'use client'

import { EducationInflationCalculator } from '@/components/custom/calculators/EducationInflationCalculator'
import { FDCalculator } from '@/components/custom/calculators/FDCalculator'
import { HLVCalculator } from '@/components/custom/calculators/HLVCalculator'
import { MediclaimEstimator } from '@/components/custom/calculators/MediclaimEstimator'
import { SIPCalculator } from '@/components/custom/calculators/SIPCalculator'
import { RetirementSWPCalculator } from '@/components/custom/calculators/SWPCalculator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { useCalculatorStore } from '@/lib/calculator-store'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import Navansh from '../icons/Navansh'

// ── All available calculators ──
export const ALL_CALCULATORS = {
  sip: { key: 'sip', label: 'SIP Calculator', Component: SIPCalculator },
  swp: {
    key: 'swp',
    label: 'SWP Calculator',
    Component: RetirementSWPCalculator,
  },
  education: {
    key: 'education',
    label: 'Education Calculator',
    Component: EducationInflationCalculator,
  },
  hlv: { key: 'hlv', label: 'HLV Calculator', Component: HLVCalculator },
  fd: { key: 'fd', label: 'FD Calculator', Component: FDCalculator },
  mediclaim: {
    key: 'mediclaim',
    label: 'Mediclaim Estimator',
    Component: MediclaimEstimator,
  },
} as const

export type CalcKey = keyof typeof ALL_CALCULATORS

interface CalculatorCarouselProps {
  /** Which calculators to show. Defaults to all. */
  calculatorKeys?: CalcKey[]
  /**
   * 'full'    – shows the big "Consult on this Goal" button (used on /enquire).
   * 'preview' – shows a small "Get a quote on this?" link button with a
   *             confirmation dialog before redirecting to /enquire.
   */
  mode?: 'full' | 'preview'
  /** Callback when "Consult" is clicked in full mode. Ignored in preview mode. */
  onConsult?: (msg: string) => void
  /** Auto-scroll to this calculator on mount (for URL restore). */
  initialCalcKey?: CalcKey
}

export function CalculatorCarousel({
  calculatorKeys,
  mode = 'full',
  onConsult,
  initialCalcKey,
}: CalculatorCarouselProps) {
  const router = useRouter()
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showRedirectDialog, setShowRedirectDialog] = useState(false)
  const [pendingCalcKey, setPendingCalcKey] = useState<CalcKey | null>(null)

  const allKeys = Object.keys(ALL_CALCULATORS) as CalcKey[]
  const activeKeys = calculatorKeys ?? allKeys
  const activeCalcs = activeKeys.map((k) => ALL_CALCULATORS[k])

  const isSingle = activeCalcs.length === 1

  const isStoreLoaded = useCalculatorStore((state) => state.isLoaded)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!isStoreLoaded) return
    const t = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(t)
  }, [isStoreLoaded])

  // ── Carousel sync ──
  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrentSlide(api.selectedScrollSnap())
    onSelect()
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  // ── Auto-scroll to initialCalcKey on mount ──
  useEffect(() => {
    if (!api || !initialCalcKey) return
    const targetIndex = activeKeys.indexOf(initialCalcKey)
    if (targetIndex > 0) {
      api.scrollTo(targetIndex, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, initialCalcKey])

  // ── Consult handler ──
  const handleConsult = useCallback(
    (msg: string) => {
      if (mode === 'full') {
        onConsult?.(msg)
        return
      }

      // Preview mode: figure out which calculator fired by slide index
      const calcKey = activeKeys[currentSlide] ?? activeKeys[0]
      setPendingCalcKey(calcKey)
      setShowRedirectDialog(true)
    },
    [mode, onConsult, activeKeys, currentSlide]
  )

  const handleConfirmRedirect = useCallback(() => {
    setShowRedirectDialog(false)
    const params = new URLSearchParams()
    if (pendingCalcKey) params.set('calculator', pendingCalcKey)
    router.push(`/enquire?${params.toString()}`)
  }, [pendingCalcKey, router])

  return isLoaded ? (
    <>
      <div className="mx-auto w-full">
        {isSingle ? (
          (() => {
            const { Component } = activeCalcs[0]
            return (
              <Component
                onConsult={mode === 'full' ? handleConsult : undefined}
              />
            )
          })()
        ) : (
          <>
            {/* Pagination */}
            <div className="text-muted-foreground mb-4 flex scale-80 items-center justify-center gap-8 lg:scale-110">
              <ChevronLeft
                className="h-6 w-6 cursor-pointer transition-all duration-100 ease-in-out hover:scale-125 active:scale-125"
                onClick={() => api?.scrollTo(currentSlide - 1)}
              />
              <div className="flex items-center space-x-3">
                {Array.from({ length: activeCalcs.length }, (_, i) => i).map(
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
              className="bg-card w-full rounded-3xl p-1 shadow-md"
            >
              <CarouselContent>
                {activeCalcs.map(({ key, Component }) => (
                  <CarouselItem className="h-full" key={key}>
                    <Component
                      onConsult={mode === 'full' ? handleConsult : undefined}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </>
        )}

        {/* Preview mode: small link CTA beneath the carousel */}
        {mode === 'preview' && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="link"
              size="sm"
              className="text-primary gap-1.5 text-sm"
              onClick={() => {
                const calcKey = activeKeys[currentSlide] ?? activeKeys[0]
                setPendingCalcKey(calcKey)
                setShowRedirectDialog(true)
              }}
            >
              Get a quote on this?
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Redirect confirmation dialog */}
      <AlertDialog
        open={showRedirectDialog}
        onOpenChange={setShowRedirectDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Continue to Enquire?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll be taken to our enquiry page where you can get a
              personalised consultation on your calculation. Your selected
              calculator will be ready for you.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay here</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRedirect}>
              Yes, take me there
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  ) : (
    <div className="bg-primary-foreground/50 fixed top-0 right-0 bottom-0 left-0 z-100 flex h-[100vh] w-[100vw] overflow-hidden rounded-none">
      {/* <Navansh height={120} />
      <p className="text-3xl font-bold">
        Navansh<span className="text-primary">Finserv</span>
      </p> */}
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="text-primary border-t-primary flex h-20 w-20 animate-spin items-center justify-center rounded-full border-4 border-transparent text-4xl">
          <div className="text-secondary border-t-muted flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent text-2xl"></div>
        </div>
      </div>
    </div>
  )
}
