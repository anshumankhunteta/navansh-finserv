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
  Briefcase,
  Home,
  Mail,
  Menu,
  Phone,
  Sparkles,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

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
]

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="border-border/40 bg-background/95 supports-backdrop-filter:bg-primary/20 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">
            NF
          </div>
          <span className="text-xl font-bold tracking-tight">
            Navansh <span className="text-primary">Finserv</span>
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
        <div className="hidden items-center gap-3 md:flex">
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
              className="flex w-[300px] flex-col p-0 sm:w-[350px]"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigate through the Navansh Finserv website
              </SheetDescription>

              {/* Header Section */}
              <div className="border-border/50 border-b p-6 pb-4">
                <SheetClose asChild>
                  <Link href="/" className="group flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground shadow-primary/25 flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold shadow-lg transition-transform group-hover:scale-105">
                      Nf
                    </div>
                    <div>
                      <span className="block text-lg font-bold">
                        Navansh <span className="text-primary">Finserv</span>
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Your Financial Partner
                      </span>
                    </div>
                  </Link>
                </SheetClose>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-auto p-4">
                <div className="space-y-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className="text-foreground/80 hover:text-foreground hover:bg-muted/80 group flex items-center gap-4 rounded-xl px-4 py-3 transition-all"
                        >
                          <div className="bg-muted group-hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
                            <Icon className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
                          </div>
                          <span className="text-base font-semibold">
                            {link.label}
                          </span>
                          <ArrowRight className="text-muted-foreground ml-auto h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </Link>
                      </SheetClose>
                    )
                  })}
                </div>
              </nav>

              {/* CTA Section */}
              <div className="border-border/50 bg-muted/30 border-t p-4">
                <SheetClose asChild>
                  <Button
                    asChild
                    className="shadow-primary/25 group h-12 w-full text-base font-semibold shadow-lg"
                  >
                    <Link
                      href="/enquire"
                      className="flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Enquire Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </SheetClose>

                {/* Contact Info */}
                <div className="border-border/50 mt-4 border-t pt-4">
                  <a
                    href="tel:+919876543210"
                    className="text-muted-foreground hover:text-primary flex items-center gap-3 text-sm transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span>+91 98765 43210</span>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
