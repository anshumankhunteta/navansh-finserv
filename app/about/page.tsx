import type { Metadata } from 'next';
import AboutContent from '@/components/pages/AboutPage';

export const metadata: Metadata = {
  title: 'About The Founder | Insurance Firm',
  description: '15 Years of Experience in Insurance & Financial Stewardship.',
};

export default function AboutPage() {
  return <AboutContent />;
}
