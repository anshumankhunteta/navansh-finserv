import { TABLE_ROW_HEIGHT, TABLE_VISIBLE_ROWS } from '@/lib/mf-utils'

export default function MutualFundsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      {/* Header skeleton — matches h1 text-3xl sm:text-4xl + p mt-2 text-sm md:text-base */}
      <div className="mb-8">
        <div className="bg-muted h-9 w-72 animate-pulse rounded-lg sm:h-10" />
        <div className="bg-muted mt-2 h-5 w-96 animate-pulse rounded-md md:h-6" />
      </div>

      {/* Search + count row — matches SearchBar (py-2.5 + text-sm + border = 42px) + count (text-sm = 20px) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="bg-muted h-[42px] w-full max-w-md animate-pulse rounded-lg" />
        <div className="bg-muted h-5 w-32 animate-pulse rounded-md" />
      </div>

      {/* Desktop filter panel — matches FilterPanel desktop div exactly */}
      <div className="border-border bg-card/50 mt-6 hidden space-y-4 rounded-xl border p-4 backdrop-blur-sm md:block">
        {/* Category label + pills */}
        <div>
          <div className="bg-muted mb-2 h-4 w-20 animate-pulse rounded" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-muted h-8 w-20 animate-pulse rounded-full"
              />
            ))}
          </div>
        </div>
        {/* AMC label + dropdown trigger (py-2 + text-sm + border = 38px) */}
        <div>
          <div className="bg-muted mb-2 h-4 w-32 animate-pulse rounded" />
          <div className="bg-muted h-[38px] w-full animate-pulse rounded-lg" />
        </div>
      </div>

      {/* Mobile filter button — matches Button variant="outline" size="sm" gap-2 (h-9 = 36px) */}
      <div className="mt-6 md:hidden">
        <div className="bg-muted h-9 w-24 animate-pulse rounded-md" />
      </div>

      {/* Table card — matches border-border bg-card overflow-hidden rounded-xl border shadow-sm */}
      <div className="border-border bg-card mt-6 overflow-hidden rounded-xl border shadow-sm">
        {/* Sort header — exact copy of SortControls wrapper: border-b px-4 py-3 */}
        <div className="border-border bg-muted/30 flex items-center gap-4 border-b px-4 py-3">
          <div className="bg-muted h-4 min-w-[200px] flex-1 animate-pulse rounded" />
          <div className="bg-muted hidden h-4 w-24 animate-pulse rounded md:block" />
          <div className="bg-muted hidden h-4 w-24 animate-pulse rounded md:block" />
          <div className="bg-muted hidden h-4 w-24 animate-pulse rounded md:block" />
          <div className="bg-muted h-4 w-24 animate-pulse rounded" />
        </div>

        {/* Rows — h-[56px] matches ROW_HEIGHT = 56 */}
        {Array.from({ length: TABLE_VISIBLE_ROWS }, (_, i) => (
          <div
            key={i}
            className="border-border flex w-full items-center gap-4 border-b px-4"
            style={{ height: `${TABLE_ROW_HEIGHT}px` }}
          >
            <div className="flex min-w-[200px] flex-1 flex-col gap-2">
              <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
              <div className="bg-muted h-3 w-1/3 animate-pulse rounded" />
            </div>
            <div className="bg-muted hidden h-4 w-16 animate-pulse rounded md:block" />
            <div className="bg-muted hidden h-4 w-16 animate-pulse rounded md:block" />
            <div className="bg-muted hidden h-4 w-16 animate-pulse rounded md:block" />
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
          </div>
        ))}
      </div>

      {/* Pagination skeleton — inside space-y-6 so effective gap = 24px (mt-6) */}
      {/* Button heights: py-1.5+text-sm+border = 34px mobile, py-2+text-sm+border = 38px sm+ */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {/* Prev button */}
        <div className="bg-muted border-border h-[34px] w-16 animate-pulse rounded-lg border sm:h-[38px] sm:w-24" />

        {/* Desktop page pills (min-w-[36px] py-2 text-sm border = 38px) */}
        <div className="hidden items-center gap-1.5 sm:flex">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className="bg-muted border-border h-[38px] w-9 animate-pulse rounded-lg border"
            />
          ))}
        </div>

        {/* Mobile page pills (min-w-[28px] py-1.5 text-sm border = 34px) */}
        <div className="flex items-center gap-1 sm:hidden">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="bg-muted border-border h-[34px] w-7 animate-pulse rounded-lg border"
            />
          ))}
        </div>

        {/* Next button */}
        <div className="bg-muted border-border h-[34px] w-14 animate-pulse rounded-lg border sm:h-[38px] sm:w-16" />
      </div>
    </section>
  )
}
