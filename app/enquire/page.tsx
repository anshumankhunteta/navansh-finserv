import { ContactInfo } from '@/components/custom/ContactInfo'
import { SIPCalculator } from '@/components/custom/SIPCalculator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Get a Quote | Navansh Finserv',
  description:
    'Schedule a free consultation with our financial experts. Get personalized insurance and wealth management solutions.',
}

export default function GetQuotePage() {
  return (
    <div className="flex flex-col backdrop-blur-xs">
      <div className="container mx-auto px-4 py-12 backdrop-blur-xs sm:px-6 lg:px-24">
        <h1 className="mb-10 text-center text-3xl font-bold md:text-5xl">
          Enquire <span className="text-primary">Now</span>
        </h1>
        <div className="overflow-hidden rounded-lg">
          <iframe
            src="https://tally.so/embed/zxYKoa?alignLeft=1&hideTitle=1&transparentBackground=1"
            width="100%"
            title="Contact Form"
            loading="lazy"
            style={{ border: 0, height: '600px' }}
          ></iframe>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ContactInfo />
          <SIPCalculator />
        </div>
      </div>
    </div>
  )
}
