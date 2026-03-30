/**
 * Mutual Fund Screener — Seed Script (AMC-filtered)
 *
 * Uses the /mf/search?q= endpoint with multiple query variants per AMC
 * to discover schemes, then fetches metadata + latest NAV per scheme.
 *
 * The search API caps results at 15 per query, so we fire multiple
 * queries per fund house (e.g. "HDFC Equity", "HDFC Debt") to
 * maximise coverage, then deduplicate.
 *
 * To add AMCs, extend the FUND_HOUSES config below.
 *
 * Usage:  npm run seed:mf   (or  npx tsx scripts/seed-mf.ts)
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

// ---- Types --------------------------------------------------------

interface MFApiSchemeListItem {
  schemeCode: number
  schemeName: string
}

interface MFApiMeta {
  fund_house: string
  scheme_type: string
  scheme_category: string
  scheme_code: number
  scheme_name: string
  isin_growth: string
}

interface MFApiNavDataPoint {
  date: string
  nav: string
}

interface MFApiLatestResponse {
  meta: MFApiMeta
  data: MFApiNavDataPoint[]
  status: string
}

// ---- Fund House Config ---------------------------------------------
// For each AMC, we provide multiple search suffixes to bypass the 15-
// result cap. The search endpoint matches against scheme names, so
// "HDFC Equity" will find all HDFC equity-themed funds.

interface FundHouseConfig {
  /** Display name */
  name: string
  /** Search queries — each hits /mf/search?q={query} (max 15 results each) */
  queries: string[]
}

const FUND_HOUSES: FundHouseConfig[] = [
  {
    name: 'HDFC Mutual Fund',
    queries: [
      'HDFC Equity',
      'HDFC Debt',
      'HDFC Hybrid',
      'HDFC Liquid',
      'HDFC Index',
      'HDFC Balanced',
      'HDFC Flexi',
      'HDFC Top',
      'HDFC Small',
      'HDFC Mid',
      'HDFC Large',
      'HDFC Multi',
      'HDFC Short',
      'HDFC Ultra',
      'HDFC Corporate',
      'HDFC ELSS',
      'HDFC Nifty',
      'HDFC Gold',
      'HDFC Banking',
      'HDFC Credit',
      'HDFC Dynamic',
      'HDFC Overnight',
      'HDFC Money',
      'HDFC Tax',
      'HDFC Growth',
      'HDFC Dividend',
    ],
  },
  {
    name: 'SBI Mutual Fund',
    queries: [
      'SBI Equity',
      'SBI Debt',
      'SBI Hybrid',
      'SBI Liquid',
      'SBI Index',
      'SBI Balanced',
      'SBI Flexi',
      'SBI Small',
      'SBI Mid',
      'SBI Large',
      'SBI Multi',
      'SBI Short',
      'SBI Ultra',
      'SBI Corporate',
      'SBI ELSS',
      'SBI Nifty',
      'SBI Gold',
      'SBI Banking',
      'SBI Magnum',
      'SBI Contra',
      'SBI Blue',
      'SBI Overnight',
      'SBI Money',
      'SBI Tax',
      'SBI Growth',
      'SBI Dividend',
      'SBI PSU',
      'SBI ETF',
    ],
  },
  {
    name: 'Motilal Oswal Mutual Fund',
    queries: [
      'Motilal Oswal',
      'Motilal Nifty',
      'Motilal Midcap',
      'Motilal Flexi',
      'Motilal Large',
      'Motilal Multi',
      'Motilal NASDAQ',
      'Motilal S&P',
      'Motilal Equity',
      'Motilal Gold',
      'Motilal Liquid',
      'Motilal Ultra',
      'Motilal Overnight',
    ],
  },
]

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
const UPSERT_BATCH = 200
const CONCURRENCY = 10
const MAX_RETRIES = 3
const SEARCH_DELAY_MS = 300 // polite delay between search queries

// ---- Helpers -------------------------------------------------------

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: 'application/json',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as T
}

