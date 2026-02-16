'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Zod schema with conditional validation
const enquirySchema = z
  .object({
    // Name validation: 2-50 chars, letters only, no numbers/special chars
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name is too long')
      .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters')
      .refine(
        (val) => !val.match(/(.)\1{3,}/), // Reject "aaaa" or "bbbb"
        'First name looks invalid'
      )
      .refine(
        (val) => val.split(' ').every((word) => word.length >= 2),
        'Each name part must be at least 2 characters'
      ),

    lastName: z
      .string()
      .max(50, 'Last name is too long')
      .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters')
      .refine(
        (val) => !val.match(/(.)\1{3,}/), // Reject "aaaa" or "bbbb"
        'Last name looks invalid'
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
    message: z.string().optional().or(z.literal('')),

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
    // 1. Validate the form data
    const validatedData = enquirySchema.parse(formData)

    // 2. Check for duplicate/spam submission
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

    // Additional spam prevention: Check for any submission in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 60 * 1000).toISOString()
    const { data: recentSubmissions } = await supabase
      .from('leads')
      .select('id, created_at')
      .gte('created_at', fiveMinutesAgo)
      .limit(1)

    if (recentSubmissions && recentSubmissions.length > 0) {
      return {
        success: false,
        message: 'Please wait a few minutes before submitting another enquiry.',
      }
    }

    // 3. Insert into Supabase
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
