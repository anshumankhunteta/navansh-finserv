import type { Metadata } from 'next';
import ServicesContent from '@/components/pages/ServicesPage';

export const metadata: Metadata = {
  title: 'Our Services | Insurance Firm',
  description: 'Life & Health Insurance, Mutual Funds, SIP, and Asset Protection services.',
};

export default function ServicesPage() {
  return <ServicesContent />;
}
