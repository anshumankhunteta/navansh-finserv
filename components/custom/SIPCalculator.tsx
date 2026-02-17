'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'
import { Calculator, ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'

type InvestmentFrequency =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'custom'
  | 'lumpsum'

function formatIndianCurrency(num: number): string {
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })
  return `₹ ${formatted}`
}

export function SIPCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState(10000)
  const [returnRate, setReturnRate] = useState(12)
  const [timePeriod, setTimePeriod] = useState(10)
  const [frequency, setFrequency] = useState<InvestmentFrequency>('monthly')
  const [customDays, setCustomDays] = useState(30)

  const calculations = useMemo(() => {
    let investedAmount: number
    let futureValue: number

    if (frequency === 'lumpsum') {
      // Lumpsum: One-time investment
      // Compound Interest Formula: FV = P × (1 + r)^t
      investedAmount = investmentAmount
      const annualRate = returnRate / 100
      futureValue = investmentAmount * Math.pow(1 + annualRate, timePeriod)
    } else {
      // SIP: Periodic investments
      // Calculate periods per year based on frequency
      let periodsPerYear: number

      switch (frequency) {
        case 'daily':
          periodsPerYear = 365
          break
        case 'weekly':
          periodsPerYear = 52
          break
        case 'monthly':
          periodsPerYear = 12
          break
        case 'yearly':
          periodsPerYear = 1
          break
        case 'custom':
          periodsPerYear = 365 / customDays
          break
        default:
          periodsPerYear = 12
      }

      const ratePerPeriod = returnRate / periodsPerYear / 100
      const totalPeriods = timePeriod * periodsPerYear
      investedAmount = investmentAmount * totalPeriods

      // SIP Future Value formula: P × ({[1 + r]^n – 1} / r) × (1 + r)
      futureValue =
        investmentAmount *
        ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod) *
        (1 + ratePerPeriod)
    }

    const estimatedReturns = futureValue - investedAmount

    return {
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(futureValue),
    }
  }, [investmentAmount, returnRate, timePeriod, frequency, customDays])

  // Calculate percentages for the donut chart
  const investedPercentage =
    (calculations.investedAmount / calculations.totalValue) * 100

  // Get appropriate label based on frequency
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
      default:
        return 'Investment Amount'
    }
  }

  return (
    <div className="bg-card border-border/50 sticky top-24 rounded-2xl border p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-lg p-2">
          <Calculator className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold md:text-2xl">SIP Calculator</h2>
      </div>

      {/* Investment Frequency Dropdown */}
      <div className="mb-6">
        <label className="text-muted-foreground mb-2 block flex justify-between text-sm">
          Investment Frequency
          <span>
            <input
              type="checkbox"
              checked={frequency === 'lumpsum'}
              onChange={() =>
                setFrequency(frequency === 'lumpsum' ? 'monthly' : 'lumpsum')
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
            <DropdownMenuItem onClick={() => setFrequency('daily')}>
              Daily
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFrequency('weekly')}>
              Weekly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFrequency('monthly')}>
              Monthly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFrequency('yearly')}>
              Yearly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFrequency('custom')}>
              Custom
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Custom Days Input (only shown when custom is selected) */}
      {frequency === 'custom' && (
        <div className="mb-6">
          <label className="text-muted-foreground mb-2 block text-sm">
            Investment Every (days)
          </label>
          <input
            type="number"
            min="1"
            max="365"
            value={customDays}
            onChange={(e) =>
              setCustomDays(Math.max(1, Math.min(365, Number(e.target.value))))
            }
            className="border-border bg-background focus:ring-primary/50 w-full rounded-lg border px-4 py-3 text-lg font-semibold focus:ring-2 focus:outline-none"
          />
        </div>
      )}

      {/* Enter Amount */}
      <div className="mb-6">
        <label className="mb-2 flex items-center justify-between text-sm">
          {getFrequencyLabel()} (₹)
          <input
            type="number"
            step={100}
            value={investmentAmount}
            onChange={(e) =>
              setInvestmentAmount(Math.max(0, Number(e.target.value)))
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
          min={0}
          max={
            frequency === 'yearly' || frequency === 'lumpsum'
              ? 1000000
              : frequency === 'monthly'
                ? 100000
                : 10000
          }
          step={100}
          value={[investmentAmount]}
          onValueChange={(value) => setInvestmentAmount(value[0])}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>₹0</span>
          {frequency === 'yearly' ? (
            <span>₹1000000</span>
          ) : frequency === 'monthly' ? (
            <span>₹100000</span>
          ) : (
            <span>₹1000</span>
          )}
        </div>
      </div>

      {/* Expected Return Rate Slider */}
      <div className="mb-6">
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
          onValueChange={(value) => setReturnRate(value[0])}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>1%</span>
          <span>30%</span>
        </div>
      </div>

      {/* SIP Time Period Slider */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            SIP time period
          </label>
          <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
            {timePeriod} Years
          </div>
        </div>
        <Slider
          min={1}
          max={40}
          step={1}
          value={[timePeriod]}
          onValueChange={(value) => setTimePeriod(value[0])}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>1 year</span>
          <span>40 years</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-border/50 my-6 border-t" />

      {/* Results Section */}
      <div className="mb-6 text-center">
        <p className="text-muted-foreground mb-1 text-sm">
          The total value of your investment after {timePeriod} Years will be
        </p>
        <p className="text-primary text-2xl font-bold md:text-3xl">
          {formatIndianCurrency(calculations.totalValue)}
        </p>
      </div>

      {/* Donut Chart and Legend */}
      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-orange-500"
            />
            {/* Invested amount (teal) */}
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

        {/* Legend */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary h-3 w-3 shrink-0 rounded-sm" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Invested amount</p>
              <p className="text-sm font-semibold">
                {formatIndianCurrency(calculations.investedAmount)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 shrink-0 rounded-sm bg-orange-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Est. returns</p>
              <p className="text-sm font-semibold">
                {formatIndianCurrency(calculations.estimatedReturns)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
