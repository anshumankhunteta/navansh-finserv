'use client'

import Navansh from '@/components/icons/Navansh'
import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

interface BusinessCardProps {
  name: string
  designation: string
  phone?: string
  email?: string
  website?: string
  tagline?: string
  address?: string
}

export default function BusinessCard({
  name,
  designation,
  phone = process.env.NEXT_PUBLIC_PHONE_NUMBER,
  email = process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  website = 'www.navansh.in',
  tagline = 'Financial Planning Made Easy',
  address = '39, Mahatma Gandhi Road, Haridevpur, Tollygunge, Kolkata, West Bengal 700082',
}: BusinessCardProps) {
  return (
    <div
      id="business-card"
      className="relative flex w-[350px] flex-col items-center overflow-hidden bg-[#0a2d1a] px-8 py-12 shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
      style={{ aspectRatio: '7/12' }}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#409e54] to-transparent" />

      {/* Logo */}
      <div className="flex flex-row items-center gap-1">
        <div>
          <Navansh height={48} alt />
        </div>

        <span>
          <h1 className="ml-1 text-2xl font-light tracking-wide text-[#f5f5f5]">
            {name}
          </h1>

          {/* Designation */}
          <p className="text-primary mt-1 text-xs font-medium tracking-[0.25em] uppercase">
            {designation}
          </p>
        </span>
      </div>

      {/* Divider */}
      <div className="via-primary my-8 h-px w-16 bg-gradient-to-r from-transparent to-transparent" />

      {/* Contact Details */}
      <div className="flex w-full flex-col gap-4 text-sm text-[#b8c5bc]">
        {phone && (
          <Link href={`tel:${phone}`}>
            <div className="flex items-center gap-3">
              <Phone size={14} className="shrink-0 text-[#52c77d]" />
              <span>{phone}</span>
            </div>
          </Link>
        )}
        {email && (
          <Link href={`mailto:${email}`}>
            <div className="flex items-center gap-3">
              <Mail size={14} className="shrink-0 text-[#52c77d]" />
              <span>{email}</span>
            </div>
          </Link>
        )}
        {website && (
          <Link href={`https://${website}`} target="_blank">
            <div className="flex items-center gap-3">
              <Globe size={14} className="shrink-0 text-[#52c77d]" />
              <span>{website}</span>
            </div>
          </Link>
        )}
        {address && (
          <Link
            href={`https://www.google.com/maps/dir//39,+Mahatma+Gandhi+Rd,+Haridevpur,+Paschim+Putiary,+Kolkata,+West+Bengal+700082/@22.4814643,88.3380689,19z/data=!4m5!4m4!1m0!1m2!1m1!1s0x3a027091f2ff6159:0xb27ac9c8999c622c`}
            target="_blank"
          >
            <div className="flex items-center gap-3">
              <MapPin size={14} className="shrink-0 text-[#52c77d]" />
              <span>{address}</span>
            </div>
          </Link>
        )}
      </div>

      {/* Tagline */}
      <p className="mt-auto pt-10 text-center text-[10px] tracking-[0.2em] text-[#52c77d]/40 uppercase">
        {tagline}
      </p>

      {/* Subtle bottom accent line */}
      <div className="absolute right-0 bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#409e54]/30 to-transparent" />
    </div>
  )
}
