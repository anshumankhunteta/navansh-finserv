/**
 * Mutual Fund Screener — Backfill Full NAV History & Calculate Returns
 *
 * For each scheme in mf_schemes, fetches the COMPLETE NAV history from
 * api.mfapi.in/mf/{schemeCode}, stores ALL data points into mf_nav,
 * then calculates CAGR returns and updates mf_schemes.
 *
 * Storage estimate per 500 schemes:
 *   ~1.5M rows × ~40 bytes/row ≈ 60 MB raw + ~30–60 MB indexes ≈ 90–120 MB
 *
 * Usage:  npm run backfill:returns   (or  npx tsx scripts/backfill-returns.ts)
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

// ---- Types --------------------------------------------------------

interface MFApiNavDataPoint {
  date: string // DD-MM-YYYY
  nav: string // string number
}

interface MFApiFullResponse {
  meta: {
    fund_house: string
    scheme_type: string
    scheme_category: string
    scheme_code: number
    scheme_name: string
    isin_growth: string
  }
  data: MFApiNavDataPoint[]
  status: string
}

interface NavRow {
  scheme_code: number
  nav_date: string
  nav: number
}

// ---- Config -------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_KEY || !SUPABASE_URL) {
  console.error(
    '❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const API_BASE = 'https://api.mfapi.in/mf'
const FETCH_CONCURRENCY = 5 // conservative — full-history responses are 100KB–2MB each
const UPSERT_BATCH = 500 // Supabase row limit per upsert
const MAX_RETRIES = 3
const LOG_INTERVAL = 50
const MS_PER_DAY = 86_400_000
const DATE_TOLERANCE_DAYS = 5

// ---- Helpers -------------------------------------------------------

function parseDateToISO(ddmmyyyy: string): string | null {
  const parts = ddmmyyyy.split('-')
  if (parts.length !== 3) return null
  const [dd, mm, yyyy] = parts
  return `${yyyy}-${mm}-${dd}`
}

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
      await new Promise((r) => setTimeout(r, 2000 * Math.pow(2, attempt - 1)))
    }
  }
  return null
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

/**
 * Parse ALL NAV data points from the API response into NavRows.
 * Skips any rows with unparseable dates or NaN nav values.
 */
function parseAllNavPoints(
  schemeCode: number,
  data: MFApiNavDataPoint[]
): NavRow[] {
  const rows: NavRow[] = []
  for (const d of data) {
    const iso = parseDateToISO(d.date)
    const nav = parseFloat(d.nav)
    if (iso && !isNaN(nav) && nav > 0) {
      rows.push({ scheme_code: schemeCode, nav_date: iso, nav })
    }
  }
  return rows
}

/**
 * Calculate CAGR returns from a set of NAV rows.
 * Expects the full history — sorts internally.
 * CAGR = ((endNAV / startNAV) ^ (1 / years) - 1) * 100
 */
function calcReturns(navRows: NavRow[]): {
  return_1y: number | null
  return_3y: number | null
  return_5y: number | null
} {
  if (navRows.length === 0) {
    return { return_1y: null, return_3y: null, return_5y: null }
  }

  // Sort descending by date
  const sorted = [...navRows].sort(
    (a, b) => new Date(b.nav_date).getTime() - new Date(a.nav_date).getTime()
  )

  const latest = sorted[0]
  const latestDate = new Date(latest.nav_date)
  const toleranceMs = DATE_TOLERANCE_DAYS * MS_PER_DAY

  function findOldNav(yearsAgo: number): number | null {
    const target = new Date(latestDate)
    target.setFullYear(target.getFullYear() - yearsAgo)
    const targetMs = target.getTime()

    let closest: NavRow | null = null
    let closestDiff = Infinity

    for (const row of sorted) {
      const rowMs = new Date(row.nav_date).getTime()
      const diff = Math.abs(rowMs - targetMs)
      if (diff <= toleranceMs && diff < closestDiff) {
        closest = row
        closestDiff = diff
      }
      if (rowMs < targetMs - toleranceMs) break
    }
    return closest ? closest.nav : null
  }

  function cagr(oldNav: number | null, years: number): number | null {
    if (oldNav === null || oldNav <= 0 || latest.nav <= 0) return null
    return +((Math.pow(latest.nav / oldNav, 1 / years) - 1) * 100).toFixed(2)
  }

  return {
    return_1y: cagr(findOldNav(1), 1),
    return_3y: cagr(findOldNav(3), 3),
    return_5y: cagr(findOldNav(5), 5),
  }
}

