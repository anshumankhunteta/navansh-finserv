import Link from 'next/link'
import Navansh from '../icons/Navansh'
import { Mail } from 'lucide-react'
import { Discord } from '../icons/Discord'
import { Github } from '../icons/Github'
import { Instagram } from '../icons/Instagram'
import Whatsapp from '../icons/Whatsapp'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const contactPhone = process.env.NEXT_PUBLIC_PHONE_NUMBER || ''

  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex flex-col justify-between gap-10 md:flex-row md:pr-24">
          {/* Brand */}
          <div>
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
            <p className="text-secondary-foreground/80 text-sm">
              Securing Families & Futures with Two Decades of Experience
            </p>
            <br />
            <p className="text-secondary-foreground/80 mt-6 mb-2 text-sm">
              Need Support?
            </p>
            <div className="flex gap-3">
              <Link href="mailto:admin@navansh.in" aria-label="Mail">
                <Mail className="text-secondary-foreground h-5 w-5" />
              </Link>
              <Link
                href="https://discord.gg/YuPpRjzYtA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
              >
                <Discord
                  fill="var(--secondary-foreground)"
                  className="h-5 w-5"
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
                  className="h-5 w-5"
                />
              </Link>
              <Link
                href={`https://wa.me/${contactPhone?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Whatsapp"
              >
                <Whatsapp
                  fill="var(--secondary-foreground)"
                  className="h-5 w-5"
                />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="grid grid-cols-6 gap-1 text-center md:grid-cols-1 md:text-left">
              <li>
                <Link
                  href="/"
                  className="text-secondary-foreground/80 hover:text-primary text-xs transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-secondary-foreground/80 hover:text-primary text-xs transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-secondary-foreground/80 hover:text-primary text-xs transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-secondary-foreground/80 hover:text-primary text-xs transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/enquire"
                  className="text-secondary-foreground/80 hover:text-primary text-xs transition-colors"
                >
                  Enquire
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-secondary-foreground/80 hover:text-primary text-xs transition-colors"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="border-secondary-foreground/10 mt-8 border-t pt-8">
          <p className="text-secondary-foreground/60 mb-4 text-xs">
            Insurance is the subject matter of solicitation. IRDAI Registration:
            <span className="italic"> Application in Progress.</span> For more
            details on risk factors, terms and conditions, please read the sales
            brochure carefully before concluding a sale.
          </p>
          <p className="text-secondary-foreground/80 text-sm">
            {currentYear} Navansh Finserv.
          </p>
        </div>
      </div>
    </footer>
  )
}
