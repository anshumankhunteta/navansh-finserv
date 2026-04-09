'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { cn } from '@/lib/utils'
import type { MFNav, MFScheme } from '@/lib/mf-utils'
import { X } from 'lucide-react'
import Link from 'next/link'

// ---- Types -------------------------------------------------------

type TimeRange = '1M' | '3M' | '6M' | '1Y' | '3Y' | 'ALL'

interface NAVChartProps {
  /** Scheme metadata (for header display) */
  scheme: MFScheme
  /** If provided, skip the API fetch and use this data directly */
  initialData?: MFNav[]
  /** Whether this is rendered inside a modal */
  isModal?: boolean
  /** Called when the modal should close */
  onClose?: () => void
}

interface ChartDataPoint {
  date: string
  nav: number
}

// ---- Time ranges -------------------------------------------------

const TIME_RANGES: { key: TimeRange; label: string }[] = [
  { key: '1M', label: '1M' },
  { key: '3M', label: '3M' },
  { key: '6M', label: '6M' },
  { key: '1Y', label: '1Y' },
  { key: '3Y', label: '3Y' },
  { key: 'ALL', label: 'All' },
]

// ---- Custom Tooltip -----------------------------------------------

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="border-border bg-card rounded-lg border px-3 py-2 shadow-xl">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-primary text-sm font-bold">
        ₹{payload[0].value.toFixed(4)}
      </p>
    </div>
  )
}

// ---- Component ---------------------------------------------------

export function NAVChart({
  scheme,
  initialData,
  isModal = false,
  onClose,
}: NAVChartProps) {
  const [history, setHistory] = useState<MFNav[]>(initialData ?? [])
  const [loading, setLoading] = useState(!initialData)
  const [range, setRange] = useState<TimeRange>('1Y')

  // Fetch data if not provided
  useEffect(() => {
    if (initialData) return
    const controller = new AbortController()

    const loadData = async () => {
      setLoading(true)
      try {
        const r = await fetch(`/api/mf/${scheme.scheme_code}/history`, {
          signal: controller.signal,
        })
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const data = (await r.json()) as { history: MFNav[] }
        setHistory(data.history ?? [])
      } catch (err: unknown) {
        if ((err as { name?: string }).name === 'AbortError') return
        setHistory([])
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadData()
    return () => controller.abort()
  }, [scheme.scheme_code, initialData])

  // Close on Escape
  useEffect(() => {
    if (!isModal) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isModal, onClose])

  // Sort history ascending by date once (API may return any order)
  const sortedHistory = useMemo(
    () =>
      [...history].sort(
        (a, b) =>
          new Date(a.nav_date).getTime() - new Date(b.nav_date).getTime()
      ),
    [history]
  )

  // Filter data by time range — relative to the latest data point, not today
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (sortedHistory.length === 0) return []

    const latestDate = new Date(
      sortedHistory[sortedHistory.length - 1].nav_date
    )

    let startDate: Date | null = null
    if (range !== 'ALL') {
      const monthsMap: Record<Exclude<TimeRange, 'ALL'>, number> = {
        '1M': 1,
        '3M': 3,
        '6M': 6,
        '1Y': 12,
        '3Y': 36,
      }
      startDate = new Date(latestDate)
      startDate.setMonth(startDate.getMonth() - monthsMap[range])
    }

    return sortedHistory
      .filter((row) => {
        if (!startDate) return true
        return new Date(row.nav_date) >= startDate
      })
      .map((row) => ({
        date: new Date(row.nav_date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: '2-digit',
        }),
        nav: row.nav,
      }))
  }, [sortedHistory, range])

  // Compute return for selected range
  const rangeReturn = useMemo(() => {
    if (chartData.length < 2) return null
    const first = chartData[0].nav
    const last = chartData[chartData.length - 1].nav
    if (first <= 0) return null
    return +((last / first - 1) * 100).toFixed(2)
  }, [chartData])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose?.()
    },
    [onClose]
  )

  const latestNav =
    sortedHistory.length > 0
      ? sortedHistory[sortedHistory.length - 1].nav
      : null

  const content = (
    <div className={cn('flex flex-col', isModal ? 'h-full' : 'space-y-4')}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-5 pb-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground truncate text-lg font-bold">
            {scheme.scheme_name}
          </h3>
          <Link href={`/mf/${scheme.scheme_code}`}>View Details</Link>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
            {latestNav !== null && (
              <span className="text-foreground font-semibold">
                ₹{latestNav.toFixed(4)}
              </span>
            )}
            {rangeReturn !== null && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-semibold',
                  rangeReturn >= 0
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-red-500/10 text-red-500'
                )}
              >
                {rangeReturn >= 0 ? '+' : ''}
                {rangeReturn}%
              </span>
            )}
            {scheme.fund_house && (
              <span className="text-muted-foreground text-xs">
                {scheme.fund_house}
              </span>
            )}
          </div>
        </div>
        {isModal && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-muted-foreground hover:bg-accent/20 hover:text-foreground rounded-lg p-1.5 transition-colors"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Time range tabs */}
      <div className="flex gap-1 px-5">
        {TIME_RANGES.map((tr) => (
          <button
            key={tr.key}
            onClick={() => setRange(tr.key)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
              range === tr.key
                ? 'bg-primary shadow-primary/25 text-white shadow-md'
                : 'text-muted-foreground hover:bg-accent/20 hover:text-foreground'
            )}
          >
            {tr.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 px-2 py-4">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-muted-foreground flex h-64 items-center justify-center text-sm">
            No NAV data available for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={isModal ? 300 : 400}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                tickLine={false}
                axisLine={false}
                width={60}
                tickFormatter={(v: number) => `₹${v.toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="nav"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'var(--primary)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )

  if (!isModal) return content

  // Modal wrapper
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 border-border bg-card w-full max-w-2xl rounded-t-2xl border shadow-2xl duration-300 sm:rounded-2xl">
        {content}
      </div>
    </div>
  )
}
