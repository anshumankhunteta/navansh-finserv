'use server'

import { subscribeSchema } from '@/lib/subscribe-schema'
import { createServiceClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { z } from 'zod'

// ---- Helpers --------------------------------------------------------

async function getClientIP(): Promise<string> {
  const headersList = await headers()

  const vercelForwardedFor = headersList.get('x-vercel-forwarded-for')
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(',')[0].trim()
  }

  const forwardedFor = headersList.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = headersList.get('x-real-ip')
  if (realIp) return realIp

  return '127.0.0.1'
}

// ---- Types ----------------------------------------------------------

export type SubscribeState = {
  success: boolean
  message: string
}

// ---- Server Action --------------------------------------------------

export async function subscribeAction(
  _prevState: SubscribeState | null,
  formData: FormData
): Promise<SubscribeState> {
  try {
    // 1. Validate
    const rawEmail = formData.get('email') as string
    const { email } = subscribeSchema.parse({ email: rawEmail })

    // 2. Rate limit: max 5 attempts per IP per hour
    const clientIP = await getClientIP()
    const supabase = createServiceClient()

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('rate_limit_log')
      .select('id', { count: 'exact' })
      .eq('client_ip', clientIP)
      .gte('created_at', oneHourAgo)

    if (count !== null && count >= 5) {
      return {
        success: false,
        message: 'Too many attempts. Please try again later.',
      }
    }

    // 3. Upsert subscriber (re-activate if previously unsubscribed)
    const { error: upsertError } = await supabase.from('subscribers').upsert(
      {
        email,
        is_active: true,
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null,
        source: 'hero',
      },
      { onConflict: 'email', ignoreDuplicates: false }
    )

    if (upsertError) {
      console.error('[newsletter/subscribe] Upsert error:', upsertError.message)
      return {
        success: false,
        message: 'Something went wrong. Please try again.',
      }
    }

    // 4. Log to rate_limit_log
    await supabase.from('rate_limit_log').insert([
      {
        client_ip: clientIP,
        fingerprint: `sub-${email.slice(0, 4)}`,
      },
    ])

    return {
      success: true,
      message: "You're in! Watch your inbox for weekly market clarity.",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues[0]?.message ?? 'Invalid email address'
      return { success: false, message: msg }
    }

    console.error('[newsletter/subscribe] Unexpected error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

// ---- Unsubscribe Action ---------------------------------------------

export async function unsubscribeAction(email: string): Promise<boolean> {
  try {
    const supabase = createServiceClient()
    const { error } = await supabase
      .from('subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', email)

    if (error) {
      console.error('[newsletter/unsubscribe] Error:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('[newsletter/unsubscribe] Unexpected error:', error)
    return false
  }
}
