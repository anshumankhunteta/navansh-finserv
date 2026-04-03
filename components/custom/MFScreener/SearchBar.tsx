'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (q: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [local, setLocal] = useState(value)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync when parent value changes (e.g. clear all)
  useEffect(() => {
    setLocal(value)
  }, [value])

  function handleChange(newValue: string) {
    setLocal(newValue)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onChange(newValue)
    }, 300)
  }

  // Cleanup pending debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
        debounceRef.current = null
      }
    }
  }, [])

  function handleClear() {
    setLocal('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    onChange('')
  }

  return (
    <div className="relative w-full max-w-md">
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <input
        id="mf-search"
        type="text"
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search by scheme name…"
        className={cn(
          'border-border bg-card text-foreground placeholder:text-muted-foreground w-full rounded-lg border py-2.5 pr-9 pl-10 text-sm transition-colors',
          'focus:border-primary/50 focus:ring-primary/20 focus:ring-2 focus:outline-none'
        )}
      />
      {local && (
        <button
          type="button"
          onClick={handleClear}
          className="text-muted-foreground hover:bg-accent/20 hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 transition-colors"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