async function fetchWithRetry<T>(
  url: string,
  retries = MAX_RETRIES
): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetchJson<T>(url)
    } catch (err) {
      if (attempt === retries) {
        console.warn(
          `   ⚠ Failed after ${retries} attempts: ${url} — ${(err as Error).message}`
        )
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

function parseDateToISO(ddmmyyyy: string): string | null {
  const parts = ddmmyyyy.split('-')
  if (parts.length !== 3) return null
  const [dd, mm, yyyy] = parts
  return `${yyyy}-${mm}-${dd}`
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

// ---- Step 1: Discover schemes via search ----------------------------

async function discoverSchemes(): Promise<MFApiSchemeListItem[]> {
  console.log('📥  Discovering schemes via search queries …\n')

  const seen = new Set<number>()
  const all: MFApiSchemeListItem[] = []

  for (const fh of FUND_HOUSES) {
    let amcCount = 0

    for (const q of fh.queries) {
      const url = `${API_BASE}/search?q=${encodeURIComponent(q)}`
      const results = await fetchWithRetry<MFApiSchemeListItem[]>(url)

      if (results) {
        for (const s of results) {
          if (!seen.has(s.schemeCode)) {
            seen.add(s.schemeCode)
            all.push(s)
            amcCount++
          }
        }
      }

      // Polite delay between queries
      await sleep(SEARCH_DELAY_MS)
    }

    console.log(`   → ${fh.name}: ${amcCount} unique schemes`)
  }

  console.log(`\n   → ${all.length} total unique schemes discovered\n`)
  return all
}

// ---- Step 2: Upsert scheme names ------------------------------------

async function upsertSchemeNames(
  schemes: MFApiSchemeListItem[]
): Promise<void> {
  console.log('💾  Upserting scheme names into mf_schemes …')
  const batches = chunk(schemes, UPSERT_BATCH)
  let upserted = 0

  for (const batch of batches) {
    const rows = batch.map((s) => ({
      scheme_code: s.schemeCode,
      scheme_name: s.schemeName,
    }))

    const { error } = await supabase
      .from('mf_schemes')
      .upsert(rows, { onConflict: 'scheme_code', ignoreDuplicates: false })

    if (error) console.error('   ❌ Upsert error:', error.message)
    upserted += batch.length
  }
  console.log(`   → ${upserted} scheme names upserted\n`)
}

// ---- Step 3: Fetch latest NAV + metadata ----------------------------

async function fetchAndUpsertLatestNav(
  schemes: MFApiSchemeListItem[]
): Promise<{ navInserted: number; metaUpdated: number; fetchErrors: number }> {
  console.log('📥  Fetching latest NAV + metadata per scheme …')
  const batches = chunk(schemes, CONCURRENCY)
  let processed = 0
  let navInserted = 0
  let metaUpdated = 0
  let fetchErrors = 0

  for (const batch of batches) {
    const results = await Promise.allSettled(
      batch.map((s) =>
        fetchWithRetry<MFApiLatestResponse>(
          `${API_BASE}/${s.schemeCode}/latest`
        )
      )
    )

    const schemeUpdates: {
      scheme_code: number
      scheme_name: string
      fund_house: string
      scheme_type: string
      scheme_category: string
      isin_growth: string
    }[] = []

    const navRows: {
      scheme_code: number
      nav_date: string
      nav: number
    }[] = []

    for (const result of results) {
      if (result.status === 'rejected') {
        fetchErrors++
        continue
      }
      const data = result.value
      if (!data || data.status !== 'SUCCESS' || !data.data?.length) {
        fetchErrors++
        continue
      }

      const { meta } = data
      schemeUpdates.push({
        scheme_code: meta.scheme_code,
        scheme_name: meta.scheme_name,
        fund_house: meta.fund_house,
        scheme_type: meta.scheme_type,
        scheme_category: meta.scheme_category,
        isin_growth: meta.isin_growth,
      })

      const latestNav = data.data[0]
      const isoDate = parseDateToISO(latestNav.date)
      const navValue = parseFloat(latestNav.nav)

      if (isoDate && !isNaN(navValue)) {
        navRows.push({
          scheme_code: meta.scheme_code,
          nav_date: isoDate,
          nav: navValue,
        })
      }
    }

    if (schemeUpdates.length > 0) {
      const { error } = await supabase
        .from('mf_schemes')
        .upsert(schemeUpdates, {
          onConflict: 'scheme_code',
          ignoreDuplicates: false,
        })
      if (error) console.error('   ❌ Scheme upsert error:', error.message)
      else metaUpdated += schemeUpdates.length
    }

    if (navRows.length > 0) {
      const { error } = await supabase.from('mf_nav').upsert(navRows, {
        onConflict: 'scheme_code,nav_date',
        ignoreDuplicates: false,
      })
      if (error) console.error('   ❌ NAV upsert error:', error.message)
      else navInserted += navRows.length
    }

    processed += batch.length
    if (processed % 50 === 0 || processed === schemes.length) {
      console.log(`   → ${processed} / ${schemes.length} schemes processed`)
    }
  }

  return { navInserted, metaUpdated, fetchErrors }
}

// ---- Main ----------------------------------------------------------

async function main() {
  const t0 = Date.now()
  console.log('🚀  Starting MF seed…\n')

  // 1. Discover schemes from search
  const schemes = await discoverSchemes()
  if (schemes.length === 0) {
    console.error('❌  No schemes found. Aborting.')
    process.exit(1)
  }

  // 2. Upsert scheme names
  await upsertSchemeNames(schemes)

  // 3. Fetch metadata + latest NAV
  const { navInserted, metaUpdated, fetchErrors } =
    await fetchAndUpsertLatestNav(schemes)

  // 4. Summary
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
  const amcNames = FUND_HOUSES.map((fh) => fh.name).join(', ')
  console.log(`
✅  Seed complete in ${elapsed}s
   AMCs:              ${amcNames}
   Schemes seeded:    ${schemes.length}
   Metadata updated:  ${metaUpdated}
   NAV rows inserted: ${navInserted}
   Fetch errors:      ${fetchErrors}
`)
}

main().catch((err) => {
  console.error('💥  Unhandled error:', err)
  process.exit(1)
})
