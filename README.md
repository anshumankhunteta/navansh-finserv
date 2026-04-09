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
    │   └── mutual-funds.md
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
    │       └── mf-sync.yml
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

### 3. Mutual Fund Screener & Cron Sync
- **Screener UI**: Filters by AMCs, categories, and sorts by CAGR. Employs `@tanstack/react-virtual` to maintain 60fps scrolling on large scheme tables.
- **Data Pipeline**: 
  - Syncs daily from `mfapi.in` via a Vercel Cron Job (`POST /api/mf/sync`). Protected by `x-cron-secret`.
  - Fetches metadata and NAV history, automatically prunes "dead" funds (no NAV updates >6 months), and recalculates 1Y/3Y/5Y CAGR in a single batch upsert to avoid N+1 queries.

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

> **Critical Architecture Review:** Relying purely on Discord webhooks for lead delivery is a single point of failure. If Discord's API rate-limits your server or goes down, leads vanish. 
> *Tough Question:* Where is your Dead Letter Queue (DLQ)? Do you have a secondary Supabase table specifically holding "unnotified leads" that a cron job can retry later?

### 2. Client-Side Computation (Calculators)
**Implementation:**
Six distinct calculators (SIP, SWP, FD, HLV, Mediclaim, Education) driven by a globally persisted Zustand store. State is cached in `sessionStorage`.
**Hydration & SSR:**
Utilizes a custom `useHydrateStore` hook to intentionally delay state injection until the component mounts, entirely bypassing Next.js hydration mismatch errors.
**Deep Linking:**
Calculators parse `window.location.search` (`?calc=sip&amt=...`) to dynamically seed the Zustand store, enabling instant state-sharing for agents.


### 3. Mutual Fund Data Pipeline & DOM Recycling
**Ingestion & Processing:**
Automated via GitHub Actions cron (`00:30 UTC` / `08:50 UTC`) triggering `POST /api/mf/sync` route (secured by `x-cron-secret`). 
**Performance Optimization:** The sync controller actively avoids N+1 database queries. It fetches all `mf_nav` rows simultaneously, constructs an in-memory `Map` keyed by `scheme_code`, computes the 1Y/3Y/5Y CAGR via `calculateReturns()`, and pushes a single batched upsert to the `mf_schemes` table.
**UI Rendering:**
The frontend utilizes `@tanstack/react-virtual` to recycle DOM nodes, allowing the screener to maintain 60fps scrolling while rendering thousands of scheme rows.


### 4. Blog CMS Internal Abstraction
**Implementation:**
A bespoke admin interface (`/blog/admin`) secured by Supabase Auth. Content is authored via `@blocknote/react`, which serializes rich text into structured JSON rather than raw HTML.
**Storage & Security:**
Images are uploaded directly to Supabase storage buckets. PostgreSQL Row Level Security (RLS) is strictly configured: unauthenticated users can only `SELECT` rows where `published = true`.

---

#### Developed and Maintained by [Anshuman Khunteta](https://www.linkedin.com/in/anshumankhunteta/)
