import { Clock, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import Whatsapp from '../icons/Whatsapp'

interface ContactInfoItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  details: string
  link?: string
}

export function ContactInfo() {
  const contactEmail = process.env.CONTACT_EMAIL || ''
  const contactPhone = process.env.PHONE_NUMBER || ''

  const contactInfo: ContactInfoItem[] = [
    {
      icon: MapPin,
      title: 'Location',
      details:
        '39, Mahatma Gandhi Road, Haridevpur, Tollygunge, Kolkata, West Bengal 700082',
      link: 'https://www.google.com/maps/dir//39,+Mahatma+Gandhi+Rd+Haridevpur,+Paschim+Putiary+Kolkata,+West+Bengal+700082/@22.4814643,88.3380689,19z/data=!4m5!4m4!1m0!1m2!1m1!1s0x3a027091f2ff6159:0xb27ac9c8999c622c',
    },
    {
      icon: Mail,
      title: 'Email',
      details: contactEmail,
      link: `mailto:${contactEmail}`,
    },
    {
      icon: Whatsapp,
      title: 'Whatsapp',
      details: contactPhone,
      link: `https://wa.me/${contactPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello')}`,
    },
    {
      icon: Clock,
      title: 'Hours',
      details: 'Mon - Sat: 9AM - 7PM',
    },
  ]

  return (
    <div className="bg-card border-border/50 rounded-2xl border p-6 md:p-8">
      <h2 className="mb-8 text-2xl font-bold">Contact Information</h2>
      <div className="space-y-6">
        {contactInfo.map((info) => (
          <div key={info.title} className="flex items-start gap-4">
            {info?.link ? (
              <Link href={info.link}>
                <div className="bg-primary/10 text-primary shrink-0 rounded-lg p-2">
                  <info.icon className="h-5 w-5" />
                </div>
              </Link>
            ) : (
              <div className="bg-primary/10 text-primary shrink-0 rounded-lg p-2">
                <info.icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className="font-medium">{info.title}</h3>
              <p className="text-muted-foreground text-sm">{info.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
