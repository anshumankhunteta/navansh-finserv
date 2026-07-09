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
 * A local JSON cache is written to scripts/mf-seed-cache.json after every
 * successful run. If Supabase is unreachable, fix the issue and re-run
 * with --from-cache to skip the API fetch phase and upsert directly from
 * the saved file.
 *
 * To add AMCs, extend the FUND_HOUSES config below.
 *
 * Usage:  npm run seed:mf              (full run — discovers + fetches + upserts)
 *         npm run seed:mf -- --from-cache  (upsert from local cache, skip API)
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

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
      // Core equity — open-ended active funds
      'HDFC Equity',
      'HDFC Flexi Cap',
      'HDFC Midcap',
      'HDFC Top',
      'HDFC Small',
      'HDFC Large',
      'HDFC Multi',
      'HDFC Value',
      'HDFC Focused',
      'HDFC Contra',
      // Sector / thematic
      'HDFC Banking',
      'HDFC Infrastructure',
      'HDFC Healthcare',
      'HDFC Technology',
      'HDFC Manufacturing',
      'HDFC Defence',
      'HDFC Consumption',
      // Tax-saving
      'HDFC ELSS',
      'HDFC Tax',
      // Hybrid
      'HDFC Hybrid',
      'HDFC Balanced Advantage',
      'HDFC Balanced',
      'HDFC Arbitrage',
      // Index / ETF / passive
      'HDFC Index',
      'HDFC Nifty',
      'HDFC Sensex',
      'HDFC Gold',
      'HDFC Silver',
      // Debt — open-ended
      'HDFC Debt',
      'HDFC Liquid',
      'HDFC Overnight',
      'HDFC Money',
      'HDFC Ultra',
      'HDFC Short',
      'HDFC Low Duration',
      'HDFC Medium',
      'HDFC Dynamic',
      'HDFC Corporate',
      'HDFC Credit',
      'HDFC Gilt',
      // Solution / lifecycle
      'HDFC Children',
      'HDFC Retirement',
      'HDFC Income',
    ],
  },
  {
    name: 'SBI Mutual Fund',
    queries: [
      // Core equity — open-ended active funds
      'SBI Equity',
      'SBI Flexi',
      'SBI Midcap',
      'SBI Small',
      'SBI Large',
      'SBI Multi',
      'SBI Focused',
      'SBI Contra',
      'SBI Blue',
      // Sector / thematic
      'SBI Banking',
      'SBI Technology',
      'SBI Healthcare',
      'SBI Infrastructure',
      'SBI PSU',
      'SBI Consumption',
      // Tax-saving
      'SBI ELSS',
      'SBI Tax',
      // Hybrid
      'SBI Hybrid',
      'SBI Balanced Advantage',
      'SBI Balanced',
      'SBI Arbitrage',
      'SBI Dynamic',
      // Index / ETF / passive — SBI uses "SBI Nifty" and "SBI ETF" for these
      'SBI Nifty',
      'SBI ETF',
      'SBI Index',
      'SBI Gold',
      'SBI Silver',
      // Debt — open-ended
      'SBI Debt',
      'SBI Liquid',
      'SBI Overnight',
      'SBI Money',
      'SBI Ultra',
      'SBI Short',
      'SBI Low Duration',
      'SBI Medium',
      'SBI Corporate',
      'SBI Credit',
      // Magnum sub-brand (broad SBI debt/equity legacy range)
      'SBI Magnum',
      'SBI Magnum Gilt',
      // Solution / lifecycle
      'SBI Children',
      'SBI Retirement',
      // FoF / global
      'SBI International',
    ],
  },
  {
    name: 'Motilal Oswal Mutual Fund',
    queries: [
      // NOTE: mfapi.in search matches on full scheme names. All Motilal Oswal
      // schemes are named "Motilal Oswal <type>", so queries must use the full
      // "Motilal Oswal" prefix — short forms like "Motilal Nifty" do NOT match.

      // Core equity — active
      'Motilal Oswal Flexi',
      'Motilal Oswal Midcap',
      'Motilal Oswal Large',
      'Motilal Oswal Small',
      'Motilal Oswal Focused',
      'Motilal Oswal Multi',
      'Motilal Oswal Equity',
      'Motilal Oswal Business',
      // Sector / thematic
      'Motilal Oswal Innovation',
      'Motilal Oswal Digital',
      // Tax-saving
      'Motilal Oswal ELSS',
      // Hybrid / balanced
      'Motilal Oswal Balanced',
      'Motilal Oswal Asset Allocation',
      // Index / ETF / passive — use "Motilal Oswal Nifty" or ETF-specific tickers
      'Motilal Oswal Nifty',
      'Motilal Oswal S&P',
      'Motilal Oswal NASDAQ',
      'Motilal Oswal Developed',
      // Debt
      'Motilal Oswal Liquid',
      'Motilal Oswal Ultra',
      'Motilal Oswal Overnight',
      // Commodity
      'Motilal Oswal Gold',
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

// ---- Local cache ---------------------------------------------------
// Written after every successful run so that --from-cache can replay
// the upserts without re-hitting the mfapi.in endpoints.

const CACHE_FILE = path.resolve(process.cwd(), 'scripts/mf-seed-cache.json')

interface SchemeMetadataRow {
  scheme_code: number
  scheme_name: string
  fund_house: string
  scheme_type: string
  scheme_category: string
  isin_growth: string
}

interface NavRow {
  scheme_code: number
  nav_date: string
  nav: number
}

interface SeedCache {
  /** ISO timestamp of when this cache was written */
  createdAt: string
  /** Discovered schemes (schemeCode + schemeName) from Step 1 */
  schemes: MFApiSchemeListItem[]
  /** Enriched scheme metadata fetched in Step 3 */
  schemeMetadata: SchemeMetadataRow[]
  /** Latest NAV rows fetched in Step 3 */
  navRows: NavRow[]
}

function saveCache(data: SeedCache, filePath: string = CACHE_FILE): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    console.log(`💾  Cache saved → ${filePath}\n`)
  } catch (err) {
    console.warn(`   ⚠ Could not write cache: ${(err as Error).message}`)
  }
}

