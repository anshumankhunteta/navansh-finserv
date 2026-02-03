import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">Navansh Finserv</h3>
                        <p className="text-slate-300 text-sm">
                            Securing Families & Futures with 15 Years of Trust.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/services" className="text-slate-300 hover:text-white transition-colors">Services</Link></li>
                            <li><Link href="/about" className="text-slate-300 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-white">Contact</h3>
                        <p className="text-slate-300 text-sm mb-2">India</p>
                        {/* Add more contact info here if provided */}
                    </div>
                </div>

                <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-400">
                        &copy; 2026 Navansh Finserv. All rights reserved.
                    </p>
                    <div className="text-xs text-slate-500 max-w-md text-center md:text-right">
                        <p>Insurance is the subject matter of solicitation. IRDAI Registration: Application in Progress.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
