# Navansh Financial Services Website

A modern, high-performance website for a Financial Services firm specializing in Insurance, built with Next.js 14+ (App Router), Material UI, and Tailwind CSS.

## Features

- ✅ Mobile-First & Fully Responsive Design
- ✅ Material UI Components with Custom Styling
- ✅ Security Headers (OWASP Basics)
- ✅ Form Validation with React Hook Form + Zod
- ✅ TypeScript Support
- ✅ Optimized for Vercel Deployment

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + Material UI
- **Components:** Material UI (@mui/material, @mui/icons-material)
- **Forms:** React Hook Form + Zod
- **Font:** Inter (Google Fonts)
- **Deployment:** Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
navansh-finserv/
├── app/
│   ├── about/
│   │   └── page.tsx          # About page
│   ├── contact/
│   │   └── page.tsx          # Contact page with form
│   ├── services/
│   │   └── page.tsx          # Services page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/
│   │   ├── button.tsx        # Custom Button component
│   │   ├── card.tsx          # Custom Card component
│   │   ├── input.tsx         # Custom Input component
│   │   └── textarea.tsx      # Custom Textarea component
│   ├── footer.tsx             # Footer component
│   ├── navbar.tsx             # Navigation bar
│   └── theme-provider.tsx     # MUI Theme provider
├── lib/
│   └── utils.ts              # Utility functions
├── next.config.js            # Next.js configuration with security headers
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Customization

### Content Placeholders

The site includes placeholder text marked with `[INSERT ... HERE]` that you should replace:

- **Hero Section:** Update hero image and description
- **Trust Logos:** Replace placeholder logos with actual partner logos
- **Services:** Add detailed service descriptions and features
- **About:** Add founder photo and detailed bio
- **Contact:** Add Calendly/Cal.com embed URL
- **Footer:** Customize disclaimer text

### Colors

The color palette uses:
- **Navy Blue:** `#0f172a` (bg-slate-900)
- **Gold/Amber:** `#f59e0b` (text-amber-500)
- **White/Gray:** `#ffffff`, `#f8fafc` (backgrounds)

### Form Submission

The contact form currently logs to console. To enable actual form submission:

1. Set up an API route in `app/api/contact/route.ts`
2. Update the `onSubmit` handler in `app/contact/page.tsx`
3. Or integrate with a third-party service like Tally.so

## Security Features

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- X-XSS-Protection: 1; mode=block
- Form input validation with Zod to prevent injection attacks

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and deploy

### Environment Variables

If you add API endpoints or third-party services, create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=your_api_url
CALENDLY_URL=your_calendly_url
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

[INSERT LICENSE INFORMATION HERE]
