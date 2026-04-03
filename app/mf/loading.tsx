export default function MutualFundsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="bg-muted h-9 w-72 animate-pulse rounded-lg" />
        <div className="bg-muted mt-3 h-5 w-96 animate-pulse rounded-md" />
      </div>

      {/* Search + count row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="bg-muted h-11 w-full max-w-md animate-pulse rounded-lg" />
        <div className="bg-muted h-5 w-32 animate-pulse rounded-md" />
      </div>

      {/* Filter panel skeleton */}
      <div className="border-border bg-card/50 mt-6 hidden space-y-4 rounded-xl border p-4 backdrop-blur-sm md:block">
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
        <div>
          <div className="bg-muted mb-2 h-4 w-32 animate-pulse rounded" />
          <div className="bg-muted h-10 w-full animate-pulse rounded-lg" />
        </div>
      </div>

      {/* Mobile filter button skeleton */}
      <div className="mt-6 md:hidden">
        <div className="bg-muted h-9 w-24 animate-pulse rounded-md" />
      </div>

      {/* Table skeleton */}
      <div className="border-border bg-card mt-6 overflow-hidden rounded-xl border shadow-sm">
        {/* Sort header */}
        <div className="border-border bg-muted/30 flex items-center gap-4 border-b px-4 py-3">
          <div className="bg-muted h-4 min-w-[200px] flex-1 animate-pulse rounded" />
          <div className="bg-muted hidden h-4 w-24 animate-pulse rounded md:block" />
          <div className="bg-muted hidden h-4 w-24 animate-pulse rounded md:block" />
          <div className="bg-muted hidden h-4 w-24 animate-pulse rounded md:block" />
          <div className="bg-muted h-4 w-24 animate-pulse rounded" />
        </div>

        {/* Rows */}
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="border-border flex h-[56px] w-full animate-pulse items-center gap-4 border-b px-4"
          >
            <div className="flex min-w-[200px] flex-1 flex-col gap-2">
              <div className="bg-muted h-4 w-3/4 rounded" />
              <div className="bg-muted h-3 w-1/3 rounded" />
            </div>
            <div className="bg-muted hidden h-4 w-16 rounded md:block" />
            <div className="bg-muted hidden h-4 w-16 rounded md:block" />
            <div className="bg-muted hidden h-4 w-16 rounded md:block" />
            <div className="bg-muted h-4 w-16 rounded" />
          </div>
        ))}
      </div>
    </section>
  )
}
