"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Open Menu">
                    <Menu className="h-6 w-6 text-primary" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
                <SheetHeader>
                    <SheetTitle className="text-left flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        Navansh Finserv
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium text-foreground hover:text-primary"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 mt-4">
                        <Link href="/contact" onClick={() => setIsOpen(false)}>Get a Quote</Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
