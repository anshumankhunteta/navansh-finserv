import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Navansh Finserv",
    description:
        "Privacy Policy for Navansh Finserv - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
    return (
        <div className="py-20 md:py-28">
            <div className="container mx-auto max-w-4xl px-4 md:px-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-8">
                    Privacy <span className="text-primary">Policy</span>
                </h1>
                <p className="text-muted-foreground mb-8">
                    Last updated: February 2026
                </p>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Navansh Finserv (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to
                                protecting your privacy. This Privacy Policy explains how we
                                collect, use, disclose, and safeguard your information when you
                                visit our website or use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                2. Information We Collect
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We collect information that you provide directly to us,
                                including:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>Name and contact information (phone number, email address)</li>
                                <li>
                                    Information related to your financial service inquiries
                                </li>
                                <li>
                                    Any other information you choose to provide during
                                    consultations
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                3. How We Use Your Information
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>Respond to your inquiries and provide customer support</li>
                                <li>
                                    Provide personalized financial service recommendations
                                </li>
                                <li>Communicate with you about our services and offers</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                4. Information Sharing
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                <strong className="text-foreground">
                                    We do not sell, trade, or rent your personal information to
                                    third parties.
                                </strong>{" "}
                                We may share your information only with insurance companies,
                                financial institutions, or other service providers as necessary
                                to fulfill your service requests, and only with your consent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We implement appropriate technical and organizational measures
                                to protect your personal information against unauthorized
                                access, alteration, disclosure, or destruction. However, no
                                method of transmission over the Internet is 100% secure, and we
                                cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                6. Your Rights
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>Access the personal information we hold about you</li>
                                <li>Request correction of inaccurate information</li>
                                <li>Request deletion of your personal information</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                7. Compliance with Indian Law
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                This Privacy Policy complies with the Information Technology Act,
                                2000 and the Information Technology (Reasonable Security
                                Practices and Procedures and Sensitive Personal Data or
                                Information) Rules, 2011 of India.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">
                                8. Changes to This Policy
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may update this Privacy Policy from time to time. We will
                                notify you of any changes by posting the new Privacy Policy on
                                this page and updating the &quot;Last updated&quot; date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about this Privacy Policy, please
                                contact us at:
                            </p>
                            <p className="text-muted-foreground mt-4">
                                <strong className="text-foreground">Email:</strong>{" "}
                                navanshfinserv@gmail.com
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
