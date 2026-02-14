import { ContactInfo } from '@/components/custom/ContactInfo'
import { SIPCalculator } from '@/components/custom/SIPCalculator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enquire - Get a Quote | Navansh Finserv',
  description:
    'Schedule a free consultation with our financial experts. Get personalized insurance and wealth management solutions.',
}

export default function GetQuotePage() {
  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-24">
        <h1 className="mb-4 text-center text-3xl font-bold md:text-5xl">
          Enquire <span className="text-primary">Now</span>
        </h1>
        <p className="text-muted-foreground mb-10 text-center text-lg">
          Reach out to us and we&apos;ll get back to you within 24 hours.
        </p>
        <iframe
          src="https://tally.so/embed/zxYKoa?alignCenter=1&hideTitle=1&transparentBackground=1"
          width="100%"
          height="600px"
          title="Enquiry Form"
          style={{ border: 0, marginBottom: '2rem' }}
        ></iframe>

        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ContactInfo />
          <SIPCalculator />
        </div>
      </div>
    </div>
  )
}
