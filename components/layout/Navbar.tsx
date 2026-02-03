import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const MobileMenu = dynamic(() => import("./MobileMenu"), {
    ssr: true,
});

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold text-primary">Navansh Finserv</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        <Link href="/contact">Get a Quote</Link>
                    </Button>
                </nav>

                {/* Mobile Navigation */}
                <MobileMenu />
            </div>
        </header>
    );
}
