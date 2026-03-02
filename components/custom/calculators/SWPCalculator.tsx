'use client'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { buildShareUrl, useCalculatorStore } from '@/lib/calculator-store'
import {
  calcSWPDepletion,
  calcSWPRequiredCorpus,
  formatINR,
  formatINRCompact,
} from '@/lib/finance-math'
import {
  Calculator,
  Check,
  Clock,
  MessageSquare,
  Share2,
  Target,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const currentYear = new Date().getFullYear()

interface RetirementSWPCalculatorProps {
  onConsult?: (msg: string) => void
}

export function RetirementSWPCalculator({
  onConsult,
}: RetirementSWPCalculatorProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true) // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  const goalMode = useCalculatorStore((s) => s.swp.goalMode)
  const corpus = useCalculatorStore((s) => s.swp.corpus)
  const monthlyWithdrawal = useCalculatorStore((s) => s.swp.monthlyWithdrawal)
  const returnRate = useCalculatorStore((s) => s.swp.returnRate)
  const desiredYears = useCalculatorStore((s) => s.swp.desiredYears)
  const setSwp = useCalculatorStore((s) => s.setSwp)

  const [copied, setCopied] = useState(false)

  const calculations = useMemo(() => {
    if (goalMode) return null
    return calcSWPDepletion(corpus, monthlyWithdrawal, returnRate)
  }, [goalMode, corpus, monthlyWithdrawal, returnRate])

  const lastingYears = calculations
    ? Math.floor(calculations.lastingMonths / 12)
    : 0
  const lastingRemainingMonths = calculations
    ? calculations.lastingMonths % 12
    : 0
  const neverDepletes = calculations ? calculations.lastingMonths >= 600 : false

  const withdrawnPortion =
    calculations && calculations.totalWithdrawn > 0
      ? Math.min((corpus / calculations.totalWithdrawn) * 100, 100)
      : 50

  const goalResult = useMemo(() => {
    if (!goalMode) return null
    return calcSWPRequiredCorpus(monthlyWithdrawal, returnRate, desiredYears)
  }, [goalMode, monthlyWithdrawal, returnRate, desiredYears])

  const handleConsult = () => {
    if (goalMode && goalResult) {
      onConsult?.(
        `SWP Goal Seek: Need ${formatINRCompact(goalResult.requiredCorpus)} corpus for ${formatINRCompact(monthlyWithdrawal)}/mo withdrawal over ${desiredYears} years (${returnRate}% returns)`
      )
      return
    }
    if (!calculations) return
    const duration = neverDepletes
      ? 'corpus never depletes'
      : `lasts ${lastingYears}y ${lastingRemainingMonths}m`
    onConsult?.(
      `Retirement SWP: ${formatINRCompact(corpus)} corpus, ${formatINRCompact(monthlyWithdrawal)}/mo withdrawal, ${returnRate}% returns – ${duration}`
    )
  }

  const handleShare = async () => {
    const url = buildShareUrl('swp')
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!mounted) return null

  return (
    <div className="bg-card border-border/50 rounded-2xl border p-6 md:p-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-lg p-2">
          <Clock className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold md:text-2xl">
            Retirement Burn Rate (SWP)
          </h2>
          <p className="text-muted-foreground text-xs">
            How long will your corpus last if you withdraw monthly?
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="bg-muted ring-ring mb-5 flex gap-2 rounded-md p-1 ring-1">
        <button
          onClick={() => setSwp({ goalMode: !goalMode })}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
            !goalMode
              ? 'bg-primary/70 text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calculator className="h-3.5 w-3.5" /> Calculate
        </button>
        <button
          onClick={() => setSwp({ goalMode: !goalMode })}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
            goalMode
              ? 'bg-destructive/50 text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Target className="h-3.5 w-3.5" /> Goal Seek
        </button>
      </div>

      {/* CALCULATE MODE: Corpus Slider */}
      {!goalMode && (
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-muted-foreground text-sm">
              Total Corpus (₹)
            </label>
            <input
              type="number"
              step={500000}
              value={corpus}
              onChange={(e) =>
                setSwp({
                  corpus: Math.max(
                    1000000,
                    Math.min(100000000, Number(e.target.value))
                  ),
                })
              }
              className="border-border bg-background focus:ring-primary/50 w-32 rounded-lg border px-3 py-1 text-right text-sm font-semibold focus:ring-2 focus:outline-none"
            />
          </div>
          <Slider
            min={1000000}
            max={200000000}
            step={500000}
            value={[corpus]}
            onValueChange={(value) => setSwp({ corpus: value[0] })}
            className="w-full"
          />
          <div className="text-muted-foreground mt-1 flex justify-between text-xs">
            <span>₹10L</span>
            <span>₹20Cr</span>
          </div>
        </div>
      )}

      {/* Monthly Withdrawal Slider */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Monthly Withdrawal (₹)
          </label>
          <input
            type="number"
            step={5000}
            value={monthlyWithdrawal}
            onChange={(e) =>
              setSwp({
                monthlyWithdrawal: Math.max(
                  10000,
                  Math.min(500000, Number(e.target.value))
                ),
              })
            }
            className="border-border bg-background focus:ring-primary/50 w-28 rounded-lg border px-3 py-1 text-right text-sm font-semibold focus:ring-2 focus:outline-none"
          />
        </div>
        <Slider
          min={10000}
          max={1500000}
          step={5000}
          value={[monthlyWithdrawal]}
          onValueChange={(value) => setSwp({ monthlyWithdrawal: value[0] })}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>₹10K</span>
          <span>₹15L</span>
        </div>
      </div>

      {/* Post-Retirement Returns Slider */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-sm">
            Post-Retirement Returns (p.a)
          </label>
          <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
            {returnRate}%
          </div>
        </div>
        <Slider
          min={4}
          max={15}
          step={0.1}
          value={[returnRate]}
          onValueChange={(value) => setSwp({ returnRate: value[0] })}
          className="w-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>4%</span>
          <span>15%</span>
        </div>
      </div>

      {/* GOAL MODE: Desired Duration slider */}
      {goalMode && (
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-muted-foreground text-sm">
              🎯 Desired Duration
            </label>
            <div className="border-border bg-muted/50 rounded border px-3 py-1 text-sm font-semibold">
              {desiredYears} Years
            </div>
          </div>
          <Slider
            min={5}
            max={50}
            step={1}
            value={[desiredYears]}
            onValueChange={(value) => setSwp({ desiredYears: value[0] })}
            className="w-full"
          />
          <div className="text-muted-foreground mt-1 flex justify-between text-xs">
            <span>5 years</span>
            <span>50 years</span>
          </div>
        </div>
      )}

      <div className="border-border/50 my-5 border-t" />

      {/* Results */}
      {!goalMode && calculations && (
        <>
          <div className="mb-5 text-center">
            <p className="text-muted-foreground mb-1 text-sm">
              Your corpus will last
            </p>
            {neverDepletes ? (
              <p className="text-primary text-2xl font-bold md:text-3xl">
                ♾️ Forever
              </p>
            ) : (
              <>
                <p className="text-primary text-2xl font-bold md:text-3xl">
                  {lastingYears} Years{' '}
                  {lastingRemainingMonths > 0
                    ? `${lastingRemainingMonths} Months`
                    : ''}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  (until{' '}
                  <span className="text-destructive">
                    {currentYear + lastingYears}
                  </span>
                  )
                </p>
              </>
            )}
            <p className="text-muted-foreground mt-1 text-xs">
              Total withdrawn: {formatINR(calculations.totalWithdrawn)}
            </p>
          </div>
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
                  className="text-blue-500"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${withdrawnPortion} ${100 - withdrawnPortion}`}
                  strokeDashoffset="0"
                  className="text-primary"
                />
              </svg>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary h-3 w-3 shrink-0 rounded-sm" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">Your Corpus</p>
                  <p className="text-sm font-semibold">{formatINR(corpus)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 shrink-0 rounded-sm bg-blue-500" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">
                    Returns Earned
                  </p>
                  <p className="text-sm font-semibold">
                    {formatINR(Math.max(0, calculations.totalGains))}
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
            To withdraw {formatINRCompact(monthlyWithdrawal)}/mo for{' '}
            {desiredYears} years (until{' '}
            <span className="text-destructive">
              {currentYear + desiredYears}
            </span>
            ), you need
          </p>
          <p className="text-primary text-2xl font-bold md:text-3xl">
            {formatINR(goalResult.requiredCorpus)}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Retirement corpus at {returnRate}% p.a. returns
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-10 flex gap-2">
        {onConsult && (
          <Button onClick={handleConsult} className="flex-1">
            <MessageSquare className="h-4 w-4" /> Consult on this Goal
          </Button>
        )}
        <Button
          variant="outline"
          size={onConsult ? 'icon' : 'default'}
          onClick={handleShare}
          className={onConsult ? 'shrink-0' : 'w-full'}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          {!onConsult && (copied ? 'Copied!' : 'Share My Calculation')}
        </Button>
      </div>
    </div>
  )
}
