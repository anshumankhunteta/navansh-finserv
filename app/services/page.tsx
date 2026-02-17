import { Button } from '@/components/ui/button'
import { Building2, Car, Heart, Shield, TrendingUp, Wallet } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Services | Navansh Finserv',
  description:
    'Explore our comprehensive financial services including general insurance, health & mediclaim, life insurance, mutual funds, bonds, and corporate loans.',
}

const services = [
  {
    icon: TrendingUp,
    title: 'Mutual Funds & SIPs',
    description: 'Expert portfolio management for long-term wealth creation.',
    features: [
      'SIP & Lumpsum Options',
      'Professional Advice and Switch Funds anytime',
      'Regular Performance Reviews',
    ],
  },
  {
    icon: Heart,
    title: 'Health & Mediclaim',
    description:
      "Protect your family's health with cashless hospitalization plans.",
    features: [
      'Floater & Individual Plans',
      'Pre & Post Hospitalization',
      'Lifetime Renewability',
    ],
  },
  {
    icon: Car,
    title: 'General Insurance',
    description:
      'Comprehensive coverage for your Car & Bike. Good knowledge with respect to add ons from personal and client experience.',
    features: [
      'Many options for Insurance providers',
      'All necessary Add-ons',
      'Cashless Garage Network',
    ],
  },
  {
    icon: Shield,
    title: 'Life & Term Insurance',
    description: 'Secure your legacy with affordable term plans.',
    features: [
      'High Coverage at Low Premium',
      'Tax Benefits under 80C',
      'Flexible Payout Options',
    ],
  },
  {
    icon: Wallet,
    title: 'Fixed Deposits & Bonds',
    description:
      'Holistic financial advisory for retirement and wealth management.',
    features: ['Retirement Planning', 'Tax Optimization', 'Estate Planning'],
  },
  {
    icon: Building2,
    title: 'Corporate Loans',
    description: 'Capital solutions for business growth and expansion.',
    features: [
      'Competitive Interest Rates',
      'Quick Approval Process',
      'Flexible Repayment Terms',
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold md:text-5xl">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Comprehensive financial solutions designed to protect, grow, and
              secure your wealth
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={index}
                  className="group bg-card border-border hover:border-primary/50 rounded-lg border p-8 transition-all hover:scale-103 hover:shadow-md"
                >
                  <div className="h-[90%]">
                    <div className="bg-primary/10 text-primary group-hover:bg-primary mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg transition-colors group-hover:text-white">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>
                    <ul className="mb-6 space-y-2">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start text-sm">
                          <span className="bg-primary mt-1.5 mr-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="group-hover:bg-primary group-hover:border-primary w-full group-hover:text-white"
                  >
                    <Link href="/contact">Learn More</Link>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">
            Need Help Choosing the Right Service?
          </h2>
          <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
            Our experts are here to guide you through every step
          </p>
          <Button asChild size="lg">
            <Link href="/contact" className="text-lg">
              Get a Free Consultation
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
