# Enquiry & Lead Capture System — Feature Documentation

> Server-action-driven lead intake pipeline with multi-tier rate limiting, duplicate detection, and Discord webhook notifications.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Form Validation (Zod Schema)](#form-validation-zod-schema)
- [Rate Limiting](#rate-limiting)
- [Duplicate Detection](#duplicate-detection)
- [Discord Webhook Notifications](#discord-webhook-notifications)
- [Persona Tracking](#persona-tracking)
- [Database Schema](#database-schema)
- [File Structure](#file-structure)
- [Gotchas & Notes](#gotchas--notes)

---

## Overview

The enquiry system captures potential client leads through a multi-step form (`ContactForm`) and processes them entirely via a Next.js Server Action — no API routes involved. It includes anti-spam measures, geolocation tracking, persona-based UTM attribution, and real-time Discord notifications.

The form appears on:
- `/enquire` — standalone enquiry page (also receives calculator share links)
- `/contact` — contact page with embedded form

---

## Architecture

```
User fills ContactForm (Client Component)
  │
  │ React Hook Form + Zod (client validation)
  │ startTransition(formAction) → React 19 useActionState
  │
  ▼
submitEnquiry() — Server Action (app/enquire/actions.ts)
  │
  ├── 1. Parse FormData + Zod validation (server-side)
  ├── 2. Get client IP (x-vercel-forwarded-for / x-forwarded-for / x-real-ip)
  ├── 3. Get country (x-vercel-ip-country → fallback: ipapi.co)
  ├── 4. Read persona cookie (navansh_persona)
  ├── 5. Duplicate check (name + contact match within 48h)
  ├── 6. Multi-tier rate limiting (1min / 1hr / 24hr)
  ├── 7. Insert into `leads` table
  ├── 8. Log to `rate_limit_log` table
  └── 9. Send Discord webhook (async, non-blocking on failure)
```

---

## Form Validation (Zod Schema)

The enquiry form validates both client-side (React Hook Form) and server-side (Zod in the Server Action). Server-side validation is the source of truth.

| Field | Rules |
|-------|-------|
| `firstName` | 2–50 chars, letters only, sanitized, no repeating chars (e.g. `aaaa`), each word ≥ 2 chars |
| `lastName` | Same as first name |
| `phone` | Exactly 10 digits (optional, required if WhatsApp/Call selected) |
| `email` | Valid email (optional, required if "Send me a mail" selected) |
| `message` | Max 500 chars, HTML tags stripped |
| `age` | Integer, max 100 (optional) |
| `gender` | Enum: `male`, `female`, `other`, `prefer-not-to-say` (optional) |
| `contactMethod` | Array of `whatsapp` / `call` / `mail` — at least 1 required |

**Conditional validation**: contact method selection drives which contact fields become required.

---

## Rate Limiting

Rate limiting is enforced server-side via the `rate_limit_log` Supabase table, keyed by client IP.

| Tier | Window | Limit | User Message |
|------|--------|-------|-------------|
| **Tier 1** | Last 1 minute | 1 submission | "Please wait a moment before submitting another enquiry." |
| **Tier 2** | Last 1 hour | 30 submissions | "Too many submissions. Please try again later." |
| **Tier 3** | Last 24 hours | 360 submissions | "Daily submission limit reached. Please try again tomorrow." |

Each successful submission inserts a row into `rate_limit_log` with the client IP, country, and a name-based fingerprint hash.

### IP Resolution Priority

1. `x-vercel-forwarded-for` (trusted Vercel header)
2. `x-forwarded-for` (first IP in chain)
3. `x-real-ip`
4. Fallback: `127.0.0.1` (local dev)

---

## Duplicate Detection

Before rate limiting checks, the system looks for an existing lead matching **all** of:
- Same `first_name` (case-insensitive)
- Same `last_name` (case-insensitive)
- Same `age` and `gender`
- At least one matching contact detail (phone OR email)
- Submitted within the last **48 hours**

If a duplicate is found, the user is told when they can resubmit (48h from the original submission).

---

## Discord Webhook Notifications

On successful lead capture, a rich Discord embed is sent to the configured webhook:

| Embed Field | Content |
|-------------|---------|
| Name | First + Last name |
| Age / Gender | Demographic data |
| Phone | Clickable `tel:` link |
| Email | Clickable `mailto:` link |
| Location | Country flag emoji + ISO code |
| Message | User's message (blockquoted) |
| Preferences | Which contact methods they selected |
| Persona | Comma-separated interest history from cookie |
| Quick Actions | Clickable WhatsApp chat / Call / Email links based on user preference |

The webhook pings `@everyone` and uses a random embed color.

**Failure handling**: If the Discord webhook fails, the error is logged but the submission is **not** rolled back — the lead is already saved to the database.

---

## Persona Tracking

The `navansh_persona` cookie tracks user interest across the site. It's set by middleware when users visit pages with `?service=` or `?utm_campaign=` parameters.

- Format: comma-separated values, e.g. `Investor,Family Protector`
- Read in the server action and stored in the `persona` column of `leads`
- Displayed in the Discord notification for sales context

---

## Database Schema

### `leads` table

```sql
CREATE TABLE leads (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name     TEXT NOT NULL,
  last_name      TEXT NOT NULL,
  email          TEXT,
  phone          TEXT,
  message        TEXT,
  contact_method TEXT[] NOT NULL,
  country        TEXT,                  -- ISO country code (e.g., 'IN', 'US')
  age            INTEGER,
  gender         TEXT,
  persona        TEXT,                  -- Comma-separated interest history
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
```

### `rate_limit_log` table

```sql
CREATE TABLE rate_limit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_ip   TEXT NOT NULL,
  country     TEXT,
  fingerprint TEXT,                     -- Hash of name for analytics
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rate_limit_ip_time ON rate_limit_log(client_ip, created_at DESC);
ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (rate limit check runs before auth)
CREATE POLICY "allow_public_rate_limit_inserts" ON rate_limit_log
  FOR INSERT WITH CHECK (true);
```

Schema file: `app/enquire/schema.sql`

---

## File Structure

```
app/enquire/
  actions.ts            # Server Action: validation, rate limiting, DB insert, Discord
  schema.sql            # Database schema (leads + rate_limit_log)
  page.tsx              # Enquiry page (Server Component shell)
  EnquireContent.tsx    # Client component with calculator URL restore + form

components/custom/
  ContactForm.tsx       # Reusable RHF + Server Action form with confetti

app/contact/
  page.tsx              # Contact page (embeds ContactForm)
```

---

## Gotchas & Notes

- **Confetti has a 10-use limit** — the `ContactForm` component tracks confetti uses in `sessionStorage` (`confettiCount`). After 10 successful submissions in a session, confetti stops firing to avoid performance issues.

- **Input sanitization happens before Zod validation** — the `sanitizeText` transform strips `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, and `<style>` tags, then normalizes whitespace. This runs via Zod's `.transform()` before `.pipe()` validation.

- **The fingerprint is NOT cryptographic** — `createFingerprint()` uses a simple hash of `firstName-lastName` for rate limiting analytics, not security. Don't rely on it for identity verification.

- **Geolocation fallback is rate-limited** — in local dev (where `x-vercel-ip-country` is unavailable), the system falls back to `ipapi.co` which has a 45 req/min limit. The response is cached for 1 hour via `next.revalidate`.

- **No RLS read policy on `leads`** — the `leads` table has RLS enabled but no public read policy. Only the service role client (used in server actions) can query leads. This is intentional — leads contain PII.

- **Calculator share links land on the enquiry page** — the `/enquire` page reads URL params like `?calc=sip&amt=15000` and restores calculator state via `restoreFromUrl()` from `calculator-store.ts`.
