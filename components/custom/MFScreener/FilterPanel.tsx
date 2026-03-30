'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SlidersHorizontal, X } from 'lucide-react'
import type { MFFilters } from './MFScreener'

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Equity', value: 'Equity' },
  { label: 'Debt', value: 'Debt' },
  { label: 'Hybrid', value: 'Hybrid' },
  { label: 'Commodity', value: 'Commodity' },
] as const

interface FilterPanelProps {
  currentFilters: MFFilters
  availableAmcs: string[]
  onFilterChange: (updates: Partial<MFFilters>) => void
}

export function FilterPanel({
  currentFilters,
  availableAmcs,
  onFilterChange,
}: FilterPanelProps) {
  const [amcOpen, setAmcOpen] = useState(false)
  const [amcSearch, setAmcSearch] = useState('')
  const selectedAmcs = currentFilters.amc
    ? currentFilters.amc.split(',').filter(Boolean)
    : []

  const hasActiveFilters =
    currentFilters.category !== 'all' ||
    selectedAmcs.length > 0 ||
    currentFilters.q !== ''

  function toggleAmc(amc: string) {
    const current = new Set(selectedAmcs)
    if (current.has(amc)) current.delete(amc)
    else current.add(amc)
    onFilterChange({ amc: [...current].join(',') })
  }

  function clearAll() {
    onFilterChange({ category: 'all', amc: '', q: '' })
  }

  const filteredAmcs = amcSearch
    ? availableAmcs.filter((a) =>
        a.toLowerCase().includes(amcSearch.toLowerCase())
      )
    : availableAmcs

  // Shared filter content for both desktop and mobile
  const filterContent = (
    <>
      {/* Category pills */}
      <div>
        <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive =
              currentFilters.category === cat.value ||
              (cat.value === 'all' && !currentFilters.category)
            return (
              <button
                key={cat.value}
                onClick={() => onFilterChange({ category: cat.value })}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary shadow-primary/25 text-white shadow-md'
                    : 'bg-card text-foreground border-border hover:bg-accent/20 hover:border-primary/40 border'
                )}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* AMC multi-select */}
      <div className="relative">
        <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
          Fund House (AMC)
        </label>

        {/* Selected AMC chips */}
        {selectedAmcs.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {selectedAmcs.map((amc) => (
              <span
                key={amc}
                className="bg-primary/15 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              >
                {amc.length > 25 ? amc.slice(0, 25) + '…' : amc}
                <button
                  onClick={() => toggleAmc(amc)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown trigger */}
        <button
          onClick={() => setAmcOpen(!amcOpen)}
          className="border-border bg-card text-foreground hover:border-primary/40 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors"
        >
          <span className="text-muted-foreground">
            {selectedAmcs.length > 0
              ? `${selectedAmcs.length} selected`
              : 'Select fund houses…'}
          </span>
          <svg
            className={cn(
              'text-muted-foreground size-4 transition-transform',
              amcOpen && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown panel */}
        {amcOpen && (
          <div className="border-border bg-card absolute z-30 mt-1 w-full rounded-lg border p-2 shadow-xl">
            <input
              type="text"
              placeholder="Search AMCs…"
              value={amcSearch}
              onChange={(e) => setAmcSearch(e.target.value)}
              className="border-border bg-input text-foreground placeholder:text-muted-foreground focus:ring-ring mb-2 w-full rounded-md border px-3 py-1.5 text-sm focus:ring-1 focus:outline-none"
            />
            <div className="max-h-48 overflow-y-auto">
              {filteredAmcs.length === 0 ? (
                <p className="text-muted-foreground px-2 py-3 text-center text-sm">
                  No AMCs found
                </p>
              ) : (
                filteredAmcs.map((amc) => (
                  <label
                    key={amc}
                    className="text-foreground hover:bg-accent/20 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmcs.includes(amc)}
                      onChange={() => toggleAmc(amc)}
                      className="accent-primary size-4"
                    />
                    <span className="truncate">{amc}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="w-fit">
          <X className="size-3.5" />
          Clear all filters
        </Button>
      )}
    </>
  )

  return (
    <>
      {/* Desktop: visible on md+ */}
      <div className="border-border bg-card/50 hidden space-y-4 rounded-xl border p-4 backdrop-blur-sm md:block">
        {filterContent}
      </div>

      {/* Mobile: bottom sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="size-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-primary flex size-5 items-center justify-center rounded-full text-[10px] text-white">
                  {(currentFilters.category !== 'all' ? 1 : 0) +
                    selectedAmcs.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[80dvh] overflow-y-auto rounded-t-2xl"
          >
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 px-4 pb-8">{filterContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
