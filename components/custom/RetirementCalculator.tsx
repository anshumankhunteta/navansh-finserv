'use client'

import { Slider } from '@/components/ui/slider'
import { TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'

function formatIndianCurrency(num: number): string {
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })
  return `₹ ${formatted}`
}

function formatCompact(num: number): string {
  if (num >= 1_00_00_000) {
    return `₹ ${(num / 1_00_00_000).toFixed(2)} Cr`
  } else if (num >= 1_00_000) {
    return `₹ ${(num / 1_00_000).toFixed(2)} L`
  }
  return formatIndianCurrency(num)
}

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(60)
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000)
  const [returnRate, setReturnRate] = useState(10)
  const [inflationRate, setInflationRate] = useState(6)
  const [withdrawalYears, setWithdrawalYears] = useState(20)

  const calculations = useMemo(() => {
    const accumulationYears = Math.max(1, retirementAge - currentAge)

    // Monthly SIP future value
    const monthlyRate = returnRate / 12 / 100
    const totalMonths = accumulationYears * 12
    const corpus =
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate)

    const investedAmount = monthlyInvestment * totalMonths

    // Inflation-adjusted (real) corpus
    const realCorpus =
      corpus / Math.pow(1 + inflationRate / 100, accumulationYears)

    // Monthly pension via PMT (annuity draw-down at same return rate)
    const withdrawalMonths = withdrawalYears * 12
    const monthlyPension =
      (corpus * monthlyRate * Math.pow(1 + monthlyRate, withdrawalMonths)) /
      (Math.pow(1 + monthlyRate, withdrawalMonths) - 1)

    return {
      investedAmount: Math.round(investedAmount),
      corpus: Math.round(corpus),
      realCorpus: Math.round(realCorpus),
      monthlyPension: Math.round(monthlyPension),
      estimatedReturns: Math.round(corpus - investedAmount),
    }
  }, [
    currentAge,
    retirementAge,
    monthlyInvestment,
    returnRate,
    inflationRate,
    withdrawalYears,
  ])

  const investedPercentage =
    (calculations.investedAmount / calculations.corpus) * 100

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-lg p-2">
          <TrendingUp className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold md:text-2xl">Retirement Calculator</h2>
      </div>

      {/* Age Row */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        {/* Current Age */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-muted-foreground text-sm">Current Age</label>
            <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
              {currentAge} yrs
            </div>
          </div>
          <Slider
            min={18}
            max={69}
            step={1}
            value={[currentAge]}
            onValueChange={([v]) => {
              setCurrentAge(v)
              if (v >= retirementAge) setRetirementAge(v + 1)
            }}
            className="w-full"
          />
          <div className="text-muted-foreground mt-1 flex justify-between text-xs">
            <span>18</span>
            <span>69</span>
          </div>
        </div>

        {/* Retirement Age */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-muted-foreground text-sm">Retire At</label>
            <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
              {retirementAge} yrs
            </div>
          </div>
          <Slider
            min={currentAge + 1}
            max={75}
            step={1}
            value={[retirementAge]}
            onValueChange={([v]) => setRetirementAge(v)}
            className="w-full"
          />
          <div className="text-muted-foreground mt-1 flex justify-between text-xs">
            <span>{currentAge + 1}</span>
            <span>75</span>
          </div>
        </div>
      </div>

      {/* Monthly Investment */}
      <div className="mb-6">
        <label className="mb-2 flex items-center justify-between text-sm">
          Monthly Investment (₹)
          <input
            type="number"
            step={500}
            value={monthlyInvestment}
            onChange={(e) =>
              setMonthlyInvestment(
                Math.max(500, Math.min(200000, Number(e.target.value)))
              )
            }
            className="border-border bg-background focus:ring-primary/50 rounded-lg border px-3 py-1 text-right text-sm font-semibold focus:ring-2 focus:outline-none"
            min={500}
            max={200000}
          />
        </label>
        <Slider
          min={500}
          max={200000}
          step={500}
          value={[monthlyInvestment]}
          onValueChange={([v]) => setMonthlyInvestment(v)}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>₹500</span>
          <span>₹2,00,000</span>
        </div>
      </div>

      {/* Expected Return Rate */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Expected Return (p.a.)
          </label>
          <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
            {returnRate}%
          </div>
        </div>
        <Slider
          min={6}
          max={15}
          step={0.5}
          value={[returnRate]}
          onValueChange={([v]) => setReturnRate(v)}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>6%</span>
          <span>15%</span>
        </div>
      </div>

      {/* Inflation Rate */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Inflation Rate (p.a.)
          </label>
          <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
            {inflationRate}%
          </div>
        </div>
        <Slider
          min={2}
          max={10}
          step={0.5}
          value={[inflationRate]}
          onValueChange={([v]) => setInflationRate(v)}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>2%</span>
          <span>10%</span>
        </div>
      </div>

      {/* Withdrawal Period */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Withdrawal Period
          </label>
          <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
            {withdrawalYears} yrs
          </div>
        </div>
        <Slider
          min={5}
          max={40}
          step={1}
          value={[withdrawalYears]}
          onValueChange={([v]) => setWithdrawalYears(v)}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>5 yrs</span>
          <span>40 yrs</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-border/50 my-6 border-t" />

      {/* Results */}
      <div className="mb-6 text-center">
        <p className="text-muted-foreground mb-1 text-sm">
          Retirement corpus at age {retirementAge}
        </p>
        <p className="text-primary text-2xl font-bold md:text-3xl">
          {formatCompact(calculations.corpus)}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          ≈ {formatCompact(calculations.realCorpus)} in today&apos;s value
        </p>
      </div>

      {/* Donut + Legend */}
      <div className="flex items-center gap-6">
        {/* Donut Chart */}
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
          <div className="border-border/50 border-t pt-2">
            <p className="text-muted-foreground text-xs">Monthly pension</p>
            <p className="text-sm font-semibold text-green-500">
              {formatIndianCurrency(calculations.monthlyPension)} / mo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
