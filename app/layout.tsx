import { ThemeProvider } from '@/components/custom/ThemeProvider'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import { FloatingWhatsAppButton } from '@/components/custom/FloatingWhatsAppButton'
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
  metadataBase: new URL('https://navansh.in'),
  title: 'Navansh Finserv',
  description:
    'Comprehensive Financial Solutions tailored for you. Over two decades of expertise in the financial services industry.',
  keywords: [
    'insurance',
    'wealth management',
    'financial services',
    'India',
    'mutual funds',
    'health insurance',
    'life insurance',
    'fixed deposit',
    'car insurance',
    'home insurance',
    'travel insurance',
    'business insurance',
    'loan',
    'wealth management',
    'financial planning',
    'term insurance',
    'bonds',
    'corporate loans',
    'corporate insurance',
    'corporate wealth management',
    'corporate financial planning',
    'corporate term insurance',
    'corporate bonds',
    'retirement planning',
    'financial security',
    'finance solutions',
    'finance firm in kolkata',
    'finance advisor in kolkata',
    'best finance in kolkata',
    'best finance firm in kolkata',
    'best financial services in kolkata',
  ],
  authors: [{ name: 'Anshuman Khunteta' }],
  openGraph: {
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Navansh Finserv',
      },
    ],
    siteName: 'Navansh Finserv',
    title: 'Navansh Finserv',
    description:
      'Securing Families & Futures with 20 Years of Expertise. Based out of Kolkata, India.',
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
                'Comprehensive Financial Solutions tailored for you. Over two decades of expertise in the financial services industry.',
              url: 'https://navansh.in',
              image: 'https://navansh.in/og-image.png',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'India',
                addressLocality: 'Kolkata',
                addressRegion: 'West Bengal',
                postalCode: '700082',
                streetAddress:
                  '39, Mahatma Gandhi Road, Haridevpur, Tollygunge',
              },
              telephone: `+91-7980659845`,
              priceRange: '$$',
              areaServed: {
                '@type': 'Country',
                name: 'India',
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                ],
                opens: '08:00',
                closes: '20:00',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <FloatingWhatsAppButton />
          <main className="min-h-screen">
            <div //bg pattern
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
