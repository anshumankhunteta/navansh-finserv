# Navansh Finserv

A performance-focused, SEO-optimized lead generation website for a financial services firm. Built with a modern, minimal design language and engineered for conversion, speed, and long-term maintainability.

**Live:** [navansh.in](https://navansh.in)

---

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Framework      | Next.js 16 (App Router, React 19)               |
| Language       | TypeScript 5                                    |
| Styling        | Tailwind CSS 4                                  |
| Components     | Shadcn UI, Radix UI primitives                  |
| Icons          | Lucide React                                    |
| Forms          | React Hook Form + Zod 4 validation              |
| Database       | Supabase (PostgreSQL)                           |
| Notifications  | Discord Webhook (real-time lead alerts)         |
| Analytics      | Vercel Analytics, Vercel Speed Insights         |
| Theming        | next-themes (light / dark / system)             |
| Font           | Inter (Google Fonts, `font-display: swap`)      |
| Hosting        | Vercel                                          |

---

## Key Features

### Lead Generation Pipeline
- Server-side enquiry form powered by React Hook Form and Zod schema validation with input sanitization (HTML stripping, whitespace normalization).
- Leads are persisted to a Supabase `leads` table and simultaneously dispatched as rich Discord embed notifications with one-click action links (WhatsApp, call, email).
- Multi-tier rate limiting on form submissions: per-minute, per-hour, and per-day thresholds enforced via a dedicated `rate_limit_log` table.
- Duplicate lead detection using case-insensitive name and demographic matching.
- IP-based geolocation using Vercel headers (production) with a fallback API for local development; country data is stored alongside each lead.
- Confetti animation on successful submission for user delight.

### Persona Tracking Middleware
- Edge middleware intercepts incoming requests and reads `?service=` or `?utm_campaign=` query parameters.
- Parameters are mapped to human-readable persona names (e.g., `mutual-funds` maps to `Investor`, `health-mediclaim` maps to `Family Protector`).
- Persona history is stored as a comma-separated cookie (`navansh_persona`) with a rolling window of the five most recent interests and a 30-day expiry.
- Persona data is attached to every lead submission and surfaced in Discord notifications for immediate sales context.

### Interactive Financial Calculators
- **SIP Calculator** -- Systematic Investment Plan projections with configurable monthly investment, expected return rate, and tenure.
- **FD Calculator** -- Fixed Deposit maturity value estimator with compounding frequency options.
- **SWP Calculator** -- Systematic Withdrawal Plan simulator for retirement income modelling.
- **HLV Calculator** -- Human Life Value estimator to determine appropriate life insurance coverage.
- **Mediclaim Estimator** -- Health insurance coverage calculator based on family size, age, and city tier.
- **Education Inflation Calculator** -- Future cost of education projector accounting for inflation rates.

### Comprehensive SEO
- Per-page `<title>`, `<meta description>`, canonical URLs, and OpenGraph / Twitter Card metadata.
- Structured data via JSON-LD (`FinancialService` schema) injected in the root layout.
- Dynamic `sitemap.ts` and `robots.ts` generated at build time.
- Extensive keyword targeting for location-specific and service-specific search queries.

### Digital Business Card
- Downloadable and shareable digital business card page (`/milee`, also accessible via `/card` and `/businesscard` rewrites).
- Card-to-image export using `html-to-image` for PNG downloads.

### UI and UX
- Light, dark, and system-preference theme support via `next-themes`.
- Floating WhatsApp call-to-action button on all pages for instant contact.
- Responsive layout across mobile, tablet, and desktop breakpoints.
- Hover animations and interactive card transitions throughout.
- Custom 404 page.

### Performance and Security
- Gzip compression enabled at the framework level.
- `X-Powered-By` header suppressed for security.
- React Strict Mode enabled.
- `httpOnly: false` on persona cookies to allow optional client-side reads; all form inputs are sanitized server-side.

### Code Quality
- ESLint 9 with `eslint-config-next` and `eslint-config-prettier`.
- Prettier with Tailwind CSS class sorting plugin.
- Husky pre-commit hooks running lint-staged checks (Prettier + ESLint) on every commit.

---

## Pages

| Route       | Description                                    |
| ----------- | ---------------------------------------------- |
| `/`         | Home -- hero, service offerings, value props   |
| `/about`    | Founder story, company values                  |
| `/services` | Full service catalog with per-service details  |
| `/enquire`  | Lead capture form (also available at `/quote`) |
| `/contact`  | Contact information, embedded Google Maps      |
| `/privacy`  | Privacy policy                                 |
| `/milee`    | Digital business card (also `/card`, `/businesscard`) |

---

## Directory structure:
└── anshumankhunteta-navansh-finserv/
    ├── README.md
    ├── components.json
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── tsconfig.json
    ├── .lintstagedrc.json
    ├── .prettierignore
    ├── .prettierrc
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── manifest.ts
    │   ├── not-found.tsx
    │   ├── page.tsx
    │   ├── robots.ts
    │   ├── sitemap.ts
    │   ├── about/
    │   │   └── page.tsx
    │   ├── contact/
    │   │   └── page.tsx
    │   ├── enquire/
    │   │   ├── actions.ts
    │   │   ├── EnquireContent.tsx
    │   │   ├── page.tsx
    │   │   └── schema.sql
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
    │   │   ├── ContactForm.tsx
    │   │   ├── ContactInfo.tsx
    │   │   ├── FloatingWhatsAppButton.tsx
    │   │   ├── ThemeProvider.tsx
    │   │   ├── ThemeToggle.tsx
    │   │   └── calculators/
    │   │       ├── EducationInflationCalculator.tsx
    │   │       ├── FDCalculator.tsx
    │   │       ├── HLVCalculator.tsx
    │   │       ├── MediclaimEstimator.tsx
    │   │       ├── SIPCalculator.tsx
    │   │       └── SWPCalculator.tsx
    │   ├── icons/
    │   │   ├── Navansh.tsx
    │   │   └── Whatsapp.tsx
    │   ├── layout/
    │   │   ├── Footer.tsx
    │   │   └── Navbar.tsx
    │   └── ui/
    │       ├── button.tsx
    │       ├── carousel.tsx
    │       ├── dropdown-menu.tsx
    │       ├── sheet.tsx
    │       └── slider.tsx
    ├── lib/
    │   ├── finance-math.ts
    │   ├── utils.ts
    │   └── supabase/
    │       └── server.ts
    └── .husky/
        └── pre-commit



## Getting Started

```bash
# Clone the repository
git clone https://github.com/anshumankhunteta/navansh-finserv.git
cd navansh-finserv

# Install dependencies
npm install

# Start the development server
npm run dev

# Production build
npm run build
npm start
```

### Environment Variables

Create a `.env.local` file with the following keys:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DISCORD_WEBHOOK_URL=
```

---

## Disclaimer

Insurance is the subject matter of solicitation. Navansh Finserv IRDAI Registration is currently **in progress**.

---

Developed and Maintained by **Anshuman Khunteta**
