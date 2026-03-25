import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    "Learn about our founder's journey from sales manager to firm owner, with 15 years of experience and 500+ happy clients.",
  alternates: {
    canonical: 'https://navansh.in/about',
  },
  openGraph: {
    url: 'https://navansh.in/about',
    title: 'Our Story | Navansh Finserv',
    description:
      "Learn about our founder's journey from sales manager to firm owner, with 15 years of experience and 500+ happy clients.",
  },
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold md:text-5xl">
              Our <span className="text-primary">Story</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Built on resilience, driven by trust
            </p>
          </div>
        </div>
      </section>

      {/* Founder's Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto">
            <div className="prose prose-lg max-w-none">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                <div className="space-y-6 md:col-span-2">
                  <h2 className="text-foreground mb-6 text-3xl font-bold md:whitespace-nowrap">
                    From Sales Manager to{' '}
                    <span className="text-primary">Firm Owner</span>
                  </h2>
                  <p className="text-lg leading-relaxed">
                    Navansh Finserv is founded by a veteran single mother with
                    over 2 decades of experience in financial services, sales
                    and customer relationship management. Having navigated the
                    challenges of building financial security from scratch for
                    her own family, raising two sons all by herself, our founder
                    brings a unique blend of professional expertise and personal
                    understanding to every client interaction.
                  </p>
                  <p className="text-lg leading-relaxed">
                    <em className="text-foreground font-medium">
                      &quot;I&apos;ve lived through the sleepless nights
                      worrying about tomorrow. When you&apos;re building
                      security from scratch, you learn what really matters.
                      That&apos;s the experience I bring to every family I work
                      with.&quot;
                    </em>
                  </p>
                  <p className="text-lg leading-relaxed">
                    This philosophy drives everything we do at Navansh Finserv.
                    We don&apos;t just sell policies, we believe in building
                    lasting relationships based on trust, transparency, and
                    genuine care. Our approach is motherly protection meets
                    professionalism and precision ensuring your financial
                    clarity is impeccable.
                  </p>
                  <p className="text-lg leading-relaxed">
                    <span className="italic">Money attracts Money.</span> We
                    believe in the power of compounding and investment
                    instruments. This mindset comes from years of earning,
                    saving, investing (repeat) not only from Personal Results
                    and Experience but from our Clients and their Family&apos;s
                    Growth as well. People don&apos;t truly understand the power
                    of these financial instruments until they see numbers and
                    actual portfolio growth.
                  </p>
                </div>
                {/* Founder Image */}
                <div className="flex w-full flex-col items-center p-3 md:items-start">
                  <Image
                    className="drop-shadow-muted-foreground w-70 object-contain drop-shadow-md sepia-50 md:w-90 dark:drop-shadow-none"
                    src="https://lnwdmhdvvnzjfbfgcdxw.supabase.co/storage/v1/object/public/cdn/Founderimage_passport.png"
                    alt="Milee Khunteta"
                    height={720}
                    width={720}
                  />
                  <div className="mt-4 flex flex-col items-start md:pl-4">
                    <p className="text-primary text-xl leading-relaxed font-bold">
                      Milee Khunteta
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Founder and Director
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-primary mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg">
                <Award className="h-8 w-8" />
              </div>
              <div className="text-foreground mb-2 text-4xl font-bold">20+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-primary mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg">
                <Users2 className="h-8 w-8" />
              </div>
              <div className="text-foreground mb-2 text-4xl font-bold">
                500+
              </div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-primary mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg">
                <Target className="h-8 w-8" />
              </div>
              <div className="text-foreground mb-2 text-4xl font-bold">
                100%
              </div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Our <span className="text-primary">Values</span>
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="border-border bg-card rounded-lg border p-6">
                <h3 className="mb-3 text-xl font-semibold">Trust First</h3>
                <p className="text-muted-foreground">
                  We prioritize building long-term relationships based on
                  honesty and transparency over short-term gains.
                </p>
              </div>
              <div className="border-border bg-card rounded-lg border p-6">
                <h3 className="mb-3 text-xl font-semibold">Empathy & Care</h3>
                <p className="text-muted-foreground">
                  Every client is treated with genuine understanding of their
                  unique financial situations.
                </p>
              </div>
              <div className="border-border bg-card rounded-lg border p-6">
                <h3 className="mb-3 text-xl font-semibold">Expert Guidance</h3>
                <p className="text-muted-foreground">
                  20+ years of industry experience ensures you receive informed,
                  professional advice.
                </p>
              </div>
              <div className="border-border bg-card rounded-lg border p-6">
                <h3 className="mb-3 text-xl font-semibold">Lifetime Support</h3>
                <p className="text-muted-foreground">
                  We don&apos;t disappear after the sale. We are dedicated to
                  provide advice and support in the long term.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-primary mb-4 text-3xl font-bold">
            Let us know how we can Help you
          </h2>
          <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
            Reach out to our location, text us on Whatsapp, send an email.
            <br /> Whatever floats your boat.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
