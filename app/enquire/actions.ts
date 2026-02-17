'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { z } from 'zod'

// Helper: Get country from IP using Vercel headers or fallback API
async function getCountryFromIP(): Promise<string | null> {
  try {
    // Method 1: Vercel's built-in headers (production)
    const headersList = await headers()
    const country = headersList.get('x-vercel-ip-country')

    if (country) return country

    // Method 2: Fallback for local dev - use free API (rate limited to 45 req/min)
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
      headersList.get('x-real-ip')

    if (ip && ip !== '::1' && ip !== '127.0.0.1') {
      const response = await fetch(`https://ipapi.co/${ip}/country/`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      })
      if (response.ok) {
        const countryText = await response.text()
        return countryText.trim()
      }
    }

    return null // Return null if all methods fail
  } catch (error) {
    console.error('Geolocation error:', error)
    return null // Don't fail submission if geolocation fails
  }
}

// Helper: Get client IP address
async function getClientIP(): Promise<string> {
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')

  // x-forwarded-for can be a comma-separated list, take the first IP
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  // Fallback for local development
  return '127.0.0.1'
}

// Helper: Convert country code to flag emoji
function getCountryFlag(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('')
}

// Helper: Sanitize text input to prevent XSS and injection
function sanitizeText(text: string): string {
  // Strip HTML tags using regex
  let cleaned = text.replace(/<[^>]*>/g, '')

  // Remove any remaining HTML entities
  cleaned = cleaned.replace(/&[a-zA-Z0-9#]+;/g, '')

  // Normalize multiple spaces to single space
  cleaned = cleaned.replace(/\s+/g, ' ')

  // Trim leading/trailing whitespace
  return cleaned.trim()
}

// Helper: Create a simple hash for fingerprinting
function createFingerprint(firstName: string, lastName: string): string {
  const combined = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
  // Simple hash function (for fingerprinting, not security)
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(36)
}

// Zod schema with conditional validation
const enquirySchema = z
  .object({
    // Name validation: 2-50 chars, letters only, no numbers/special chars
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name is too long')
      .transform(sanitizeText) // Sanitize before validation
      .pipe(
        z
          .string()
          .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters')
          .refine(
            (val) => !val.match(/(.)\1{3,}/), // Reject "aaaa" or "bbbb"
            'First name looks invalid'
          )
          .refine(
            (val) => val.split(' ').every((word) => word.length >= 2),
            'Each name part must be at least 2 characters'
          )
      ),

    lastName: z
      .string()
      .max(50, 'Last name is too long')
      .transform(sanitizeText) // Sanitize before validation
      .pipe(
        z
          .string()
          .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters')
          .refine(
            (val) => !val.match(/(.)\1{3,}/), // Reject "aaaa" or "bbbb"
            'Last name looks invalid'
          )
      ),

    // Phone validation: exactly 10 digits
    phone: z
      .string()
      .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .optional()
      .or(z.literal('')),

    email: z
      .string()
      .email('Invalid email address')
      .optional()
      .or(z.literal('')),
    message: z
      .string()
      .max(500, 'Message is too long (max 500 characters)')
      .transform(sanitizeText) // Sanitize HTML and normalize whitespace
      .optional()
      .or(z.literal('')),

    // Optional demographic fields
    age: z
      .number()
      .int('Age must be a whole number')
      .max(100, 'Please enter a valid age')
      .optional()
      .or(z.nan()),

    gender: z
      .enum(['male', 'female', 'other', 'prefer-not-to-say'])
      .optional()
      .or(z.literal('')),

    contactMethod: z
      .array(z.enum(['whatsapp', 'call', 'mail']))
      .min(1, 'Please select at least one contact method'),
  })
  .refine(
    (data) => {
      // If "mail" is selected, email must be provided and valid
      if (data.contactMethod.includes('mail')) {
        return data.email && data.email.length > 0
      }
      return true
    },
    {
      message: 'Email is required when "Send me a mail" is selected',
      path: ['email'],
    }
  )
  .refine(
    (data) => {
      // If "whatsapp" OR "call" is selected, phone must be provided
      if (
        data.contactMethod.includes('whatsapp') ||
        data.contactMethod.includes('call')
      ) {
        return data.phone && data.phone.length > 0
      }
      return true
    },
    {
      message:
        'Phone number is required when "Text me on Whatsapp" or "Call me" is selected',
      path: ['phone'],
    }
  )

type EnquiryFormData = z.infer<typeof enquirySchema>

export type FormState = {
  success: boolean
  message: string
  errors?: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    phone?: string[]
    message?: string[]
    age?: string[]
    gender?: string[]
    contactMethod?: string[]
  }
}

export async function submitEnquiry(
  formData: EnquiryFormData
): Promise<FormState> {
  try {
    // 1. Validate the form data (with sanitization via transforms)
    const validatedData = enquirySchema.parse(formData)

    // 2. Get client IP and country for rate limiting and analytics
    const clientIP = await getClientIP()
    const country = await getCountryFromIP()
    const fingerprint = createFingerprint(
      validatedData.firstName,
      validatedData.lastName
    )

    // 3. Multi-tier rate limiting using Supabase
    const supabase = createServiceClient()

    // Check for exact name match (case-insensitive)
    const { data: existingLeads } = await supabase
      .from('leads')
      .select('id, first_name, last_name, created_at')
      .ilike('first_name', validatedData.firstName)
      .ilike('last_name', validatedData.lastName)
      .order('created_at', { ascending: false })
      .limit(1)

    if (existingLeads && existingLeads.length > 0) {
      const existingLead = existingLeads[0]
      const submittedDate = new Date(
        existingLead.created_at
      ).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      return {
        success: false,
        message: `You have already submitted an enquiry on ${submittedDate}. Our team will contact you soon!`,
      }
    }

    // Tier 1: Check for submissions from same IP in last 1 minute
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
    const { data: recentIP } = await supabase
      .from('rate_limit_log')
      .select('id, created_at')
      .eq('client_ip', clientIP)
      .gte('created_at', oneMinuteAgo)
      .limit(1)

    if (recentIP && recentIP.length > 0) {
      return {
        success: false,
        message: 'Please wait a moment before submitting another enquiry.',
      }
    }

    // Tier 2: Check for more than 3 submissions from same IP in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { data: hourlySubmissions, count: hourlyCount } = await supabase
      .from('rate_limit_log')
      .select('id', { count: 'exact' })
      .eq('client_ip', clientIP)
      .gte('created_at', oneHourAgo)

    if (hourlyCount && hourlyCount >= 8) {
      return {
        success: false,
        message: 'Too many submissions. Please try again later.',
      }
    }

    // Tier 3: Check for more than 10 submissions from same IP in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: dailySubmissions, count: dailyCount } = await supabase
      .from('rate_limit_log')
      .select('id', { count: 'exact' })
      .eq('client_ip', clientIP)
      .gte('created_at', oneDayAgo)

    if (dailyCount && dailyCount >= 15) {
      return {
        success: false,
        message: 'Daily submission limit reached. Please try again tomorrow.',
      }
    }

    // 4. Check for duplicate name (keep existing logic as additional protection)

    // 5. Insert into Supabase leads table
    const { error } = await supabase
      .from('leads')
      .insert([
        {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          email: validatedData.email || null,
          phone: validatedData.phone || null,
          message: validatedData.message || null,
          age: validatedData.age || null,
          gender: validatedData.gender || null,
          contact_method: validatedData.contactMethod,
          country: country, // Add country from geolocation
        },
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return {
        success: false,
        message: 'Failed to submit enquiry. Please try again.',
      }
    }

    // 6. Log successful submission to rate_limit_log
    await supabase.from('rate_limit_log').insert([
      {
        client_ip: clientIP,
        country: country,
        fingerprint: fingerprint,
      },
    ])

    if (error) {
      console.error('Supabase error:', error)
      return {
        success: false,
        message: 'Failed to submit enquiry. Please try again.',
      }
    }

    // 4. Send Discord notification
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (discordWebhookUrl) {
      // Helper: Sanitize phone number for links (remove spaces/dashes)
      const rawPhone = validatedData.phone || ''
      const cleanPhone = rawPhone.replace(/\D/g, '')
      const waLink = `https://wa.me/91${cleanPhone}?text=Hello%20${validatedData.firstName},%20we%20received%20your%20inquiry%20at%20Navansh%20Finserv.`
      const mailLink = `mailto:${validatedData.email}?subject=Regarding%20your%20inquiry%20at%20Navansh%20Finserv`

      // Helper: Build the "Quick Actions" string based on user selection
      const actionLinks = []
      const methods = validatedData.contactMethod || []

      if (methods.includes('whatsapp') && cleanPhone) {
        actionLinks.push(`[**📱 Chat on WhatsApp**](${waLink})`)
      }
      if (methods.includes('call') && cleanPhone) {
        // Note: 'tel:' links support varies by device, but is standard
        actionLinks.push(`[**📞 Call Now**](tel:${cleanPhone})`)
      }
      if (methods.includes('mail') && validatedData.email) {
        actionLinks.push(`[**✉️ Send Email**](${mailLink})`)
      }

      // Fallback if no specific preference or data missing
      if (actionLinks.length === 0) {
        if (cleanPhone) actionLinks.push(`[Chat on WhatsApp](${waLink})`)
        if (validatedData.email) actionLinks.push(`[Send Email](${mailLink})`)
      }

      const payload = {
        // 🔔 IMPORTANT: This is the only place @everyone works
        content: '@everyone',
        embeds: [
          {
            title: 'New Lead Enquiry',
            color: Math.floor(Math.random() * 16777215), // Random color (0x000000 to 0xFFFFFF)
            fields: [
              {
                name: '👤 Name',
                value: `**${validatedData.firstName} ${validatedData.lastName}**`,
                inline: true,
              },
              {
                name: '🎂 Age',
                value: validatedData.age ? `${validatedData.age} years` : 'N/A',
                inline: true,
              },
              {
                name: '⚧ Gender',
                value: validatedData.gender
                  ? validatedData.gender
                      .split('-')
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')
                  : 'N/A',
                inline: true,
              },
              {
                name: '📞 Phone',
                value: validatedData.phone
                  ? `[${validatedData.phone}](tel:${cleanPhone})`
                  : 'N/A',
                inline: true,
              },
              {
                name: '📧 Email',
                value: validatedData.email
                  ? `[${validatedData.email}](${mailLink})`
                  : 'N/A',
                inline: true,
              },
              {
                name: '🌍 Location',
                value: country
                  ? `${getCountryFlag(country)} ${country}`
                  : 'Unknown',
                inline: true,
              },
              {
                name: '💬 Message',
                value: validatedData.message
                  ? `>>> ${validatedData.message}`
                  : '_No message provided_',
                inline: false,
              },
              {
                name: 'Preferences',
                value:
                  methods
                    .map((m) => {
                      if (m === 'whatsapp') return '✅ WhatsApp'
                      if (m === 'call') return '✅ Call'
                      if (m === 'mail') return '✅ Email'
                      return m
                    })
                    .join('\n') || 'None selected',
                inline: false,
              },
              {
                name: '⚡ Quick Actions',
                // Join the generated links with a separator
                value: actionLinks.join(' • ') || 'No actions available',
                inline: false,
              },
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: 'Navansh Finserv • Lead Bot',
            },
          },
        ],
      }

      // Send to Discord
      await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      try {
        await fetch(discordWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (discordError) {
        console.error('Discord webhook error:', discordError)
        // Don't fail the entire request if Discord fails
      }
    }

    return {
      success: true,
      message:
        'Thank you for your enquiry! We will get back to you within 24 hours.',
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {}
      error.issues.forEach((err) => {
        const path = err.path[0] as string
        if (!fieldErrors[path]) {
          fieldErrors[path] = []
        }
        fieldErrors[path].push(err.message)
      })

      return {
        success: false,
        message: 'Please fix the errors in the above fields',
        errors: fieldErrors as FormState['errors'],
      }
    }

    console.error('Unexpected error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}
