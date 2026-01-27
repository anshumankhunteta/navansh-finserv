# Navansh Finserv - Insurance Firm Website

A modern, high-performance website for a Financial Services firm specializing in Insurance. Built with Next.js 14+ (App Router), Tailwind CSS, and Shadcn/UI components.

## Features

- **Mobile-First & Fully Responsive**: Optimized for iPhone SE, iPad, and 4K desktops
- **Secure**: OWASP-compliant security headers and XSS prevention
- **Modern Stack**: Next.js 14+, Tailwind CSS, Shadcn/UI, React Hook Form + Zod
- **Modular Architecture**: Clean, separated components for easy customization

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Components**: Shadcn/UI with Lucide React icons
- **Font**: Inter (Google Fonts)
- **Form Handling**: React Hook Form + Zod validation
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── services/          # Services page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Shadcn/UI components
│   ├── navbar.tsx        # Navigation component
│   └── footer.tsx        # Footer component
├── lib/                  # Utility functions
│   └── utils.ts          # Tailwind class utilities
└── next.config.js        # Next.js configuration with security headers
```

## Security Features

The project includes OWASP-compliant security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-XSS-Protection: 1; mode=block`
- `Permissions-Policy` restrictions

## Customization

### Content Placeholders

Throughout the site, you'll find placeholder text marked with `[INSERT ... HERE]`. Replace these with your actual content:
- Hero section images and copy
- Service descriptions
- Founder bio and images
- Contact information
- Trust signal logos

### Calendar Integration

On the Contact page, replace the Calendly iframe URL:
```tsx
src="https://calendly.com/[INSERT-CALENDLY-USERNAME]/[INSERT-EVENT-TYPE]"
```

### Form Submission

The contact form currently uses a placeholder submission handler. To integrate with email forwarding or a third-party service:
1. Update the `onSubmit` function in `app/contact/page.tsx`
2. Configure your email service (e.g., Resend, SendGrid, or Tally.so embed)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Self-hosted with Node.js

## Design System

- **Primary Color**: Navy Blue (`slate-900`)
- **Accent Color**: Gold/Amber (`amber-500`)
- **Background**: Dark slate (`slate-800`, `slate-900`)
- **Typography**: Inter (sans-serif)
- **Spacing**: Mobile-first with responsive gaps (`gap-4` mobile, `gap-8`/`gap-12` desktop)

## License

[INSERT LICENSE INFORMATION HERE]
