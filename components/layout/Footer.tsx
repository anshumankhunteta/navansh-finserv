import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-secondary text-secondary-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between mx-auto md:flex-row flex-col gap-10">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <span className="text-2xl font-bold text-primary">Navansh</span>
                            <span className="text-2xl font-bold text-secondary">Finserv</span>
                        </Link>
                        <p className="text-sm text-secondary-foreground/80">
                            Securing Families & Futures with 15 Years of Trust
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="grid grid-cols-5 gap-2 md:grid-cols-1">
                            <li>
                                <Link href="/" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Disclaimer & Copyright */}
                <div className="mt-12 pt-8 border-t border-secondary-foreground/10">
                    <p className="text-xs text-secondary-foreground/60 mb-4">
                        Insurance is the subject matter of solicitation. IRDAI Registration: Application in Progress.
                        For more details on risk factors, terms and conditions, please read the sales brochure carefully before concluding a sale.
                    </p>
                    <p className="text-sm text-secondary-foreground/80">
                        © {currentYear} Navansh Finserv. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
