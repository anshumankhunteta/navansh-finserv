# Navansh Finserv

A high-performance lead-generation platform and financial tools portal. Engineered to capture client intents, handle complex client-side financial computations, and maintain a synchronized mutual fund database with zero manual intervention.

> Visit live website @ [navansh.in](https://navansh.in)

## Tech Stack
- **Framework**: Next.js 16.1 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + Shadcn UI / Radix UI Primitives
- **State Management**: Zustand (Persisted via `sessionStorage`)
- **Database & Auth**: Supabase (PostgreSQL, Auth, Storage)
- **Forms**: React Hook Form + Zod
- **Editor**: BlockNote (Internal Blog CMS)
- **Charts / UI**: Recharts, Framer Motion, Embla Carousel

## Architecture Diagrams

### System Overview

```mermaid
graph LR
  subgraph Client["🖥️ Client — Browser"]
    direction TB
    UI["React 19<br/>Next.js App Router"]
    LIBS["Zustand · Framer Motion<br/>React Hook Form · Zod<br/>TanStack Virtual"]
    UI --- LIBS
  end

  subgraph Vercel["▲ Vercel"]
    direction TB
    SSR["Server Components<br/>RSC Streaming"]
    SA["Server Actions<br/>enquire · blog"]
    API["API Routes<br/>/api/mf/sync<br/>/api/mf/.../history"]
    VA["Analytics<br/>Speed Insights"]
  end

  subgraph Supabase["⚡ Supabase"]
    direction TB
    PG[("PostgreSQL<br/>+ RLS")]
    AUTH["Auth"]
    STORE["Storage<br/>Blog Images"]
  end

  subgraph External["🌐 External"]
    direction TB
    MFAPI["mfapi.in"]
    DISCORD["Discord"]
    IPAPI["ipapi.co"]
  end

  subgraph CI["⚙️ GitHub Actions"]
    direction TB
    CISYNC["Daily Sync"]
    CIBF["Biweekly Backfill"]
    CILINT["CI Lint + Typecheck"]
  end

  Client -- "RSC · Actions · Fetch" --> Vercel
  SSR & SA --> PG
  SA --> STORE
  API --> PG
  API --> MFAPI
  SA -.-> DISCORD
  SA -.-> IPAPI
  AUTH --> PG
  CISYNC -- "POST /api/mf/sync" --> API
  CIBF -- "Direct script" --> PG
  CIBF --> MFAPI
```

### Request & Data Flow

```mermaid
flowchart LR
  subgraph User
    B["Browser"]
  end

  subgraph NextJS["Next.js (Vercel)"]
    direction TB
    RSC["Server Components"]
    SA["Server Actions"]
    AR["API Routes"]
  end

  subgraph Data["Data Layer"]
    SB[("Supabase<br/>PostgreSQL")]
    SS["Supabase<br/>Storage"]
  end

  B -- "GET /page" --> RSC
  B -- "Form Submit" --> SA
  B -- "Fetch NAV" --> AR
  RSC -- "SELECT" --> SB
  SA -- "INSERT / UPDATE" --> SB
  SA -- "Upload" --> SS
  AR -- "SELECT / UPSERT" --> SB

  style RSC fill:#2563eb,color:#fff
  style SA fill:#7c3aed,color:#fff
  style AR fill:#059669,color:#fff
  style SB fill:#f59e0b,color:#000
```

### Feature Architecture Map

#### Financial Calculators

```mermaid
graph LR
  URL["URL Params<br/>?calc=sip&amt=..."] --> STORE["Zustand Store<br/>sessionStorage"]
  STORE --> SIP["SIP"]
  STORE --> FD["FD"]
  STORE --> SWP["SWP"]
  STORE --> HLV["HLV"]
  STORE --> EDU["Education"]
  STORE --> MED["Mediclaim"]
  SIP & FD & SWP & HLV & EDU & MED --> MATH["finance-math.ts<br/>CAGR · PV · FV"]
  STORE --> HYDRATE["useHydrateStore<br/>SSR Guard"]
```

#### Blog CMS

```mermaid
graph LR
  AUTH["Supabase Auth"] --> GUARD["AuthGuard<br/>Client Redirect"]
  GUARD --> DASH["/blog/admin<br/>Dashboard"]
  DASH --> NEW["/blog/admin/new<br/>Create Post"]
  DASH --> EDIT["/blog/admin/[id]/edit<br/>Edit Post"]
  NEW & EDIT --> EDITOR["BlockNote Editor<br/>JSONB Output"]
  EDITOR --> ACTIONS["Server Actions<br/>create · update · delete<br/>duplicate · togglePublish"]
  ACTIONS --> DB[("Supabase<br/>RLS: published = true")]
  ACTIONS --> STORAGE["Supabase Storage<br/>Cover Images"]
```

#### Enquiry System

```mermaid
graph LR
  FORM["ContactForm<br/>React Hook Form + Zod"] --> ACTION["Server Action<br/>submitEnquiry()"]
  ACTION --> DUP{"Duplicate?<br/>name+contact < 48h"}
  DUP -- Yes --> DROP["❌ Dropped"]
  DUP -- No --> RATE{"Rate Limit?<br/>1m · 1h · 24h"}
  RATE -- Exceeded --> BLOCK["❌ Blocked"]
  RATE -- OK --> INSERT["INSERT → leads<br/>LOG → rate_limit_log"]
  INSERT --> DISCORD["🔔 Discord Webhook"]
  FORM --> PERSONA["navansh_persona<br/>Cookie Tracking"]

  style DROP fill:#dc2626,color:#fff
  style BLOCK fill:#dc2626,color:#fff
  style DISCORD fill:#5865F2,color:#fff
```

### Mutual Fund Data Pipeline

```mermaid
flowchart TD
  subgraph Seed["1️⃣ Seed (One-Time)"]
    S1["pnpm seed:mf"]
    S2["Query mfapi.in<br/>(per AMC search)"]
    S3["Write mf-seed-cache.json"]
    S4["Upsert to mf_schemes"]
    S1 --> S2 --> S3 --> S4
  end

  subgraph Backfill["2️⃣ Biweekly Backfill"]
    B1["GitHub Actions<br/>(1st & 15th)"]
    B2["Fetch full NAV history<br/>(per scheme)"]
    B3["Calculate 1Y/3Y/5Y CAGR"]
    B4["Downsample to<br/>≤ 1000 points"]
    B5["DELETE + INSERT<br/>mf_nav rows"]
    B6["Prune dead funds<br/>(> 6mo stale)"]
    B1 --> B2 --> B3 --> B4 --> B5
    B2 --> B6
  end

  subgraph Sync["3️⃣ Daily Sync"]
    D1["GitHub Actions<br/>(Weekdays 06:00 & 14:20 IST)"]
    D2["POST /api/mf/sync"]
    D3["Fetch latest NAV<br/>(per scheme)"]
    D4["Fetch ALL mf_nav rows<br/>(single query)"]
    D5["Group by scheme_code<br/>(in-memory Map)"]
    D6["calculateReturns()<br/>per group"]
    D7["Batched upsert<br/>to mf_schemes"]
    D1 --> D2 --> D3 & D4
    D4 --> D5 --> D6 --> D7
  end

  MFAPI["mfapi.in API"] -.-> S2
  MFAPI -.-> B2
  MFAPI -.-> D3
  DB[("Supabase<br/>PostgreSQL")] <-.-> S4
  DB <-.-> B5
  DB <-.-> D4
  DB <-.-> D7

  style Seed fill:#0faa1f,color:#fff
  style Backfill fill:#5745c0,color:#fff
  style Sync fill:#f0a0a0,color:#fff
```

### Enquiry / Lead Pipeline

```mermaid
flowchart TD
  A["User fills ContactForm"] --> B["Client Validation<br/>(React Hook Form + Zod)"]
  B --> C["startTransition → Server Action"]
  C --> D["Server-side Zod Parse"]
  D --> E{"Duplicate Check<br/>(name + contact < 48h)"}
  E -- Duplicate --> F["❌ Silently Dropped"]
  E -- Unique --> G{"Rate Limit Check"}
  G -- "Exceeded<br/>(1m / 1h / 24h)" --> H["❌ Rate Limited"]
  G -- Passed --> I["Get IP + Country<br/>(Vercel headers / ipapi.co)"]
  I --> J["Read navansh_persona cookie"]
  J --> K["INSERT → leads table"]
  K --> L["LOG → rate_limit_log"]
  L --> M["🔔 Discord Webhook<br/>(async, non-blocking)"]

  style A fill:#f0f9ff,color:#000
  style F fill:#dc2626,color:#fff
  style H fill:#dc2626,color:#fff
  style M fill:#5865F2,color:#fff
```

### Folder Structure (Layered View)

#### `app/` — Pages, API Routes & Server Actions

```mermaid
graph LR
  APP["app/"] --> HOME["page.tsx — Landing"]
  APP --> ABOUT["about/"]
  APP --> CONTACT["contact/"]
  APP --> SERVICES["services/"]
  APP --> PRIVACY["privacy/"]
  APP --> ENQ["enquire/<br/>actions.ts · schema.sql"]
  APP --> BLOG["blog/<br/>page · [slug] · admin/"]
  APP --> MF["mf/<br/>page · [schemeCode]/"]
  APP --> API["api/mf/<br/>sync/ · [code]/history/"]

  style APP fill:#1e3a5f,color:#fff
```

#### `components/` — UI Layer

```mermaid
graph LR
  COMP["components/"] --> CUSTOM["custom/<br/>ContactForm · FloatingWhatsApp<br/>ThemeToggle · BackButton"]
  COMP --> CALCS["custom/calculators/<br/>SIP · FD · SWP · HLV<br/>Education · Mediclaim"]
  COMP --> SCREENER["custom/MFScreener/<br/>SearchBar · FilterPanel<br/>SchemeTable · NAVChart · SortControls"]
  COMP --> BLOGC["custom/blog/<br/>AuthGuard · BlockNoteEditor<br/>PostForm · PostCard · SlugInput"]
  COMP --> LAND["landing/<br/>HeroSection · BentoServices<br/>RefractiveContainer · AuraBackground"]
  COMP --> LAYOUT["layout/<br/>Navbar · Footer"]
  COMP --> UI["ui/<br/>Button · Input · Sheet<br/>Carousel · Slider · AlertDialog"]
  COMP --> PROV["providers/<br/>SmoothScrollProvider"]

  style COMP fill:#3b1f6e,color:#fff
```

#### `lib/` & `scripts/` & `.github/` — Logic, Pipelines & CI

```mermaid
graph LR
  LIB["lib/"] --> SB["supabase/server.ts<br/>SSR Supabase Client"]
  LIB --> CALC["calculator-store.ts<br/>Zustand + URL Sharing"]
  LIB --> MATH["finance-math.ts<br/>SIP · FD · SWP · HLV Formulae"]
  LIB --> MFU["mf-utils.ts<br/>CAGR · Returns · Types"]
  LIB --> UTIL["utils.ts<br/>cn() — clsx + twMerge"]
  LIB --> UPLOAD["blog-upload.ts<br/>Image Validation"]

  SCRIPTS["scripts/"] --> SEED["seed-mf.ts<br/>One-time AMC Discovery"]
  SCRIPTS --> BACKFILL["backfill-returns.ts<br/>Full NAV History + CAGR"]

  GHA[".github/workflows/"] --> CI["ci.yml — Lint + Typecheck"]
  GHA --> SYNC["mf-sync.yml — Daily NAV"]
  GHA --> BF["mf-backfill.yml — Biweekly"]

  style LIB fill:#14532d,color:#fff
  style SCRIPTS fill:#78350f,color:#fff
  style GHA fill:#78350f,color:#fff
```

## Core Architecture & Features

### 1. [Lead Generation & Rate Limiting](docs/enquiry-system.md)
- **Enquiry Pipeline**: Server actions handle form submissions natively (`app/enquire/actions.ts`), paired with Zod validation. 
- **Spam Prevention**: Multi-tier rate limiting (1 min, 1 hr, 24 hr thresholds) enforced via a Supabase `rate_limit_log` table. Captures client IPs and geolocation (`x-vercel-ip-country`). Identifies and blocks duplicate submissions within 48 hours.
- **Alerts**: Dispatches rich Discord webhook notifications on successful lead captures, including UTM/Persona tracking (`navansh_persona` cookie).

### 2. [Financial Calculators](docs/calculators.md)
- **Tools Available**: SIP, SWP, FD, HLV, Mediclaim, and Education Inflation.
- **State Sync**: Uses Zustand with a custom hydration guard (`useHydrateStore`) to prevent Next.js SSR mismatches.
- **Shareability**: Granular state management supports URL-based restoration (`?calc=sip&amt=...`), allowing agents and users to share pre-filled calculation states.

### 3. [Mutual Fund Screener & Automated Data Pipeline](docs/mutual-funds.md)
- **Screener UI**: Filters by AMCs, categories, and sorts by CAGR. Employs `@tanstack/react-virtual` to maintain 60fps scrolling on large scheme tables.
- **Data Pipeline** (three-tier automation):
  - **Seed** (`scripts/seed-mf.ts`): One-time discovery of all schemes for configured AMCs via the mfapi.in search endpoint. Writes a local JSON cache (`scripts/mf-seed-cache.json`) so failed Supabase upserts can be replayed with `--from-cache`.
  - **Biweekly backfill** (GitHub Actions `mf-backfill.yml`, 1st & 15th of each month): Runs `scripts/backfill-returns.ts` directly on a CI runner. Fetches the complete NAV history per scheme, calculates 1Y/3Y/5Y CAGR from the full dataset, downsamples to ≤ 1,000 points/scheme (to stay within Supabase's PostgREST row limit), and replaces stored rows via DELETE + INSERT. Prunes dead funds (no NAV update > 6 months).
  - **Daily sync** (GitHub Actions `mf-sync.yml`, weekdays at 06:00 & 14:20 IST): Triggers `POST /api/mf/sync`. Fetches only the latest NAV per scheme and recalculates returns in a single batched upsert. Protected by `x-cron-secret`.
  - Both GH Actions workflows support a `workflow_dispatch` input to target **dev or prod** on demand.

### 4. [Blog CMS](docs/blog-cms.md)
- **Custom Admin**: Authenticated via Supabase (`/blog/admin`). Uses RLS to ensure public users only query `published = true` rows.
- **Editor**: Integrates `@blocknote/react` for block-based rich text editing, outputting JSON to the database.
- **Storage**: Image uploads are piped directly to Supabase storage buckets, validated server-side.

## Low-Level Architecture & Implementation

### 1. [Lead Intake & Rate Limiting Engine](docs/enquiry-system.md)
**Implementation:** Form submissions bypass standard API routes, using Next.js Server Actions (`app/enquire/actions.ts`) combined with Zod schemas for strict runtime type-safety and sanitization. 
**Security & Anti-Spam:**
Supabase `rate_limit_log` table acts as the gatekeeper. It tracks `x-vercel-ip-country` headers and client IPs to enforce multi-tier thresholds (1m, 1h, 24h). Duplicates within a 48-hour window are silently dropped.
**Delivery Pipeline:**
Successful leads trigger asynchronous Discord webhook payloads containing client data and `navansh_persona` cookie values for UTM attribution.


### 2. [Client-Side Computation (Calculators)](docs/calculators.md)
**Implementation:**
Six distinct calculators (SIP, SWP, FD, HLV, Mediclaim, Education) driven by a globally persisted Zustand store. State is cached in `sessionStorage`.
**Hydration & SSR:**
Utilizes a custom `useHydrateStore` hook to intentionally delay state injection until the component mounts, entirely bypassing Next.js hydration mismatch errors.
**Deep Linking:**
Calculators parse `window.location.search` (`?calc=sip&amt=...`) to dynamically seed the Zustand store, enabling instant state-sharing for agents.


### 3. [Mutual Fund Data Pipeline & DOM Recycling](docs/mutual-funds.md)
**Ingestion & Processing (layered automation):**
- **Seed** (`pnpm seed:mf`): Discovers schemes via targeted search queries against mfapi.in (15-result cap bypassed with multiple queries per AMC). Deduplicates and upserts into Supabase. Writes `scripts/mf-seed-cache.json` for crash recovery (`--from-cache` flag replays upserts without re-hitting the API).
- **Biweekly backfill** (GitHub Actions `mf-backfill.yml`): Runs on the CI runner (not via HTTP — the script takes 5–10 min and is too heavy for a serverless function). Fetches the entire NAV history per scheme from mfapi.in, calculates CAGR from the full raw data, downsamples to ≤ 1,000 rows/scheme, and replaces stored rows (DELETE + INSERT). Dead fund pruning runs here. Targets prod on schedule; dev or prod selectable via `workflow_dispatch` input.
- **Daily sync** (GitHub Actions `mf-sync.yml` → `POST /api/mf/sync`): Lightweight — fetches only the latest NAV, fetches all `mf_nav` rows in one query, groups in-memory by `scheme_code` via a `Map`, computes 1Y/3Y/5Y CAGR with `calculateReturns()`, and pushes a single batched upsert to `mf_schemes`. Zero N+1 queries.

**UI Rendering:**
The frontend utilises `@tanstack/react-virtual` to recycle DOM nodes, allowing the screener to maintain 60fps scrolling while rendering hundreds of scheme rows.


### 4. [Blog CMS Internal Abstraction](docs/blog-cms.md)
**Implementation:**
A bespoke admin interface (`/blog/admin`) secured by Supabase Auth. Content is authored via `@blocknote/react`, which serializes rich text into structured JSON rather than raw HTML.
**Storage & Security:**
Images are uploaded directly to Supabase storage buckets. PostgreSQL Row Level Security (RLS) is strictly configured: unauthenticated users can only `SELECT` rows where `published = true`.

---

#### Contributing

Want to contribute? Read the [Contributing Guide](docs/CONTRIBUTING.md) for setup instructions, branch conventions, environment variables, and the full development workflow.

#### Developed and Maintained by [Anshuman Khunteta](https://www.linkedin.com/in/anshumankhunteta/)
