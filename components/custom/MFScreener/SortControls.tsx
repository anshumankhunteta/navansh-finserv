'use client'

import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

interface SortColumn {
  label: string
  key: string
  sortable: boolean
  /** Tailwind width class */
  className: string
}

const COLUMNS: SortColumn[] = [
  {
    label: 'Scheme Name',
    key: 'scheme_name',
    sortable: true,
    className: 'flex-1 min-w-[200px]',
  },
  {
    label: '1Y Return',
    key: 'return_1y',
    sortable: true,
    className: 'w-24 text-right',
  },
  {
    label: '3Y Return',
    key: 'return_3y',
    sortable: true,
    className: 'w-24 text-right',
  },
  {
    label: '5Y Return',
    key: 'return_5y',
    sortable: true,
    className: 'w-24 text-right',
  },
  { label: 'NAV', key: 'nav', sortable: false, className: 'w-24 text-right' },
]

interface SortControlsProps {
  currentSort: string
  onSortChange: (sort: string) => void
}

function parseSort(sort: string): {
  column: string
  direction: 'asc' | 'desc'
} {
  const match = sort.match(/^(\w+)_(asc|desc)$/)
  if (!match) return { column: 'return_1y', direction: 'desc' }
  return { column: match[1], direction: match[2] as 'asc' | 'desc' }
}

export function SortControls({ currentSort, onSortChange }: SortControlsProps) {
  const { column: activeCol, direction } = parseSort(currentSort)

  function handleSort(key: string) {
    if (activeCol === key) {
      // Toggle direction
      onSortChange(`${key}_${direction === 'asc' ? 'desc' : 'asc'}`)
    } else {
      // Default descending for returns, ascending for name
      const defaultDir = key === 'scheme_name' ? 'asc' : 'desc'
      onSortChange(`${key}_${defaultDir}`)
    }
  }

  return (
    <div className="border-border bg-muted/30 hidden border-b px-4 py-3 md:flex md:items-center md:gap-4">
      {COLUMNS.map((col) => (
        <div
          key={col.key}
          className={cn('flex items-center gap-1.5', col.className)}
        >
          {col.sortable ? (
            <button
              onClick={() => handleSort(col.key)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase transition-colors',
                activeCol === col.key
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {col.label}
              {activeCol === col.key ? (
                direction === 'asc' ? (
                  <ArrowUp className="size-3.5" />
                ) : (
                  <ArrowDown className="size-3.5" />
                )
              ) : (
                <ArrowUpDown className="size-3.5 opacity-40" />
              )}
            </button>
          ) : (
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {col.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export { COLUMNS }
