import { ContactForm } from '@/components/custom/contact-form'
import { SIPCalculator } from '@/components/custom/SIPCalculator'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Enquire | Navansh Finserv',
  description:
    'Schedule a free consultation with our financial experts. Get personalized insurance and wealth management solutions.',
}

export default function GetQuotePage() {
  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl py-12 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">
            Enquire <span className="text-primary">Now</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Build your Wealth or Secure Your Family, We will help you.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 md:py-20">
          <ContactForm />
          <SIPCalculator />
        </div>
        {/* <div className="py-20">
          <ContactInfo />
        </div> */}
      </div>
      <section className="py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-primary mb-4 text-3xl font-bold">
            Want to Contact us Directly?
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
