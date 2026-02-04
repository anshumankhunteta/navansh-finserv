import { Metadata } from "next";
import { Award, Users, Clock, Heart, Shield, Lock, UserCheck, FileText } from "lucide-react";

export const metadata: Metadata = {
    title: "About Us | Navansh Finserv",
    description:
        "Learn about Navansh Finserv - founded by a veteran single mom with 15+ years of experience in financial services. We understand the value of every rupee.",
};

const stats = [
    { value: "15+", label: "Years Experience" },
    { value: "500+", label: "Happy Clients" },
    { value: "₹50Cr+", label: "Assets Managed" },
    { value: "24/7", label: "Support Available" },
];

const values = [
    {
        title: "Trust",
        description:
            "Every relationship is built on trust. We're transparent about costs, risks, and rewards.",
        icon: Heart,
    },
    {
        title: "Expertise",
        description:
            "15+ years of experience across insurance, investments, and lending solutions.",
        icon: Award,
    },
    {
        title: "Care",
        description:
            "We treat every client like family, understanding that behind every policy is a person's dreams.",
        icon: Users,
    },
    {
        title: "Accessibility",
        description:
            "Available when you need us most. Round-the-clock support for claims and queries.",
        icon: Clock,
    },
];

const privacyPoints = [
    {
        icon: UserCheck,
        title: "Minimal Data Collection",
        description: "We only collect basic information (Name, Phone) necessary for communication.",
    },
    {
        icon: Lock,
        title: "No Third-Party Sharing",
        description: "Your data is never sold or shared with third parties for marketing.",
    },
    {
        icon: Shield,
        title: "IT Act Compliant",
        description: "We comply with the Information Technology Act, 2000 and related regulations.",
    },
    {
        icon: FileText,
        title: "Data Protection",
        description: "Your information is stored securely and used solely for our services.",
    },
];

export default function AboutPage() {
    return (
        <div className="py-20 md:py-28">
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        About <span className="text-primary">Navansh Finserv</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A story of resilience, expertise, and unwavering commitment to
                        securing families.
                    </p>
                </div>

                {/* Founder Story */}
                <div className="max-w-4xl mx-auto mb-20">
                    <div className="p-8 md:p-12 rounded-2xl bg-card border border-border/50">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">
                            The Journey Behind <span className="text-primary">Our Mission</span>
                        </h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                Navansh Finserv was founded by a veteran single mother who spent
                                over 15 years climbing the ranks from Sales Executive to Sales
                                Manager in the financial services industry. Through this
                                journey, she witnessed countless families struggle with complex
                                financial decisions, often falling prey to one-size-fits-all
                                solutions.
                            </p>
                            <p>
                                <strong className="text-foreground">
                                    &quot;I understand the value of every rupee because I&apos;ve built
                                    this from the ground up.&quot;
                                </strong>
                            </p>
                            <p>
                                This understanding became the foundation of Navansh Finserv – a
                                firm that combines deep industry expertise with the genuine care
                                of someone who knows what it means to protect a family.
                            </p>
                            <p>
                                Today, we&apos;re proud to serve over 500 families across India,
                                helping them navigate insurance, investments, and business
                                financing with personalized guidance they can trust.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="text-center p-6 rounded-xl bg-muted/30 border border-border/50"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Values Section */}
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Our <span className="text-primary">Values</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all"
                            >
                                <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                                    <value.icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Privacy Section - Horizontal Layout */}
                <div className="rounded-2xl bg-card border border-border/50 p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold">
                            Your Privacy Matters
                        </h2>
                    </div>
                    <p className="text-muted-foreground mb-8 max-w-2xl">
                        At Navansh Finserv, we are committed to protecting your personal
                        information. Here&apos;s how we handle your data:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {privacyPoints.map((point) => (
                            <div
                                key={point.title}
                                className="p-4 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors"
                            >
                                <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit mb-3">
                                    <point.icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-sm mb-1">{point.title}</h3>
                                <p className="text-muted-foreground text-xs">
                                    {point.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">
                            We comply with the Information Technology Act, 2000 and applicable
                            data protection standards in India. Read our full{" "}
                            <a
                                href="/privacy"
                                className="text-primary hover:underline font-medium"
                            >
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

