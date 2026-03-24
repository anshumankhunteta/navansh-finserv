'use client'

import { ThemeToggle } from '@/components/custom/ThemeToggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  ArrowRight,
  Book,
  Briefcase,
  Home,
  Mail,
  Menu,
  Users,
  UserSearch,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import Navansh from '../icons/Navansh'

// ── Route → Display Title ──
const ROUTE_TITLES: Record<string, string> = {
  '/': 'Finserv',
  '/services': 'Services',
  '/about': 'About',
  '/contact': 'Contact',
  '/enquire': 'Enquire',
  '/privacy': 'Privacy',
  '/milee': 'Milee',
}

const navLinks = [
  { href: '/', label: 'Home', icon: Home, description: 'Back to homepage' },
  {
    href: '/services',
    label: 'Services',
    icon: Briefcase,
    description: 'Explore our offerings',
  },
  {
    href: '/about',
    label: 'About',
    icon: Users,
    description: 'Learn about us',
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: Mail,
    description: 'Get in touch',
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: Book,
    description: 'Read our articles',
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)
  const lastScrollY = React.useRef(0)

  // Derive page title from pathname — no state, no listeners
  const pageTitle = React.useMemo(() => {
    if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]
    const firstSegment = '/' + (pathname.split('/')[1] || '')
    return ROUTE_TITLES[firstSegment] || 'Finserv'
  }, [pathname])

  React.useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY
      setHidden(currentScrollY > lastScrollY.current && currentScrollY > 80)
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`border-border/40 bg-background/95 supports-backdrop-filter:bg-primary/20 sticky top-0 z-50 w-full border-b backdrop-blur transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="max-w-10xl container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex w-xs items-baseline justify-start gap-2">
          <Navansh height={24} />
          <span className="text-2xl font-bold tracking-tight whitespace-nowrap">
            Navansh{' '}
            <span className="text-primary inline-block w-28">{pageTitle}</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/80 hover:text-primary text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden w-xs items-center justify-end gap-3 md:flex">
          <ThemeToggle />
          <Button asChild className="font-semibold">
            <Link href="/enquire">Enquire Now</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[300px] flex-col gap-0 p-0 sm:w-[350px]"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigate through the Navansh Finserv website
              </SheetDescription>

              {/* Header Section */}
              <div className="mt-6 p-6 pb-4">
                <SheetClose asChild>
                  <Link href="/" className="group flex items-center gap-3">
                    <Navansh height={45} />
                    <div>
                      <span className="block text-xl font-bold">
                        Navansh <span className="text-primary">Finserv</span>
                      </span>
                      <span className="text-foreground text-xs">
                        Gain <span className="italic">Absolute</span> Financial{' '}
                        <span className="text-primary italic">Clarity</span>
                      </span>
                    </div>
                  </Link>
                </SheetClose>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-auto py-4">
                <div className="mt-4">
                  {navLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className="hover:text-primary group border-primary/30 dark:border-border/80 bg-card/40 active:bg-primary/30 m-2 flex items-center gap-4 rounded-xl border px-4 py-3 transition-all dark:bg-black/20"
                        >
                          <div className="bg-primary/10 group-hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                            <Icon className="text-primary group-hover:text-primary h-5 w-5 transition-colors" />
                          </div>
                          <span className="text-base font-semibold">
                            {link.label}
                          </span>
                          <ArrowRight className="text-primary ml-auto h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </Link>
                      </SheetClose>
                    )
                  })}
                </div>
              </nav>

              {/* CTA Section */}
              <div className="p-4">
                <SheetClose asChild>
                  <Button
                    asChild
                    className="shadow-primary/25 group h-12 w-full text-base font-semibold shadow-md"
                  >
                    <Link
                      href="/enquire"
                      className="flex items-center justify-center gap-2 active:scale-105"
                    >
                      <UserSearch className="h-4 w-4" />
                      Enquire Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </SheetClose>
                <div className="mt-2 text-center">
                  <SheetClose asChild>
                    <Link
                      href="/privacy"
                      className="text-muted-foreground hover:text-primary text-xs transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