function loadCache(): SeedCache | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8')
    return JSON.parse(raw) as SeedCache
  } catch (err) {
    console.warn(`   ⚠ Could not read cache: ${(err as Error).message}`)
    return null
  }
}

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
    else upserted += batch.length
  }
  console.log(`   → ${upserted} scheme names upserted\n`)
}

// ---- Step 3: Fetch latest NAV + metadata ----------------------------

async function fetchAndUpsertLatestNav(
  schemes: MFApiSchemeListItem[]
): Promise<{
  navInserted: number
  metaUpdated: number
  fetchErrors: number
  allSchemeMetadata: SchemeMetadataRow[]
  allNavRows: NavRow[]
}> {
  console.log('📥  Fetching latest NAV + metadata per scheme …')
  const batches = chunk(schemes, CONCURRENCY)
  let processed = 0
  let navInserted = 0
  let metaUpdated = 0
  let fetchErrors = 0

  // Accumulated across all batches — used to write the full cache at the end
  const allSchemeMetadata: SchemeMetadataRow[] = []
  const allNavRows: NavRow[] = []

  for (const batch of batches) {
    const results = await Promise.allSettled(
      batch.map((s) =>
        fetchWithRetry<MFApiLatestResponse>(
          `${API_BASE}/${s.schemeCode}/latest`
        )
      )
    )

    const schemeUpdates: SchemeMetadataRow[] = []
    const navRows: NavRow[] = []

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
      const metaRow: SchemeMetadataRow = {
        scheme_code: meta.scheme_code,
        scheme_name: meta.scheme_name,
        fund_house: meta.fund_house,
        scheme_type: meta.scheme_type,
        scheme_category: meta.scheme_category,
        isin_growth: meta.isin_growth,
      }
      schemeUpdates.push(metaRow)
      allSchemeMetadata.push(metaRow)

      const latestNav = data.data[0]
      const isoDate = parseDateToISO(latestNav.date)
      const navValue = parseFloat(latestNav.nav)

      if (isoDate && !isNaN(navValue)) {
        const navRow: NavRow = {
          scheme_code: meta.scheme_code,
          nav_date: isoDate,
          nav: navValue,
        }
        navRows.push(navRow)
        allNavRows.push(navRow)
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

  return {
    navInserted,
    metaUpdated,
    fetchErrors,
    allSchemeMetadata,
    allNavRows,
  }
}

// ---- Step 3b (restore path): Upsert directly from cache -------------

async function upsertFromCache(
  cache: SeedCache
): Promise<{ navInserted: number; metaUpdated: number }> {
  console.log(
    `📂  Restoring from cache (created ${new Date(cache.createdAt).toLocaleString()}) …`
  )
  let metaUpdated = 0
  let navInserted = 0

  // Upsert scheme names first
  console.log('💾  Upserting scheme names …')
  for (const batch of chunk(cache.schemes, UPSERT_BATCH)) {
    const rows = batch.map((s) => ({
      scheme_code: s.schemeCode,
      scheme_name: s.schemeName,
    }))
    const { error } = await supabase
      .from('mf_schemes')
      .upsert(rows, { onConflict: 'scheme_code', ignoreDuplicates: false })
    if (error) console.error('   ❌ Upsert error:', error.message)
  }
  console.log(`   → ${cache.schemes.length} scheme names upserted\n`)

  // Upsert enriched metadata
  console.log('💾  Upserting scheme metadata …')
  for (const batch of chunk(cache.schemeMetadata, UPSERT_BATCH)) {
    const { error } = await supabase
      .from('mf_schemes')
      .upsert(batch, { onConflict: 'scheme_code', ignoreDuplicates: false })
    if (error) console.error('   ❌ Metadata upsert error:', error.message)
    else metaUpdated += batch.length
  }
  console.log(`   → ${metaUpdated} scheme metadata rows upserted\n`)

  // Upsert NAV rows
  console.log('💾  Upserting NAV rows …')
  for (const batch of chunk(cache.navRows, UPSERT_BATCH)) {
    const { error } = await supabase.from('mf_nav').upsert(batch, {
      onConflict: 'scheme_code,nav_date',
      ignoreDuplicates: false,
    })
    if (error) console.error('   ❌ NAV upsert error:', error.message)
    else navInserted += batch.length
  }
  console.log(`   → ${navInserted} NAV rows upserted\n`)

  return { navInserted, metaUpdated }
}

// ---- Main ----------------------------------------------------------

async function main() {
  const t0 = Date.now()
  const fromCache = process.argv.includes('--from-cache')

  if (fromCache) {
    // ── Restore mode ─────────────────────────────────────────────────
    console.log(
      '🔄  --from-cache mode: skipping API fetch, restoring from local cache…\n'
    )
    const cache = loadCache()
    if (!cache) {
      console.error(
        `❌  No cache found at ${CACHE_FILE}.\n` +
          '    Run without --from-cache first to generate it.'
      )
      process.exit(1)
    }

    const { navInserted, metaUpdated } = await upsertFromCache(cache)
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
    const amcNames = FUND_HOUSES.map((fh) => fh.name).join(', ')
    console.log(`
✅  Restore complete in ${elapsed}s
   AMCs:              ${amcNames}
   Cache created:     ${new Date(cache.createdAt).toLocaleString()}
   Schemes restored:  ${cache.schemes.length}
   Metadata updated:  ${metaUpdated}
   NAV rows inserted: ${navInserted}
`)
    return
  }

  // ── Normal (full) mode ─────────────────────────────────────────────
  console.log('🚀  Starting MF seed…\n')

  // 1. Discover schemes from search
  const schemes = await discoverSchemes()
  if (schemes.length === 0) {
    console.error('❌  No schemes found. Aborting.')
    process.exit(1)
  }

  // Save a partial cache now to a temporary file so that if Step 3 fails
  // partway, we don't lose the discovery work, but we also don't overwrite
  // the main cache file with empty metadata/navRows arrays.
  const TEMP_CACHE_FILE = CACHE_FILE + '.tmp'
  saveCache(
    {
      createdAt: new Date().toISOString(),
      schemes,
      schemeMetadata: [],
      navRows: [],
    },
    TEMP_CACHE_FILE
  )

  // 2. Upsert scheme names
  await upsertSchemeNames(schemes)

  // 3. Fetch metadata + latest NAV
  const {
    navInserted,
    metaUpdated,
    fetchErrors,
    allSchemeMetadata,
    allNavRows,
  } = await fetchAndUpsertLatestNav(schemes)

  // 4. Overwrite cache with the full dataset (metadata + NAV rows)
  if (allSchemeMetadata.length > 0) {
    saveCache({
      createdAt: new Date().toISOString(),
      schemes,
      schemeMetadata: allSchemeMetadata,
      navRows: allNavRows,
    })

    // Clean up temporary file
    try {
      if (fs.existsSync(TEMP_CACHE_FILE)) {
        fs.unlinkSync(TEMP_CACHE_FILE)
      }
    } catch {
      // ignore unlink error
    }
  } else {
    console.warn(
      '   ⚠ fetchAndUpsertLatestNav returned no metadata. Skipping final cache overwrite to preserve existing cache.'
    )
  }

  // 5. Summary
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1)
  const amcNames = FUND_HOUSES.map((fh) => fh.name).join(', ')
  console.log(`
✅  Seed complete in ${elapsed}s
   AMCs:              ${amcNames}
   Schemes seeded:    ${schemes.length}
   Metadata updated:  ${metaUpdated}
   NAV rows inserted: ${navInserted}
   Fetch errors:      ${fetchErrors}
   Cache written:     ${CACHE_FILE}
`)
}

main().catch((err) => {
  console.error('💥  Unhandled error:', err)
  process.exit(1)
})
