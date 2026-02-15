'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Zod schema with conditional validation
const enquirySchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z
      .string()
      .email('Invalid email address')
      .optional()
      .or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    message: z.string().optional().or(z.literal('')),
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
    contactMethod?: string[]
  }
}

export async function submitEnquiry(
  formData: EnquiryFormData
): Promise<FormState> {
  try {
    // 1. Validate the form data
    const validatedData = enquirySchema.parse(formData)

    // 2. Insert into Supabase using service role (bypasses RLS)
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          email: validatedData.email || null,
          phone: validatedData.phone || null,
          message: validatedData.message || null,
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

    // 3. Send Discord notification
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (discordWebhookUrl) {
      // Helper: Sanitize phone number for links (remove spaces/dashes)
      // Assuming India (+91) context based on your location
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
        actionLinks.push(`[**📞 Call Now**](tel:+91${cleanPhone})`)
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
        content: '@everyone 🚨 **New Lead Received!**',
        embeds: [
          {
            title: 'New Lead Enquiry',
            color: 0x409e54, // Teal color
            fields: [
              {
                name: '👤 Name',
                value: `**${validatedData.firstName} ${validatedData.lastName}**`,
                inline: true,
              },
              {
                // Empty spacer to force new line if needed, or just keep inline
                name: '\u200b',
                value: '\u200b',
                inline: false,
              },
              {
                name: '📞 Phone',
                value: validatedData.phone
                  ? `[${validatedData.phone}](tel:+91${cleanPhone})`
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
        message: 'Please fix the errors below',
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
