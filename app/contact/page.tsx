import Discord from '@/components/icons/Discord'
import Instagram from '@/components/icons/Instagram'
import Navansh from '@/components/icons/Navansh'
import Whatsapp from '@/components/icons/Whatsapp'
import { Button } from '@/components/ui/button'
import { Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Schedule a free consultation with our financial experts. Get personalized insurance and wealth management solutions.',
  alternates: {
    canonical: 'https://navansh.in/contact',
  },
  openGraph: {
    url: 'https://navansh.in/contact',
    title: 'Contact Us | Navansh Finserv',
    description:
      'Schedule a free consultation with our financial experts. Get personalized insurance and wealth management solutions.',
  },
}

interface ContactInfoItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  details: string
  link: string
}

export default function ContactPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || ''
  const contactPhone = process.env.NEXT_PUBLIC_PHONE_NUMBER || ''

  const contactInfo: ContactInfoItem[] = [
    contactEmail && {
      icon: Mail,
      title: 'Send us an Email',
      details: contactEmail,
      link: `mailto:${contactEmail}`,
    },
    {
      icon: Instagram,
      title: 'Follow us on Instagram',
      details: '@navansh_finserv',
      link: `https://instagram.com/navansh_finserv`,
    },
    contactPhone && {
      icon: Whatsapp,
      title: 'Send a message on Whatsapp',
      details: contactPhone,
      link: `https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello')}`,
    },
  ].filter(Boolean) as ContactInfoItem[]

  return (
    <div className="flex flex-col">
      <div className="bg-card/75 border-border/50 w-full border p-6 md:p-8 dark:bg-black/30">
        <div className="container mx-auto">
          <div className="bg-secondary mx-auto flex h-[120px] w-[120px] items-center justify-center rounded-full">
            <Navansh
              height={50}
              style={
                { '--primary-foreground': '#eeeeee' } as React.CSSProperties
              }
            />
          </div>
          <h2 className="mb-8 text-center text-2xl font-bold tracking-widest">
            <span className="text-primary">NAVANSH</span> FINSERV
          </h2>
          <div className="mb-6 space-y-6">
            {contactInfo.map((info) => (
              <Link
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                key={info.title}
                className="border-border/50 bg-card flex items-start gap-4 rounded-xl border p-3 md:mx-auto md:w-[50%]"
              >
                <div className="bg-primary/10 text-primary fill-primary shrink-0 rounded-lg p-3">
                  <info.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{info.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {info.details}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {/* Google Maps Embed*/}
          <div className="bg-card border-border/50 overflow-hidden rounded-xl border md:mx-auto md:w-[50%]">
            <div className="border-border/50 flex items-center gap-4 border-b p-3">
              <div className="bg-primary/10 text-primary fill-primary shrink-0 rounded-lg p-3">
                <MapPin className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Our Location</h3>
                <p className="text-muted-foreground text-sm">
                  Reach out to us at our office
                </p>
              </div>
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
            />
          </div>
          <Link
            href="https://discord.gg/YuPpRjzYtA"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border/50 bg-card mt-6 mb-24 flex items-start gap-4 rounded-xl border p-3 md:mx-auto md:w-[50%]"
          >
            <div className="bg-primary/10 text-primary fill-primary shrink-0 rounded-lg p-3">
              <Discord className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Need Dev Support?</h3>
              <p className="text-muted-foreground text-sm">
                Join our Discord Community
              </p>
            </div>
          </Link>
        </div>
      </div>
      {/* Schedule Consultation Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-primary mb-4 text-3xl font-bold">
            Get a Free Consultation
          </h2>
          <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
            We would love to help you with your financial planning needs.
          </p>
          <Button asChild variant={'default'} className="px-8 py-6 text-lg">
            <Link href="/enquire">Get a Quote</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
