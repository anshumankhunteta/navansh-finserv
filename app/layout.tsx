import { ThemeProvider } from '@/components/custom/ThemeProvider'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://navansh-finserv.vercel.app'),
  title: 'Navansh Finserv | Trusted Insurance & Wealth Expert in India',
  description:
    'Comprehensive Insurance, Wealth, and Loan Solutions tailored for you. 15+ years of experience securing families and futures across India.',
  keywords: [
    'insurance',
    'wealth management',
    'financial services',
    'India',
    'mutual funds',
    'health insurance',
    'life insurance',
  ],
  authors: [{ name: 'Anshuman Khunteta' }],
  openGraph: {
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Navansh Finserv - Trusted Financial Partner',
      },
    ],
    siteName: 'Navansh Finserv',
    title: 'Navansh Finserv | Trusted Insurance & Wealth Expert in India',
    description: 'Securing Families & Futures with 15 Years of Trust',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialService',
              name: 'Navansh Finserv',
              description:
                'Comprehensive Insurance, Wealth, and Loan Solutions',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'IN',
              },
              priceRange: '$$',
              telephone: '+91-XXXXXXXXXX',
              areaServed: 'IN',
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          // disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen">
            <div
              className="fixed inset-0 -z-10"
              style={{
                backgroundImage: `
          repeating-linear-gradient(45deg, var(--muted) 0, var(--muted) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(-45deg, var(--muted) 0, var(--muted) 1px, transparent 1px, transparent 20px)
        `,
                backgroundSize: '40px 40px',
              }}
            />
            {children}
            <SpeedInsights />
            <Analytics />
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
