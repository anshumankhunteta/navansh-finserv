# Navansh Finserv

A performance focused, SEO-optimized website for a financial services firm for Generating Leads. Built with a Modern and Minimal Design Language keeping UX in mind.

### Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Styling:** Tailwind CSS
- **Components:** Shadcn UI
- **Icons:** Lucide React
- **Lead Gen:** Using a Custom Zod Form and Discord Webhook
- **Database:** Supabase


### Directory Structure

```
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
    │   ├── not-found.tsx //404 page
    │   ├── page.tsx //Home
    │   ├── sitemap.ts
    │   ├── about/
    │   │   └── page.tsx //About Us
    │   ├── contact/
    │   │   └── page.tsx //Contact Us
    │   ├── enquire/
    │   │   ├── actions.ts //Enquiry Form Server action for pusing data to Supabase and Send Leads on Phone via Discord
    │   │   ├── page.tsx //Enquire Now
    │   │   └── schema.sql //schema for Leads Data
    │   ├── privacy/
    │   │   └── page.tsx //Privacy Policy
    │   └── services/
    │       └── page.tsx //Services
    ├── components/
    │   ├── custom/
    │   │   ├── contact-form.tsx
    │   │   ├── ContactInfo.tsx
    │   │   ├── FloatingWhatsAppButton.tsx
    │   │   ├── SIPCalculator.tsx
    │   │   ├── ThemeProvider.tsx
    │   │   └── ThemeToggle.tsx
    │   ├── icons/
    │   │   └── Whatsapp.tsx
    │   ├── layout/
    │   │   ├── Footer.tsx
    │   │   └── Navbar.tsx
    │   └── ui/ //shad-cn components
    │       ├── button.tsx
    │       ├── dropdown-menu.tsx
    │       └── sheet.tsx
    ├── lib/
    │   ├── utils.ts
    │   └── supabase/
    │       └── server.ts //Supabase config for Leads data
    ├── public/
    │   └── robots.txt
    └── .husky/
        └── pre-commit //scripts for code quality checks(eslint and prettier)

```

### Getting Started

- **Clone:** `git clone https://github.com/anshumankhunteta/navansh-finserv`
- **Install:** npm install
- **​Dev View:** npm run dev
- **​Build:** npm run build

### Disclaimer

Insurance is the subject matter of solicitation. Navansh Finserv IRDAI Registration is currently **_In Progress_**.

Developed by **Anshuman Khunteta**
