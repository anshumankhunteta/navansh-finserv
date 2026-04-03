/**
 * Mutual Fund Screener — Backfill Full NAV History & Calculate Returns
 *
 * For each scheme in mf_schemes, fetches the COMPLETE NAV history from
 * api.mfapi.in/mf/{schemeCode}, calculates CAGR returns from the full dataset,
 * then stores a DOWNSAMPLED set of ≤ MAX_STORED_POINTS data points per scheme.
 *
 * Downsampling strategy (recent data gets higher density):
 *   • Last RECENT_YEARS_DAILY years  → keep every trading day
 *   • Older than that                → keep the last point per calendar month
 *   • Safety trim                   → if monthly + daily still > MAX_STORED_POINTS,
 *                                      thin the monthly portion proportionally
 *
 * Why downsampling?
 *   Supabase's PostgREST anon key enforces a 1000-row default limit on SELECT
 *   queries. Storing > 1000 rows per scheme means the history API route silently
 *   returns truncated data (oldest 1000 rows), hiding recent NAVs from the chart.
 *   By storing ≤ MAX_STORED_POINTS we stay within the limit for any single scheme.
 *
 * Storage estimate post-downsampling (500 schemes × ≤1000 rows):
 *   ≤500K rows × ~40 bytes/row ≈ 20 MB raw — well within Supabase Free tier.
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
  nav_date: string // ISO YYYY-MM-DD
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
const INSERT_BATCH = 500 // Supabase row limit per request
const MAX_RETRIES = 3
const LOG_INTERVAL = 50
const MS_PER_DAY = 86_400_000
const DATE_TOLERANCE_DAYS = 5

// Dead-fund config
const STALE_MONTHS = 6 // funds with no NAV newer than this are pruned

// Downsampling config
const MAX_STORED_POINTS = 1000 // hard cap per scheme — keeps us under PostgREST row limit
const RECENT_YEARS_DAILY = 2 // last N years: keep every trading day

// ---- Helpers -------------------------------------------------------

function parseDateToISO(ddmmyyyy: string): string | null {
  const parts = ddmmyyyy.split('-')
  if (parts.length !== 3) return null
  const [dd, mm, yyyy] = parts
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Returns true if the scheme's latest NAV date (DD-MM-YYYY) is older
 * than STALE_MONTHS from today.
 */
function isSchemeStale(latestDateDDMMYYYY: string): boolean {
  const iso = parseDateToISO(latestDateDDMMYYYY)
  if (!iso) return true
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - STALE_MONTHS)
  return new Date(iso) < cutoff
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
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      console.error(
        `   ⚠ Attempt ${attempt}/${retries} failed for ${url}: ${errMsg}`
      )
      if (attempt === retries) {
        console.error(`   ❌ Giving up on ${url} after ${retries} attempts`)
        return null
      }
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
 * Parse ALL NAV data points from the API response into NavRows (ascending by date).
 * Skips rows with unparseable dates or non-positive nav values.
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
  // API returns newest-first; sort ascending for downsampler
  return rows.sort((a, b) => a.nav_date.localeCompare(b.nav_date))
}

/**
 * Downsample NAV rows to ≤ MAX_STORED_POINTS while preserving recent density.
 *
 * Strategy:
 *   1. Keep ALL rows from the last RECENT_YEARS_DAILY years (daily resolution)
 *   2. For older rows: keep the last row of each calendar month (monthly resolution)
 *   3. If the result is still > MAX_STORED_POINTS, thin the monthly portion by
 *      selecting every Nth month to fit the remaining budget
 *
 * The first and last rows are always preserved (inception + latest NAV).
 * Input MUST be sorted ascending by nav_date.
 */
function downsampleNavPoints(rows: NavRow[]): NavRow[] {
  if (rows.length <= MAX_STORED_POINTS) return rows

  const cutoff = new Date()
  cutoff.setFullYear(cutoff.getFullYear() - RECENT_YEARS_DAILY)
  const cutoffStr = cutoff.toISOString().slice(0, 10) // YYYY-MM-DD

  const recentRows = rows.filter((r) => r.nav_date >= cutoffStr)
  const olderRows = rows.filter((r) => r.nav_date < cutoffStr)

  // Monthly sampling from older rows: keep the LAST point in each calendar month
  const monthMap = new Map<string, NavRow>()
  for (const row of olderRows) {
    const monthKey = row.nav_date.slice(0, 7) // "YYYY-MM"
    monthMap.set(monthKey, row) // later (ascending) row overwrites → last of month
  }
  let monthlySampled = [...monthMap.values()] // already ordered by insertion (ascending)

  let combined = [...monthlySampled, ...recentRows]

  // Safety trim: if we're still over budget, thin the monthly portion
  if (combined.length > MAX_STORED_POINTS) {
    const olderBudget = MAX_STORED_POINTS - recentRows.length
    if (olderBudget <= 0) {
      // Extreme case: recent data alone already fills the budget
      // Keep evenly spaced subset of recent rows
      const step = Math.ceil(recentRows.length / MAX_STORED_POINTS)
      return recentRows.filter((_, i) => i % step === 0)
    }
    const step = Math.ceil(monthlySampled.length / olderBudget)
    monthlySampled = monthlySampled.filter((_, i) => i % step === 0)
    combined = [...monthlySampled, ...recentRows]
  }

  // Always include the very first row (inception)
  if (
    rows.length > 0 &&
    combined.length > 0 &&
    combined[0].nav_date !== rows[0].nav_date
  ) {
    combined = [rows[0], ...combined]
  }

  return combined
}

