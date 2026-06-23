import { Mail } from 'lucide-react'
import Link from 'next/link'
import Discord from '../icons/Discord'
import Instagram from '../icons/Instagram'
import Navansh from '../icons/Navansh'
import Whatsapp from '../icons/Whatsapp'

const services = [
  { label: 'Mutual Funds & SIPs', slug: 'mutual-funds' },
  { label: 'Health & Mediclaim', slug: 'health-mediclaim' },
  { label: 'General Insurance', slug: 'general-insurance' },
  { label: 'Life & Term Insurance', slug: 'life-term-insurance' },
  { label: 'Fixed Deposits & Bonds', slug: 'fd-bonds' },
]

const resources = [
  { label: 'Blog & Articles', href: '/blog' },
  { label: 'Mutual Fund Screener', href: '/mf' },
  { label: 'Financial Calculators', href: '/enquire' },
]

const company = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Enquire Now', href: '/enquire' },
  { label: 'Services', href: '/services' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const contactPhone = process.env.NEXT_PUBLIC_PHONE_NUMBER || ''

  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <Navansh
                height={24}
                style={
                  { '--primary-foreground': '#eeeeee' } as React.CSSProperties
                }
              />
              <span className="text-primary text-2xl font-bold">Navansh</span>
              <span className="text-secondary-foreground text-2xl font-bold">
                Finserv
              </span>
            </Link>
            <p className="text-secondary-foreground/70 max-w-xs text-sm leading-relaxed">
              Securing families & futures with two decades of trusted financial
              expertise. Your clarity. Our commitment.
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
              Services
            </h3>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/enquire?service=${s.slug}`}
                    className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {resources.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
              Company
            </h3>
            <ul className="space-y-2.5">
              {company.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer Band */}
        <div className="border-secondary-foreground/10 mt-10 border-t pt-8">
          <p className="text-secondary-foreground/50 text-xs leading-relaxed">
            Mutual Fund investments are subject to market risks. Read all scheme
            related documents carefully before investing. Insurance is the
            subject matter of solicitation. For more details on risk factors,
            terms and conditions, please read the sales brochure carefully
            before concluding a sale. Financial calculators on this site provide
            estimates only and do not constitute financial advice.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-secondary-foreground/10 mt-6 flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
          {/* Left: Copyright + Legal Links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-secondary-foreground/60 text-xs">
              © {currentYear} Navansh Finserv
            </span>
            <span className="text-secondary-foreground/20 hidden text-xs sm:inline">
              |
            </span>
            {legalLinks.map((l, i) => (
              <span key={l.href} className="flex items-center gap-4">
                {i > 0 && (
                  <span className="text-secondary-foreground/20 text-xs">
                    ·
                  </span>
                )}
                <Link
                  href={l.href}
                  className="text-secondary-foreground/60 hover:text-primary text-xs transition-colors"
                >
                  {l.label}
                </Link>
              </span>
            ))}
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-4">
            <Link href="mailto:admin@navansh.in" aria-label="Email">
              <Mail className="text-secondary-foreground/60 hover:text-primary h-4 w-4 transition-colors" />
            </Link>
            <Link
              href="https://discord.gg/YuPpRjzYtA"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <Discord
                fill="var(--secondary-foreground)"
                className="h-4 w-4 opacity-60 transition-opacity hover:opacity-100"
              />
            </Link>
            <Link
              href="https://instagram.com/navansh_finserv"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram
                fill="var(--secondary-foreground)"
                className="h-4 w-4 opacity-60 transition-opacity hover:opacity-100"
              />
            </Link>
            <Link
              href={`https://wa.me/${contactPhone?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <Whatsapp
                fill="var(--secondary-foreground)"
                className="h-4 w-4 opacity-60 transition-opacity hover:opacity-100"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
