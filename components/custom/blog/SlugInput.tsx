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
  const [prevValue, setPrevValue] = useState(value)

  // Sync when external value changes (e.g., form reset).
  // According to React docs, adjusting state while rendering is explicitly preferred here
  // over using an effect to avoid an entire secondary render cycle triggering a flash.
  if (value !== prevValue) {
    setPrevValue(value)
    setInternalSlug(value)
  }

  useEffect(() => {
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
  }, [title, internalSlug, onChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        placeholder="auto-generated-url-name"
      />
    </div>
  )
}
