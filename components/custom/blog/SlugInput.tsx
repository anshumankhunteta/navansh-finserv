'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'

interface SlugInputProps {
  title: string
  value?: string
  onChange: (slug: string) => void
}

export function SlugInput({ title, value = '', onChange }: SlugInputProps) {
  const [internalSlug, setInternalSlug] = useState(value)
  const [isManual, setIsManual] = useState(!!value)

  useEffect(() => {
    // If we have an incoming value on mount that differs, set it
    if (value && !internalSlug) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInternalSlug(value)
      setIsManual(true)
    }
  }, [value, internalSlug])

  useEffect(() => {
    if (isManual) return

    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const timeoutId = setTimeout(() => {
      if (generated !== internalSlug) {
        setInternalSlug(generated)
        onChange(generated)
      }
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [title, isManual, internalSlug, onChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsManual(true)
    const newSlug = e.target.value
    setInternalSlug(newSlug)
    onChange(newSlug)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="slug" className="text-foreground">
        Slug
      </Label>
      <Input
        id="slug"
        name="slug"
        type="text"
        value={internalSlug}
        onChange={handleChange}
        placeholder="auto-generated-slug"
        className="font-mono text-sm"
      />
    </div>
  )
}
