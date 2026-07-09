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
import { Check, ChevronsUpDown, SlidersHorizontal, X } from 'lucide-react'
import type { MFFilters } from './MFScreener'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

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

interface AmcSelectorProps {
  selectedAmcs: string[]
  availableAmcs: string[]
  toggleAmc: (amc: string) => void
  modal?: boolean
}

function AmcSelector({
  selectedAmcs,
  availableAmcs,
  toggleAmc,
  modal = false,
}: AmcSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="border-border bg-card text-foreground hover:border-primary/40 flex h-10 w-full shrink-0 items-center justify-between rounded-lg border px-3 py-2 text-sm font-normal transition-colors"
        >
          <span className="text-muted-foreground max-w-[90%] truncate">
            {selectedAmcs.length === 0
              ? 'Select fund houses…'
              : selectedAmcs.length === 1
                ? selectedAmcs[0]
                : `${selectedAmcs[0]} +${selectedAmcs.length - 1} more`}
          </span>
          <ChevronsUpDown className="text-muted-foreground size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search AMCs…" className="h-9" />
          <CommandList>
            <CommandEmpty>No AMCs found.</CommandEmpty>
            <CommandGroup>
              {availableAmcs.map((amc) => {
                const isSelected = selectedAmcs.includes(amc)
                return (
                  <CommandItem
                    key={amc}
                    value={amc}
                    onSelect={() => toggleAmc(amc)}
                    className="flex cursor-pointer items-center gap-2 px-2.5 py-1.5"
                  >
                    <div
                      className={cn(
                        'border-primary flex size-4 items-center justify-center rounded-sm border transition-colors',
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-transparent opacity-50'
                      )}
                    >
                      {isSelected && <Check className="size-3" />}
                    </div>
                    <span className="truncate text-sm">{amc}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function FilterPanel({
  currentFilters,
  availableAmcs,
  onFilterChange,
}: FilterPanelProps) {
  const selectedAmcs = currentFilters.amc
    ? currentFilters.amc.split(',').filter(Boolean)
    : []

  const hasActiveFilters =
    currentFilters.category !== 'all' ||
    selectedAmcs.length > 0 ||
    !!currentFilters.q

  function toggleAmc(amc: string) {
    const current = new Set(selectedAmcs)
    if (current.has(amc)) current.delete(amc)
    else current.add(amc)
    onFilterChange({ amc: [...current].join(',') })
  }

  function clearAll() {
    onFilterChange({ category: 'all', amc: '', q: '' })
  }

  // Shared filter content for both desktop and mobile
  const renderFilterContent = (isMobile = false) => (
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

        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <AmcSelector
              selectedAmcs={selectedAmcs}
              availableAmcs={availableAmcs}
              toggleAmc={toggleAmc}
              modal={isMobile}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            disabled={!hasActiveFilters}
            tabIndex={hasActiveFilters ? 0 : -1}
            className={cn(
              'hover:border-border h-10 shrink-0 gap-1.5 border border-transparent px-3 text-xs font-semibold transition-opacity duration-200',
              hasActiveFilters
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-0'
            )}
          >
            <X className="size-3.5" />
            Clear
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop: visible on md+ */}
      <div className="border-border bg-card/50 hidden space-y-4 rounded-xl border p-4 backdrop-blur-sm md:block">
        {renderFilterContent(false)}
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
                    selectedAmcs.length +
                    (currentFilters.q?.trim() ? 1 : 0)}
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
            <div className="space-y-6 px-4 pb-8">
              {renderFilterContent(true)}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
