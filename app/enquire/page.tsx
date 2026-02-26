import type { Metadata } from 'next'
import { EnquireContent } from './EnquireContent'

export const metadata: Metadata = {
  title: 'Enquire',
  description:
    'Schedule a free consultation with our financial experts. Get personalized insurance and wealth management solutions.',
  alternates: {
    canonical: 'https://navansh.in/enquire',
  },
  openGraph: {
    url: 'https://navansh.in/enquire',
    title: 'Enquire | Navansh Finserv',
    description:
      'Schedule a free consultation with our financial experts. Get personalized insurance and wealth management solutions.',
  },
}

export default function GetQuotePage() {
  return <EnquireContent />
}
