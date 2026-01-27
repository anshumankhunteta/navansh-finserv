import { Award, Users, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="border-b border-slate-700 bg-slate-800 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
            About Us
          </h1>
          <p className="mt-4 text-lg text-slate-400 sm:text-xl">
            [INSERT ABOUT PAGE INTRO TEXT HERE]
          </p>
        </div>
      </section>

      {/* Founder Bio Section */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Placeholder */}
          <div className="order-2 lg:order-1">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-slate-800">
              <div className="flex h-full w-full items-center justify-center text-slate-500">
                [INSERT FOUNDER IMAGE HERE]
              </div>
            </div>
          </div>

          {/* Bio Content */}
          <div className="order-1 flex flex-col justify-center lg:order-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl md:text-4xl">
                15 Years of Experience
              </h2>
              <p className="mt-2 text-lg text-amber-500">
                Sales Manager & Insurance Professional
              </p>
            </div>
            <div className="space-y-4 text-slate-300">
              <p className="text-lg leading-relaxed">
                [INSERT FOUNDER BIO PARAGRAPH 1 HERE] With 15 years of
                experience as a sales manager in the insurance industry, I've
                helped countless families and businesses secure their futures.
              </p>
              <p className="text-lg leading-relaxed">
                [INSERT FOUNDER BIO PARAGRAPH 2 HERE] My journey has taught me
                that insurance isn't just about policies—it's about peace of
                mind, security, and protecting what you've worked hard to build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The "Why" Section */}
      <section className="border-y border-slate-700 bg-slate-800 py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Heart className="mx-auto mb-6 h-12 w-12 text-amber-500" />
            <h2 className="mb-6 text-2xl font-bold text-slate-50 sm:text-3xl md:text-4xl">
              The "Why"
            </h2>
            <div className="space-y-6 text-lg text-slate-300">
              <p className="leading-relaxed">
                I understand the weight of responsibility. As a mother and a
                veteran of the insurance industry, I don't just sell policies; I
                build safety nets.
              </p>
              <p className="leading-relaxed">
                [INSERT ADDITIONAL "WHY" CONTENT HERE] Every family deserves
                protection that understands their unique circumstances. Every
                business deserves coverage that grows with them. This isn't just
                my profession—it's my commitment to ensuring that the people I
                serve can face the future with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl md:text-4xl">
            Our Values
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            [INSERT VALUES INTRO TEXT HERE]
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Award className="mb-4 h-10 w-10 text-amber-500" />
              <CardTitle>Experience</CardTitle>
              <CardDescription>
                [INSERT EXPERIENCE VALUE DESCRIPTION HERE] 15 years of industry
                expertise ensures you receive knowledgeable guidance and
                reliable service.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="mb-4 h-10 w-10 text-amber-500" />
              <CardTitle>Empathy</CardTitle>
              <CardDescription>
                [INSERT EMPATHY VALUE DESCRIPTION HERE] We understand life's
                challenges because we've lived them. Your needs are our
                priority.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="mb-4 h-10 w-10 text-amber-500" />
              <CardTitle>Partnership</CardTitle>
              <CardDescription>
                [INSERT PARTNERSHIP VALUE DESCRIPTION HERE] We're not just your
                insurance provider—we're your long-term partner in protection.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
