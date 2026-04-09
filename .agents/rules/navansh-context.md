---
trigger: always_on
---

---

# Project Context

## Stack
TypeScript | React 19 / Next.js 16.1.7+ (App Router) | TailwindCSS 4 | Supabase SSR | Zustand (Persist) | Zod & Hook Form

## Folder Structure
- `app`: Next.js App Router root (pages, server components, layouts, API routes)
- `components/custom`: Domain-specific components (calculators, complex forms)
- `components/ui`: Generic headless/reusable UI components (Shadcn/Radix)
- `components/providers`: Global context wrappers (Theme, Lenis smooth scroll)
- `components/landing`: Distinct sections for the marketing homepage
- `components/layout`: Structural UI parts (Navbar, Footer)
- `lib/supabase`: Next.js SSR Supabase client instantiators
- `lib`: Business logic (Zustand stores, math utils, schemas, generic helpers)

## Architecture & Patterns
- [Data Fetching & Auth] → Server Components fetch data & session via `@supabase/ssr` (`createClient()` in `lib/supabase/server.ts`).
- [State Management] → `zustand` with `persist` middleware storing to `sessionStorage`. Hydrated manually via `useHydrateStore()` to avoid Next.js mismatches.
- [Form Handling] → React Hook Form + Zod on the client wrapper; submit handlers use `startTransition(formAction)` binding to React 19 `useActionState` Server Actions.
- [Styling] → Pure TailwindCSS 4 using `cn()` (`clsx` + `tailwind-merge`); no raw CSS besides `globals.css` patterns.
- [Animations] → Framer Motion client wrappers (like `RefractiveContainer`) heavily used to animate Server Components.
- [Routing] → Everything defaults to Server Components; explicitly mark `"use client"` only at the interactive leaf nodes.

## Code Quality Rules
- Strict TypeScript (`strict: true`); avoid `any` completely.
- Import paths use absolute aliases (`@/components`, `@/lib`).
- Prettier formatting with `prettier-plugin-tailwindcss` sorting.
- ESLint strictly configured using `eslint-config-next/core-web-vitals`.
- Enforced clean Git commits via Husky and `lint-staged` pre-commit hooks.
- Prefix unused variables or arguments with `_` conventionally.

## Key Abstractions (reuse, don't recreate)
| Name | Type | Purpose |
|------|------|---------|
| `useCalculatorStore` | Zustand Store | Centralized, persistent state for all 6 calculators; handles complex URL parse/serialize logic. |
| `ContactForm` | Client Component | Reusable RHF + Server Action enquiry form featuring confetti & rate-limiting logic. |
| `RefractiveContainer` | Client Component | Reusable Framer Motion wrapper adding glow, blur, and scroll-reveal effects to containers. |
| `cn` | Utility function | Safe merging of conditional Tailwind classes (`clsx` + `twMerge`). |
| `AuthGuard` | Client Component | Wrapper validating Supabase sessions to protect admin routes on the client side. |

## Feature Inventory
- Landing Page: High-conversion hero, bento-grid services, animated calculator preview — `app/page.tsx`
- Financial Calculators: SIP, FD, SWP, HLV, Education, Mediclaim calculators with URL-sharing capabilities — `lib/calculator-store.ts` & `components/custom/calculators`
- Contact/Enquiry Flow: Rate-limited server action submissions with confetti success state — `components/custom/ContactForm.tsx` & `app/enquire`
- Blog/CMS: Blogs and Articles Page. Admin dashboard with native image upload and Supabase auth guard — `app/blog/admin`
- Mutual Fund Screener: Full-featured fund discovery tool at `/mf` with search, category/AMC filters, virtualized table, NAV chart modal, and scheme detail pages (`/mf/[schemeCode]`). Data pipeline: `seed-mf.ts` (discovery) → `backfill-returns.ts` (full history + pruning) → `/api/mf/sync` (daily cron). Schema in `app/mf/schema.sql`; shared types + CAGR logic in `lib/mf-utils.ts`.

## Gotchas & Non-obvious Rules
- Zustand `persist` uses `sessionStorage`. Client components reading the store MUST call `useHydrateStore()` first to avoid SSR hydration mismatch.
- Form submissions with RHF require calling `handleSubmit` to trigger client validation, then dispatching the form data to the Server Action inside `startTransition()`.
- Calculator sharing works by encoding the entire calculator state into URL search params (e.g. `?calc=sip&amt=10000`), handled uniquely by functions in `calculator-store.ts`.
- The success confetti effect in `ContactForm.tsx` has a strict 10-use limit per session tracked in `sessionStorage` (`confettiCount`).
- Always use `lib/supabase/server.ts` for database access in Server Components/Actions, never the standard `@supabase/supabase-js` client directly.
- **MF dead-fund pruning**: Both `backfill-returns.ts` and `/api/mf/sync` check the latest NAV date from the API response (`data.data[0].date`). If it is older than `STALE_MONTHS` (default 6, defined at the top of each file), the fund is deleted from `mf_nav` and `mf_schemes` before any upserts. Adjust the constant in both files to change the threshold.
- **MF sync avoids N+1**: The sync route fetches all `mf_nav` rows in a single query, groups them in-memory by `scheme_code` with a `Map`, calculates CAGR for each group via `calculateReturns()`, then performs a single batched upsert back to `mf_schemes`. Never add per-scheme queries inside the recalculation loop.

---

> **AGENT INSTRUCTION**: Update this `Context.md` file **IF AND ONLY IF** you are implementing or modifying a new Pattern, Abstraction, Major Feature, or Gotcha. Do not update this file for minor bug fixes or localized component changes.