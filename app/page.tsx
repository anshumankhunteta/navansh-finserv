import Navansh from '@/components/icons/Navansh'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  CheckCircle2,
  HeadphonesIcon,
  Shield,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { CalculatorCarousel } from '@/components/custom/CalculatorCarousel'
import { HeroSection } from '@/components/landing/HeroSection'
import { BentoServices } from '@/components/landing/BentoServices'
import { RefractiveContainer } from '@/components/landing/RefractiveContainer'

export default function HomePage() {
  return (
    <div className="relative flex flex-col overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Our Offerings / Bento Services */}
      <BentoServices />

      {/* Interactive Calculators Preview (Point of Clarity - sharpest element) */}
      <section className="relative z-20 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RefractiveContainer className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
              Focus on Your <span className="text-primary italic">Future</span>
            </h2>
            <p className="text-muted-foreground mx-auto text-lg md:text-xl">
              Plan your investments, estimate returns, and set clear financial
              benchmarks with our interactive foresight tools.
            </p>
          </RefractiveContainer>

          <RefractiveContainer
            delay={0.2}
            className="relative mx-auto max-w-4xl"
          >
            {/* Glow backing to indicate "clarity" */}
            <div className="bg-primary/5 absolute inset-0 -z-10 rounded-full blur-[100px]" />
            <CalculatorCarousel mode="preview" />
          </RefractiveContainer>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="bg-card/50 border-border/50 relative z-10 border-y py-24 backdrop-blur-3xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RefractiveContainer className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
              Why Choose <Navansh className="-mt-1 inline-flex pb-2" />
              Navansh <span className="text-primary italic">Finserv</span>?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
              Experience transparent financial intelligence backed by two
              decades of expertise and compassion.
            </p>
          </RefractiveContainer>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Card 1 */}
            <RefractiveContainer delay={0.1}>
              <div className="group bg-card border-border hover:border-primary/50 relative h-full overflow-hidden rounded-2xl border p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                <div className="bg-primary/10 group-hover:bg-primary/20 pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl transition-all duration-700" />
                <div className="relative z-10 mb-6">
                  <div className="bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-500">
                    <Users className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight">
                    Women Leadership
                  </h3>
                  <p className="text-muted-foreground">
                    Founded by a single mom with 20 years of expertise in
                    financial services, bringing genuine care to every long-term
                    relationship.
                  </p>
                </div>
                <ul className="relative z-10 space-y-3">
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-foreground/80 font-medium">
                      Total transparency
                    </span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-foreground/80 font-medium">
                      Empathetic planning approach
                    </span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-foreground/80 font-medium">
                      Cross-generational expertise
                    </span>
                  </li>
                </ul>
              </div>
            </RefractiveContainer>

            {/* Card 2 */}
            <RefractiveContainer delay={0.3}>
              <div className="group bg-card border-border hover:border-primary/50 relative h-full overflow-hidden rounded-2xl border p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                <div className="bg-primary/10 group-hover:bg-primary/20 pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl transition-all duration-700" />
                <div className="relative z-10 mb-6">
                  <div className="bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-500">
                    <Shield className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight">
                    Personalized Advisory
                  </h3>
                  <p className="text-muted-foreground">
                    Holistic financial health assessments tailored to your life
                    stage, clarifying the path to a secure future.
                  </p>
                </div>
                <ul className="relative z-10 space-y-3">
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-foreground/80 font-medium">
                      Retirement Planning
                    </span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-foreground/80 font-medium">
                      Family-First Framework
                    </span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-foreground/80 font-medium">
                      HNI & Super-HNI Experience
                    </span>
                  </li>
                </ul>
              </div>
            </RefractiveContainer>

            {/* Card 3 */}
            <RefractiveContainer delay={0.5}>
              <div className="group bg-card border-border hover:border-primary/50 relative h-full overflow-hidden rounded-2xl border p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                <div className="bg-primary/10 group-hover:bg-primary/20 pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl transition-all duration-700" />
                <div className="relative z-10 mb-6">
                  <div className="bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-500">
                    <HeadphonesIcon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight">
                    Decade-Scale Support
                  </h3>
                  <p className="text-muted-foreground">
                    Securing your wealth is an ongoing journey. We provide
                    proactive, end-to-end support throughout your relationship
                    lifecycle.
                  </p>
                </div>
                <ul className="relative z-10 space-y-3">
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-foreground/80 font-medium">
                      Dedicated claims concierge
                    </span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-foreground/80 font-medium">
                      Proactive milestone reminders
                    </span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-foreground/80 font-medium">
                      Periodic strategy realignment
                    </span>
                  </li>
                </ul>
              </div>
            </RefractiveContainer>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-20 py-32">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <RefractiveContainer>
            <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Ready to Find{' '}
              <span className="text-primary italic">Absolute</span>{' '}
              <span className="italic">Clarity?</span>
            </h2>
            <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl">
              Elevate your portfolio with strategies forged from 20 years of
              active market intelligence.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 h-14 rounded-full px-8 text-lg"
              >
                <Link href="/contact">Schedule a Review</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary/50 text-foreground hover:bg-primary/10 h-14 rounded-full px-8 text-lg"
              >
                <Link href="/services">
                  Explore Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </RefractiveContainer>
        </div>
      </section>
    </div>
  )
}
