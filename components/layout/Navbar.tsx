"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Home, Briefcase, Users, Mail, Phone, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/custom/ThemeToggle";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";

const navLinks = [
    { href: "/", label: "Home", icon: Home, description: "Back to homepage" },
    { href: "/services", label: "Services", icon: Briefcase, description: "Explore our offerings" },
    { href: "/about", label: "About", icon: Users, description: "Learn about us" },
    { href: "/contact", label: "Contact", icon: Mail, description: "Get in touch" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-secondary/15">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm">NF</div>
                    <span className="text-xl font-bold tracking-tight">
                        Navansh <span className="text-primary">Finserv</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <ThemeToggle />
                    <Button asChild className="font-semibold">
                        <Link href="/enquire">Enquire Now</Link>
                    </Button>
                </div>

                {/* Mobile Menu */}
                <div className="flex md:hidden items-center gap-2">
                    <ThemeToggle />
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <SheetDescription className="sr-only">Navigate through the Navansh Finserv website</SheetDescription>

                            {/* Header Section */}
                            <div className="p-6 pb-4 border-b border-border/50">
                                <SheetClose asChild>
                                    <Link href="/" className="flex items-center gap-3 group">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">Nf</div>
                                        <div>
                                            <span className="text-lg font-bold block">
                                                Navansh <span className="text-primary">Finserv</span>
                                            </span>
                                            <span className="text-xs text-muted-foreground">Your Financial Partner</span>
                                        </div>
                                    </Link>
                                </SheetClose>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex-1 p-4 overflow-auto">
                                <div className="space-y-1">
                                    {navLinks.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <SheetClose asChild key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-foreground/80 hover:text-foreground hover:bg-muted/80 transition-all group"
                                                >
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                                                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <span className="font-semibold text-base">{link.label}</span>
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-auto" />
                                                </Link>
                                            </SheetClose>
                                        );
                                    })}
                                </div>
                            </nav>

                            {/* CTA Section */}
                            <div className="p-4 border-t border-border/50 bg-muted/30">
                                <SheetClose asChild>
                                    <Button asChild className="w-full h-12 font-semibold text-base shadow-lg shadow-primary/25 group">
                                        <Link href="/enquire" className="flex items-center justify-center gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            Enquire Now
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </SheetClose>

                                {/* Contact Info */}
                                <div className="mt-4 pt-4 border-t border-border/50">
                                    <a
                                        href="tel:+919876543210"
                                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
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
    );
}
