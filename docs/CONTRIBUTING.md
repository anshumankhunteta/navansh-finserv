# Contributing Guide

Welcome! This guide will help you get up and running as a contributor. If you run into anything unclear, open an issue or ask in the team chat.

---

## Table of Contents

- [Requesting Access](#requesting-access)
- [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Database Setup](#database-initialization--seeding)
- [Development Workflow](#development-workflow)
- [Code Style & Conventions](#code-style--conventions)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Getting Help](#getting-help)

---

## Requesting Access

Before you begin, make sure you have access to the following:

| Resource | How to Request |
|---|---|
| GitHub Repository | [Request access →](https://github.com/anshumankhunteta/navansh-finserv) |
| Vercel | [Request access →](https://vercel.com/anshumankhuntetas-projects/navansh-finserv) |
| Supabase Project | [Request access →](https://supabase.com/dashboard/project/edyrjsphbskqdvwsneek) |
| Discord / Team Chat | [Join here →](https://discord.gg/YuPpRjzYtA) |

---

## Local Development Setup

### Prerequisites

Before cloning the repo, ensure you have the following installed:

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **npm** v9+ (bundled with Node.js)
- **Git** — [Download](https://git-scm.com/)
- Access to the **Supabase project** (see [Requesting Access](#requesting-access))

You can verify your Node version with:

```bash
node -v
npm -v
```

---

### 1. Clone the Repository

```bash
git clone <REPO_URL>
cd <PROJECT_DIRECTORY>
```

> Replace `<REPO_URL>` with the actual repository URL once you have access.

---

### 2. Environment Variables

Create a `.env.local` file in the root of the project:

```bash
cp .env.example .env.local   # if an example file exists, otherwise create it manually
```

Then populate {} with relevant values (obtain secrets from the supabase project):

```env

NEXT_PUBLIC_PHONE_NUMBER=+917980659845
NEXT_PUBLIC_CONTACT_EMAIL=sales@navansh.in
NEXT_PUBLIC_SUPABASE_URL={}
NEXT_PUBLIC_SUPABASE_ANON_KEY={}
SUPABASE_SERVICE_ROLE_KEY={}
DISCORD_WEBHOOK_URL={}
CRON_SECRET=anything-works-here
```

> ⚠️ **Never commit `.env.local` to version control.** It is already listed in `.gitignore`.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for client-side access |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for server-side/admin operations |
| `DISCORD_WEBHOOK_URL` | Webhook URL for Discord notifications |
| `CRON_SECRET` | A secure random string used to authenticate cron job requests (this can be anything) |

---

### 3. Install Dependencies & Run Locally

```bash
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

### 4. Dev Environment Auth (/admin/login)

The credentials for logging into the dev environment unified admin dashboard are:

```
Email: user@email.com
Password: pass123
```

---

## Project Structure

A quick orientation to help you find your way around:

```
/
├── app/                  # Next.js App Router root (pages, APIs, layouts)
│   ├── admin/            # Unified Admin Dashboard (Blog CMS & Newsletter)
│   ├── api/              # API routes (including background cron jobs)
│   ├── blog/             # Public Blog UI & post routing
│   ├── enquire/          # Server Actions for Lead tracking & form submission
│   └── mf/               # Mutual Fund Screener feature pages
├── components/           # UI and Feature components
│   ├── custom/           # Domain-specific modules (Calculators, MFScreener, etc.)
│   ├── landing/          # Homepage specific animated sections
│   └── ui/               # Generic Headless UI wrappers (Shadcn/Radix)
├── lib/                  # Business logic & Global State
│   ├── calculator-store.ts # Zustand persistent state for financial tools
│   └── supabase/         # Server-side Supabase instantiators (@supabase/ssr)
├── scripts/              # Independent Node scripts (e.g., DB data seeders)
├── supabase/             # Local Supabase Dev Environment & SQL Migrations
├── public/               # Static assets (images, fonts, metadata)
├── .env.local            # (create this file)
└── package.json          # Core project dependencies and npm scripts
```

Each feature directory under `app/` typically contains its own `schema.sql` for the database schema relevant to that feature.

---

## Database Initialization & Seeding

### Applying Schemas

Make sure your Supabase instance has the necessary schemas applied. Run the following SQL files in order via the Supabase SQL editor or CLI:

1. `app/mf/schema.sql`
2. `app/blog/schema.sql`
3. `app/enquire/schema.sql`
4. `app/admin/schema.sql`

> **Tip:** You can run these via the [Supabase Dashboard SQL Editor](https://supabase.com/dashboard) or using the Supabase CLI:
> ```bash
> supabase db push
> ```

---

## Development Workflow

>We encourage AI use. Use any Agentic IDE (Cursor, [Antigravity](https://antigravity.google/), Kiro, etc.) to help you with the development process, but be mindful and always provide enough context to the agent. Always verify AI code before pushing. There are context files present in the repo for your agent!

We follow a standard feature-branch workflow:

1. **Sync with main** before starting any new work:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a feature branch** using a descriptive name:
   ```bash
   git checkout -b feat/your-feature-name
   # or for fixes:
   git checkout -b fix/issue-description
   ```

3. **Make your changes**, commit often with clear messages (see [Code Style & Conventions](#code-style--conventions)).

4. **Push your branch** and open a Pull Request against `main`.

---

## Code Style & Conventions

- **Language:** TypeScript — avoid using `any` where possible.
- **Framework:** Next.js (App Router). Follow Next.js conventions for layouts, server components, and route handlers.
- **Database:** Supabase. Use typed queries where possible; avoid raw SQL in component files.
- **Commits:** We loosely follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: add mutual fund filter by category`
  - `fix: resolve NAV fetch timeout`
  - `chore: update dependencies`
- **Linting:** Run `npm run lint` before pushing. PRs with lint errors will not be merged.

---

## Submitting a Pull Request

1. Ensure your branch is up to date with `main`.
2. Run `npm run lint` and fix any issues.
3. Open a Pull Request with:
   - A clear title describing the change.
   - A short description of *what* changed and *why*.
   - Screenshots or recordings for any UI changes.
4. Request a review from a team lead.
5. Address review feedback and re-request review once resolved.

> PRs should be focused and small where possible. Large PRs are harder to review and slower to merge.

---

## Getting Help

>Ask your AI agent for local setup related questions, this file should have enough context :)

If you're stuck or have questions:

- **Team Chat:** [Join the Discord →](https://discord.gg/YuPpRjzYtA)
- **Open an Issue:** [GitHub Issues →](https://github.com/khunt-dev/navansh-finserv/issues)

We're glad to have you contributing — don't hesitate to ask questions!