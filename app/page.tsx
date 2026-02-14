import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Building2,
  Car,
  CheckCircle2,
  HeadphonesIcon,
  Heart,
  Shield,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  // All services for homepage (headings only)
  const allServices = [
    { title: 'Mutual Funds & SIPs', icon: TrendingUp },
    { title: 'Health & Mediclaim', icon: Heart },
    { title: 'General Insurance', icon: Car },
    { title: 'Life & Term Insurance', icon: Shield },
    { title: 'Fixed Deposits & Bonds', icon: Wallet },
    { title: 'Corporate Loans', icon: Building2 },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        style={{
          backgroundImage: `
        radial-gradient(140% 140% at 50% 35%, var(--card) 10%, transparent 40%)
      `,
          backgroundSize: '100% 100%',
        }}
        className="relative py-20 md:py-32"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Securing Families & Futures with{' '}
              <span className="text-primary">15 Years of Trust</span>
            </h1>
            <p className="text-muted-foreground mb-8 text-lg md:text-xl">
              Comprehensive Insurance, Wealth, and Loan Solutions tailored for
              you
            </p>
            <Button asChild size="lg" className="px-8 text-lg">
              <Link href="/contact">
                Book a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Strip - Partner Logos */}
      {/* <section className="py-12 border-y bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-muted-foreground mb-8">
            TRUSTED PARTNERS
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
            {["HDFC", "LIC", "Star Health", "ICICI"].map((partner) => (
              <div
                key={partner}
                className="text-xl font-bold text-foreground/60 hover:text-foreground transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Our Offerings */}
      <div className="mt-20 mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Our <span className="text-primary">Offerings</span>
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          We offer a range of services to help you achieve your financial goals
        </p>
      </div>
      <div className="mx-3 mx-auto mb-16 grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3 lg:gap-8 2xl:grid-cols-6">
        {allServices.map((service) => {
          const Icon = service.icon
          return (
            <div
              key={service.title}
              className="bg-card border-border/50 hover:border-primary/50 flex flex-col items-center rounded-xl border p-4 text-center transition-all hover:shadow-lg md:p-6"
            >
              <div className="bg-primary/10 text-primary mb-3 rounded-lg p-3">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold">{service.title}</h3>
            </div>
          )
        })}
      </div>

      {/* Why Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Why Choose <span className="text-primary">Navansh Finserv</span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Experience personalized financial solutions backed by expertise
              and compassion.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="group bg-card border-border hover:border-primary/50 rounded-lg border p-8 transition-all hover:shadow-lg">
              <div className="mb-6">
                <div className="bg-primary/10 text-primary mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Women Leadership</h3>
                <p className="text-muted-foreground">
                  Founded by a single mom with 20 years of expertise in
                  financial services, we bring genuine care and understanding to
                  every client relationship, even in the long term.
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="text-primary mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>We believe in total transparency</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="text-primary mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Empathetic approach to financial planning</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="text-primary mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>
                    Gen-Z, Alpha or Boomers, we understand them all because of
                    our diverse team and experience
                  </span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="text-primary mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Worked 10+ Years with HNI and Super-HNI Clients</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="group bg-card border-border hover:border-primary/50 rounded-lg border p-8 transition-all hover:shadow-lg">
              <div className="mb-6">
                <div className="bg-primary/10 text-primary mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">
                  Personalized Advisory
                </h3>
                <p className="text-muted-foreground">
                  Comprehensive financial health assessments tailored to your
                  unique needs and life stage with proper goal setting. We will
                  help build a secure future for your Family.
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="text-primary mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Retirement Planning</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="text-primary mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Family First Approach</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="text-primary mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Portfolio Reviews</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="group bg-card border-border hover:border-primary/50 rounded-lg border p-8 transition-all hover:shadow-lg">
              <div className="mb-6">
                <div className="bg-primary/10 text-primary mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg">
                  <HeadphonesIcon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">
                  Long Term Support Guarantee
                </h3>
                <p className="text-muted-foreground">
                  Insurance, or any financial product is not a one-time
                  purchase, it is a long-term commitment. We believe in keeping
                  the client relationship healthy and strong in the long term.
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="text-primary mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Dedicated claims assistance</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="text-primary mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Pro-active reminders and helpful tips</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="text-primary mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Regular reviews and updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Secure Your Future?
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            Reach out to us if you have any questions or need assistance.
            {/* Get expert financial guidance tailored to your family&apos;s needs */}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Get Started Today</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
