import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Car, CheckCircle2, HeadphonesIcon, Heart, Shield, TrendingUp, Users, Wallet } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  // All services for homepage (headings only)
  const allServices = [
    { title: "Mutual Funds & SIPs", icon: TrendingUp },
    { title: "Health & Mediclaim", icon: Heart },
    { title: "General Insurance", icon: Car },
    { title: "Life & Term Insurance", icon: Shield },
    { title: "Fixed Deposits & Bonds", icon: Wallet },
    { title: "Corporate Loans", icon: Building2 },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-background to-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Securing Families & Futures with{" "}
              <span className="text-primary">15 Years of Trust</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Comprehensive Insurance, Wealth, and Loan Solutions tailored for you
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/contact">
                Book a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Strip - Partner Logos */}
      {/* <section className="py-12 border-y bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-muted-foreground mb-8">
            TRUSTED PARTNERS
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
            {["HDFC", "LIC", "Star Health", "ICICI"].map((partner) => (
              <div
                key={partner}
                className="text-xl font-bold text-foreground/60 hover:text-foreground transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Our Offerings */}
      <div className="mt-20 text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Our <span className="text-primary">Offerings</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We offer a range of services to help you achieve your financial goals
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3 md:gap-6 lg:gap-8 mx-auto mb-16 mx-3">
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

      {/* Why Us Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-primary">Navansh Finserv</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience personalized financial solutions backed by expertise and compassion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group p-8 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary mb-4">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Women-Led Leadership</h3>
                <p className="text-muted-foreground">
                  Founded by a veteran single mom with 15 years of sales experience, bringing genuine care and understanding to every client relationship.
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Empathetic approach to financial planning</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>15+ years industry expertise</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="group p-8 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary mb-4">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Personalized Audits</h3>
                <p className="text-muted-foreground">
                  Comprehensive financial health assessments tailored to your unique needs and life stage.
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Free portfolio reviews</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Risk assessment & gap analysis</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="group p-8 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary mb-4">
                  <HeadphonesIcon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">24/7 Claim Support</h3>
                <p className="text-muted-foreground">
                  Round-the-clock assistance when you need it most. We stand by you during claims and emergencies.
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Dedicated claims assistance</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Fast-track claim processing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-primary/2 to-primary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Secure Your Future?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get expert financial guidance tailored to your family's needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Get Started Today</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
