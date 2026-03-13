'use client'

import './landing-animations.css'

import Navansh from '@/components/icons/Navansh'
import { Button } from '@/components/ui/button'
import { useScrollReveal } from '@/lib/useScrollReveal'
import {
  ArrowRight,
  CheckCircle2,
  HeadphonesIcon,
  Heart,
  Shield,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CalculatorCarousel } from './enquire/EnquireContent'

/* ── Animated Counter ── */
function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2000,
}: {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

/* ── Partner Marquee ── */
const partners = ['HDFC', 'LIC', 'Star Health', 'ICICI', 'Bajaj Allianz', 'SBI']

function PartnerMarquee() {
  return (
    <div className="relative overflow-hidden py-4">
      <div className="animate-marquee flex w-max gap-16">
        {[...partners, ...partners].map((name, i) => (
          <span
            key={i}
            className="text-foreground/40 hover:text-foreground/70 text-lg font-bold tracking-wider whitespace-nowrap transition-colors"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Static Data ── */
const allServices = [
  {
    title: 'Build a Foundation',
    description:
      'Started a new Job? Got some savings? Start Investing early to build a strong financial foundation to avoid headaches later.',
    icon: TrendingUp,
  },
  {
    title: 'Grow Your Wealth',
    description:
      'Starting a New Family? Just got Married? Do you have a good Foundation? Money attracts Money!',
    icon: Heart,
  },
  {
    title: 'Retirement Planning',
    description:
      'Wondering when you can stop working with what you have? We can help you allocate and grow funds according to your goals.',
    icon: Wallet,
  },
]

const testimonials = [
  {
    name: 'Rajesh K.',
    role: 'Business Owner',
    text: 'Navansh Finserv gave us the clarity and confidence to make smart financial decisions for our family. Their personalized approach is unmatched.',
  },
  {
    name: 'Priya M.',
    role: 'IT Professional',
    text: 'Their SIP recommendations have consistently outperformed my expectations. The regular reviews keep me on track toward my goals.',
  },
  {
    name: 'Amit S.',
    role: 'Doctor',
    text: 'Claims assistance was seamless when I needed it the most. Having a dedicated advisor makes all the difference.',
  },
]

const whyUsCards = [
  {
    icon: Users,
    number: 1,
    title: 'Women Leadership',
    description:
      'Founded by a single mom with 20 years of expertise in financial services, we bring genuine care and understanding to every client relationship, even in the long term.',
    features: [
      'We believe in total transparency',
      'Empathetic approach to financial planning',
      'Gen-Alpha, Gen-Z, Millennials or Boomers, we understand everyone because of our diverse team and experience',
    ],
  },
  {
    icon: Shield,
    number: 2,
    title: 'Personalized Advisory',
    description:
      'Comprehensive financial health assessments tailored to your unique needs and life stage with proper goal setting. We will help build a secure future for your Family.',
    features: [
      'Retirement Planning',
      'Family First Approach',
      'Portfolio Reviews',
      'Worked 10+ Years with HNI and Super-HNI Clients',
    ],
  },
  {
    icon: HeadphonesIcon,
    number: 3,
    title: 'Long Term Support Guarantee',
    description:
      'Insurance, or any financial product is not a one-time purchase, it is a long-term commitment. We believe in keeping the client relationship healthy and strong in the long term.',
    features: [
      'Dedicated claims assistance',
      'Pro-active reminders and helpful tips',
      'Regular reviews and updates',
    ],
  },
]

/* ── Main Landing Client Component ── */
export default function LandingClient() {
  const containerRef = useScrollReveal()

  return (
    <div ref={containerRef}>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden py-24 md:py-36">
        {/* Decorative floating elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float bg-primary/10 absolute -top-20 -right-20 h-72 w-72 rounded-full blur-3xl" />
          <div className="animate-float-delayed bg-primary/5 absolute -bottom-32 -left-32 h-96 w-96 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* <div className="scroll-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
              Trusted by 500+ Families
            </div> */}

            <h1 className="scroll-reveal scroll-reveal-delay-1 mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-7xl">
              Securing Families &amp; Futures with{' '}
              <span className="from-primary to-primary animate-shimmer bg-gradient-to-r via-emerald-400 bg-clip-text text-transparent">
                Two Decades of Experience
              </span>
            </h1>

            <p className="scroll-reveal scroll-reveal-delay-2 text-muted-foreground mx-auto mb-10 max-w-2xl text-lg md:text-xl">
              Personalized financial planning made easy. Insurance, mutual
              funds, and wealth management - all under one roof.
            </p>

            <div className="scroll-reveal scroll-reveal-delay-3 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/enquire"
                className="animate-pulse-glow bg-primary inline-flex h-12 items-center justify-center rounded-lg px-8 text-lg font-bold text-white transition-transform hover:scale-105"
              >
                Get a Free Consultation
              </a>
              <a
                href="/services"
                className="text-primary hover:text-primary/80 inline-flex items-center gap-2 text-lg font-medium transition-colors"
              >
                Explore Services
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Stats Strip */}
          <div className="scroll-reveal scroll-reveal-delay-4 mx-auto mt-16 max-w-3xl">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {[
                {
                  value: 20,
                  suffix: '+',
                  label: 'Years Experience',
                },
                {
                  value: 500,
                  suffix: '+',
                  label: 'Families Served',
                },
                {
                  value: 50,
                  suffix: 'Cr+',
                  label: 'Assets Managed',
                  prefix: '₹',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border-border/50 bg-card/80 rounded-xl border p-4 text-center backdrop-blur-sm"
                >
                  <div className="text-primary text-2xl font-bold md:text-3xl">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                    />
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trusted Partners Strip ─── */}
      <section className="scroll-reveal border-border/50 bg-card/50 border-y py-8 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-muted-foreground mb-4 text-center text-xs font-semibold tracking-widest uppercase">
            Trusted Partners
          </p>
          <PartnerMarquee />
        </div>
      </section>

      {/* ─── Our Offerings ─── */}
      <section className="py-20">
        <div className="scroll-reveal mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            How Our Services Can Help <span className="text-primary">You</span>?
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            We can offer you personalized services based on your Life Stage.{' '}
            <Link href="/services" className="text-primary hover:underline">
              Learn More
            </Link>
          </p>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6 lg:gap-8">
            {allServices.map((service, i) => {
              const Icon = service.icon
              return (
                <div
                  key={service.title}
                  className={`scroll-reveal scroll-reveal-delay-${i + 1} group border-border/50 bg-card hover:border-primary/50 hover:shadow-primary/5 cursor-pointer rounded-xl border p-4 text-center transition-all hover:shadow-lg md:p-6`}
                >
                  <div className="mb-4 flex flex-row items-center gap-2">
                    <div className="bg-primary/10 text-primary group-hover:bg-primary rounded-lg p-3 transition-colors group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold sm:text-2xl">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {service.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Interactive Calculators Preview ─── */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Try Our Financial{' '}
              <span className="text-primary">Calculators</span>
            </h2>
            <p className="text-muted-foreground mx-auto text-lg">
              Plan your investments, estimate returns, and set financial goals
              with our interactive tools.
            </p>
          </div>
          <div className="scroll-reveal scroll-reveal-delay-1 mx-auto max-w-4xl">
            <CalculatorCarousel mode="preview" />
          </div>
        </div>
      </section>

      {/* ─── Testimonials Section ─── */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              What Our Clients <span className="text-primary">Say</span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Real stories from families we&apos;ve helped secure their
              financial futures.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`scroll-reveal scroll-reveal-delay-${i + 1} group border-border/50 bg-card hover:border-primary/50 rounded-xl border p-6 transition-all hover:shadow-lg`}
              >
                {/* Stars */}
                <div className="mb-4 flex gap-1 text-yellow-500">
                  {[...Array(5)].map((_, s) => (
                    <svg
                      key={s}
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="scroll-reveal mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Why Choose <Navansh className="inline-flex pb-2" />
              Navansh <span className="text-primary">Finserv</span>?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Experience personalized financial solutions backed by expertise
              and compassion.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {whyUsCards.map((card, i) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className={`scroll-reveal scroll-reveal-delay-${i + 1} group border-border/50 bg-card hover:border-primary/50 hover:shadow-primary/5 cursor-pointer rounded-xl border p-8 transition-all hover:shadow-lg`}
                >
                  <div className="mb-6">
                    <div className="relative mb-4">
                      <div className="bg-primary/10 text-primary group-hover:bg-primary inline-flex h-14 w-14 items-center justify-center rounded-lg transition-colors group-hover:text-white">
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="bg-primary absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white">
                        {card.number}
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold">{card.title}</h3>
                    <p className="text-muted-foreground">{card.description}</p>
                  </div>
                  <ul className="space-y-2">
                    {card.features.map((feature) => (
                      <li key={feature} className="flex items-start text-sm">
                        <CheckCircle2 className="text-primary mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Final CTA Section ─── */}
      <section className="relative overflow-hidden py-24">
        {/* Gradient background */}
        <div className="from-primary/10 to-primary/5 absolute inset-0 bg-gradient-to-br via-transparent" />

        <div className="relative container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div className="scroll-reveal">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Secure Your <span className="text-primary">Future</span>?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
              Take the first step toward financial freedom. Get expert guidance
              tailored to your family&apos;s needs — it starts with a
              conversation.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="text-lg font-semibold">
                <Link href="/contact">Get Started Today</Link>
              </Button>
              <Button asChild variant="link" size="lg">
                <Link href="/services" className="text-lg">
                  Explore Services
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
