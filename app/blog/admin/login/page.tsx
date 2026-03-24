'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { loginAction } from '../actions'

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      await loginAction(formData)
      router.push('/blog/admin')
      router.refresh() // Ensure server components re-run auth checks
    } catch (err: unknown) {
      const e = err as Error
      setError(e.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="border-border bg-card mx-auto mt-20 max-w-sm rounded-xl border p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold">Admin Login</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to manage blog posts
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@example.com"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-destructive rounded-md bg-red-50 p-3 text-sm dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  )
}
