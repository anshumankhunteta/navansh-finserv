# Navansh Finserv

A high-performance lead-generation platform and financial tools portal. Engineered to capture client intents, handle complex client-side financial computations, and maintain a synchronized mutual fund database with zero manual intervention.

## Tech Stack
- **Framework**: Next.js 16.1 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + Shadcn UI / Radix UI Primitives
- **State Management**: Zustand (Persisted via `sessionStorage`)
- **Database & Auth**: Supabase (PostgreSQL, Auth, Storage)
- **Forms**: React Hook Form + Zod
- **Editor**: BlockNote (Internal Blog CMS)
- **Charts / UI**: Recharts, Framer Motion, Embla Carousel

```
Directory structure:
└── anshumankhunteta-navansh-finserv/
    ├── README.md
    ├── components.json
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── proxy.ts
    ├── tsconfig.json
    ├── vercel.json
    ├── .lintstagedrc.json
    ├── .prettierignore
    ├── .prettierrc
    ├── app/
    │   ├── apple-icon.tsx
    │   ├── CalculatorStateManagement.md.resolved
    │   ├── globals.css
    │   ├── icon.tsx
    │   ├── layout.tsx
    │   ├── manifest.ts
    │   ├── not-found.tsx
    │   ├── opengraph-image.tsx
    │   ├── page.tsx
    │   ├── robots.ts
    │   ├── sitemap.ts
    │   ├── about/
    │   │   └── page.tsx
    │   ├── api/
    │   │   └── mf/
    │   │       ├── [schemeCode]/
    │   │       │   └── history/
    │   │       │       └── route.ts
    │   │       └── sync/
    │   │           └── route.ts
    │   ├── blog/
    │   │   ├── page.tsx
    │   │   ├── schema.sql
    │   │   ├── [slug]/
    │   │   │   └── page.tsx
    │   │   └── admin/
    │   │       ├── actions.ts
    │   │       ├── layout.tsx
    │   │       ├── page.tsx
    │   │       ├── [id]/
    │   │       │   └── edit/
    │   │       │       └── page.tsx
    │   │       ├── login/
    │   │       │   └── page.tsx
    │   │       └── new/
    │   │           └── page.tsx
    │   ├── contact/
    │   │   └── page.tsx
    │   ├── enquire/
    │   │   ├── actions.ts
    │   │   ├── EnquireContent.tsx
    │   │   ├── page.tsx
    │   │   └── schema.sql
    │   ├── mf/
    │   │   ├── loading.tsx
    │   │   ├── page.tsx
    │   │   ├── schema.sql
    │   │   └── [schemeCode]/
    │   │       ├── NAVChartWrapper.tsx
    │   │       └── page.tsx
    │   ├── milee/
    │   │   ├── DownloadCardButton.tsx
    │   │   └── page.tsx
    │   ├── privacy/
    │   │   └── page.tsx
    │   └── services/
    │       └── page.tsx
    ├── components/
    │   ├── custom/
    │   │   ├── BackButton.tsx
    │   │   ├── BusinessCard.tsx
    │   │   ├── CalculatorCarousel.tsx
    │   │   ├── ContactForm.tsx
    │   │   ├── FloatingWhatsAppButton.tsx
    │   │   ├── ThemeProvider.tsx
    │   │   ├── ThemeToggle.tsx
    │   │   ├── blog/
    │   │   │   ├── AdminPostActions.tsx
    │   │   │   ├── AuthGuard.tsx
    │   │   │   ├── BlockNoteEditor.tsx
    │   │   │   ├── BlockNoteRenderer.tsx
    │   │   │   ├── CustomRenderer.tsx
    │   │   │   ├── PostCard.tsx
    │   │   │   ├── PostForm.tsx
    │   │   │   ├── SignOutButton.tsx
    │   │   │   ├── SlugInput.tsx
    │   │   │   └── TableOfContents.tsx
    │   │   ├── calculators/
    │   │   │   ├── CalculatorActionButtons.tsx
    │   │   │   ├── EducationInflationCalculator.tsx
    │   │   │   ├── FDCalculator.tsx
    │   │   │   ├── HLVCalculator.tsx
    │   │   │   ├── MediclaimEstimator.tsx
    │   │   │   ├── SIPCalculator.tsx
    │   │   │   └── SWPCalculator.tsx
    │   │   └── MFScreener/
    │   │       ├── FilterPanel.tsx
    │   │       ├── MFScreener.tsx
    │   │       ├── NAVChart.tsx
    │   │       ├── SchemeTable.tsx
    │   │       ├── SearchBar.tsx
    │   │       └── SortControls.tsx
    │   ├── icons/
    │   │   ├── Discord.tsx
    │   │   ├── Github.tsx
    │   │   ├── Instagram.tsx
    │   │   ├── Navansh.tsx
    │   │   └── Whatsapp.tsx
    │   ├── landing/
    │   │   ├── AuraBackground.tsx
    │   │   ├── BentoServices.tsx
    │   │   ├── HeroSection.tsx
    │   │   └── RefractiveContainer.tsx
    │   ├── layout/
    │   │   ├── Footer.tsx
    │   │   └── Navbar.tsx
    │   ├── providers/
    │   │   └── SmoothScrollProvider.tsx
    │   └── ui/
    │       ├── alert-dialog.tsx
    │       ├── button.tsx
    │       ├── carousel.tsx
    │       ├── dropdown-menu.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── sheet.tsx
    │       └── slider.tsx
    ├── docs/
    │   ├── mutual-funds.md
    │   ├── calculators.md
    │   ├── blog-cms.md
    │   ├── enquiry-system.md
    │   └── CONTRIBUTING.md
    ├── lib/
    │   ├── blog-upload.ts
    │   ├── calculator-store.ts
    │   ├── finance-math.ts
    │   ├── icon-shared.ts
    │   ├── mf-utils.ts
    │   ├── utils.ts
    │   └── supabase/
    │       └── server.ts
    ├── scripts/
    │   ├── backfill-returns.ts
    │   └── seed-mf.ts
    ├── .agents/
    │   └── rules/
    │       └── navansh-context.md
    ├── .github/
    │   └── workflows/
    │       ├── ci.yml
    │       ├── mf-sync.yml
    │       └── mf-backfill.yml
    └── .husky/
        └── pre-commit
```

