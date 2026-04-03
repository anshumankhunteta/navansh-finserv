'use client'

import { RefractiveContainer } from '@/components/landing/RefractiveContainer'
import { cn } from '@/lib/utils'
import {
  Car,
  Heart,
  LucideProps,
  Shield,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { LazyMotion, domAnimation, m } from 'motion/react'
import { useRouter } from 'next/navigation'

export function BentoServices() {
  const router = useRouter()
  return (
    <section className="relative z-10 py-20">
      <LazyMotion features={domAnimation}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RefractiveContainer className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
              Comprehensive{' '}
              <span className="text-primary italic">Services</span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
              Protect, grow, and secure your wealth with our tailored financial
              solutions and expert guidance.
            </p>
          </RefractiveContainer>

          {/* 3 Column Layout that fits exactly 5 cards: 1 wide card and 4 standard cards */}
          <div className="grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {/* Card 1: Mutual Funds & SIPs (Wide Card) */}
            <RefractiveContainer
              delay={0.1}
              className="md:col-span-2 lg:col-span-2 lg:row-span-2"
            >
              <BentoCard
                onClick={() => router.push('/mf')}
                title="Mutual Funds & SIPs"
                subtitle="Expert portfolio management for long-term wealth creation"
                icon={TrendingUp}
                content={
                  <div className="relative z-10 mt-2 flex min-h-[220px] w-full flex-1 flex-col px-6 pb-6 sm:w-[50%] md:mt-6 md:self-end">
                    <div className="bg-card border-border relative z-20 flex items-center justify-between rounded-lg border px-3 pt-4 pb-3 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground mb-1 text-[10px] font-medium tracking-wider uppercase sm:text-xs">
                          Your Portfolio
                        </span>
                        <span className="text-primary text-sm font-bold sm:text-base">
                          31.2%
                        </span>
                      </div>
                      <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-[10px] font-bold uppercase">
                        VS
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-muted-foreground mb-1 text-[10px] font-medium tracking-wider uppercase sm:text-xs">
                          Nifty 50
                        </span>
                        <span className="text-sm font-bold text-orange-500 sm:text-base">
                          15.5%
                        </span>
                      </div>
                    </div>

                    <div className="relative mt-4 min-h-[140px] w-full flex-1">
                      <div className="pointer-events-none absolute inset-x-0 top-2 bottom-4 z-0 flex flex-col justify-between">
                        <div className="border-border/50 relative w-full border-b">
                          <span className="text-muted-foreground bg-card absolute -top-3 left-0 rounded-sm pr-1 text-[10px] font-medium">
                            ₹35K
                          </span>
                        </div>
                        <div className="border-border/50 relative w-full border-b">
                          <span className="text-muted-foreground bg-card absolute -top-3 left-0 rounded-sm pr-1 text-[10px] font-medium">
                            ₹17K
                          </span>
                        </div>
                        <div className="border-border/50 w-full border-b" />
                      </div>

                      <svg
                        className="absolute inset-0 z-10 h-full w-full overflow-visible drop-shadow-sm"
                        fill="none"
                        viewBox="0 0 300 120"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient
                            id="portfolioGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="var(--color-primary)"
                              stopOpacity={0.25}
                            />
                            <stop
                              offset="100%"
                              stopColor="var(--color-primary)"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,110 Q 30,105 50,100 T 110,95 T 160,85 T 220,70 L280,60"
                          stroke="#f97316"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M0,120 L0,100 C 30,95 60,80 100,85 S 160,40 190,50 S 250,15 280,15 L280,120 Z"
                          fill="url(#portfolioGradient)"
                        />
                        <path
                          d="M0,100 C 30,95 60,80 100,85 S 160,40 190,50 S 250,15 280,15"
                          stroke="var(--color-primary)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <div className="bg-primary text-primary-foreground border-card absolute top-[8%] right-0 z-20 rounded-full border-2 px-2 py-0.5 text-[9px] font-semibold shadow-md sm:right-6 sm:translate-x-2 sm:text-[10px]">
                        Your Portfolio
                      </div>
                      <div className="border-card absolute top-[48%] right-0 z-20 rounded-full border-2 bg-orange-500 px-2 py-0.5 text-[9px] font-semibold text-white shadow-md sm:translate-x-2 sm:text-[10px]">
                        NIFTY 50
                      </div>
                    </div>

                    <div className="text-muted-foreground z-20 mt-6 flex w-full items-center justify-between pt-2 pb-0 text-[10px] font-medium sm:text-xs">
                      <span className="hover:text-foreground hidden cursor-pointer transition-colors sm:block">
                        1M
                      </span>
                      <span>3M</span>
                      <span>6M</span>
                      <span>1Y</span>
                      <span className="bg-primary/10 text-primary border-primary/20 cursor-default rounded-md border px-2.5 py-1 font-bold shadow-sm">
                        3Y
                      </span>
                      <span>5Y</span>
                      <span>ALL</span>
                    </div>
                  </div>
                }
              />
            </RefractiveContainer>

            {/* Card 2: Life & Term Insurance */}
            <RefractiveContainer
              delay={0.2}
              className="md:col-span-1 lg:col-span-1"
            >
              <BentoCard
                title="Life & Term Insurance"
                subtitle="Secure your legacy with affordable term plans"
                icon={Shield}
              />
            </RefractiveContainer>

            {/* Card 3: Health & Mediclaim */}
            <RefractiveContainer
              delay={0.3}
              className="md:col-span-1 lg:col-span-1"
            >
              <BentoCard
                title="Health & Mediclaim"
                subtitle="Protect your family with cashless hospitalization"
                icon={Heart}
                content={
                  <div className="bg-primary/5 border-primary/10 relative mt-4 flex h-24 w-full items-center justify-center overflow-hidden rounded-t-xl border-t">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    />
                    <svg
                      viewBox="0 0 900 40"
                      preserveAspectRatio="xMidYMid meet"
                      className="stroke-primary h-[32px] w-full fill-none stroke-[3px] drop-shadow-[0_0_8px_var(--color-primary)]"
                    >
                      <path
                        d="M0,20 L60,20 L70,5 L85,35 L95,20 L900,20"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="to-card pointer-events-none absolute inset-y-0 right-0 z-10 w-1/3 bg-gradient-to-r from-transparent" />
                  </div>
                }
              />
            </RefractiveContainer>

            {/* Card 4: General Insurance */}
            <RefractiveContainer
              delay={0.4}
              className="md:col-span-1 lg:col-span-1"
            >
              <BentoCard
                title="General Insurance"
                subtitle="Comprehensive coverage for your Car & Bike"
                icon={Car}
                content={
                  <div className="mt-4 flex h-24 w-full items-end justify-center gap-2 px-6">
                    <div className="bg-primary/10 border-primary/20 relative h-20 w-1/2 overflow-hidden rounded-t-xl border-x border-t">
                      <div className="bg-primary/30 absolute top-2 left-2 h-4 w-4 rounded-full" />
                      <div className="bg-primary/20 absolute right-2 bottom-2 h-2 w-16 rounded-full" />
                    </div>
                    <div className="bg-primary/10 border-primary/20 relative h-20 w-1/2 overflow-hidden rounded-t-xl border-x border-t">
                      <div className="bg-primary/30 absolute top-2 left-2 h-4 w-4 rounded-full" />
                      <div className="bg-primary/20 absolute bottom-2 left-2 h-2 w-16 rounded-full" />
                    </div>
                  </div>
                }
              />
            </RefractiveContainer>

            {/* Card 5: Fixed Deposits & Bonds */}
            <RefractiveContainer
              delay={0.5}
              className="md:col-span-1 lg:col-span-2"
            >
              <BentoCard
                title="Fixed Deposits & Bonds"
                subtitle="Secure growth and steady guaranteed returns"
                icon={Wallet}
                content={
                  <div className="mt-4 flex h-24 w-full items-end justify-center gap-1 px-6 opacity-80">
                    {[30, 45, 60, 75, 90, 100].map((h, i) => (
                      <div
                        key={i}
                        className="from-primary/30 to-primary/40 relative flex-1 overflow-hidden rounded-t-md bg-gradient-to-t"
                        style={{ height: `${h}%` }}
                      >
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-white/30 dark:bg-white/10" />
                      </div>
                    ))}
                  </div>
                }
              />
            </RefractiveContainer>
          </div>
        </div>
      </LazyMotion>
    </section>
  )
}

function BentoCard({
  title,
  subtitle,
  icon: Icon,
  content,
  onClick,
}: {
  title: string
  subtitle: string
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  content?: React.ReactNode
  onClick?: () => void
}) {
  return (
    <m.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={cn(
        'group bg-card border-border/50 hover:shadow-primary/10 relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl border p-6 transition-shadow duration-500 hover:shadow-2xl',
        onClick ? 'cursor-pointer' : ''
      )}
      onClick={onClick}
    >
      {/* Frosted glass internal flare */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

      {/* Spotlight effect */}
      <div className="bg-primary/20 pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full opacity-0 blur-[50px] transition-opacity duration-700 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
      </div>

      {content && (
        <div className="relative mx-[-24px] mb-[-24px] flex flex-1 flex-col justify-end overflow-hidden px-0">
          {content}
        </div>
      )}
    </m.div>
  )
}
