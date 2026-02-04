import { Metadata } from "next";
import { ServiceCard } from "@/components/ServiceCard";
import {
    Car,
    HeartPulse,
    Shield,
    TrendingUp,
    Building2,
    Wallet,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Services | Navansh Finserv",
    description:
        "Explore our comprehensive range of financial services including General Insurance, Health Insurance, Life Insurance, Mutual Funds, and Corporate Loans.",
};

const services = [
    {
        title: "General Insurance",
        description:
            "Comprehensive coverage for your Car & Bike. Zero-depreciation and fast claims processing. Protect your vehicles with policies tailored to your driving needs.",
        icon: Car,
    },
    {
        title: "Health & Mediclaim",
        description:
            "Protect your family's health with cashless hospitalization plans. Coverage for critical illness, maternity, and pre-existing conditions with top network hospitals.",
        icon: HeartPulse,
    },
    {
        title: "Life & Term Insurance",
        description:
            "Secure your legacy with affordable term plans. Provide financial security to your loved ones with comprehensive life coverage and tax benefits.",
        icon: Shield,
    },
    {
        title: "Mutual Funds & SIPs",
        description:
            "Expert portfolio management for long-term wealth creation. Diversified investment options across equity, debt, and hybrid funds to match your risk profile.",
        icon: TrendingUp,
    },
    {
        title: "Fixed Deposits & Bonds",
        description:
            "Safe and steady returns with government-backed securities and corporate bonds. Ideal for conservative investors seeking capital preservation.",
        icon: Wallet,
    },
    {
        title: "Corporate Loans",
        description:
            "Capital solutions for business growth and expansion. Quick approvals, competitive rates, and flexible repayment options for SMEs and enterprises.",
        icon: Building2,
    },
];

export default function ServicesPage() {
    return (
        <div className="py-20 md:py-28">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Our <span className="text-primary">Services</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        From protecting your assets to growing your wealth, we offer a
                        complete suite of financial solutions designed with your goals in
                        mind.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.title}
                            title={service.title}
                            description={service.description}
                            icon={service.icon}
                        />
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/90 to-primary p-8 md:p-16 text-center">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                            Ready to Secure Your Future?
                        </h2>
                        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
                            Let&apos;s have a conversation about your financial goals. No
                            pressure, just honest advice from someone who cares.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary text-secondary-foreground px-6 py-3 font-semibold text-base hover:bg-secondary/90 transition-colors"
                        >
                            Get Your Free Consultation
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
