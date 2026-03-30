import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createPublicClient } from '@/lib/supabase/server'
import type { MFScheme, MFNav } from '@/lib/mf-utils'
import type { Metadata } from 'next'
import { NAVChartWrapper } from './NAVChartWrapper'
import { ArrowLeft } from 'lucide-react'

interface PageParams {
  schemeCode: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const { schemeCode } = await params
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('mf_schemes')
    .select('scheme_name, fund_house')
    .eq('scheme_code', parseInt(schemeCode, 10))
    .single()

  return {
    title: data?.scheme_name ?? 'Mutual Fund Details',
    description: data
      ? `NAV chart, returns, and details for ${data.scheme_name} by ${data.fund_house}`
      : 'Mutual fund scheme details and performance',
  }
}

function formatReturn(value: number | null): {
  text: string
  color: string
} {
  if (value === null) return { text: '—', color: 'text-muted-foreground' }
  const sign = value >= 0 ? '+' : ''
  return {
    text: `${sign}${value.toFixed(2)}%`,
    color: value >= 0 ? 'text-emerald-500' : 'text-red-500',
  }
}

export default async function SchemeDetailPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { schemeCode } = await params
  const code = parseInt(schemeCode, 10)
  if (isNaN(code)) notFound()

  const supabase = createPublicClient()

  const { data: scheme, error } = await supabase
    .from('mf_schemes')
    .select('*')
    .eq('scheme_code', code)
    .single()

  if (error || !scheme) notFound()

  const typedScheme = scheme as MFScheme

  // Fetch full NAV history
  const { data: history } = await supabase
    .from('mf_nav')
    .select('scheme_code, nav_date, nav')
    .eq('scheme_code', code)
    .order('nav_date', { ascending: true })

  const navHistory = (history ?? []) as MFNav[]
  const latestNav =
    navHistory.length > 0 ? navHistory[navHistory.length - 1].nav : null

  const r1y = formatReturn(typedScheme.return_1y)
  const r3y = formatReturn(typedScheme.return_3y)
  const r5y = formatReturn(typedScheme.return_5y)

  return (
    <section className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/mf"
        className="text-muted-foreground hover:text-primary mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        All funds
      </Link>

      {/* Scheme header */}
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          {typedScheme.scheme_name}
        </h1>
        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-3 text-sm">
          {typedScheme.fund_house && <span>{typedScheme.fund_house}</span>}
          {typedScheme.scheme_category && (
            <>
              <span className="text-border">•</span>
              <span>{typedScheme.scheme_category}</span>
            </>
          )}
          {typedScheme.scheme_type && (
            <>
              <span className="text-border">•</span>
              <span>{typedScheme.scheme_type}</span>
            </>
          )}
        </div>
        {typedScheme.isin_growth && (
          <p className="text-muted-foreground mt-1 text-xs">
            ISIN: {typedScheme.isin_growth}
          </p>
        )}
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Latest NAV */}
        <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Latest NAV
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold">
            {latestNav !== null ? `₹${latestNav.toFixed(4)}` : '—'}
          </p>
        </div>

        {/* 1Y CAGR */}
        <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            1Y CAGR
          </p>
          <p className={`mt-1 text-2xl font-bold ${r1y.color}`}>{r1y.text}</p>
        </div>

        {/* 3Y CAGR */}
        <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            3Y CAGR
          </p>
          <p className={`mt-1 text-2xl font-bold ${r3y.color}`}>{r3y.text}</p>
        </div>

        {/* 5Y CAGR */}
        <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            5Y CAGR
          </p>
          <p className={`mt-1 text-2xl font-bold ${r5y.color}`}>{r5y.text}</p>
        </div>
      </div>

      {/* NAV Chart */}
      <div className="border-border bg-card rounded-xl border shadow-sm">
        <NAVChartWrapper scheme={typedScheme} history={navHistory} />
      </div>
    </section>
  )
}
