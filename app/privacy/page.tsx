import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Navansh Finserv",
    description: "Learn how Navansh Finserv collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
    return (
        <div className="flex flex-col">
            {/* Header */}
            <section className="bg-gradient-to-br from-background via-background to-primary/5 py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-muted-foreground">Last updated: February 2026</p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="prose prose-lg max-w-none">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-foreground">1. Introduction</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Navansh Finserv ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                                    explains how we collect, use, disclose, and safeguard your information when you visit our website
                                    or use our services.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-foreground">2. Information We Collect</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    We collect information that you provide directly to us, including:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Name, email address, and phone number</li>
                                    <li>Financial information necessary to provide our services</li>
                                    <li>Communication preferences and correspondence with us</li>
                                    <li>Information submitted through our contact forms</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-foreground">3. How We Use Your Information</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    We use the information we collect to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Provide, maintain, and improve our financial services</li>
                                    <li>Process your requests and respond to your inquiries</li>
                                    <li>Send you service-related communications and updates</li>
                                    <li>Comply with legal obligations and regulatory requirements</li>
                                    <li>Provide personalized financial advice and recommendations</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Information Sharing and Disclosure</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    We do not sell, trade, or rent your personal information to third parties. We may share your
                                    information only in the following circumstances:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>With insurance providers and financial institutions to process your applications</li>
                                    <li>With service providers who assist us in operating our business</li>
                                    <li>When required by law or to protect our rights</li>
                                    <li>With your explicit consent</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Data Security</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    We implement appropriate technical and organizational security measures to protect your personal
                                    information against unauthorized access, alteration, disclosure, or destruction. However, no
                                    method of transmission over the Internet or electronic storage is 100% secure.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Your Rights</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    You have the right to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Access and receive a copy of your personal information</li>
                                    <li>Request correction of inaccurate or incomplete data</li>
                                    <li>Request deletion of your personal information</li>
                                    <li>Withdraw consent for data processing where applicable</li>
                                    <li>Object to or restrict certain processing of your data</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-foreground">7. Cookies and Tracking</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    We may use cookies and similar tracking technologies to improve your browsing experience and
                                    analyze website traffic. You can control cookie preferences through your browser settings.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-foreground">8. Compliance with Indian Laws</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    This Privacy Policy complies with the Information Technology Act, 2000 and the Information
                                    Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information)
                                    Rules, 2011 of India.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-foreground">9. Changes to This Policy</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                                    the new Privacy Policy on this page and updating the "Last updated" date.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-foreground">10. Contact Us</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    If you have any questions about this Privacy Policy or our data practices, please contact us at:
                                </p>
                                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                                    <p className="text-muted-foreground">
                                        <strong className="text-foreground">Navansh Finserv</strong><br />
                                        Email: info@navanshfinserv.com<br />
                                        Phone: +91-XXXXXXXXXX
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
