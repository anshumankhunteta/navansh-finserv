'use client'

import { Slider } from '@/components/ui/slider'
import { buildShareUrl, useCalculatorStore } from '@/lib/calculator-store'
import { calcHLV, formatINR, formatINRCompact } from '@/lib/finance-math'
import { Landmark, Shield } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import CalculatorActionButtons from './CalculatorActionButtons'

const currentYear = new Date().getFullYear()

interface HLVCalculatorProps {
  onConsult?: (msg: string) => void
}

export function HLVCalculator({ onConsult }: HLVCalculatorProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true) // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  const monthlyIncome = useCalculatorStore((s) => s.hlv.monthlyIncome)
  const monthlyExpenses = useCalculatorStore((s) => s.hlv.monthlyExpenses)
  const yearsToRetirement = useCalculatorStore((s) => s.hlv.yearsToRetirement)
  const liabilitiesEnabled = useCalculatorStore((s) => s.hlv.liabilitiesEnabled)
  const liabilities = useCalculatorStore((s) => s.hlv.liabilities)
  const setHlv = useCalculatorStore((s) => s.setHlv)

  const [copied, setCopied] = useState(false)

  const calculations = useMemo(() => {
    return calcHLV(
      monthlyIncome,
      monthlyExpenses,
      yearsToRetirement,
      liabilitiesEnabled ? liabilities : 0
    )
  }, [
    monthlyIncome,
    monthlyExpenses,
    yearsToRetirement,
    liabilitiesEnabled,
    liabilities,
  ])

  const familyPct =
    calculations.totalIncome > 0
      ? ((calculations.totalIncome - calculations.totalExpenses) /
          calculations.totalIncome) *
        100
      : 0

  const threeSegBase =
    calculations.totalIncome +
      (liabilitiesEnabled ? calculations.liabilities : 0) || 1
  const familyNeedsPct =
    ((calculations.totalIncome - calculations.totalExpenses) / threeSegBase) *
    100
  const liabSegPct = liabilitiesEnabled
    ? (calculations.liabilities / threeSegBase) * 100
    : 0

  const handleConsult = () => {
    const liabText = liabilitiesEnabled
      ? `, liabilities: ${formatINRCompact(liabilities)}`
      : ''
    onConsult?.(
      `Insurance Need: ${formatINRCompact(calculations.hlvValue)} HLV cover for ${yearsToRetirement} years (income: ${formatINRCompact(monthlyIncome * 12)}/yr, expenses: ${formatINRCompact(monthlyExpenses * 12)}/yr${liabText})`
    )
  }

  const handleShare = async () => {
    const url = buildShareUrl('hlv')
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!mounted) return null

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-lg p-2">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold md:text-2xl">
            Human Life Value (HLV)
          </h2>
          <p className="text-muted-foreground text-xs">
            The exact &apos;Insurance Shield&apos; your family needs to replace
            your income.
          </p>
        </div>
      </div>

      {/* Monthly Income Slider */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Monthly Income (₹)
          </label>
          <input
            type="number"
            step={5000}
            value={monthlyIncome}
            onChange={(e) =>
              setHlv({
                monthlyIncome: Math.max(
                  20000,
                  Math.min(2000000, Number(e.target.value))
                ),
              })
            }
            className="border-border bg-background focus:ring-primary/50 w-28 rounded-lg border px-3 py-1 text-right text-sm font-semibold focus:ring-2 focus:outline-none"
          />
        </div>
        <Slider
          min={20000}
          max={2000000}
          step={5000}
          value={[monthlyIncome]}
          onValueChange={(value) => setHlv({ monthlyIncome: value[0] })}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>₹20K</span>
          <span>₹20L</span>
        </div>
      </div>

      {/* Monthly Personal Expenses Slider */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Monthly Personal Expenses (₹)
          </label>
          <input
            type="number"
            step={5000}
            value={monthlyExpenses}
            onChange={(e) =>
              setHlv({
                monthlyExpenses: Math.max(
                  5000,
                  Math.min(
                    Math.min(monthlyIncome, 1000000),
                    Number(e.target.value)
                  )
                ),
              })
            }
            className="border-border bg-background focus:ring-primary/50 w-28 rounded-lg border px-3 py-1 text-right text-sm font-semibold focus:ring-2 focus:outline-none"
          />
        </div>
        <Slider
          min={5000}
          max={Math.min(monthlyIncome, 1000000)}
          step={5000}
          value={[monthlyExpenses]}
          onValueChange={(value) => setHlv({ monthlyExpenses: value[0] })}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>₹5K</span>
          <span>{formatINRCompact(Math.min(monthlyIncome, 1000000))}</span>
        </div>
      </div>

      {/* Years to Retirement Slider */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Years Until Retirement
          </label>
          <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
            {yearsToRetirement} Years
          </div>
        </div>
        <Slider
          min={1}
          max={40}
          step={1}
          value={[yearsToRetirement]}
          onValueChange={(value) => setHlv({ yearsToRetirement: value[0] })}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>1 year</span>
          <span>40 years</span>
        </div>
      </div>

      {/* Liabilities Toggle */}
      <div className="mb-5">
        <label className="text-muted-foreground mb-2 flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={liabilitiesEnabled}
            onChange={(e) => setHlv({ liabilitiesEnabled: e.target.checked })}
            className="border-border text-primary focus:ring-primary/20 h-4 w-4 rounded focus:ring-2"
          />
          <Landmark className="h-4 w-4" /> Got Loans?
        </label>
        {liabilitiesEnabled && (
          <div className="border-destructive/30 bg-destructive/5 mt-3 rounded-lg border border-dashed p-4">
            <p className="text-muted-foreground mb-3 text-xs">
              Car Loan, Home Loan, Any Loan : outstanding debt your family would
              inherit.
            </p>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-muted-foreground text-sm">
                Total Liabilities (₹)
              </label>
              <input
                type="number"
                step={100000}
                value={liabilities}
                onChange={(e) =>
                  setHlv({
                    liabilities: Math.max(
                      0,
                      Math.min(100000000, Number(e.target.value))
                    ),
                  })
                }
                className="border-border bg-background focus:ring-primary/50 w-28 rounded-lg border px-3 py-1 text-right text-sm font-semibold focus:ring-2 focus:outline-none"
              />
            </div>
            <Slider
              min={0}
              max={50000000}
              step={100000}
              value={[liabilities]}
              onValueChange={(value) => setHlv({ liabilities: value[0] })}
              className="w-full"
            />
            <div className="text-muted-foreground mt-1 flex justify-between text-xs">
              <span>₹0</span>
              <span>₹5Cr</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-border/50 my-5 border-t" />

      {/* Results */}
      <div className="mb-5 text-center">
        <p className="text-muted-foreground mb-1 text-sm">
          Your family needs an insurance cover of
        </p>
        <p className="text-primary text-2xl font-bold md:text-3xl">
          {formatINR(calculations.hlvValue)}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Based on {yearsToRetirement} years of income replacement (until{' '}
          <span className="text-destructive">
            {currentYear + yearsToRetirement}
          </span>
          )
        </p>
      </div>

      {/* Donut Chart + Legend */}
      {!liabilitiesEnabled ? (
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24 shrink-0">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-amber-500"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${familyPct} ${100 - familyPct}`}
                strokeDashoffset="0"
                className="text-primary"
              />
            </svg>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary h-3 w-3 shrink-0 rounded-sm" />
              <div className="flex-1">
                <p className="text-muted-foreground text-xs">
                  Family Needs (HLV)
                </p>
                <p className="text-sm font-semibold">
                  {formatINR(calculations.hlvValue)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 shrink-0 rounded-sm bg-amber-500" />
              <div className="flex-1">
                <p className="text-muted-foreground text-xs">
                  Personal Expenses
                </p>
                <p className="text-sm font-semibold">
                  {formatINR(calculations.totalExpenses)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24 shrink-0">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-amber-500"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${familyNeedsPct + liabSegPct} ${100 - familyNeedsPct - liabSegPct}`}
                strokeDashoffset="0"
                className="text-destructive"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${familyNeedsPct} ${100 - familyNeedsPct}`}
                strokeDashoffset="0"
                className="text-primary"
              />
            </svg>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary h-3 w-3 shrink-0 rounded-sm" />
              <div className="flex-1">
                <p className="text-muted-foreground text-xs">
                  Family Needs (HLV)
                </p>
                <p className="text-sm font-semibold">
                  {formatINR(calculations.hlvValue)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-destructive h-3 w-3 shrink-0 rounded-sm" />
              <div className="flex-1">
                <p className="text-muted-foreground text-xs">Liabilities</p>
                <p className="text-sm font-semibold">
                  {formatINR(calculations.liabilities)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 shrink-0 rounded-sm bg-amber-500" />
              <div className="flex-1">
                <p className="text-muted-foreground text-xs">
                  Personal Expenses
                </p>
                <p className="text-sm font-semibold">
                  {formatINR(calculations.totalExpenses)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <CalculatorActionButtons
        onConsult={onConsult}
        handleConsult={handleConsult}
        handleShare={handleShare}
        copied={copied}
      />
    </div>
  )
}
