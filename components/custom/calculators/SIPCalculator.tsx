'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'
import { buildShareUrl, useCalculatorStore } from '@/lib/calculator-store'
import {
  calcLumpsumFV,
  calcSIPFutureValue,
  calcSIPRequiredInvestment,
  calcStepUpSIPFutureValue,
  calcStepUpSIPRequiredInvestment,
  formatINR,
  formatINRCompact,
} from '@/lib/finance-math'
import { Calculator, ChevronDown, Target, TrendingUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import CalculatorActionButtons from './CalculatorActionButtons'

const currentYear = new Date().getFullYear()

interface SIPCalculatorProps {
  onConsult?: (msg: string) => void
}

export function SIPCalculator({ onConsult }: SIPCalculatorProps) {
  // ── Store selectors (granular to avoid cross-calc re-renders) ──
  const goalMode = useCalculatorStore((s) => s.sip.goalMode)
  const investmentAmount = useCalculatorStore((s) => s.sip.investmentAmount)
  const returnRate = useCalculatorStore((s) => s.sip.returnRate)
  const timePeriod = useCalculatorStore((s) => s.sip.timePeriod)
  const frequency = useCalculatorStore((s) => s.sip.frequency)
  const customDays = useCalculatorStore((s) => s.sip.customDays)
  const stepUpEnabled = useCalculatorStore((s) => s.sip.stepUpEnabled)
  const stepUpPercent = useCalculatorStore((s) => s.sip.stepUpPercent)
  const targetAmount = useCalculatorStore((s) => s.sip.targetAmount)
  const setSip = useCalculatorStore((s) => s.setSip)

  // ── Share button state ──
  const [copied, setCopied] = useState(false)

  const getPeriodsPerYear = () => {
    switch (frequency) {
      case 'daily':
        return 365
      case 'weekly':
        return 52
      case 'monthly':
        return 12
      case 'yearly':
        return 1
      case 'custom':
        return 365 / customDays
      default:
        return 12
    }
  }

  // ── Calculate mode ──
  const calculations = useMemo(() => {
    if (goalMode) return null

    if (frequency === 'lumpsum') {
      const investedAmount = investmentAmount
      const futureValue = calcLumpsumFV(
        investmentAmount,
        returnRate,
        timePeriod
      )
      return {
        investedAmount,
        estimatedReturns: futureValue - investedAmount,
        totalValue: futureValue,
      }
    }

    if (stepUpEnabled && frequency === 'monthly') {
      const { investedAmount, futureValue } = calcStepUpSIPFutureValue(
        investmentAmount,
        stepUpPercent,
        returnRate,
        timePeriod
      )
      return {
        investedAmount,
        estimatedReturns: futureValue - investedAmount,
        totalValue: futureValue,
      }
    }

    const periodsPerYear = getPeriodsPerYear()
    const { investedAmount, futureValue } = calcSIPFutureValue(
      investmentAmount,
      returnRate,
      timePeriod,
      periodsPerYear
    )
    return {
      investedAmount,
      estimatedReturns: futureValue - investedAmount,
      totalValue: futureValue,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    goalMode,
    investmentAmount,
    returnRate,
    timePeriod,
    frequency,
    customDays,
    stepUpEnabled,
    stepUpPercent,
  ])

  // ── Goal mode ──
  const goalResult = useMemo(() => {
    if (!goalMode) return null

    if (frequency === 'lumpsum') {
      const required = Math.round(
        targetAmount / Math.pow(1 + returnRate / 100, timePeriod)
      )
      return { requiredInvestment: required, isStepUp: false }
    }

    if (stepUpEnabled && frequency === 'monthly') {
      const required = calcStepUpSIPRequiredInvestment(
        targetAmount,
        stepUpPercent,
        returnRate,
        timePeriod
      )
      return { requiredInvestment: required, isStepUp: true }
    }

    const periodsPerYear = getPeriodsPerYear()
    const required = calcSIPRequiredInvestment(
      targetAmount,
      returnRate,
      timePeriod,
      periodsPerYear
    )
    return { requiredInvestment: required, isStepUp: false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    goalMode,
    targetAmount,
    returnRate,
    timePeriod,
    frequency,
    customDays,
    stepUpEnabled,
    stepUpPercent,
  ])

  const investedPercentage =
    calculations && calculations.totalValue > 0
      ? (calculations.investedAmount / calculations.totalValue) * 100
      : 50

  const getFrequencyLabel = () => {
    switch (frequency) {
      case 'daily':
        return 'Daily Investment'
      case 'weekly':
        return 'Weekly Investment'
      case 'monthly':
        return 'Monthly Investment'
      case 'yearly':
        return 'Yearly Investment'
      case 'custom':
        return `Investment (Every ${customDays} days)`
      case 'lumpsum':
        return 'Lumpsum Required'
      default:
        return 'Investment Amount'
    }
  }

  const handleConsult = () => {
    if (goalMode && goalResult) {
      const label = `SIP Goal Seek: Need ${formatINR(goalResult.requiredInvestment)} ${frequency} to reach ${formatINRCompact(targetAmount)} in ${timePeriod}yrs (${returnRate}% returns)`
      onConsult?.(label)
      return
    }
    if (!calculations) return
    const label = stepUpEnabled
      ? `SIP Goal: ${formatINRCompact(calculations.totalValue)} in ${timePeriod}yrs (${formatINR(investmentAmount)}/mo, ${stepUpPercent}% annual step-up, ${returnRate}% returns)`
      : `SIP Goal: ${formatINRCompact(calculations.totalValue)} in ${timePeriod}yrs (${formatINR(investmentAmount)} ${frequency}, ${returnRate}% returns)`
    onConsult?.(label)
  }

  const handleShare = async () => {
    const url = buildShareUrl('sip')
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-lg p-2">
          <Calculator className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold md:text-2xl">SIP Calculator</h2>
          <p className="text-muted-foreground text-xs">
            See the power of compounding with systematic investments.
          </p>
        </div>
      </div>

      {/* ── Mode Toggle ── */}
      <div className="bg-muted ring-ring mb-5 flex gap-2 rounded-md p-1 ring-1">
        <button
          onClick={() => setSip({ goalMode: !goalMode })}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
            !goalMode
              ? 'bg-primary/70 text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calculator className="h-3.5 w-3.5" />
          Calculate
        </button>
        <button
          onClick={() => setSip({ goalMode: !goalMode })}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
            goalMode
              ? 'bg-destructive/50 text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Target className="h-3.5 w-3.5" />
          Goal Seek
        </button>
      </div>

      {/* Investment Frequency Dropdown */}
      <div className="mb-5">
        <label className="text-muted-foreground mb-2 flex justify-between text-sm">
          Investment Frequency
          <span>
            <input
              type="checkbox"
              checked={frequency === 'lumpsum'}
              onChange={() =>
                setSip({
                  frequency: frequency === 'lumpsum' ? 'monthly' : 'lumpsum',
                })
              }
            />{' '}
            Lumpsum
          </span>
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              disabled={frequency === 'lumpsum'}
              className="border-border bg-background focus:ring-primary/50 hover:bg-muted/50 flex w-full items-center justify-between rounded-lg border px-4 py-3 text-base font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="capitalize">{frequency}</span>
              <ChevronDown className="text-muted-foreground h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[var(--radix-dropdown-menu-trigger-width)]"
          >
            <DropdownMenuItem onClick={() => setSip({ frequency: 'daily' })}>
              Daily
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSip({ frequency: 'weekly' })}>
              Weekly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSip({ frequency: 'monthly' })}>
              Monthly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSip({ frequency: 'yearly' })}>
              Yearly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSip({ frequency: 'custom' })}>
              Custom
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Custom Days Input */}
      {frequency === 'custom' && (
        <div className="mb-5">
          <label className="text-muted-foreground mb-2 block text-sm">
            Investment Every (days)
          </label>
          <input
            type="number"
            min="1"
            max="365"
            value={customDays}
            onChange={(e) =>
              setSip({
                customDays: Math.max(1, Math.min(365, Number(e.target.value))),
              })
            }
            className="border-border bg-background focus:ring-primary/50 w-full rounded-lg border px-4 py-3 text-lg font-semibold focus:ring-2 focus:outline-none"
          />
        </div>
      )}

      {/* ── GOAL MODE: Target Amount slider ── */}
      {goalMode && (
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-muted-foreground text-sm">
              Target Amount (₹)
            </label>
            <input
              type="number"
              step={100000}
              value={targetAmount}
              onChange={(e) =>
                setSip({
                  targetAmount: Math.max(
                    100000,
                    Math.min(500000000, Number(e.target.value))
                  ),
                })
              }
              className="border-border bg-background focus:ring-primary/50 w-32 rounded-lg border px-3 py-1 text-right text-sm font-semibold focus:ring-2 focus:outline-none"
            />
          </div>
          <Slider
            min={100000}
            max={100000000}
            step={100000}
            value={[targetAmount]}
            onValueChange={(value) => setSip({ targetAmount: value[0] })}
            className="w-full"
          />
          <div className="text-muted-foreground mt-1 flex justify-between text-xs">
            <span>₹1L</span>
            <span>₹10Cr</span>
          </div>
        </div>
      )}

      {/* ── CALCULATE MODE: Investment Amount slider ── */}
      {!goalMode && (
        <div className="mb-5">
          <label className="mb-2 flex items-center justify-between text-sm">
            {getFrequencyLabel()} (₹)
            <input
              type="number"
              step={100}
              value={investmentAmount}
              onChange={(e) =>
                setSip({
                  investmentAmount: Math.max(0, Number(e.target.value)),
                })
              }
              className="border-border bg-background focus:ring-primary/50 rounded-lg border px-3 py-1 text-right text-sm font-semibold focus:ring-2 focus:outline-none"
              min="0"
              max={
                frequency === 'yearly' || frequency === 'lumpsum'
                  ? 10000000
                  : frequency === 'monthly'
                    ? 1000000
                    : 100000
              }
            />
          </label>
          <Slider
            min={500}
            max={
              frequency === 'yearly' || frequency === 'lumpsum'
                ? 1000000
                : frequency === 'monthly'
                  ? 100000
                  : 10000
            }
            step={100}
            value={[investmentAmount]}
            onValueChange={(value) => setSip({ investmentAmount: value[0] })}
            className="w-full"
          />
          <div className="text-muted-foreground mt-1 flex justify-between text-xs">
            <span>₹500</span>
            <span>
              {formatINRCompact(
                frequency === 'yearly' || frequency === 'lumpsum'
                  ? 1000000
                  : frequency === 'monthly'
                    ? 100000
                    : 10000
              )}
            </span>
          </div>
        </div>
      )}

      {/* Expected Return Rate Slider */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Expected Return Rate (p.a)
          </label>
          <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
            {returnRate}%
          </div>
        </div>
        <Slider
          min={1}
          max={30}
          step={0.1}
          value={[returnRate]}
          onValueChange={(value) => setSip({ returnRate: value[0] })}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>1%</span>
          <span>30%</span>
        </div>
      </div>

      {/* Time Period Slider */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">Time Period</label>
          <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
            {timePeriod} Years
          </div>
        </div>
        <Slider
          min={1}
          max={40}
          step={1}
          value={[timePeriod]}
          onValueChange={(value) => setSip({ timePeriod: value[0] })}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>1 year</span>
          <span>40 years</span>
        </div>
      </div>

      {/* Step-Up SIP Toggle — calculate mode only */}
      {frequency === 'monthly' && (
        <div className="mb-5">
          <label className="text-muted-foreground mb-2 flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={stepUpEnabled}
              onChange={(e) => setSip({ stepUpEnabled: e.target.checked })}
              className="border-border text-primary focus:ring-primary/20 h-4 w-4 rounded focus:ring-2"
            />
            <TrendingUp className="h-4 w-4" />
            Enable Annual Step-Up
          </label>
          {stepUpEnabled && (
            <div className="border-primary/30 bg-primary/5 mt-3 rounded-lg border border-dashed p-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-muted-foreground text-sm">
                  Annual Step-Up
                </label>
                <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
                  {stepUpPercent}%
                </div>
              </div>
              <Slider
                min={1}
                max={25}
                step={1}
                value={[stepUpPercent]}
                onValueChange={(value) => setSip({ stepUpPercent: value[0] })}
                className="w-full"
              />
              <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                <span>1%</span>
                <span>25%</span>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                Your investment increases by {stepUpPercent}% every year.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="border-border/50 my-5 border-t" />

      {/* ── Results ── */}
      {!goalMode && calculations && (
        <>
          <div className="mb-5 text-center">
            <p className="text-muted-foreground mb-1 text-sm">
              Total value after {timePeriod} years (by{' '}
              <span className="text-destructive">
                {currentYear + timePeriod}
              </span>
              )
            </p>
            <p className="text-primary text-2xl font-bold md:text-3xl">
              {formatINR(calculations.totalValue)}
            </p>
          </div>

          {/* Donut Chart + Legend */}
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
                  className="text-orange-500"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${investedPercentage} ${100 - investedPercentage}`}
                  strokeDashoffset="0"
                  className="text-primary"
                />
              </svg>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary h-3 w-3 shrink-0 rounded-sm" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">Invested</p>
                  <p className="text-sm font-semibold">
                    {formatINR(calculations.investedAmount)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 shrink-0 rounded-sm bg-orange-500" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">Est. returns</p>
                  <p className="text-sm font-semibold">
                    {formatINR(calculations.estimatedReturns)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {goalMode && goalResult && (
        <div className="mb-5 text-center">
          <p className="text-muted-foreground mb-1 text-sm">
            To reach {formatINRCompact(targetAmount)} in {timePeriod} years (by{' '}
            <span className="text-destructive">{currentYear + timePeriod}</span>
            ), you need
          </p>
          <p className="text-primary text-2xl font-bold md:text-3xl">
            {formatINR(goalResult.requiredInvestment)}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {goalResult.isStepUp
              ? `Starting ${getFrequencyLabel()} with ${stepUpPercent}% annual step-up at ${returnRate}% p.a. returns`
              : `${getFrequencyLabel()} at ${returnRate}% p.a. returns`}
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
