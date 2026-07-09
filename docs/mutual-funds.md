# Mutual Fund Screener — Feature Documentation

> Covers both **user-facing** functionality and **developer internals** including setup, data pipeline, and operations.

---

## Table of Contents

- [User Guide](#user-guide)
- [Architecture Overview](#architecture-overview)
- [Data Pipeline](#data-pipeline)
- [Developer Setup](#developer-setup)
- [Script Reference](#script-reference)
- [Cron Job Setup](#cron-job-setup)
- [File Structure](#file-structure)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)

---

## User Guide

### What is the Mutual Fund Screener?

The Mutual Fund Screener at `/mf` lets you explore, compare, and analyse mutual funds from curated Asset Management Companies (AMCs). It is designed for retail investors who want performance data without needing a paid DEMAT platform.

### Features

| Feature | Description |
|---------|-------------|
| **Search** | Full-text search across all scheme names |
| **Category filter** | Filter by Equity, Debt, Hybrid, or Commodity |
| **Fund House filter** | Multi-select by AMC (e.g. HDFC, SBI, Motilal Oswal) |
| **Sortable columns** | Sort by Scheme Name, 1Y / 3Y / 5Y CAGR returns, or current NAV |
| **NAV chart modal** | Click any scheme row to open a full NAV history chart |
| **Scheme detail page** | Navigate to `/mf/[schemeCode]` for a dedicated stat + chart page |
| **Time range tabs** | Chart supports 1M / 3M / 6M / 1Y / 3Y / All views |
| **Pagination** | 50 schemes per page, navigable |

### Understanding the Returns

All returns displayed are **CAGR (Compound Annual Growth Rate)**, not absolute percentage change.

- **1Y Return** — annualised growth over the last 12 months
- **3Y Return** — annualised growth per year over the last 3 years
- **5Y Return** — annualised growth per year over the last 5 years

> Formula: `CAGR = ((endNAV / startNAV) ^ (1 / years) - 1) × 100`

A `—` in any return column means there is insufficient NAV history to calculate that metric (e.g. a fund launched less than 1 year ago will show `—` for 3Y and 5Y).

### Understanding the NAV Chart

- Click any row in the screener to open the chart modal.
- The X-axis shows dates; Y-axis shows NAV in ₹.
- The **percentage badge** in the chart header shows the return for the **selected time range** (not a stored figure).
- Time range tabs are relative to the fund's **latest data point**, so filters are always accurate even if the fund's last NAV date is not today.

---

## Architecture Overview

```
External API (mfapi.in)
        │
        ├── One-time / on-demand ──────────────────────────────────────────
        │   seed-mf.ts          discovers schemes, seeds latest NAV
        │
        ├── Biweekly (GitHub Actions: mf-backfill.yml) ──────────────────
        │   backfill-returns.ts  full NAV history + CAGR recalculation
        │
        └── Daily (GitHub Actions → HTTP: mf-sync.yml) ────────────────
            POST /api/mf/sync   latest NAV only + lightweight returns update
                    │
                    ▼
          Supabase PostgreSQL
          ┌─────────────┐      ┌─────────┐
          │  mf_schemes │ ─FK─ │  mf_nav │
          └─────────────┘      └─────────┘
                  │
                  ▼
          Next.js Server Component (page.tsx)
          → Queries, paginates, joins latest NAV
                  │
                  ▼
          MFScreener (Client Component)
          → URL-driven filter/sort state
          → SchemeTable (virtualized, @tanstack/react-virtual)
          → NAVChart (lazy-loaded Recharts modal)
                  │
          /api/mf/[schemeCode]/history  ← fetches from mf_nav
```

### Key Design Decisions

- **No client-side state for filters** — all filter/sort state lives in URL search params (`useRouter` + `useSearchParams`). This makes the screener shareable and SSR-friendly.
- **No external API calls at page-view time** — NAV history is stored locally in Supabase. No risk of rate-limiting during user browsing.
- **Virtualized table** — the table renders only visible rows using `@tanstack/react-virtual` (56px row height, 5 overscan) so 500+ schemes render smoothly.
- **Lazy-loaded chart** — `NAVChart` is imported via `next/dynamic` with `ssr: false`, so it does not bloat the initial page bundle.
- **Layered automation** — three separate cron tiers handle different concerns: daily sync (cheap, HTTP-triggered) handles freshness; biweekly backfill (expensive, runner-executed) handles accuracy and history depth; seed runs only on-demand when AMC lists change.

---

## Data Pipeline

### Phase 1: Seed (one-time per AMC list change)

Fetches scheme metadata and the latest NAV for each fund in the curated AMC list.

```
seed-mf.ts
  1. Fire /mf/search?q=<query> for each configured query per AMC
  2. Deduplicate by schemeCode
  3. Upsert into mf_schemes (scheme_code, scheme_name)
  4. Fetch /mf/{schemeCode}/latest for each scheme (concurrency 10)
  5. Upsert fund metadata into mf_schemes
  6. Upsert latest NAV into mf_nav
```

### Phase 2: Recurring Backfill (biweekly via GitHub Actions, or on-demand)

Fetches the **complete daily NAV history** for every scheme, calculates returns from the full dataset, then stores a **downsampled** subset of ≤ 1,000 points per scheme. This powers the chart while staying within Supabase's PostgREST default row limit.

Runs automatically every two weeks via [`.github/workflows/mf-backfill.yml`](file:///c:/Users/khunt/Documents/GitHub/navansh-finserv-v0.3/.github/workflows/mf-backfill.yml) (1st and 15th of each month, 02:00 UTC). Can also be triggered manually from the GitHub Actions tab or run locally with `pnpm backfill:returns`.

```
backfill-returns.ts
  1. Load all scheme_codes from mf_schemes
  2. Fetch /mf/{schemeCode} for each (concurrency 5 — responses are 100KB–2MB)
  3. Check latest NAV date (data[0].date) — if older than STALE_MONTHS (default 6),
     delete from mf_nav + mf_schemes and skip (dead fund pruning)
  4. Parse ALL NAV data points into memory
  5. Calculate CAGR returns (1Y, 3Y, 5Y) from the FULL dataset
  6. Downsample to ≤ MAX_STORED_POINTS (default 1,000):
       • Last RECENT_YEARS_DAILY years (default 2) → keep every trading day
       • Older data → keep the last point of each calendar month
       • Safety trim if monthly + daily still exceeds 1,000
  7. Replace mf_nav rows (DELETE + INSERT) with the downsampled set
  8. Update mf_schemes.return_1y/3y/5y
```

> **Why downsampling?** Supabase's PostgREST anon key enforces a hard 1,000-row default limit on SELECT queries. Without downsampling a 13-year-old fund would have ~3,000 rows and the history API would silently return only the oldest 1,000, making the chart appear to end in 2017 even though data exists through today.

#### Downsampling strategy

| Portion | Resolution | Approx. points |
|---------|-----------|----------------|
| Last 2 years | Daily (every trading day) | ~500 |
| Before that | Last point of each calendar month | ~120–456 depending on fund age |
| **Total** | | **≤ 1,000** |

Returns are always calculated from the **raw full history** before downsampling, so CAGR accuracy is not affected.

> **Storage estimate** post-downsampling (40 bytes/row):
> | Schemes | Rows/scheme (max) | Total rows | Est. size (with indexes) |
> |---------|-------------------|------------|--------------------------|
> | 350 | ≤ 1,000 | ~210K | ~8–16 MB |
> | 500 | ≤ 1,000 | ~500K | ~20–24 MB |
> | 1,000 | ≤ 1,000 | ~1M | ~40–48 MB |
>
> Supabase Free tier = 500 MB database. Safe up to **5,000+ schemes** with downsampling.

### Phase 3: Daily Sync (automated cron)

Fetches only the **latest** NAV for all schemes and recalculates returns.

```
POST /api/mf/sync
  1. Auth check: x-cron-secret header must match CRON_SECRET env var
     (returns 503 if CRON_SECRET env var is not set)
  2. Fetch /mf/{schemeCode}/latest for all schemes (concurrency 20, 10s timeout)
  3. Check latest NAV date — if older than STALE_MONTHS (default 6),
     delete from mf_nav + mf_schemes (dead fund pruning)
  4. Upsert 1 new row per active scheme into mf_nav
  5. Fetch ALL mf_nav rows once, group in-memory by scheme_code
  6. Recalculate CAGR returns for all schemes in a single batch upsert
  7. Return JSON summary: { updated, failed, pruned, duration_ms }
```

---

## Developer Setup

### Prerequisites

- Node 18+
- A Supabase project with the schema applied (see [Database Schema](#database-schema))
- `.env.local` with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
CRON_SECRET=<a-strong-random-secret>
```

> **`CRON_SECRET`** — generate with `openssl rand -base64 32` or any password manager. This protects the sync endpoint from unauthorized triggers.

### First-Time Setup

```bash
# 1. Apply the schema (run in Supabase SQL Editor)
#    -> See /app/mutual-funds/schema.sql

# 2. Seed schemes and latest NAV
pnpm seed:mf

# 3. Backfill full NAV history (takes 5–15 min for 500 schemes)
pnpm backfill:returns
```

### Adding More AMCs

Edit the `FUND_HOUSES` array in `scripts/seed-mf.ts`:

```ts
const FUND_HOUSES: FundHouseConfig[] = [
  {
    name: 'HDFC Mutual Fund',
    queries: ['HDFC Equity', 'HDFC Debt', /* ... */],
  },
  {
    name: 'Axis Mutual Fund',           // ← add new AMC here
    queries: ['Axis Equity', 'Axis Debt', 'Axis Liquid', 'Axis ELSS'],
  },
]
```

After editing, run:

```bash
# Seed new AMC schemes (uses ignoreDuplicates — safe to re-run)
pnpm seed:mf

# Backfill NAV history for all schemes
# (existing rows are replaced via DELETE + INSERT — idempotent and safe to re-run)
pnpm backfill:returns
```

### Clearing All Data

Run in the Supabase SQL Editor:

```sql
-- Truncates both tables (mf_nav first due to FK constraint)
TRUNCATE mf_nav, mf_schemes CASCADE;
```

Then re-run the seed and backfill scripts.

---

## Script Reference

| Command | Script | What it does |
|---------|--------|-------------|
| `pnpm seed:mf` | `scripts/seed-mf.ts` | Discovers schemes for configured AMCs via `/mf/search`, upserts metadata + latest NAV, writes `scripts/mf-seed-cache.json` |
| `pnpm seed:mf -- --from-cache` | `scripts/seed-mf.ts` | Skips API discovery/fetch, reads `mf-seed-cache.json` and upserts directly — fast retry when Supabase was unreachable |
| `pnpm backfill:returns` | `scripts/backfill-returns.ts` | Fetches full NAV history, calculates CAGR from full data, downsamples to ≤ 1,000 pts/scheme, replaces stored rows |

### `pnpm seed:mf`

```
📥  Discovering schemes via search queries …
   → HDFC Mutual Fund: ~350 unique schemes
   → SBI Mutual Fund: ~280 unique schemes
   → Motilal Oswal Mutual Fund: ~76 unique schemes
   → 706 total unique schemes discovered

💾  Upserting scheme names into mf_schemes …
   → 706 / 706

📥  Fetching latest NAV + metadata per scheme …
   → 100 / 706 schemes processed
   → 200 / 706 schemes processed
   ...

✅  Seed complete in 148.7s
   AMCs: HDFC Mutual Fund, SBI Mutual Fund, Motilal Oswal Mutual Fund
   Schemes seeded:    706
   Metadata updated:  706
   NAV rows inserted: 706
   Fetch errors:      0
```

> **Note on the 2026-07-06 query refinement**: The discovery count jumped from 502 → 706 (+41%) after a systematic overhaul of the search queries. See the Gotchas section for the rationale.

> **Local cache**: Every full run writes a `scripts/mf-seed-cache.json` file containing all discovered schemes, enriched metadata, and latest NAV rows. If Supabase upserts fail, fix the connection issue and re-run with `pnpm seed:mf -- --from-cache` to replay the upserts without hitting the API again (completes in seconds instead of ~150s).

### `pnpm backfill:returns`

```
🚀  Starting full NAV history backfill (with downsampling)…

   Config: max 1000 pts/scheme | daily last 2y | monthly before that

   → 347 schemes to backfill

   → 50 / 347 schemes (14%) — 36,377 rows stored
   → 100 / 347 schemes (29%) — 69,735 rows stored
   ...

✅  Backfill complete in 240.8s
   Schemes processed:  347
   Raw data points:    975,889
   Stored (sampled):   210,298 (~8.0 MB, 78% reduction)
   Returns calculated: 337
   Dead funds pruned:  0
   Fetch errors:       0
```

> Fetch errors are normal — some schemes are historical/inactive and their API endpoint returns empty data. Dead funds (latest NAV older than 6 months) are pruned automatically and are NOT counted as errors.
>
> The **78% reduction** in stored rows vs raw data points is typical. Returns are calculated from the full raw dataset before downsampling, so accuracy is not affected.

---

## Cron Job Setup

The daily sync is a Next.js Route Handler at `POST /api/mf/sync`, protected by a secret header.

### Option A: Vercel Cron (Recommended for Vercel deployments)

Add to `vercel.json` in the project root:

```json
{
  "crons": [
    {
      "path": "/api/mf/sync",
      "schedule": "0 1 * * *"
    }
  ]
}
```

> Runs at **1:00 AM UTC** every day. Vercel automatically sends the `Authorization` header — but you still need the `x-cron-secret` check for security. Update the sync route if using Vercel's built-in cron auth instead.

To use with your `CRON_SECRET`, use an external scheduler (Option B) or a Vercel Edge Function wrapper.

### Option B: GitHub Actions (Works with any host)

Create `.github/workflows/mf-sync.yml`:

```yaml
name: Daily MF NAV Sync

on:
  schedule:
    - cron: '30 18 * * 1-5'   # 18:30 UTC = midnight IST, weekdays only
  workflow_dispatch:           # allow manual trigger from GitHub UI

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger MF Sync
        run: |
          curl -s -X POST \
            -H "x-cron-secret: ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json" \
            "${{ secrets.APP_URL }}/api/mf/sync" \
            | jq .
```

**Required GitHub Secrets** (Settings → Secrets → Actions):

| Secret | Value |
|--------|-------|
| `PROD_CRON_SECRET` | Same value as your prod `.env.local` `CRON_SECRET` |
| `PROD_APP_URL` | Your production URL, e.g. `https://navansh-finserv.vercel.app` |
| `DEV_CRON_SECRET` | Same value as your dev `.env.local` `CRON_SECRET` |
| `DEV_APP_URL` | Your dev/preview URL, e.g. a Vercel preview branch URL |

> The `workflow_dispatch` trigger lets you manually run a sync from the GitHub Actions tab and choose the target environment (dev / prod). Scheduled runs always target prod.

> **Dev target note**: The sync job hits an HTTP endpoint, so the dev target only works when you have a deployed dev instance (e.g. a Vercel preview deployment for a `develop` or `staging` branch). It will not work against `localhost`.

### Option C: cron-job.org (Free, no GitHub required)

1. Go to [cron-job.org](https://cron-job.org) and create a free account
2. Create a new cron job:
   - **URL**: `https://your-domain.com/api/mf/sync`
   - **Method**: POST
   - **Schedule**: Daily at 01:00 UTC
   - **Headers**: Add `x-cron-secret: <your-secret>`
3. Save and enable

### Option D: GitHub Actions — Biweekly Full Backfill (separate from daily sync)

This runs the Node.js `backfill-returns.ts` script **directly on a GitHub Actions runner** — not via HTTP. It is necessary because the backfill takes 5–10 minutes and makes 700+ API calls to mfapi.in, far exceeding any serverless function timeout. The `workflow_dispatch` input lets you choose whether to run against dev or prod.

The workflow file is already in the repo at [`.github/workflows/mf-backfill.yml`](file:///c:/Users/khunt/Documents/GitHub/navansh-finserv-v0.3/.github/workflows/mf-backfill.yml). Abbreviated:

```yaml
on:
  schedule:
    - cron: '0 2 1,15 * *'   # always targets prod
  workflow_dispatch:
    inputs:
      environment:             # choose dev or prod when triggering manually
        type: choice
        options: [dev, prod]
        default: prod

jobs:
  backfill:
    steps:
      # ... checkout, pnpm, node setup ...
      - name: Resolve target environment credentials
        run: |
          TARGET="${{ inputs.environment || 'prod' }}"
          if [ "$TARGET" = "prod" ]; then
            echo "SUPABASE_URL=${{ secrets.PROD_SUPABASE_URL }}" >> $GITHUB_ENV
            echo "SUPABASE_KEY=${{ secrets.PROD_SERVICE_ROLE_KEY }}" >> $GITHUB_ENV
          else
            echo "SUPABASE_URL=${{ secrets.DEV_SUPABASE_URL }}" >> $GITHUB_ENV
            echo "SUPABASE_KEY=${{ secrets.DEV_SERVICE_ROLE_KEY }}" >> $GITHUB_ENV
          fi
      - run: pnpm backfill:returns
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ env.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ env.SUPABASE_KEY }}
```

> **Step order matters**: `pnpm/action-setup` must run *before* `setup-node` so that Node can detect the pnpm store location and enable the `cache: 'pnpm'` optimisation. Reversing the order silently disables caching.

> **dotenv in CI**: The script calls `dotenv.config({ path: '.env.local' })` at startup. In CI there is no `.env.local` file — dotenv silently skips it and the secrets set in `$GITHUB_ENV` are already present in `process.env`, so no code change is required.

**Required GitHub Secrets** (Settings → Secrets → Actions):

| Secret | Value |
|--------|-------|
| `DEV_SUPABASE_URL` | Dev Supabase project URL |
| `DEV_SERVICE_ROLE_KEY` | Dev service-role key (Supabase → Settings → API) |
| `PROD_SUPABASE_URL` | Prod Supabase project URL |
| `PROD_SERVICE_ROLE_KEY` | Prod service-role key |

---

### Automation summary

| Workflow | File | Scheduled trigger | Manual env selection | Duration | Purpose |
|----------|------|------------------|---------------------|----------|---------|
| Daily NAV Sync | `mf-sync.yml` | Weekdays 00:30 + 08:50 UTC → prod | dev / prod | ~30s | Keep latest NAV current |
| Biweekly Backfill | `mf-backfill.yml` | 1st & 15th at 02:00 UTC → prod | dev / prod | ~5–10 min | Full history accuracy + dead fund pruning |

The two jobs are complementary: the daily sync handles freshness cheaply; the biweekly backfill corrects drift in older history and processes any newly listed schemes that were missed between seed runs.

---

### Testing workflows before merging to main

GitHub Actions `workflow_dispatch` runs on **whichever branch you select** — not just `main`. This is the primary testing mechanism:

**Step-by-step for testing a workflow change:**
1. Push your branch to GitHub (e.g. `git push origin feature/fix-backfill`)
2. Go to **Actions tab → select the workflow → Run workflow**
3. In the dropdown, select your feature branch instead of `main`
4. Choose `dev` as the environment (never test against prod)
5. Watch the live log

This runs your *branch’s version* of the workflow file, so you’re testing exactly what will land on `main` after merge.

**Testing the backfill locally (fastest iteration loop):**

```bash
# This is identical to what the CI runner does — no Docker required
pnpm backfill:returns
```

Your `.env.local` already has dev credentials, so this hits the dev DB. The script output is identical to what you’d see in the Actions log.

**Testing the sync endpoint locally:**

```bash
# Start the dev server first, then:
curl -X POST \
  -H "x-cron-secret: YOUR_CRON_SECRET" \
  http://localhost:3000/api/mf/sync

# Expected response:
# {"updated":478,"failed":0,"pruned":24,"duration_ms":34821}
```

**Local runner with `act` (advanced, requires Docker):**

[`act`](https://github.com/nektos/act) runs GitHub Actions workflows locally using Docker containers. Useful when you need to test the full CI step sequence (checkout → pnpm install → script) without pushing to GitHub:

```bash
# Install (Windows, via Chocolatey)
choco install act-cli

# Dry-run the backfill workflow (--dryrun skips actual execution)
act workflow_dispatch --dryrun -W .github/workflows/mf-backfill.yml

# Run it for real (supply secrets via .secrets file or --secret flag)
act workflow_dispatch \
  --secret NEXT_PUBLIC_SUPABASE_URL=<url> \
  --secret SUPABASE_SERVICE_ROLE_KEY=<key> \
  -W .github/workflows/mf-backfill.yml
```

> `act` has known limitations with pnpm cache steps on Windows hosts. If it fails on the cache step, add `--no-cache-server` or skip directly to the local `pnpm backfill:returns` approach instead.

---

## File Structure

```
app/
  mf/
    page.tsx                  # Server Component — queries, paginates, joins NAV
    [schemeCode]/
      page.tsx                # Detail page — scheme metadata + stat cards + chart
      NAVChartWrapper.tsx     # Client wrapper that passes history to NAVChart
    schema.sql                # Database schema (apply once in Supabase)
  api/
    mf/
      sync/
        route.ts              # POST — daily cron handler (pruning + returns recalc)
      [schemeCode]/
        history/
          route.ts            # GET — returns full NAV history from DB

components/
  custom/
    MFScreener/
      MFScreener.tsx          # Client shell — URL filter state, modal control
      SchemeTable.tsx         # Virtualized table (react-virtual)
      NAVChart.tsx            # Recharts chart modal + detail page variant
      FilterPanel.tsx         # Category + AMC filter controls
      SortControls.tsx        # Column sort header buttons
      SearchBar.tsx           # Scheme name search input

lib/
  mf-utils.ts                 # Shared types (MFScheme, MFNav) + calculateReturns()

scripts/
  seed-mf.ts                  # AMC-based scheme discovery + initial NAV seed
  backfill-returns.ts         # Full NAV history backfill + downsampling + pruning + CAGR

docs/
  mutual-funds.md             # ← This file
```

---

## Database Schema

```sql
-- Scheme master data
CREATE TABLE mf_schemes (
  scheme_code     integer PRIMARY KEY,
  scheme_name     text    NOT NULL,
  fund_house      text,
  scheme_type     text,
  scheme_category text,
  isin_growth     text,
  return_1y       numeric,   -- CAGR % over 1 year
  return_3y       numeric,   -- CAGR % over 3 years
  return_5y       numeric,   -- CAGR % over 5 years
  updated_at      timestamptz DEFAULT now()
);

-- Daily NAV history
CREATE TABLE mf_nav (
  scheme_code integer NOT NULL REFERENCES mf_schemes(scheme_code) ON DELETE CASCADE,
  nav_date    date    NOT NULL,
  nav         numeric NOT NULL,
  PRIMARY KEY (scheme_code, nav_date)
);

-- Indexes
CREATE INDEX idx_mf_schemes_category  ON mf_schemes (scheme_category);
CREATE INDEX idx_mf_schemes_fund_house ON mf_schemes (fund_house);
CREATE INDEX idx_mf_nav_scheme_date   ON mf_nav (scheme_code, nav_date DESC);

-- RLS — public read, no auth required
ALTER TABLE mf_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mf_nav     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view all schemes" ON mf_schemes FOR SELECT USING (true);
CREATE POLICY "Public can view all NAVs"    ON mf_nav     FOR SELECT USING (true);
```

> **Note**: `latest_nav` is NOT a stored column on `mf_schemes`. It is joined at query time in `page.tsx` by fetching the most recent row from `mf_nav` per scheme. This avoids data duplication since `mf_nav` already holds the ground truth.

---

## API Routes

### `GET /api/mf/[schemeCode]/history`

Returns the full NAV history for a single scheme.

**Response:**
```json
{
  "meta": {
    "scheme_code": 119598,
    "scheme_name": "HDFC Top 100 Fund - Growth Option",
    "fund_house": "HDFC Mutual Fund",
    "scheme_type": "Open Ended Schemes",
    "scheme_category": "Equity Scheme - Large Cap Fund",
    "isin_growth": "INF179K01BB7",
    ...
  },
  "history": [
    { "scheme_code": 119598, "nav_date": "2010-01-04", "nav": 145.32 },
    { "scheme_code": 119598, "nav_date": "2010-01-05", "nav": 147.10 },
    ...
  ]
}
```

History is returned **ascending by date** (oldest first). The `NAVChart` component sorts it internally.

### `POST /api/mf/sync`

Triggers a full sync of latest NAVs and return recalculation.

**Required header:**
```
x-cron-secret: <value of CRON_SECRET env var>
```

**Response:**
```json
{
  "updated": 478,
  "failed": 3,
  "pruned": 24,
  "duration_ms": 34821
}
```

Returns `401 Unauthorized` if the secret is missing or incorrect.
Returns `503 Service Unavailable` if `CRON_SECRET` env var is not set on the server.

---

## Gotchas & Known Limitations

- **`mfapi.in` search caps at 15 results per query** — the seed script uses multiple targeted queries per AMC to work around this. The query strategy was overhauled on 2026-07-06 after empirical testing:

  **Key rules for writing queries:**
  1. **Match on full scheme name substrings** — the API does a substring search on the complete scheme name (e.g. `"HDFC Midcap Opportunities Fund - Direct - Growth"`). A query only matches if it appears as a contiguous substring in that name.
  2. **Use the full fund-house prefix for AMCs with a compound name** — Motilal Oswal schemes are all named `"Motilal Oswal <type>"`. Queries like `"Motilal Nifty"` or `"Motilal Midcap"` return **zero results** because `"Oswal"` sits between the two words in the actual name. Always use `"Motilal Oswal Nifty"`, `"Motilal Oswal Midcap"`, etc.
  3. **Avoid plan-suffix terms as standalone queries** — words like `"Growth"`, `"Dividend"`, `"IDCW"` appear in the plan suffix of *every* scheme (`"... - Growth Option"`). A query of `"HDFC Growth"` will return 15 random HDFC schemes with no useful discrimination, wasting a query slot. Removed: `HDFC Growth`, `HDFC Dividend`, `SBI Growth`, `SBI Dividend`.
  4. **Use category-specific terms** — queries like `"HDFC Flexi Cap"`, `"HDFC Balanced Advantage"`, `"SBI Midcap"`, `"Motilal Oswal Business"` each surface a distinct, non-overlapping set of schemes. After the 2026-07-06 update, HDFC has 39 queries, SBI has 38, and Motilal Oswal has 22 — covering all active open-ended fund categories.

  If you add a new AMC, make sure to add enough query variants to capture all scheme types, following the rules above.

- **`/mf/latest` is unreliable for large fetches** — the endpoint that returns all schemes + latest NAVs in one call gets connection-reset at ~128KB. We deliberately avoid it and use per-scheme fetches instead.

- **Inactive/historical schemes return empty data** — some schemes are delisted or merged. Their `/mf/{code}` endpoint returns `status: "ERROR"` or empty `data`. These are counted as fetch errors in the backfill summary and safely skipped.

- **Dead fund pruning** — both the backfill script and the daily sync check the latest NAV date before upserting. A fund whose most recent NAV is older than **6 months** (`STALE_MONTHS` constant in both files) is treated as dead: its rows are deleted from `mf_nav` and `mf_schemes` and the fund is skipped. Adjust `STALE_MONTHS` in `scripts/backfill-returns.ts` and `app/api/mf/sync/route.ts` to change the threshold. Pruned funds appear in the summary output and the sync JSON response (`pruned` field).

- **Returns recalculation uses a single bulk query** — the sync route fetches all `mf_nav` rows in one query, groups them in-memory by `scheme_code`, and upserts all computed returns in a single batch. This avoids an N+1 query pattern (one query per scheme).

- **PostgREST 1,000-row limit & NAV downsampling** — Supabase's PostgREST API enforces a default 1,000-row cap on SELECT queries for the anon key. Without mitigation, a 13-year-old fund with ~3,000 NAV rows would return only the oldest 1,000 (ascending sort), making the chart appear to stop at 2017. The backfill script solves this by storing ≤ `MAX_STORED_POINTS` (default 1,000) rows per scheme using a density-weighted strategy: daily resolution for the last `RECENT_YEARS_DAILY` years (default 2), and one point per calendar month for older data. CAGR calculations always use the full raw dataset before downsampling. The script uses **DELETE + INSERT** (not upsert) so stale rows from previous runs are fully replaced on each re-run.

- **5Y return requires 5 years of data** — the CAGR calculation uses a ±5 day tolerance window when looking for the NAV closest to the target date. If a scheme is less than 5 years old, `return_5y` will be `null`.

- **Supabase Free tier storage** — with downsampling, `mf_nav` stays small (~8 MB for 350 schemes, ~40 MB for 1,000). The 500 MB Free tier limit is unlikely to be hit for typical AMC lists.