## Core Architecture & Features

### 1. Lead Generation & Rate Limiting
- **Enquiry Pipeline**: Server actions handle form submissions natively (`app/enquire/actions.ts`), paired with Zod validation. 
- **Spam Prevention**: Multi-tier rate limiting (1 min, 1 hr, 24 hr thresholds) enforced via a Supabase `rate_limit_log` table. Captures client IPs and geolocation (`x-vercel-ip-country`). Identifies and blocks duplicate submissions within 48 hours.
- **Alerts**: Dispatches rich Discord webhook notifications on successful lead captures, including UTM/Persona tracking (`navansh_persona` cookie).

### 2. Financial Calculators
- **Tools Available**: SIP, SWP, FD, HLV, Mediclaim, and Education Inflation.
- **State Sync**: Uses Zustand with a custom hydration guard (`useHydrateStore`) to prevent Next.js SSR mismatches.
- **Shareability**: Granular state management supports URL-based restoration (`?calc=sip&amt=...`), allowing agents and users to share pre-filled calculation states.

### 3. Mutual Fund Screener & Automated Data Pipeline
- **Screener UI**: Filters by AMCs, categories, and sorts by CAGR. Employs `@tanstack/react-virtual` to maintain 60fps scrolling on large scheme tables.
- **Data Pipeline** (three-tier automation):
  - **Seed** (`scripts/seed-mf.ts`): One-time discovery of all schemes for configured AMCs via the mfapi.in search endpoint. Writes a local JSON cache (`scripts/mf-seed-cache.json`) so failed Supabase upserts can be replayed with `--from-cache`.
  - **Biweekly backfill** (GitHub Actions `mf-backfill.yml`, 1st & 15th of each month): Runs `scripts/backfill-returns.ts` directly on a CI runner. Fetches the complete NAV history per scheme, calculates 1Y/3Y/5Y CAGR from the full dataset, downsamples to ≤ 1,000 points/scheme (to stay within Supabase's PostgREST row limit), and replaces stored rows via DELETE + INSERT. Prunes dead funds (no NAV update > 6 months).
  - **Daily sync** (GitHub Actions `mf-sync.yml`, weekdays at 06:00 & 14:20 IST): Triggers `POST /api/mf/sync`. Fetches only the latest NAV per scheme and recalculates returns in a single batched upsert. Protected by `x-cron-secret`.
  - Both GH Actions workflows support a `workflow_dispatch` input to target **dev or prod** on demand.

### 4. Blog CMS
- **Custom Admin**: Authenticated via Supabase (`/blog/admin`). Uses RLS to ensure public users only query `published = true` rows.
- **Editor**: Integrates `@blocknote/react` for block-based rich text editing, outputting JSON to the database.
- **Storage**: Image uploads are piped directly to Supabase storage buckets, validated server-side.

## Low-Level Architecture & Implementation

### 1. Lead Intake & Rate Limiting Engine
**Implementation:** Form submissions bypass standard API routes, using Next.js Server Actions (`app/enquire/actions.ts`) combined with Zod schemas for strict runtime type-safety and sanitization. 
**Security & Anti-Spam:**
Supabase `rate_limit_log` table acts as the gatekeeper. It tracks `x-vercel-ip-country` headers and client IPs to enforce multi-tier thresholds (1m, 1h, 24h). Duplicates within a 48-hour window are silently dropped.
**Delivery Pipeline:**
Successful leads trigger asynchronous Discord webhook payloads containing client data and `navansh_persona` cookie values for UTM attribution.


### 2. Client-Side Computation (Calculators)
**Implementation:**
Six distinct calculators (SIP, SWP, FD, HLV, Mediclaim, Education) driven by a globally persisted Zustand store. State is cached in `sessionStorage`.
**Hydration & SSR:**
Utilizes a custom `useHydrateStore` hook to intentionally delay state injection until the component mounts, entirely bypassing Next.js hydration mismatch errors.
**Deep Linking:**
Calculators parse `window.location.search` (`?calc=sip&amt=...`) to dynamically seed the Zustand store, enabling instant state-sharing for agents.


### 3. Mutual Fund Data Pipeline & DOM Recycling
**Ingestion & Processing (layered automation):**
- **Seed** (`pnpm seed:mf`): Discovers schemes via targeted search queries against mfapi.in (15-result cap bypassed with multiple queries per AMC). Deduplicates and upserts into Supabase. Writes `scripts/mf-seed-cache.json` for crash recovery (`--from-cache` flag replays upserts without re-hitting the API).
- **Biweekly backfill** (GitHub Actions `mf-backfill.yml`): Runs on the CI runner (not via HTTP — the script takes 5–10 min and is too heavy for a serverless function). Fetches the entire NAV history per scheme from mfapi.in, calculates CAGR from the full raw data, downsamples to ≤ 1,000 rows/scheme, and replaces stored rows (DELETE + INSERT). Dead fund pruning runs here. Targets prod on schedule; dev or prod selectable via `workflow_dispatch` input.
- **Daily sync** (GitHub Actions `mf-sync.yml` → `POST /api/mf/sync`): Lightweight — fetches only the latest NAV, fetches all `mf_nav` rows in one query, groups in-memory by `scheme_code` via a `Map`, computes 1Y/3Y/5Y CAGR with `calculateReturns()`, and pushes a single batched upsert to `mf_schemes`. Zero N+1 queries.

**UI Rendering:**
The frontend utilises `@tanstack/react-virtual` to recycle DOM nodes, allowing the screener to maintain 60fps scrolling while rendering hundreds of scheme rows.


### 4. Blog CMS Internal Abstraction
**Implementation:**
A bespoke admin interface (`/blog/admin`) secured by Supabase Auth. Content is authored via `@blocknote/react`, which serializes rich text into structured JSON rather than raw HTML.
**Storage & Security:**
Images are uploaded directly to Supabase storage buckets. PostgreSQL Row Level Security (RLS) is strictly configured: unauthenticated users can only `SELECT` rows where `published = true`.

---

#### Developed and Maintained by [Anshuman Khunteta](https://www.linkedin.com/in/anshumankhunteta/)
