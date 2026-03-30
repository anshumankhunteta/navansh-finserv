'use client'

import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '@/lib/utils'
import type { MFScheme } from '@/lib/mf-utils'
import { COLUMNS } from './SortControls'

const ROW_HEIGHT = 56

interface SchemeTableProps {
  data: MFScheme[]
  isPending: boolean
  onSchemeClick?: (scheme: MFScheme) => void
}

function formatReturn(value: number | null): {
  text: string
  color: string
} {
  if (value === null || value === undefined)
    return { text: '—', color: 'text-muted-foreground' }
  const sign = value >= 0 ? '+' : ''
  return {
    text: `${sign}${value.toFixed(2)}%`,
    color: value >= 0 ? 'text-emerald-500' : 'text-red-500',
  }
}

function categoryBadge(category: string | null): {
  label: string
  className: string
} {
  if (!category)
    return { label: 'Other', className: 'bg-muted text-muted-foreground' }

  const lower = category.toLowerCase()
  if (lower.includes('equity'))
    return {
      label: 'Equity',
      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    }
  if (lower.includes('debt'))
    return {
      label: 'Debt',
      className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    }
  if (lower.includes('hybrid'))
    return {
      label: 'Hybrid',
      className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    }
  if (lower.includes('commodity') || lower.includes('other'))
    return {
      label: 'Commodity',
      className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    }
  return {
    label: category.slice(0, 12),
    className: 'bg-muted text-muted-foreground',
  }
}

// ---- Skeleton row -----------------------------------------------

function SkeletonRow() {
  return (
    <div className="border-border flex animate-pulse items-center gap-4 border-b px-4 py-4">
      <div className="flex-1 space-y-2">
        <div className="bg-muted h-4 w-3/4 rounded" />
        <div className="bg-muted h-3 w-1/3 rounded" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="hidden w-24 md:block">
          <div className="bg-muted ml-auto h-4 w-16 rounded" />
        </div>
      ))}
      <div className="hidden w-24 md:block">
        <div className="bg-muted ml-auto h-4 w-14 rounded" />
      </div>
    </div>
  )
}

// ---- Main component ---------------------------------------------

export function SchemeTable({
  data,
  isPending,
  onSchemeClick,
}: SchemeTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  })

  if (isPending) {
    return (
      <div>
        {[...Array(5)].map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 text-4xl">🔍</div>
        <p className="text-foreground text-lg font-medium">No schemes found</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Try adjusting your filters or search query.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={scrollRef}
      className="overflow-y-auto"
      style={{ height: 'calc(100vh - 220px)' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const scheme = data[virtualRow.index]
          const r1y = formatReturn(scheme.return_1y)
          const r3y = formatReturn(scheme.return_3y)
          const r5y = formatReturn(scheme.return_5y)
          const badge = categoryBadge(scheme.scheme_category)

          return (
            <div
              key={scheme.scheme_code}
              data-index={virtualRow.index}
              className="border-border absolute top-0 left-0 w-full border-b"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <button
                onClick={() => onSchemeClick?.(scheme)}
                className="group hover:bg-accent/10 flex h-full w-full items-center gap-4 px-4 text-left transition-colors"
              >
                {/* Scheme name + badge (flex-1) */}
                <div className={COLUMNS[0].className}>
                  <p className="text-foreground group-hover:text-primary truncate text-sm font-medium transition-colors">
                    {scheme.scheme_name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase',
                        badge.className
                      )}
                    >
                      {badge.label}
                    </span>
                    {scheme.fund_house && (
                      <span className="text-muted-foreground hidden truncate text-xs sm:inline">
                        {scheme.fund_house}
                      </span>
                    )}
                  </div>
                </div>

                {/* Desktop return columns */}
                <div
                  className={cn(
                    'hidden text-sm font-semibold tabular-nums md:block',
                    COLUMNS[1].className,
                    r1y.color
                  )}
                >
                  {r1y.text}
                </div>
                <div
                  className={cn(
                    'hidden text-sm font-semibold tabular-nums md:block',
                    COLUMNS[2].className,
                    r3y.color
                  )}
                >
                  {r3y.text}
                </div>
                <div
                  className={cn(
                    'hidden text-sm font-semibold tabular-nums md:block',
                    COLUMNS[3].className,
                    r5y.color
                  )}
                >
                  {r5y.text}
                </div>

                {/* Mobile returns */}
                <div className="flex items-center gap-3 md:hidden">
                  <span className={cn('text-xs font-semibold', r1y.color)}>
                    {r1y.text}
                  </span>
                </div>

                {/* NAV (desktop) */}
                <div
                  className={cn(
                    'text-foreground hidden text-sm tabular-nums md:block',
                    COLUMNS[4].className
                  )}
                >
                  {scheme.latest_nav != null
                    ? `₹${scheme.latest_nav.toFixed(2)}`
                    : '—'}
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
