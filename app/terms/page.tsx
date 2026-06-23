import { Link2 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    "Read the terms and conditions governing use of Navansh Finserv's website, financial calculators, and advisory services.",
  alternates: {
    canonical: 'https://navansh.in/terms',
  },
  openGraph: {
    url: 'https://navansh.in/terms',
    title: 'Terms of Service | Navansh Finserv',
    description:
      "Read the terms and conditions governing use of Navansh Finserv's website, financial calculators, and advisory services.",
  },
}

export default function TermsPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">Last updated: 23 June 2026</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8">
              <div>
                <h2 className="text-foreground mb-4 text-xl font-bold">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using the Navansh Finserv website
                  (navansh.in), you agree to be bound by these Terms of Service.
                  If you do not agree with any part of these terms, please do
                  not use our website or services.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-xl font-bold">
                  2. Nature of Services
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Navansh Finserv is a financial intermediary and advisory firm.
                  Our services include:
                </p>
                <ul className="text-muted-foreground list-disc space-y-2 pl-6">
                  <li>
                    Distribution of Mutual Funds on behalf of Asset Management
                    Companies (AMCs)
                  </li>
                  <li>
                    Facilitation of insurance products (health, life, and
                    general) on behalf of licensed insurers
                  </li>
                  <li>Advisory guidance on Fixed Deposits and Bonds</li>
                  <li>
                    Free-to-use financial planning calculators and tools on this
                    website
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  We act as an intermediary and do not directly underwrite,
                  issue, or guarantee any insurance policy or investment
                  product. All products are subject to the terms and conditions
                  of the respective insurers, AMCs, or financial institutions.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-xl font-bold">
                  3. Financial Calculator Disclaimer
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The financial calculators available on this website (including
                  SIP, FD, SWP, HLV, Education, and Mediclaim estimators) are
                  provided for illustrative and educational purposes only. All
                  outputs are estimates based on user-provided inputs and market
                  averages and{' '}
                  <strong className="text-foreground">
                    do not constitute financial, investment, tax, or legal
                    advice
                  </strong>
                  . Actual returns, premiums, and figures will vary based on
                  market conditions, insurer pricing, scheme parameters, and
                  individual circumstances. Always consult a qualified financial
                  advisor before making any investment or insurance decisions.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-xl font-bold">
                  4. Mutual Fund Disclosure
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Mutual Fund investments are subject to market risks. Past
                  performance is not indicative of future returns. Read all
                  scheme-related documents carefully before investing. The NAV
                  data displayed in the Mutual Fund Screener is sourced from
                  publicly available AMFI data and may be subject to a delay.
                  Navansh Finserv is not responsible for inaccuracies in third-
                  party data.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-xl font-bold">
                  5. Insurance Disclosure
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Insurance is the subject matter of solicitation. For more
                  details on risk factors, terms and conditions, please read the
                  relevant sales brochure or policy document carefully before
                  concluding a sale. Claims are subject to the terms of the
                  policy issued by the respective insurer.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-xl font-bold">
                  6. Enquiry & Contact Forms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By submitting an enquiry through our website, you consent to
                  Navansh Finserv contacting you via phone, email, or WhatsApp
                  to respond to your enquiry. Submission of an enquiry does not
                  create any contractual obligation on either party. We reserve
                  the right to decline or not respond to enquiries at our
                  discretion.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-xl font-bold">
                  7. Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on this website — including text, graphics, logos,
                  blog articles, and software — is the property of Navansh
                  Finserv or its content suppliers and is protected under
                  applicable intellectual property laws. You may not reproduce,
                  distribute, or create derivative works without our express
                  written permission.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-xl font-bold">
                  8. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the fullest extent permitted by applicable law, Navansh
                  Finserv shall not be liable for any direct, indirect,
                  incidental, consequential, or punitive damages arising from
                  your use of this website or reliance on any information
                  provided herein, including but not limited to investment
                  losses, incorrect premium estimates, or third-party service
                  failures.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-xl font-bold">
                  9. Third-Party Links
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  This website may contain links to external websites (e.g.,
                  WhatsApp, Instagram, Discord). We are not responsible for the
                  content, privacy practices, or accuracy of any third-party
                  websites. Accessing such links is at your own risk.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-xl font-bold">
                  10. Governing Law
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service shall be governed by and construed in
                  accordance with the laws of India. Any disputes arising under
                  these terms shall be subject to the exclusive jurisdiction of
                  the courts in Kolkata, West Bengal.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-xl font-bold">
                  11. Changes to These Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to update these Terms of Service at any
                  time. Changes will be effective upon posting to this page with
                  an updated &quot;Last updated&quot; date. Continued use of our
                  website after any changes constitutes your acceptance of the
                  revised terms.
                </p>
              </div>

              <div>
                <Link href="/contact">
                  <h2 className="text-foreground mb-4 text-xl font-bold">
                    12. Contact Us{' '}
                    <Link2 className="text-muted-foreground inline-block" />
                  </h2>
                </Link>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions or concerns about these Terms of
                  Service, please contact us. You can also review our{' '}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>{' '}
                  for information on how we handle your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
