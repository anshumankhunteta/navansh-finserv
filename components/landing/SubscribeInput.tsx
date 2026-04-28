'use client'

import {
  useActionState,
  useRef,
  useTransition,
  useEffect,
  useState,
} from 'react'
import { subscribeAction, type SubscribeState } from '@/app/newsletter/actions'
import { cn } from '@/lib/utils'
import { ArrowRight, CheckCircle2, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export function SubscribeInput() {
  const [state, formAction] = useActionState<SubscribeState | null, FormData>(
    subscribeAction,
    null
  )
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [hasFired, setHasFired] = useState(false)

  // Fire confetti on success
  useEffect(() => {
    if (state?.success && !hasFired) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasFired(true)
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#52c77d', '#409e54', '#34d399', '#ffffff'],
      })
    }
  }, [state?.success, hasFired])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(() => formAction(fd))
  }

  // Success state
  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="bg-primary/10 border-primary/30 inline-flex items-center gap-2 rounded-full border px-6 py-3 backdrop-blur-md">
          <CheckCircle2 className="text-primary h-5 w-5" />
          <span className="text-primary font-[family-name:var(--font-inter)] text-sm font-semibold tracking-wide sm:text-base">
            {state.message}
          </span>
        </div>
        <Link
          href="/enquire"
          className="text-muted-foreground hover:text-primary text-sm font-medium underline transition-colors"
        >
          Get a free portfolio review
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:gap-0"
      >
        {/* Input wrapper */}
        <div className="relative flex-1">
          <Mail className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
          <input
            ref={inputRef}
            type="email"
            name="email"
            placeholder="Subscribe to Newsletter"
            required
            autoComplete="email"
            disabled={isPending}
            className={cn(
              'bg-primary/5 border-primary/30 text-foreground placeholder:text-muted-foreground h-12 w-full rounded-full border py-3 pr-4 pl-10 font-[family-name:var(--font-inter)] text-sm font-medium backdrop-blur-md transition-all duration-300 sm:h-14 sm:rounded-r-none sm:text-base',
              'focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              state &&
                !state.success &&
                'border-destructive focus:border-destructive focus:ring-destructive/20'
            )}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            'bg-primary hover:bg-primary/90 text-primary-foreground group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 font-[family-name:var(--font-inter)] text-sm font-bold tracking-wider whitespace-nowrap transition-all duration-300 sm:h-14 sm:rounded-l-none sm:px-6 sm:text-base',
            'disabled:cursor-not-allowed disabled:opacity-70'
          )}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </button>
      </form>

      {/* Error message */}
      {state && !state.success && (
        <p className="text-destructive text-sm font-medium">{state.message}</p>
      )}

      {/* Secondary CTA */}
      <Link
        href="/enquire"
        className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
      >
        Or get a free portfolio review →
      </Link>
    </div>
  )
}
