import type { Metadata } from 'next';
import HomeContent from '@/components/pages/HomePage';

export const metadata: Metadata = {
  title: 'Insurance Firm | Protecting Futures',
  description: 'Proactively securing your future with 15 years of industry experience.',
};

export default function Home() {
  return <HomeContent />;
}
