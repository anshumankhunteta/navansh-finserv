import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-24">
        <div className="mx-auto flex flex-col justify-between gap-10 px-2 md:flex-row">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <span className="text-primary text-2xl font-bold">Navansh</span>
              <span className="text-secondary-foreground text-2xl font-bold">
                Finserv
              </span>
            </Link>
            <p className="text-secondary-foreground/80 text-sm">
              Securing Families & Futures with Two Decades of Experience
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="grid w-[70%] grid-cols-3 gap-1 text-left sm:w-full sm:text-right md:grid-cols-1">
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
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="border-secondary-foreground/10 mt-12 border-t pt-8">
          <p className="text-secondary-foreground/60 mb-4 text-xs">
            Insurance is the subject matter of solicitation. IRDAI Registration:
            <span className="italic"> Application in Progress.</span> For more
            details on risk factors, terms and conditions, please read the sales
            brochure carefully before concluding a sale.
          </p>
          <p className="text-secondary-foreground/80 text-xs">
            {currentYear} Navansh Finserv.
          </p>
        </div>
      </div>
    </footer>
  )
}