/**
 * Calculate CAGR returns from a set of NAV rows.
 * Call this on the FULL (pre-downsampled) dataset for accuracy.
 * CAGR = ((endNAV / startNAV) ^ (1 / years) - 1) × 100
 */
function calcReturns(navRows: NavRow[]): {
  return_1y: number | null
  return_3y: number | null
  return_5y: number | null
} {
  if (navRows.length === 0) {
    return { return_1y: null, return_3y: null, return_5y: null }
  }

  // Sort descending — latest first
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
 * Replace all mf_nav rows for a scheme with the given (downsampled) rows.
 * Uses DELETE + INSERT (not upsert) so stale rows from previous runs are removed.
 * Returns the number of rows successfully inserted.
 */
async function replaceNavRows(
  schemeCode: number,
  rows: NavRow[]
): Promise<number> {
  // 1. Delete all existing rows for this scheme
  const { error: delErr } = await supabase
    .from('mf_nav')
    .delete()
    .eq('scheme_code', schemeCode)

  if (delErr) {
    console.error(
      `   ❌ Delete error for scheme ${schemeCode}: ${delErr.message}`
    )
    return 0
  }

  // 2. Insert the new (downsampled) rows in batches
  let inserted = 0
  for (const batch of chunk(rows, INSERT_BATCH)) {
    const { error: insErr } = await supabase.from('mf_nav').insert(batch)
    if (insErr) {
      console.error(
        `   ❌ Insert error for scheme ${schemeCode}: ${insErr.message}`
      )
    } else {
      inserted += batch.length
    }
  }
  return inserted
}

// ---- Main ---------------------------------------------------------

async function main() {
  const t0 = Date.now()
  console.log('🚀  Starting full NAV history backfill (with downsampling)…\n')
  console.log(
    `   Config: max ${MAX_STORED_POINTS} pts/scheme | daily last ${RECENT_YEARS_DAILY}y | monthly before that\n`
  )

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
  let pruned = 0
  let totalRaw = 0 // total data points downloaded
  let totalStored = 0 // total after downsampling

  for (const batch of fetchBatches) {
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

      // Prune dead funds — latest NAV date is first in the response
      if (isSchemeStale(data.data[0].date)) {
        const { error: delNavErr } = await supabase
          .from('mf_nav')
          .delete()
          .eq('scheme_code', schemeCode)
        const { error: delSchemeErr } = await supabase
          .from('mf_schemes')
          .delete()
          .eq('scheme_code', schemeCode)
        if (delNavErr)
          console.error(
            `   ⚠ Failed to delete NAV rows for stale scheme ${schemeCode}:`,
            delNavErr.message
          )
        if (delSchemeErr)
          console.error(
            `   ⚠ Failed to delete stale scheme ${schemeCode}:`,
            delSchemeErr.message
          )
        else
          console.log(
            `   🗑  Pruned dead fund ${schemeCode} (latest NAV: ${data.data[0].date})`
          )
        pruned++
        continue
      }

      // Parse the full history (sorted ascending)
      const fullNavRows = parseAllNavPoints(schemeCode, data.data)
      totalRaw += fullNavRows.length

      // ── Step 1: Calculate returns from the FULL dataset ──────────
      const returns = calcReturns(fullNavRows)

      // ── Step 2: Downsample to ≤ MAX_STORED_POINTS ───────────────
      const sampledRows = downsampleNavPoints(fullNavRows)
      totalStored += sampledRows.length

      // ── Step 3: Replace stored rows (delete + insert) ────────────
      const inserted = await replaceNavRows(schemeCode, sampledRows)
      totalNavRows += inserted

      // ── Step 4: Update CAGR returns + latest_nav on mf_schemes ───
      const latestNavValue =
        fullNavRows.length > 0 ? fullNavRows[fullNavRows.length - 1].nav : null

      const { error: updateErr } = await supabase
        .from('mf_schemes')
        .update({
          return_1y: returns.return_1y,
          return_3y: returns.return_3y,
          return_5y: returns.return_5y,
          latest_nav: latestNavValue,
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
        `   → ${processed} / ${schemes.length} schemes (${pct}%) — ` +
          `${totalNavRows.toLocaleString()} rows stored`
      )
    }
  }

  // 3. Summary
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
  const estSizeMB = ((totalNavRows * 40) / 1_048_576).toFixed(1)
  const compressionPct =
    totalRaw > 0 ? ((1 - totalStored / totalRaw) * 100).toFixed(0) : '0'

  console.log(`
✅  Backfill complete in ${elapsed}s
   Schemes processed:  ${processed - pruned - fetchErrors}
   Raw data points:    ${totalRaw.toLocaleString()}
   Stored (sampled):   ${totalNavRows.toLocaleString()} (~${estSizeMB} MB, ${compressionPct}% reduction)
   Returns calculated: ${returnsCalculated}
   Dead funds pruned:  ${pruned}
   Fetch errors:       ${fetchErrors}
`)
}

main().catch((err) => {
  console.error('💥  Unhandled error:', err)
  process.exit(1)
})
