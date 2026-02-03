import { Car, Heart, Shield, TrendingUp, Building2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Services - Insurance, Wealth & Loans | Navansh Finserv",
    description: "Explore our comprehensive financial services including general insurance, health & mediclaim, life insurance, mutual funds, bonds, and corporate loans.",
};

const services = [
    {
        icon: Car,
        title: "General Insurance",
        description: "Comprehensive coverage for your Car & Bike. Zero-depreciation and fast claims.",
        features: ["Zero Depreciation Cover", "24/7 Roadside Assistance", "Cashless Garage Network"],
    },
    {
        icon: Heart,
        title: "Health & Mediclaim",
        description: "Protect your family's health with cashless hospitalization plans.",
        features: ["Cashless Hospitalization", "Pre & Post Hospitalization", "Lifetime Renewability"],
    },
    {
        icon: Shield,
        title: "Life & Term Insurance",
        description: "Secure your legacy with affordable term plans.",
        features: ["High Coverage at Low Premium", "Tax Benefits under 80C", "Flexible Payout Options"],
    },
    {
        icon: TrendingUp,
        title: "Mutual Funds & Bonds",
        description: "Expert portfolio management for long-term wealth creation.",
        features: ["SIP & Lumpsum Options", "Diversified Portfolio", "Regular Performance Reviews"],
    },
    {
        icon: Building2,
        title: "Corporate Loans",
        description: "Capital solutions for business growth and expansion.",
        features: ["Competitive Interest Rates", "Quick Approval Process", "Flexible Repayment Terms"],
    },
    {
        icon: FileText,
        title: "Financial Planning",
        description: "Holistic financial advisory for retirement and wealth management.",
        features: ["Retirement Planning", "Tax Optimization", "Estate Planning"],
    },
];

export default function ServicesPage() {
    return (
        <div className="flex flex-col">
            {/* Header */}
            <section className="bg-gradient-to-br from-background via-background to-primary/5 py-8 md:py-12">
                <div className="container mx-auto px-6 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            Our <span className="text-primary">Services</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Comprehensive financial solutions designed to protect, grow, and secure your wealth
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={index}
                                    className="group p-8 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                                    <p className="text-muted-foreground mb-6">{service.description}</p>
                                    <ul className="space-y-2 mb-6">
                                        {service.features.map((feature, fIndex) => (
                                            <li key={fIndex} className="flex items-start text-sm">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-2 mt-1.5 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                                        <Link href="/contact">Learn More</Link>
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Need Help Choosing the Right Service?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Our experts are here to guide you through every step
                    </p>
                    <Button asChild size="lg">
                        <Link href="/contact">Schedule a Free Consultation</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