/**
 * Upsert NAV rows in batches (Supabase has a per-request row limit).
 * Returns the total number of successfully upserted rows.
 */
async function upsertNavBatched(rows: NavRow[]): Promise<number> {
  let upserted = 0
  const batches = chunk(rows, UPSERT_BATCH)

  for (const batch of batches) {
    const { error } = await supabase.from('mf_nav').upsert(batch, {
      onConflict: 'scheme_code,nav_date',
      ignoreDuplicates: true, // skip existing rows — idempotent re-runs
    })
    if (error) {
      console.error(`   ❌ NAV upsert error: ${error.message}`)
    } else {
      upserted += batch.length
    }
  }

  return upserted
}

// ---- Main ---------------------------------------------------------

async function main() {
  const t0 = Date.now()
  console.log('🚀  Starting full NAV history backfill…\n')

  // 1. Load all scheme codes from mf_schemes
  const { data: schemes, error: schemeErr } = await supabase
    .from('mf_schemes')
    .select('scheme_code')

  if (schemeErr || !schemes || schemes.length === 0) {
    console.error('❌  Could not load schemes:', schemeErr?.message)
    process.exit(1)
  }
  console.log(`   → ${schemes.length} schemes to backfill\n`)

  // 2. Process in small concurrent batches
  const fetchBatches = chunk(schemes, FETCH_CONCURRENCY)
  let processed = 0
  let totalNavRows = 0
  let returnsCalculated = 0
  let fetchErrors = 0

  for (const batch of fetchBatches) {
    // Fetch full history for each scheme in this batch concurrently
    const results = await Promise.allSettled(
      batch.map((s) =>
        fetchWithRetry<MFApiFullResponse>(`${API_BASE}/${s.scheme_code}`)
      )
    )

    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      const schemeCode = batch[i].scheme_code

      if (result.status === 'rejected' || !result.value) {
        fetchErrors++
        continue
      }

      const data = result.value
      if (data.status !== 'SUCCESS' || !data.data?.length) {
        fetchErrors++
        continue
      }

      // Parse ALL NAV data points
      const navRows = parseAllNavPoints(schemeCode, data.data)

      // Upsert all rows in batches
      const upserted = await upsertNavBatched(navRows)
      totalNavRows += upserted

      // Calculate CAGR returns from the full dataset
      const returns = calcReturns(navRows)

      // Update mf_schemes with returns
      const { error: updateErr } = await supabase
        .from('mf_schemes')
        .update({
          return_1y: returns.return_1y,
          return_3y: returns.return_3y,
          return_5y: returns.return_5y,
          updated_at: new Date().toISOString(),
        })
        .eq('scheme_code', schemeCode)

      if (updateErr) {
        console.error(
          `   ❌ Returns update error (${schemeCode}):`,
          updateErr.message
        )
      } else if (returns.return_1y !== null) {
        returnsCalculated++
      }
    }

    processed += batch.length
    if (processed % LOG_INTERVAL === 0 || processed === schemes.length) {
      const pct = ((processed / schemes.length) * 100).toFixed(0)
      console.log(
        `   → ${processed} / ${schemes.length} schemes (${pct}%) — ${totalNavRows.toLocaleString()} NAV rows stored`
      )
    }
  }

  // 3. Summary
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
  const estSizeMB = ((totalNavRows * 40) / 1_048_576).toFixed(1)
  console.log(`
✅  Backfill complete in ${elapsed}s
   NAV rows stored:    ${totalNavRows.toLocaleString()} (~${estSizeMB} MB estimated)
   Returns calculated: ${returnsCalculated}
   Fetch errors:       ${fetchErrors}
`)
}

main().catch((err) => {
  console.error('💥  Unhandled error:', err)
  process.exit(1)
})
