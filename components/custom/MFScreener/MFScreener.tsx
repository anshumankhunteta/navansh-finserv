'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
import type { MFScheme } from '@/lib/mf-utils'
import { FilterPanel } from './FilterPanel'
import { SearchBar } from './SearchBar'
import { SortControls } from './SortControls'
import { SchemeTable } from './SchemeTable'

const NAVChart = dynamic(() => import('./NAVChart').then((m) => m.NAVChart), {
  ssr: false,
})

export interface MFFilters {
  category: string
  amc: string
  sort: string
  q: string
  page: number
}

interface MFScreenerProps {
  initialData: MFScheme[]
  totalCount: number
  currentFilters: MFFilters
  availableAmcs: string[]
  itemsPerPage: number
}

export function MFScreener({
  initialData,
  totalCount,
  currentFilters,
  availableAmcs,
  itemsPerPage,
}: MFScreenerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [selectedScheme, setSelectedScheme] = useState<MFScheme | null>(null)

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const updateParams = useCallback(
    (updates: Partial<MFFilters>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === '' ||
          value === 'all' ||
          (key === 'page' && value === 1)
        ) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      if (!('page' in updates)) {
        params.delete('page')
      }

      startTransition(() => {
        router.replace(`/mf?${params.toString()}`, { scroll: false })
      })
    },
    [router, searchParams, startTransition]
  )

  return (
    <div className="space-y-6">
      {/* Search + Filter row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={currentFilters.q}
          onChange={(q: string) => updateParams({ q })}
        />
        <div className="text-muted-foreground text-sm tabular-nums">
          {totalCount.toLocaleString()} scheme{totalCount !== 1 ? 's' : ''}{' '}
          found
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        currentFilters={currentFilters}
        availableAmcs={availableAmcs}
        onFilterChange={updateParams}
      />

      {/* Table */}
      <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
        <SortControls
          currentSort={currentFilters.sort}
          onSortChange={(sort: string) => updateParams({ sort })}
        />
        <SchemeTable
          data={initialData}
          isPending={isPending}
          onSchemeClick={(scheme: MFScheme) => setSelectedScheme(scheme)}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() =>
              updateParams({ page: Math.max(1, currentFilters.page - 1) })
            }
            disabled={currentFilters.page <= 1}
            className="border-border bg-card text-foreground hover:bg-accent/20 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <div className="flex items-center gap-1.5">
            {generatePageNumbers(currentFilters.page, totalPages).map((p, i) =>
              p === '...' ? (
                <span
                  key={`ellipsis-${i}`}
                  className="text-muted-foreground px-2"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => updateParams({ page: p as number })}
                  className={`min-w-[36px] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    p === currentFilters.page
                      ? 'bg-primary text-white shadow-md'
                      : 'border-border bg-card text-foreground hover:bg-accent/20 border'
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>
          <button
            onClick={() =>
              updateParams({
                page: Math.min(totalPages, currentFilters.page + 1),
              })
            }
            disabled={currentFilters.page >= totalPages}
            className="border-border bg-card text-foreground hover:bg-accent/20 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* NAV Chart Modal */}
      {selectedScheme && (
        <NAVChart
          scheme={selectedScheme}
          isModal
          onClose={() => setSelectedScheme(null)}
        />
      )}
    </div>
  )
}

/** Generate a compact page number list with ellipsis. */
function generatePageNumbers(
  current: number,
  total: number
): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('...')

  pages.push(total)
  return pages
}
