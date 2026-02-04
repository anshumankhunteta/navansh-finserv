import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import {
  Shield,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Car,
  HeartPulse,
  Landmark,
  TrendingUp,
  Building2,
  Wallet,
} from "lucide-react";

// Partner logos placeholder data
const partners = [
  { name: "HDFC Life", initials: "HDFC" },
  { name: "LIC", initials: "LIC" },
  { name: "Star Health", initials: "SH" },
  { name: "ICICI Prudential", initials: "ICICI" },
  { name: "SBI Life", initials: "SBI" },
  { name: "Max Life", initials: "MAX" },
];

// Why Us features
const whyUsFeatures = [
  {
    title: "Women-Led Leadership",
    description:
      "Founded by a veteran single mom with 15 years of experience. We understand the value of every rupee and every family.",
    icon: Users,
  },
  {
    title: "Personalized Audits",
    description:
      "We don't believe in one-size-fits-all. Get customized financial audits and recommendations tailored to your unique situation.",
    icon: CheckCircle,
  },
  {
    title: "24/7 Claim Support",
    description:
      "When you need us most, we're there. Round-the-clock assistance for all your insurance claims and queries.",
    icon: Clock,
  },
];

// All services for homepage (headings only)
const allServices = [
  { title: "General Insurance", icon: Car },
  { title: "Health & Mediclaim", icon: HeartPulse },
  { title: "Life & Term Insurance", icon: Shield },
  { title: "Mutual Funds & SIPs", icon: TrendingUp },
  { title: "Fixed Deposits & Bonds", icon: Wallet },
  { title: "Corporate Loans", icon: Building2 },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-background to-muted/30 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
              <Shield className="h-4 w-4" />
              <span>Trusted by 500+ Families</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl leading-tight">
              Securing Families & Futures with{" "}
              <span className="text-primary">15 Years of Trust</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
              Comprehensive Insurance, Wealth, and Loan Solutions tailored for
              you. Experience the care of a mother protecting her family.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="font-semibold text-base">
                <Link href="/quote">
                  Book a Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="font-semibold text-base"
              >
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip - Partner Logos - HIDDEN: Uncomment to re-enable */}
      {/* <section className="py-12 border-y border-border/40 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Partnered with India&apos;s Leading Insurers
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center justify-center w-20 h-12 rounded-lg bg-card border border-border/50 text-muted-foreground font-semibold text-sm hover:border-primary/50 hover:text-primary transition-all"
              >
                {partner.initials}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Why Us Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-primary">Navansh Finserv</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We bring the dedication of a mother protecting her family to every
              financial decision we help you make.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {whyUsFeatures.map((feature) => (
              <ServiceCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 md:py-28 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Our <span className="text-primary">Offerings</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {allServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="flex flex-col items-center text-center p-4 md:p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <div className="p-3 rounded-lg bg-primary/10 text-primary mb-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm">{service.title}</h3>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild className="font-semibold">
              <Link href="/services">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="p-8 md:p-16 rounded-2xl bg-muted/30 border border-border/50">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Not sure which service is right for you?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We offer free financial audits to help you understand your current
                situation and identify the best solutions. No pressure, just
                honest guidance from experts who care.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
