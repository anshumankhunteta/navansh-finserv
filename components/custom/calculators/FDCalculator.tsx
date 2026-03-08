'use client'

import { Slider } from '@/components/ui/slider'
import { buildShareUrl, useCalculatorStore } from '@/lib/calculator-store'
import {
  calcFDMaturity,
  calcFDRequiredPrincipal,
  calcInflationAdjusted,
  formatINR,
  formatINRCompact,
} from '@/lib/finance-math'
import { Calculator, Landmark, Target } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import CalculatorActionButtons from './CalculatorActionButtons'

const currentYear = new Date().getFullYear()

interface FDCalculatorProps {
  onConsult?: (msg: string) => void
}

export function FDCalculator({ onConsult }: FDCalculatorProps) {
  const mode = useCalculatorStore((s) => s.fd.mode)
  const principal = useCalculatorStore((s) => s.fd.principal)
  const interestRate = useCalculatorStore((s) => s.fd.interestRate)
  const inflationRate = useCalculatorStore((s) => s.fd.inflationRate)
  const timePeriod = useCalculatorStore((s) => s.fd.timePeriod)
  const targetAmount = useCalculatorStore((s) => s.fd.targetAmount)
  const setFd = useCalculatorStore((s) => s.setFd)

  const [copied, setCopied] = useState(false)

  const calculations = useMemo(() => {
    if (mode === 'goal') return null
    const { maturityAmount, interestEarned } = calcFDMaturity(
      principal,
      interestRate,
      timePeriod
    )
    const realValue = calcInflationAdjusted(
      maturityAmount,
      inflationRate,
      timePeriod
    )
    const inflationErosion = maturityAmount - realValue
    return { maturityAmount, interestEarned, realValue, inflationErosion }
  }, [mode, principal, interestRate, inflationRate, timePeriod])

  const goalResult = useMemo(() => {
    if (mode !== 'goal') return null
    const required = calcFDRequiredPrincipal(
      targetAmount,
      interestRate,
      timePeriod
    )
    const realValue = calcInflationAdjusted(
      targetAmount,
      inflationRate,
      timePeriod
    )
    return { requiredPrincipal: required, realValue }
  }, [mode, targetAmount, interestRate, inflationRate, timePeriod])

  const principalPct =
    calculations && calculations.maturityAmount > 0
      ? (principal / calculations.maturityAmount) * 100
      : 50

  const showInflation = inflationRate > 0
  const realPct =
    calculations && showInflation && calculations.maturityAmount > 0
      ? (calculations.realValue / calculations.maturityAmount) * 100
      : 100

  const handleConsult = () => {
    if (mode === 'goal' && goalResult) {
      onConsult?.(
        `FD Goal: Need ${formatINRCompact(goalResult.requiredPrincipal)} investment to get ${formatINRCompact(targetAmount)} in ${timePeriod} years at ${interestRate}% (real value: ${formatINRCompact(goalResult.realValue)})`
      )
      return
    }
    if (!calculations) return
    onConsult?.(
      `FD Plan: ${formatINRCompact(principal)} → ${formatINRCompact(calculations.maturityAmount)} in ${timePeriod} years at ${interestRate}% (real value after ${inflationRate}% inflation: ${formatINRCompact(calculations.realValue)})`
    )
  }

  const handleShare = async () => {
    const url = buildShareUrl('fd')
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-lg p-2">
          <Landmark className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold md:text-2xl">FD Calculator</h2>
          <p className="text-muted-foreground text-xs">
            Fixed Deposit returns with real (inflation-adjusted) value.
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="bg-muted ring-ring mb-5 flex rounded-md p-1 ring-1">
        <button
          onClick={() => setFd({ mode: 'calculate' })}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
            mode === 'calculate'
              ? 'bg-primary/70 text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calculator className="h-3.5 w-3.5" />
          Calculate
        </button>
        <button
          onClick={() => setFd({ mode: 'goal' })}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
            mode === 'goal'
              ? 'bg-destructive/50 text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Target className="h-3.5 w-3.5" />
          Goal Seek
        </button>
      </div>

      {/* GOAL MODE: Target Amount */}
      {mode === 'goal' && (
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-muted-foreground text-sm">
              Target Maturity Amount (₹)
            </label>
            <input
              type="number"
              step={100000}
              value={targetAmount}
              onChange={(e) =>
                setFd({
                  targetAmount: Math.max(
                    100000,
                    Math.min(100000000, Number(e.target.value))
                  ),
                })
              }
              className="border-border bg-background focus:ring-primary/50 w-32 rounded-lg border px-3 py-1 text-right text-sm font-semibold focus:ring-2 focus:outline-none"
            />
          </div>
          <Slider
            min={100000}
            max={50000000}
            step={100000}
            value={[targetAmount]}
            onValueChange={(value) => setFd({ targetAmount: value[0] })}
            className="w-full"
          />
          <div className="text-muted-foreground mt-1 flex justify-between text-xs">
            <span>₹1L</span>
            <span>₹5Cr</span>
          </div>
        </div>
      )}

      {/* CALCULATE MODE: Principal */}
      {mode === 'calculate' && (
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-muted-foreground text-sm">
              Investment Amount (₹)
            </label>
            <input
              type="number"
              step={10000}
              value={principal}
              onChange={(e) =>
                setFd({
                  principal: Math.max(
                    10000,
                    Math.min(50000000, Number(e.target.value))
                  ),
                })
              }
              className="border-border bg-background focus:ring-primary/50 w-32 rounded-lg border px-3 py-1 text-right text-sm font-semibold focus:ring-2 focus:outline-none"
            />
          </div>
          <Slider
            min={10000}
            max={10000000}
            step={10000}
            value={[principal]}
            onValueChange={(value) => setFd({ principal: value[0] })}
            className="w-full"
          />
          <div className="text-muted-foreground mt-1 flex justify-between text-xs">
            <span>₹10K</span>
            <span>₹1Cr</span>
          </div>
        </div>
      )}

      {/* Interest Rate */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Interest Rate (p.a)
          </label>
          <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
            {interestRate}%
          </div>
        </div>
        <Slider
          min={3}
          max={10}
          step={0.1}
          value={[interestRate]}
          onValueChange={(value) => setFd({ interestRate: value[0] })}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>3%</span>
          <span>10%</span>
        </div>
      </div>

      {/* Inflation Rate */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Inflation Rate (p.a)
          </label>
          <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
            {inflationRate}%
          </div>
        </div>
        <Slider
          min={0}
          max={12}
          step={0.1}
          value={[inflationRate]}
          onValueChange={(value) => setFd({ inflationRate: value[0] })}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>0%</span>
          <span>12%</span>
        </div>
      </div>

      {/* Time Period */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">Time Period</label>
          <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
            {timePeriod} Years
          </div>
        </div>
        <Slider
          min={1}
          max={30}
          step={1}
          value={[timePeriod]}
          onValueChange={(value) => setFd({ timePeriod: value[0] })}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>1 year</span>
          <span>30 years</span>
        </div>
      </div>

      <div className="border-border/50 my-5 border-t" />

      {/* Results */}
      {mode === 'calculate' && calculations && (
        <>
          <div className="mb-5 text-center">
            <p className="text-muted-foreground mb-1 text-sm">
              Maturity amount after {timePeriod} years (by{' '}
              <span className="text-destructive">
                {currentYear + timePeriod}
              </span>
              )
            </p>
            <p className="text-primary text-2xl font-bold md:text-3xl">
              {formatINR(calculations.maturityAmount)}
            </p>
            {showInflation && (
              <p className="text-muted-foreground mt-1 text-xs">
                Real value (after {inflationRate}% inflation):{' '}
                <span className="font-semibold text-amber-500">
                  {formatINR(calculations.realValue)}
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 shrink-0">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                {showInflation ? (
                  <>
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
                      strokeDasharray={`${realPct} ${100 - realPct}`}
                      strokeDashoffset="0"
                      className="text-primary"
                    />
                  </>
                ) : (
                  <>
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-orange-500"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={`${principalPct} ${100 - principalPct}`}
                      strokeDashoffset="0"
                      className="text-primary"
                    />
                  </>
                )}
              </svg>
            </div>
            <div className="flex-1 space-y-3">
              {showInflation ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary h-3 w-3 shrink-0 rounded-sm" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">
                        Real Value (after inflation)
                      </p>
                      <p className="text-sm font-semibold">
                        {formatINR(calculations.realValue)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 shrink-0 rounded-sm bg-amber-500" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">
                        Inflation Erosion
                      </p>
                      <p className="text-sm font-semibold">
                        {formatINR(calculations.inflationErosion)}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary h-3 w-3 shrink-0 rounded-sm" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">Invested</p>
                      <p className="text-sm font-semibold">
                        {formatINR(principal)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 shrink-0 rounded-sm bg-orange-500" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">
                        Interest Earned
                      </p>
                      <p className="text-sm font-semibold">
                        {formatINR(calculations.interestEarned)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {mode === 'goal' && goalResult && (
        <div className="mb-5 text-center">
          <p className="text-muted-foreground mb-1 text-sm">
            To get {formatINRCompact(targetAmount)} in {timePeriod} years (by{' '}
            {currentYear + timePeriod}), invest
          </p>
          <p className="text-primary text-2xl font-bold md:text-3xl">
            {formatINR(goalResult.requiredPrincipal)}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            At {interestRate}% p.a. | Real value after {inflationRate}%
            inflation:{' '}
            <span className="font-semibold text-amber-500">
              {formatINR(goalResult.realValue)}
            </span>
          </p>
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
