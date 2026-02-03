import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Award, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Securing Families & Futures with <span className="text-secondary">15 Years</span> of Trust.
            </h1>
            <p className="text-xl text-slate-300 max-w-lg">
              Comprehensive Insurance, Wealth, and Loan Solutions tailored for you. Expert guidance from a mother who understands protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8">
                <Link href="/contact">Book a Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-primary hover:text-primary hover:bg-secondary/10 border-slate-500 bg-white">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            {/* Placeholder for Hero Image or Abstract Graphic */}
            <div className="w-full h-96 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-sm">
              <Shield className="h-48 w-48 text-secondary opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-10 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Trusted by partners</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
            {/* Placeholders for partner logos */}
            <span className="text-xl font-bold font-sans text-slate-400">HDFC Life</span>
            <span className="text-xl font-bold font-sans text-slate-400">LIC</span>
            <span className="text-xl font-bold font-sans text-slate-400">Star Health</span>
            <span className="text-xl font-bold font-sans text-slate-400">Tata AIG</span>
            <span className="text-xl font-bold font-sans text-slate-400">Bajaj Allianz</span>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Navansh Finserv?</h2>
            <p className="text-muted-foreground text-lg">
              We bring a mother&apos;s care and a professional&apos;s expertise to your financial planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-secondary shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-primary">Women-Led Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Founded by a veteran single mom with 15 years of sales experience, prioritizing trust above all.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-secondary shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-primary">Personalized Audits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We don&apos;t just sell products; we audit your needs to find the perfect financial fit for your family.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-secondary shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-primary">24/7 Claim Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We stand by you when it matters most. Dedicated support for claims and emergencies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to secure your future?</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Get a comprehensive financial audit and find the best insurance plans for your family today.
          </p>
          <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8">
            <Link href="/contact">Get a Quote Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
