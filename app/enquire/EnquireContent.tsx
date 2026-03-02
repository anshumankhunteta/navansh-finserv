'use client'

import {
  CalculatorCarousel,
  type CalcKey,
} from '@/components/custom/CalculatorCarousel'
import { ContactForm } from '@/components/custom/ContactForm'
import { Button } from '@/components/ui/button'
import { restoreFromUrl } from '@/lib/calculator-store'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

// Re-export CalculatorCarousel from here as requested
export { CalculatorCarousel } from '@/components/custom/CalculatorCarousel'

// ── Service → Calculator mapping ──
const SERVICE_CALC_MAP: Record<string, CalcKey[]> = {
  'mutual-funds': ['sip', 'swp'],
  'health-mediclaim': ['mediclaim'],
  'general-insurance': ['mediclaim', 'education', 'swp', 'hlv', 'fd', 'sip'],
  'life-term-insurance': ['hlv', 'education'],
  'fd-bonds': ['fd'],
}

export function EnquireContent() {
  const searchParams = useSearchParams()
  const service = searchParams.get('service')
  const [consultMessage, setConsultMessage] = useState('')

  // ── URL-based state restore (shared link) ──
  const initialCalcKey = useMemo(() => {
    // Read ?calc= from URL and restore store values
    const restored = restoreFromUrl(searchParams)
    // Also check the legacy ?calculator= param from the preview redirect
    if (!restored) {
      const legacy = searchParams.get('calculator') as CalcKey | null
      return legacy
    }
    return restored
  }, [searchParams])

  // Determine which calculators to show
  const activeKeys: CalcKey[] | undefined =
    service && SERVICE_CALC_MAP[service] ? SERVICE_CALC_MAP[service] : undefined // undefined = show all (default in CalculatorCarousel)

  const handleConsult = useCallback((msg: string) => {
    setConsultMessage(msg)
    setTimeout(() => {
      const el = document.getElementById('contact-form')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setTimeout(() => {
          const textarea = el.querySelector('textarea')
          if (textarea) textarea.focus()
        }, 600)
      }
    }, 100)
  }, [])

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-6 lg:px-8">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                Navansh <span className="text-primary">Financial Suite</span>
              </h1>
              <p className="text-muted-foreground">
                Explore our interactive calculators!
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid w-full grid-cols-1 gap-3 xl:grid-cols-2 xl:gap-24">
          {/* Calculator(s) */}
          <div className="mx-auto w-full pb-12">
            <CalculatorCarousel
              calculatorKeys={activeKeys}
              mode="full"
              onConsult={handleConsult}
              initialCalcKey={initialCalcKey ?? undefined}
            />
          </div>
          {/* Contact Form */}
          <div className="mx-auto w-full">
            <ContactForm externalMessage={consultMessage} />
          </div>
        </div>
      </div>
      <section className="py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-primary mb-4 text-3xl font-bold">
            <span className="text-primary-foreground">Want to</span> Contact us
            Directly?
          </h2>
          <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
            Don&apos;t want to share your data? Visit our contact page to get in
            touch with us.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild variant="link" size="lg">
              <Link href="/services">
                <ArrowLeft className="text-primary" />
                <span className="text-primary">Explore Services </span>
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/contact">
                <span className="">Contact Page </span>
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
