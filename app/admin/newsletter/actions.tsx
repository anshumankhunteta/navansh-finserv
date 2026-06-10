'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { resend, NEWSLETTER_FROM } from '@/lib/resend'
import { render } from 'react-email'
import WeeklyDigest from '@/emails/WeeklyDigest'
import type { NewsletterContent } from '@/lib/newsletter-ai'
import { generateNewsletterContent } from '@/lib/newsletter-ai'

// ---- Types ----------------------------------------------------------

export type IssueRow = {
  id: string
  subject: string
  content_json: NewsletterContent
  content_html: string | null
  admin_feedback: string | null
  created_at: string
  sent_at: string | null
  recipient_count: number
  status: 'draft' | 'approved' | 'sent' | 'failed' | 'rejected'
}

// ---- Actions --------------------------------------------------------

/**
 * Approves a draft issue: renders HTML, batch sends via Resend, and updates status.
 */
export async function approveAndSendIssue(issueId: string): Promise<void> {
  const supabase = createServiceClient()

  // 1. Fetch the issue
  const { data: issue, error: fetchError } = await supabase
    .from('newsletter_issues')
    .select('*')
    .eq('id', issueId)
    .single()

  if (fetchError || !issue) {
    throw new Error('Issue not found or fetch failed')
  }

  if (issue.status !== 'draft') {
    throw new Error(`Cannot approve issue in status: ${issue.status}`)
  }

  // 2. Fetch active subscribers
  const { data: subscribers, error: subError } = await supabase
    .from('subscribers')
    .select('email')
    .eq('is_active', true)

  if (subError) {
    throw new Error('Failed to fetch subscribers')
  }

  const recipientCount = subscribers?.length || 0

  if (recipientCount === 0) {
    throw new Error('No active subscribers to send to')
  }

  // 3. Render React Email to HTML string
  const content = issue.content_json as NewsletterContent
  let html: string
  try {
    // Generate an unsub link that can be processed. For batching, we can use Resend's batch API.
    // In a real prod environment with individual unsub links, we'd loop.
    // For this prototype, we'll send a generic one or use Resend's audience management if applicable.
    // For now, we'll use a placeholder unsub link that works for everyone.
    html = await render(
      <WeeklyDigest
        content={content}
        unsubscribeUrl="https://navansh.in/newsletter/unsubscribe?token=general"
      />
    )
  } catch (error) {
    console.error('Error rendering React Email:', error)
    throw new Error('Failed to render email HTML')
  }

  // 4. Batch Send via Resend (max 100 per batch)
  try {
    const emails = subscribers.map((sub) => sub.email)

    // Batch in chunks of 100
    const chunkSize = 100
    for (let i = 0; i < emails.length; i += chunkSize) {
      const chunk = emails.slice(i, i + chunkSize)

      const { error: sendError } = await resend.emails.send({
        from: NEWSLETTER_FROM,
        to: [], // not used in bcc batching, or we map to multiple objects
        bcc: chunk, // send via BCC to avoid exposing emails
        subject: content.subject,
        html: html,
      })

      if (sendError) {
        throw new Error(`Resend API Error: ${sendError.message}`)
      }
    }

    // 5. Update DB
    await supabase
      .from('newsletter_issues')
      .update({
        status: 'sent',
        content_html: html,
        sent_at: new Date().toISOString(),
        recipient_count: recipientCount,
      })
      .eq('id', issueId)

    revalidatePath('/admin/newsletter')
  } catch (error) {
    // Mark failed
    await supabase
      .from('newsletter_issues')
      .update({
        status: 'failed',
        content_html: html,
      })
      .eq('id', issueId)

    throw error
  }
}

/**
 * Rejects a draft with feedback.
 */
export async function rejectIssue(
  issueId: string,
  feedback: string
): Promise<void> {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('newsletter_issues')
    .update({
      status: 'rejected',
      admin_feedback: feedback || null,
    })
    .eq('id', issueId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/newsletter')
}

/**
 * Regenerates a draft based on previous rejection feedback.
 * Calls Gemini directly instead of going through the cron endpoint.
 */
export async function regenerateIssue(issueId: string): Promise<void> {
  const supabase = createServiceClient()

  // 1. Fetch the rejected issue
  const { data: issue, error: fetchError } = await supabase
    .from('newsletter_issues')
    .select('admin_feedback')
    .eq('id', issueId)
    .single()

  if (fetchError || !issue) {
    throw new Error('Issue not found or fetch failed')
  }

  // 2. Generate new content using the stored feedback
  const content = await generateNewsletterContent(
    issue.admin_feedback || undefined
  )

  // 3. Update the existing issue (or insert new draft, but updating is cleaner)
  const { error: updateError } = await supabase
    .from('newsletter_issues')
    .update({
      subject: content.subject,
      content_json: content as unknown as Record<string, unknown>,
      status: 'draft',
      // keep the feedback so we remember why we regenerated
    })
    .eq('id', issueId)

  if (updateError) {
    throw new Error(`Update failed: ${updateError.message}`)
  }

  revalidatePath('/admin/newsletter')
}
