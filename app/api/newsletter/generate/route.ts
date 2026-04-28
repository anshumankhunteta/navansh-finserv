import { generateNewsletterContent } from '@/lib/newsletter-ai'
import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // 1. Auth check — same pattern as /api/mf/sync
  if (!process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: 'Cron secret is not configured on the server' },
      { status: 503 }
    )
  }

  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const t0 = Date.now()
  const supabase = createServiceClient()

  try {
    // 2. Check if there's already a draft from this week (prevent duplicates)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data: existingDraft } = await supabase
      .from('newsletter_issues')
      .select('id, status')
      .eq('status', 'draft')
      .gte('created_at', weekAgo)
      .limit(1)

    if (existingDraft && existingDraft.length > 0) {
      return NextResponse.json({
        skipped: true,
        message: 'A draft already exists for this week',
        draft_id: existingDraft[0].id,
        duration_ms: Date.now() - t0,
      })
    }

    // 3. Check for admin feedback (for re-generation after rejection)
    let adminFeedback: string | undefined
    try {
      const body = await request.json()
      adminFeedback = body?.admin_feedback
    } catch {
      // No body or invalid JSON — that's fine for cron triggers
    }

    // 4. Generate content via Gemini
    const content = await generateNewsletterContent(adminFeedback)

    // 5. Save as draft
    const { data: issue, error: insertError } = await supabase
      .from('newsletter_issues')
      .insert({
        subject: content.subject,
        content_json: content,
        status: 'draft',
        admin_feedback: adminFeedback || null,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('[newsletter/generate] Insert error:', insertError.message)
      return NextResponse.json(
        { error: 'Failed to save draft', detail: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      draft_id: issue.id,
      subject: content.subject,
      duration_ms: Date.now() - t0,
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('[newsletter/generate] Error:', errMsg)
    return NextResponse.json(
      { error: 'Generation failed', detail: errMsg },
      { status: 500 }
    )
  }
}
