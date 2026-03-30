import { NextResponse } from 'next/server'
import { createPublicClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ schemeCode: string }> }
) {
  const { schemeCode } = await params
  const code = parseInt(schemeCode, 10)

  if (isNaN(code)) {
    return NextResponse.json({ error: 'Invalid scheme code' }, { status: 400 })
  }

  const supabase = createPublicClient()

  // Fetch scheme meta
  const { data: meta, error: metaErr } = await supabase
    .from('mf_schemes')
    .select('*')
    .eq('scheme_code', code)
    .single()

  if (metaErr || !meta) {
    return NextResponse.json({ error: 'Scheme not found' }, { status: 404 })
  }

  // Fetch full NAV history, ascending by date
  const { data: history, error: historyErr } = await supabase
    .from('mf_nav')
    .select('scheme_code, nav_date, nav')
    .eq('scheme_code', code)
    .order('nav_date', { ascending: true })

  if (historyErr) {
    console.error('[mf/history] Failed to fetch NAV history:', historyErr)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }

  return NextResponse.json({ meta, history: history ?? [] })
}
