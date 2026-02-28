'use client'

import { ContactForm } from '@/components/custom/ContactForm'
import { EducationInflationCalculator } from '@/components/custom/calculators/EducationInflationCalculator'
import { FDCalculator } from '@/components/custom/calculators/FDCalculator'
import { HLVCalculator } from '@/components/custom/calculators/HLVCalculator'
import { MediclaimEstimator } from '@/components/custom/calculators/MediclaimEstimator'
import { SIPCalculator } from '@/components/custom/calculators/SIPCalculator'
import { RetirementSWPCalculator } from '@/components/custom/calculators/SWPCalculator'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

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
  'general-insurance': ['mediclaim', 'education', 'swp', 'hlv', 'fd', 'sip'],
  'life-term-insurance': ['hlv', 'education'],
  'fd-bonds': ['fd'],
}

export function EnquireContent() {
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

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

  const NUMBER_OF_PAGES = activeCalcs.length

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrentSlide(api.selectedScrollSnap())
    // Initial sync — standard Embla subscription pattern

    onSelect()
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

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
            {isSingle ? (
              // Single calculator — no carousel needed
              (() => {
                const { Component } = activeCalcs[0]
                return <Component onConsult={handleConsult} />
              })()
            ) : (
              // Multiple calculators — show carousel
              <>
                {/* Pagination */}
                <div className="text-muted-foreground mb-4 flex scale-80 items-center justify-center gap-8 lg:scale-110">
                  <ChevronLeft
                    className="h-6 w-6 cursor-pointer transition-all duration-100 ease-in-out hover:scale-125 active:scale-125"
                    onClick={() => api?.scrollTo(currentSlide - 1)}
                  />
                  <div className="flex items-center space-x-3">
                    {Array.from({ length: NUMBER_OF_PAGES }, (_, i) => i).map(
                      (index) => (
                        <button
                          key={index}
                          onClick={() => api?.scrollTo(index)}
                          className={`hover:bg-primary/50 h-3 w-3 cursor-pointer rounded-full shadow-lg transition-all duration-300 ease-in-out ${index === currentSlide ? 'bg-primary scale-125' : 'bg-muted'}`}
                        />
                      )
                    )}
                  </div>
                  <ChevronRight
                    className="h-6 w-6 cursor-pointer transition-all duration-100 ease-in-out hover:scale-125 active:scale-125"
                    onClick={() => api?.scrollTo(currentSlide + 1)}
                  />
                </div>
                <Carousel
                  setApi={setApi}
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
                  className="bg-muted/60 dark:bg-muted/30 w-full rounded-3xl p-1"
                >
                  <CarouselContent>
                    {activeCalcs.map(({ key, Component }) => (
                      <CarouselItem className="h-full" key={key}>
                        <Component onConsult={handleConsult} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
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
