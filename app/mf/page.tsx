import { createPublicClient } from '@/lib/supabase/server'
import { MFScreener } from '@/components/custom/MFScreener/MFScreener'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mutual Fund Screener',
  description:
    'Screen and compare mutual funds across categories, AMCs, and performance metrics. Filter by returns, risk, and more.',
}

const ITEMS_PER_PAGE = 50

type ValidSortColumn =
  | 'scheme_name'
  | 'return_1y'
  | 'return_3y'
  | 'return_5y'
  | 'latest_nav'

interface PageSearchParams {
  category?: string
  amc?: string
  sort?: string
  q?: string
  page?: string
}

function parseSortParam(sort?: string): {
  column: ValidSortColumn
  ascending: boolean
} {
  if (!sort) return { column: 'return_1y', ascending: false }

  const validColumns: ValidSortColumn[] = [
    'scheme_name',
    'return_1y',
    'return_3y',
    'return_5y',
    'latest_nav',
  ]

  const match = sort.match(/^(\w+)_(asc|desc)$/)
  if (!match) return { column: 'return_1y', ascending: false }

  // Map legacy 'nav' sort key to 'latest_nav'
  let col = match[1] as string
  if (col === 'nav') col = 'latest_nav'

  if (!validColumns.includes(col as ValidSortColumn))
    return { column: 'return_1y', ascending: false }

  return { column: col as ValidSortColumn, ascending: match[2] === 'asc' }
}

export default async function MutualFundsPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>
}) {
  const params = await searchParams
  const supabase = createPublicClient()

  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1)
  const { column: sortColumn, ascending: sortAsc } = parseSortParam(params.sort)

  // Build main schemes query — latest_nav is now a column on mf_schemes,
  // so no separate mf_nav join required.
  let query = supabase.from('mf_schemes').select('*', { count: 'exact' })

  // Category filter
  if (params.category && params.category !== 'all') {
    query = query.ilike('scheme_category', `%${params.category}%`)
  }

  // AMC / fund house filter (comma-separated)
  if (params.amc) {
    const amcList = params.amc
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean)
    if (amcList.length > 0) {
      query = query.in('fund_house', amcList)
    }
  }

  // Search query
  if (params.q) {
    query = query.ilike('scheme_name', `%${params.q}%`)
  }

  // Sorting — put nulls last
  query = query.order(sortColumn, {
    ascending: sortAsc,
    nullsFirst: false,
  })

  // Pagination
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1
  query = query.range(from, to)

  // ── Run BOTH queries in parallel ───────────────────────────────
  const [schemesResult, amcResult] = await Promise.all([
    query,
    supabase
      .from('mf_schemes')
      .select('fund_house')
      .not('fund_house', 'is', null)
      .order('fund_house', { ascending: true }),
  ])

  const { data: schemes, count } = schemesResult

  // De-duplicate AMCs in-memory
  const uniqueAmcs = [
    ...new Set(
      (amcResult.data ?? []).map((r) => r.fund_house as string).filter(Boolean)
    ),
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Mutual Fund Finder
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Explore and compare mutual funds across categories, AMCs, and
          performance.
        </p>
      </div>

      <MFScreener
        initialData={schemes ?? []}
        totalCount={count ?? 0}
        currentFilters={{
          category: params.category ?? 'all',
          amc: params.amc ?? '',
          sort: params.sort ?? 'return_1y_desc',
          q: params.q ?? '',
          page,
        }}
        availableAmcs={uniqueAmcs}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </section>
  )
}
