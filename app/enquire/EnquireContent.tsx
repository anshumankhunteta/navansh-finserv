'use client'

import { ContactForm } from '@/components/custom/ContactForm'
import { SIPCalculator } from '@/components/custom/calculators/SIPCalculator'
import { EducationInflationCalculator } from '@/components/custom/calculators/EducationInflationCalculator'
import { RetirementSWPCalculator } from '@/components/custom/calculators/SWPCalculator'
import { HLVCalculator } from '@/components/custom/calculators/HLVCalculator'
import { FDCalculator } from '@/components/custom/calculators/FDCalculator'
import { MediclaimEstimator } from '@/components/custom/calculators/MediclaimEstimator'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// ── All available calculators ──
const ALL_CALCULATORS = {
  sip: { key: 'sip', Component: SIPCalculator },
  swp: { key: 'swp', Component: RetirementSWPCalculator },
  education: { key: 'education', Component: EducationInflationCalculator },
  hlv: { key: 'hlv', Component: HLVCalculator },
  fd: { key: 'fd', Component: FDCalculator },
  mediclaim: { key: 'mediclaim', Component: MediclaimEstimator },
} as const

type CalcKey = keyof typeof ALL_CALCULATORS

// ── Service → Calculator mapping ──
const SERVICE_CALC_MAP: Record<string, CalcKey[]> = {
  'mutual-funds': ['sip', 'swp'],
  'health-mediclaim': ['mediclaim'],
  'general-insurance': ['sip', 'education', 'swp', 'hlv', 'fd', 'mediclaim'],
  'life-term-insurance': ['hlv'],
  'fd-bonds': ['fd'],
}

export function EnquireContent() {
  const searchParams = useSearchParams()
  const service = searchParams.get('service')
  const [consultMessage, setConsultMessage] = useState('')

  // Determine which calculators to show
  const activeKeys: CalcKey[] =
    service && SERVICE_CALC_MAP[service]
      ? SERVICE_CALC_MAP[service]
      : (Object.keys(ALL_CALCULATORS) as CalcKey[])

  const activeCalcs = activeKeys.map((k) => ALL_CALCULATORS[k])

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

  const isSingle = activeCalcs.length === 1

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl py-12 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">
            Navansh <span className="text-primary">Financial Suite</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Plan your Wealth, Protect your Family - explore our interactive
            calculators.
            <br />
            Fill the form below to get a free personalised quote!
          </p>
        </div>

        <div className="mx-auto grid w-full grid-cols-1 gap-10 xl:grid-cols-2 xl:gap-24">
          {/* Calculator(s) */}
          <div className="mx-auto w-full pb-12">
            {isSingle ? (
              // Single calculator — no carousel needed
              (() => {
                const { Component } = activeCalcs[0]
                return <Component onConsult={handleConsult} />
              })()
            ) : (
              // Multiple calculators — show carousel
              <>
                <p className="text-muted-foreground mb-4 text-center text-sm">
                  ← Swipe or use arrows to explore all calculators →
                </p>
                <Carousel
                  opts={{
                    align: 'start',
                    loop: true,
                    watchDrag: (_emblaApi, evt) => {
                      const target = (evt as PointerEvent | TouchEvent)
                        .target as HTMLElement | null
                      if (!target) return true
                      const interactive = target.closest(
                        '[data-slot="slider"], input, textarea, select, button, a, label'
                      )
                      return !interactive
                    },
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {activeCalcs.map(({ key, Component }) => (
                      <CarouselItem key={key}>
                        <Component onConsult={handleConsult} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
              </>
            )}
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
          <Button asChild size="lg">
            <Link href="/contact">
              <span className="text-lg">Contact Page </span>
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
