import { Shield, Heart, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          {/* Text Content */}
          <div className="flex flex-1 flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl md:text-5xl lg:text-6xl">
              Protecting Futures with{" "}
              <span className="text-amber-500">15 Years of Experience</span>
            </h1>
            <p className="text-lg text-slate-400 sm:text-xl">
              [INSERT COMPELLING SUBHEADLINE HERE] Trusted insurance solutions
              for families and businesses. We don't just sell policies; we build
              safety nets.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="flex flex-1 items-center justify-center">
            <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-lg bg-slate-800">
              <div className="flex h-full w-full items-center justify-center text-slate-500">
                [INSERT HERO IMAGE HERE]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-y border-slate-700 bg-slate-800 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">
            Trusted By
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex h-20 items-center justify-center rounded-lg bg-slate-700/50 text-slate-500"
              >
                [LOGO {i}]
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
            Why Choose Us
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            [INSERT VALUE PROPOSITION INTRO TEXT HERE]
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          <Card>
            <CardHeader>
              <Shield className="mb-4 h-10 w-10 text-amber-500" />
              <CardTitle>Expert Guidance</CardTitle>
              <CardDescription>
                [INSERT EXPERT GUIDANCE DESCRIPTION HERE] 15 years of industry
                experience ensures you get the right coverage for your unique
                situation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="mb-4 h-10 w-10 text-amber-500" />
              <CardTitle>Personalized Service</CardTitle>
              <CardDescription>
                [INSERT PERSONALIZED SERVICE DESCRIPTION HERE] We understand
                that every family and business has unique needs. Your protection
                is our priority.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Building2 className="mb-4 h-10 w-10 text-amber-500" />
              <CardTitle>Comprehensive Coverage</CardTitle>
              <CardDescription>
                [INSERT COMPREHENSIVE COVERAGE DESCRIPTION HERE] From life
                insurance to asset protection, we offer solutions that safeguard
                what matters most.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
