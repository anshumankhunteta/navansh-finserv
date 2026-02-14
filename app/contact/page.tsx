import { ContactInfo } from '@/components/custom/ContactInfo'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us | Navansh Finserv',
  description:
    'Schedule a free consultation with our financial experts. Get personalized insurance and wealth management solutions.',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold md:text-5xl">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Learn More about us and find out Where to reach out.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mx-4 py-20 md:mx-auto">
        {/* Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Info */}
          <ContactInfo />

          {/* Google Maps */}
          <div className="bg-card border-border/50 overflow-hidden rounded-2xl border">
            <div className="border-border/50 border-b p-4">
              <h3 className="text-xl font-bold">Our Location</h3>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d460.82518860936966!2d88.33799571472095!3d22.481604322024946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027091f2ff6159%3A0xb27ac9c8999c622c!2s39%2C%20Mahatma%20Gandhi%20Rd%2C%20Haridevpur%2C%20Paschim%20Putiary%2C%20Kolkata%2C%20West%20Bengal%20700082!5e0!3m2!1sen!2sin!4v1770227001040!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Navansh Finserv Location"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Schedule Consultation Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-primary mb-4 text-3xl font-bold">
            Schedule a Free Consultation
          </h2>
          <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
            We are ready to help you with your financial planning needs.
          </p>
          <Button asChild variant={'default'} className="px-8 py-6 text-lg">
            <Link href="/enquire">Get a Quote</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
