import { ServiceCard } from "@/components/ServiceCard";
import { Car, Heart, ShieldCheck, TrendingUp, Building2, Wallet } from "lucide-react";

export const metadata = {
    title: "Our Services | Navansh Finserv",
    description: "Comprehensive financial services including Insurance, Mutual Funds, and Loans.",
};

const services = [
    {
        title: "General Insurance",
        description: "Comprehensive coverage for your Car & Bike. Zero-depreciation models and fast claim settlements to keep you moving.",
        icon: Car,
    },
    {
        title: "Health & Mediclaim",
        description: "Protect your family's health with cashless hospitalization plans and comprehensive critical illness coverage.",
        icon: Heart,
    },
    {
        title: "Life & Term Insurance",
        description: "Secure your legacy and family's future with affordable term plans giving high coverage at low premiums.",
        icon: ShieldCheck,
    },
    {
        title: "Mutual Funds & SIP",
        description: "Expert portfolio management for long-term wealth creation. Systematic Investment Plans tailored to your goals.",
        icon: TrendingUp,
    },
    {
        title: "Corporate Loans",
        description: "Capital solutions for business growth. Specialized loans for machinery, working capital, and expansion.",
        icon: Building2,
    },
    {
        title: "Car & Home Loans",
        description: "Low-interest loans to help you buy your dream home or vehicle with minimal paperwork.",
        icon: Wallet,
    },
];

export default function ServicesPage() {
    return (
        <div className="py-20 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold text-primary mb-6">Our Services</h1>
                    <p className="text-lg text-muted-foreground">
                        We offer a wide range of financial products designed to protect your assets and grow your wealth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.title}
                            title={service.title}
                            description={service.description}
                            icon={service.icon}
                            href="/contact"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
