'use client'

import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Number */}
        <h1 className="text-primary/20 text-9xl font-bold">404</h1>

        {/* Message */}
        <h2 className="text-foreground mt-4 text-3xl font-bold">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mt-4 max-w-md">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or doesn&apos;t exist.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors"
          >
            <Home className="h-5 w-5" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="border-border bg-background text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-semibold transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
