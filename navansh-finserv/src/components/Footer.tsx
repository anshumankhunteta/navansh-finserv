import Link from "next/link";


export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-border/40 bg-deep-charcoal dark:bg-deep-charcoal">
            <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm">Nf</div>
                            <span className="text-xl font-bold text-light-gray">
                                Navansh <span className="text-primary">Finserv</span>
                            </span>
                        </Link>
                        <p className="text-light-gray/70 text-sm max-w-md">
                            Comprehensive Insurance, Wealth, and Loan Solutions tailored for
                            families and businesses. Trusted by 500+ clients across India.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-light-gray mb-4">Quick Links</h4>
                        <nav className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className="text-light-gray/70 text-sm hover:text-primary transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/services"
                                className="text-light-gray/70 text-sm hover:text-primary transition-colors"
                            >
                                Services
                            </Link>
                            <Link
                                href="/about"
                                className="text-light-gray/70 text-sm hover:text-primary transition-colors"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/contact"
                                className="text-light-gray/70 text-sm hover:text-primary transition-colors"
                            >
                                Contact
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-light-gray mb-4">Contact</h4>
                        <div className="flex flex-col gap-2 text-light-gray/70 text-sm">
                            <p>India</p>
                            <p>navanshfinserv@gmail.com</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-light-gray/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-light-gray/50 text-sm">
                            © {currentYear} Navansh Finserv. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/privacy"
                                className="text-light-gray/50 text-sm hover:text-primary transition-colors"
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                    {/* IRDAI Disclaimer */}
                    <p className="mt-6 text-light-gray/40 text-xs text-center md:text-left">
                        Insurance is the subject matter of solicitation. IRDAI Registration:
                        Application in Progress.
                    </p>
                </div>
            </div>
        </footer>
    );
}
