import type { Metadata } from 'next'
import BusinessCard from '@/components/custom/BusinessCard'
import CardActionButton from './DownloadCardButton'
import BackButton from '@/components/custom/BackButton'

export const metadata: Metadata = {
  title: 'Milee Khunteta | Navansh Finserv',
  description: 'Digital business card for Navansh Finserv',
  robots: { index: false, follow: false },
}

export default function MileePage() {
  return (
    <div className="flex flex-col items-center">
      <BackButton className="text-white" />
      <BusinessCard name="Milee Khunteta" designation="Founder" />
      <CardActionButton />
      <CardActionButton mode="share" />
    </div>
  )
}
