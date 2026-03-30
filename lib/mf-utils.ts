// ============================================================
// Mutual Fund Screener — Shared Types
// ============================================================

/** Row shape for the `mf_schemes` table (+ optional joined fields). */
export interface MFScheme {
  scheme_code: number
  scheme_name: string
  fund_house: string | null
  scheme_type: string | null
  scheme_category: string | null
  isin_growth: string | null
  return_1y: number | null
  return_3y: number | null
  return_5y: number | null
  updated_at: string
  /** Latest NAV — joined from mf_nav, not stored on mf_schemes */
  latest_nav?: number | null
}

/** Row shape for the `mf_nav` table. */
export interface MFNav {
  scheme_code: number
  /** ISO date string (YYYY-MM-DD) */
  nav_date: string
  nav: number
}

// ---- API response shapes (from api.mfapi.in) ----------------

/** Single entry returned from `GET /mf` (scheme list). */
export interface MFApiSchemeListItem {
  schemeCode: number
  schemeName: string
}

/** Meta block returned from `GET /mf/{schemeCode}` or `/latest`. */
export interface MFApiMeta {
  fund_house: string
  scheme_type: string
  scheme_category: string
  scheme_code: number
  scheme_name: string
  isin_growth: string
  isin_div_reinvestment: string
}

/** Single NAV data point from the API. */
export interface MFApiNavDataPoint {
  date: string // DD-MM-YYYY
  nav: string // string number
}

/** Full response from `GET /mf/{schemeCode}/latest`. */
export interface MFApiLatestResponse {
  meta: MFApiMeta
  data: MFApiNavDataPoint[]
  status: string
}

// ---- Return calculation types ------------------------------------

export interface MFReturns {
  return_1y: number | null
  return_3y: number | null
  return_5y: number | null
}

// ---- Helpers -----------------------------------------------------

/**
 * Convert DD-MM-YYYY (mfapi format) → YYYY-MM-DD (ISO / Postgres).
 * Returns null if the input is malformed.
 */
export function parseMfApiDate(ddmmyyyy: string): string | null {
  const parts = ddmmyyyy.split('-')
  if (parts.length !== 3) return null
  const [dd, mm, yyyy] = parts
  return `${yyyy}-${mm}-${dd}`
}

/** Milliseconds in one day. */
const MS_PER_DAY = 86_400_000
/** Maximum tolerance in days when searching for a historical NAV. */
const DATE_TOLERANCE_DAYS = 5

/**
 * Calculate CAGR (Compound Annual Growth Rate) for 1y, 3y, and 5y
 * horizons from a NAV history array.
 *
 * Formula: CAGR = ((endNAV / startNAV) ^ (1 / years) - 1) * 100
 *
 * The input array can be in ANY order — the function sorts internally.
 * If no NAV is found within ±5 calendar days of the target date the
 * corresponding return is returned as `null`.
 */
export function calculateReturns(navHistory: MFNav[]): MFReturns {
  if (navHistory.length === 0) {
    return { return_1y: null, return_3y: null, return_5y: null }
  }

  // Sort ascending by date for binary search
  const sorted = [...navHistory].sort(
    (a, b) => new Date(a.nav_date).getTime() - new Date(b.nav_date).getTime()
  )

  // Pre-compute timestamps for binary search
  const timestamps = sorted.map((r) => new Date(r.nav_date).getTime())
  const latestNav = sorted[sorted.length - 1]
  const latestDate = new Date(latestNav.nav_date)
  const toleranceMs = DATE_TOLERANCE_DAYS * MS_PER_DAY

  /**
   * Binary search for the NAV closest to `targetMs` within tolerance.
   */
  function findClosestNav(yearsAgo: number): number | null {
    const target = new Date(latestDate)
    target.setFullYear(target.getFullYear() - yearsAgo)
    const targetMs = target.getTime()

    // Binary search for insertion point
    let lo = 0
    let hi = timestamps.length - 1

    while (lo <= hi) {
      const mid = (lo + hi) >>> 1
      if (timestamps[mid] < targetMs) lo = mid + 1
      else hi = mid - 1
    }
    // `lo` is now the index of the first timestamp >= targetMs

    // Check the two candidates: lo and lo-1
    let bestIdx = -1
    let bestDiff = Infinity

    for (const idx of [lo - 1, lo]) {
      if (idx < 0 || idx >= timestamps.length) continue
      const diff = Math.abs(timestamps[idx] - targetMs)
      if (diff <= toleranceMs && diff < bestDiff) {
        bestDiff = diff
        bestIdx = idx
      }
    }

    return bestIdx >= 0 ? sorted[bestIdx].nav : null
  }

  function cagr(oldNav: number | null, years: number): number | null {
    if (oldNav === null || oldNav <= 0 || latestNav.nav <= 0) return null
    return +((Math.pow(latestNav.nav / oldNav, 1 / years) - 1) * 100).toFixed(2)
  }

  return {
    return_1y: cagr(findClosestNav(1), 1),
    return_3y: cagr(findClosestNav(3), 3),
    return_5y: cagr(findClosestNav(5), 5),
  }
}
