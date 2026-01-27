import { Shield, Heart, Home, Car, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Services() {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="border-b border-slate-700 bg-slate-800 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
            Our Services
          </h1>
          <p className="mt-4 text-lg text-slate-400 sm:text-xl">
            [INSERT SERVICES PAGE INTRO TEXT HERE] Comprehensive insurance
            solutions tailored to protect what matters most to you.
          </p>
        </div>
      </section>

      {/* Life & Health Insurance Section */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-4">
            <Heart className="h-8 w-8 text-amber-500 sm:h-10 sm:w-10" />
            <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl md:text-4xl">
              Life & Health Insurance
            </h2>
          </div>
          <p className="text-lg text-slate-300 sm:text-xl">
            Securing your family's foundation
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Heart className="mb-4 h-8 w-8 text-amber-500" />
              <CardTitle>Life Insurance</CardTitle>
              <CardDescription>
                [INSERT LIFE INSURANCE DETAILS HERE] Protect your loved ones
                with comprehensive life insurance coverage that provides
                financial security when they need it most.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• [INSERT BENEFIT 1]</li>
                <li>• [INSERT BENEFIT 2]</li>
                <li>• [INSERT BENEFIT 3]</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="mb-4 h-8 w-8 text-amber-500" />
              <CardTitle>Health Insurance</CardTitle>
              <CardDescription>
                [INSERT HEALTH INSURANCE DETAILS HERE] Comprehensive health
                coverage options to keep you and your family healthy and
                protected.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• [INSERT BENEFIT 1]</li>
                <li>• [INSERT BENEFIT 2]</li>
                <li>• [INSERT BENEFIT 3]</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Briefcase className="mb-4 h-8 w-8 text-amber-500" />
              <CardTitle>Disability Insurance</CardTitle>
              <CardDescription>
                [INSERT DISABILITY INSURANCE DETAILS HERE] Income protection
                that ensures financial stability if you're unable to work.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• [INSERT BENEFIT 1]</li>
                <li>• [INSERT BENEFIT 2]</li>
                <li>• [INSERT BENEFIT 3]</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Asset Protection Section */}
      <section className="border-y border-slate-700 bg-slate-800 py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-6 flex items-center gap-4">
              <Shield className="h-8 w-8 text-amber-500 sm:h-10 sm:w-10" />
              <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl md:text-4xl">
                Asset Protection
              </h2>
            </div>
            <p className="text-lg text-slate-300 sm:text-xl">
              Safeguarding what you've built
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-slate-900">
              <CardHeader>
                <Home className="mb-4 h-8 w-8 text-amber-500" />
                <CardTitle>Home Insurance</CardTitle>
                <CardDescription>
                  [INSERT HOME INSURANCE DETAILS HERE] Protect your most
                  valuable asset with comprehensive home insurance coverage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• [INSERT BENEFIT 1]</li>
                  <li>• [INSERT BENEFIT 2]</li>
                  <li>• [INSERT BENEFIT 3]</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900">
              <CardHeader>
                <Car className="mb-4 h-8 w-8 text-amber-500" />
                <CardTitle>Auto Insurance</CardTitle>
                <CardDescription>
                  [INSERT AUTO INSURANCE DETAILS HERE] Reliable auto insurance
                  coverage that protects you on the road.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• [INSERT BENEFIT 1]</li>
                  <li>• [INSERT BENEFIT 2]</li>
                  <li>• [INSERT BENEFIT 3]</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900">
              <CardHeader>
                <Briefcase className="mb-4 h-8 w-8 text-amber-500" />
                <CardTitle>Business Insurance</CardTitle>
                <CardDescription>
                  [INSERT BUSINESS INSURANCE DETAILS HERE] Comprehensive
                  business insurance solutions to protect your enterprise.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• [INSERT BENEFIT 1]</li>
                  <li>• [INSERT BENEFIT 2]</li>
                  <li>• [INSERT BENEFIT 3]</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 text-center md:p-12">
          <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl md:text-4xl">
            Ready to Protect What Matters?
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            [INSERT CTA TEXT HERE] Let's discuss your insurance needs and find
            the perfect coverage for you.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/contact">Schedule a Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
