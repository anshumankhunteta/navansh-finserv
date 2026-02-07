import { Button } from "@/components/ui/button";
import { Award, Target, Users2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About Us - Our Story | Navansh Finserv",
    description: "Learn about our founder's journey from sales manager to firm owner, with 15 years of experience and 500+ happy clients.",
};

export default function AboutPage() {
    return (
        <div className="flex flex-col">
            {/* Header */}
            <section className="bg-gradient-to-br from-background via-background to-primary/5 py-8 md:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            Our <span className="text-primary">Story</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Built on resilience, driven by trust
                        </p>
                    </div>
                </div>
            </section>

            {/* Founder's Story */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="prose prose-lg max-w-none">
                            <h2 className="text-2xl font-bold mb-6 text-foreground md:whitespace-nowrap">
                                From Sales Manager to <span className="text-primary">Firm Owner</span>
                            </h2>
                            <div className="space-y-6 text-muted-foreground">
                                <p className="text-lg leading-relaxed">
                                    Navansh Finserv was founded by a veteran single mother with over 15 years of experience
                                    in financial sales and customer relationship management. Having navigated the challenges
                                    of building financial security for her own family, our founder brings a unique blend of
                                    professional expertise and personal understanding to every client interaction.
                                </p>
                                <p className="text-lg leading-relaxed">
                                    <em className="text-foreground font-medium">
                                        "I understand the value of every rupee because I've built this from the ground up.
                                        Your family's security isn't just business to me—it's personal."
                                    </em>
                                </p>
                                <p className="text-lg leading-relaxed">
                                    This philosophy drives everything we do at Navansh Finserv. We don't just sell policies;
                                    we build lasting relationships based on trust, transparency, and genuine care. Our
                                    approach is motherly protection meets professional excellence—ensuring your financial
                                    future is secure while treating you like family.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 text-primary mb-4">
                                <Award className="h-8 w-8" />
                            </div>
                            <div className="text-4xl font-bold text-foreground mb-2">15+</div>
                            <div className="text-muted-foreground">Years Experience</div>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 text-primary mb-4">
                                <Users2 className="h-8 w-8" />
                            </div>
                            <div className="text-4xl font-bold text-foreground mb-2">500+</div>
                            <div className="text-muted-foreground">Happy Clients</div>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 text-primary mb-4">
                                <Target className="h-8 w-8" />
                            </div>
                            <div className="text-4xl font-bold text-foreground mb-2">100%</div>
                            <div className="text-muted-foreground">Client Satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">
                            Our <span className="text-primary">Values</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 rounded-lg border border-border bg-card">
                                <h3 className="text-xl font-semibold mb-3">Trust First</h3>
                                <p className="text-muted-foreground">
                                    We prioritize building long-term relationships based on honesty and transparency over short-term gains.
                                </p>
                            </div>
                            <div className="p-6 rounded-lg border border-border bg-card">
                                <h3 className="text-xl font-semibold mb-3">Empathy & Care</h3>
                                <p className="text-muted-foreground">
                                    Every client is treated like family, with genuine understanding of their unique financial situations.
                                </p>
                            </div>
                            <div className="p-6 rounded-lg border border-border bg-card">
                                <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
                                <p className="text-muted-foreground">
                                    15+ years of industry experience ensures you receive informed, professional advice.
                                </p>
                            </div>
                            <div className="p-6 rounded-lg border border-border bg-card">
                                <h3 className="text-xl font-semibold mb-3">Lifetime Support</h3>
                                <p className="text-muted-foreground">
                                    We don't disappear after the sale. Our 24/7 support ensures we're there when you need us most.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Financial Journey?</h2>
                    <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Let's work together to secure your family's future
                    </p>
                    <Button asChild size="lg">
                        <Link href="/contact">Get in Touch</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
