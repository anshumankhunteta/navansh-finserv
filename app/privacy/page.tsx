import { Link2 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Navansh Finserv',
  description:
    'Learn how Navansh Finserv collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col backdrop-blur-[3px]">
      {/* Header */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">Last updated: February 2026</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8">
              <div>
                <h2 className="text-foreground mb-4 text-2xl font-bold">
                  1. Introduction
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Navansh Finserv (&quot;we,&quot; &quot;our,&quot; or
                  &quot;us&quot;) is committed to protecting your privacy. This
                  Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you visit our website or use
                  our services.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-2xl font-bold">
                  2. Information We Collect
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  We collect information that you provide directly to us,
                  including:
                </p>
                <ul className="text-muted-foreground list-disc space-y-2 pl-6">
                  <li>Name, email address, and phone number</li>
                  <li>
                    Financial information necessary to provide our services
                  </li>
                  <li>Communication preferences and correspondence with us</li>
                  <li>Information submitted through our contact forms</li>
                </ul>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-2xl font-bold">
                  3. How We Use Your Information
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="text-muted-foreground list-disc space-y-2 pl-6">
                  <li>Provide, maintain, and improve our financial services</li>
                  <li>Process your requests and respond to your inquiries</li>
                  <li>Send you service-related communications and updates</li>
                  <li>
                    Comply with legal obligations and regulatory requirements
                  </li>
                  <li>
                    Provide personalized financial advice and recommendations
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-2xl font-bold">
                  4. Information Sharing and Disclosure
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  We do not sell, trade, or rent your personal information to
                  third parties. We may share your information only in the
                  following circumstances:
                </p>
                <ul className="text-muted-foreground list-disc space-y-2 pl-6">
                  <li>
                    With insurance providers and financial institutions to
                    process your applications
                  </li>
                  <li>
                    With service providers who assist us in operating our
                    business
                  </li>
                  <li>When required by law or to protect our rights</li>
                  <li>With your explicit consent</li>
                </ul>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-2xl font-bold">
                  5. Data Security
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security
                  measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction.
                  However, no method of transmission over the Internet or
                  electronic storage is 100% secure.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-2xl font-bold">
                  6. Your Rights
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  You have the right to:
                </p>
                <ul className="text-muted-foreground list-disc space-y-2 pl-6">
                  <li>
                    Access and receive a copy of your personal information
                  </li>
                  <li>Request correction of inaccurate or incomplete data</li>
                  <li>Request deletion of your personal information</li>
                  <li>Withdraw consent for data processing where applicable</li>
                  <li>Object to or restrict certain processing of your data</li>
                </ul>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-2xl font-bold">
                  7. Cookies and Tracking
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may use cookies and similar tracking technologies to
                  improve your browsing experience and analyze website traffic.
                  You can control cookie preferences through your browser
                  settings.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-2xl font-bold">
                  8. Compliance with Indian Laws
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  This Privacy Policy complies with the Information Technology
                  Act, 2000 and the Information Technology (Reasonable Security
                  Practices and Procedures and Sensitive Personal Data or
                  Information) Rules, 2011 of India.
                </p>
              </div>

              <div>
                <h2 className="text-foreground mb-4 text-2xl font-bold">
                  9. Changes to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the &quot;Last updated&quot; date.
                </p>
              </div>

              <div>
                <Link href="/contact">
                  <h2 className="text-foreground mb-4 text-2xl font-bold">
                    10. Contact Us{' '}
                    <Link2 className="text-muted-foreground inline-block" />
                  </h2>
                </Link>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us at:
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
