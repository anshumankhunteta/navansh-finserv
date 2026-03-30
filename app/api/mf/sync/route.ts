import {
  calculateReturns,
  type MFApiLatestResponse,
  parseMfApiDate,
} from '@/lib/mf-utils'
import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ---- Config -------------------------------------------------------

const MF_API_BASE = 'https://api.mfapi.in/mf'
const CONCURRENCY = 20
const MAX_RETRIES = 3

// ---- Helpers ------------------------------------------------------

async function fetchWithRetry<T>(
  url: string,
  retries = MAX_RETRIES
): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Accept: 'application/json',
        },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return (await res.json()) as T
    } catch {
      if (attempt === retries) return null
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt - 1)))
    }
  }
  return null
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

// ---- Route handler ------------------------------------------------

export async function POST(request: Request) {
  // 1. Auth check
  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const t0 = Date.now()
  const supabase = createServiceClient()
  let updated = 0
  let failed = 0

  // 2. Load all scheme codes
  const { data: schemes, error: schemeErr } = await supabase
    .from('mf_schemes')
    .select('scheme_code')

  if (schemeErr || !schemes) {
    return NextResponse.json(
      { error: 'Failed to load schemes', detail: schemeErr?.message },
      { status: 500 }
    )
  }

  // 3. Fetch latest NAV in batches of CONCURRENCY
  const batches = chunk(schemes, CONCURRENCY)

  for (const batch of batches) {
    const results = await Promise.allSettled(
      batch.map((s) =>
        fetchWithRetry<MFApiLatestResponse>(
          `${MF_API_BASE}/${s.scheme_code}/latest`
        )
      )
    )

    const navRows: { scheme_code: number; nav_date: string; nav: number }[] = []
    const metaUpdates: {
      scheme_code: number
      scheme_name: string
      fund_house: string
      scheme_type: string
      scheme_category: string
      isin_growth: string
    }[] = []

    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.status === 'rejected') {
        failed++
        continue
      }
      const data = result.value
      if (!data || data.status !== 'SUCCESS' || !data.data?.length) {
        failed++
        continue
      }

      const { meta } = data

      // Update scheme metadata
      metaUpdates.push({
        scheme_code: meta.scheme_code,
        scheme_name: meta.scheme_name,
        fund_house: meta.fund_house,
        scheme_type: meta.scheme_type,
        scheme_category: meta.scheme_category,
        isin_growth: meta.isin_growth,
      })

      // Collect latest NAV
      const latestNavPoint = data.data[0]
      const isoDate = parseMfApiDate(latestNavPoint.date)
      const navValue = parseFloat(latestNavPoint.nav)

      if (isoDate && !isNaN(navValue)) {
        navRows.push({
          scheme_code: meta.scheme_code,
          nav_date: isoDate,
          nav: navValue,
        })
      }
    }

    // Upsert scheme metadata
    if (metaUpdates.length > 0) {
      await supabase.from('mf_schemes').upsert(metaUpdates, {
        onConflict: 'scheme_code',
        ignoreDuplicates: false,
      })
    }

    // Upsert NAV rows
    if (navRows.length > 0) {
      const { error } = await supabase.from('mf_nav').upsert(navRows, {
        onConflict: 'scheme_code,nav_date',
        ignoreDuplicates: false,
      })
      if (!error) updated += navRows.length
      else failed += navRows.length
    }
  }

  // 4. Recalculate returns for all schemes that have NAV history
  const { data: allSchemeCodes } = await supabase
    .from('mf_schemes')
    .select('scheme_code')

  if (allSchemeCodes) {
    for (const { scheme_code } of allSchemeCodes) {
      // Query NAV history for this single scheme (any order — calculateReturns sorts)
      const { data: navData } = await supabase
        .from('mf_nav')
        .select('scheme_code, nav_date, nav')
        .eq('scheme_code', scheme_code)

      if (!navData || navData.length === 0) continue

      const returns = calculateReturns(navData)

      await supabase
        .from('mf_schemes')
        .update({
          return_1y: returns.return_1y,
          return_3y: returns.return_3y,
          return_5y: returns.return_5y,
          updated_at: new Date().toISOString(),
        })
        .eq('scheme_code', scheme_code)
    }
  }

  // 5. Summary
  const duration_ms = Date.now() - t0
  return NextResponse.json({ updated, failed, duration_ms })
}
