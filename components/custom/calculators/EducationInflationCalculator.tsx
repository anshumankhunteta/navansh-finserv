'use client'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  calcEducationInflation,
  formatINR,
  formatINRCompact,
} from '@/lib/finance-math'
import { GraduationCap, MessageSquare } from 'lucide-react'
import { useMemo, useState } from 'react'

const currentYear = new Date().getFullYear()

interface EducationInflationCalculatorProps {
  onConsult?: (msg: string) => void
}

export function EducationInflationCalculator({
  onConsult,
}: EducationInflationCalculatorProps) {
  const [currentCost, setCurrentCost] = useState(1500000)
  const [inflationRate, setInflationRate] = useState(10)
  const [years, setYears] = useState(12)

  const calculations = useMemo(() => {
    const futureCost = calcEducationInflation(currentCost, inflationRate, years)
    const inflationImpact = futureCost - currentCost
    return { futureCost, inflationImpact }
  }, [currentCost, inflationRate, years])

  const currentPercentage = (currentCost / calculations.futureCost) * 100

  const handleConsult = () => {
    onConsult?.(
      `Goal: ${formatINRCompact(calculations.futureCost)} for Child Education in ${years} years (current cost: ${formatINRCompact(currentCost)}, ${inflationRate}% inflation)`
    )
  }

  return (
    <div className="bg-card border-border/50 rounded-2xl border p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-lg p-2">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold md:text-2xl">
            Child Education Planner
          </h2>
          <p className="text-muted-foreground text-xs">
            Education costs double every 6-7 years. Are you prepared?
          </p>
        </div>
      </div>

      {/* Current Cost Slider */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Current Education Cost (₹)
          </label>
          <input
            type="number"
            step={50000}
            value={currentCost}
            onChange={(e) =>
              setCurrentCost(
                Math.max(100000, Math.min(5000000, Number(e.target.value)))
              )
            }
            className="border-border bg-background focus:ring-primary/50 w-28 rounded-lg border px-3 py-1 text-right text-sm font-semibold focus:ring-2 focus:outline-none"
          />
        </div>
        <Slider
          min={100000}
          max={5000000}
          step={50000}
          value={[currentCost]}
          onValueChange={(value) => setCurrentCost(value[0])}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>₹1L</span>
          <span>₹50L</span>
        </div>
      </div>

      {/* Inflation Rate Slider */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Education Inflation Rate
          </label>
          <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
            {inflationRate}%
          </div>
        </div>
        <Slider
          min={5}
          max={15}
          step={0.1}
          value={[inflationRate]}
          onValueChange={(value) => setInflationRate(value[0])}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>5%</span>
          <span>15%</span>
        </div>
      </div>

      {/* Years Until Slider */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Years Until Education
          </label>
          <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
            {years} Years
          </div>
        </div>
        <Slider
          min={1}
          max={18}
          step={1}
          value={[years]}
          onValueChange={(value) => setYears(value[0])}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>1 year</span>
          <span>18 years</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-border/50 my-5 border-t" />

      {/* Results */}
      <div className="mb-5 text-center">
        <p className="text-muted-foreground mb-1 text-sm">
          Future education cost in {years} years (in{' '}
          <span className="text-destructive">{currentYear + years}</span>)
        </p>
        <p className="text-primary text-2xl font-bold md:text-3xl">
          {formatINR(calculations.futureCost)}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          That&apos;s {(calculations.futureCost / currentCost).toFixed(1)}x of
          today&apos;s cost
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
              className="text-red-500"
            />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${currentPercentage} ${100 - currentPercentage}`}
              strokeDashoffset="0"
              className="text-primary"
            />
          </svg>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary h-3 w-3 shrink-0 rounded-sm" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Current Cost</p>
              <p className="text-sm font-semibold">{formatINR(currentCost)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 shrink-0 rounded-sm bg-red-500" />
            <div className="flex-1">
              <p className="text-muted-foreground text-xs">Inflation Impact</p>
              <p className="text-sm font-semibold">
                {formatINR(calculations.inflationImpact)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Consult CTA */}
      {onConsult && (
        <Button onClick={handleConsult} className="mt-10 w-full">
          <MessageSquare className="h-4 w-4" />
          Consult on this Goal
        </Button>
      )}
    </div>
  )
}
