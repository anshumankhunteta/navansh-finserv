import { NextRequest, NextResponse } from 'next/server'

// ── Slug → Persona Name ──
const PERSONA_MAP: Record<string, string> = {
  'mutual-funds': 'Investor',
  'health-mediclaim': 'Family Protector',
  'general-insurance': 'Asset Guardian',
  'life-term-insurance': 'Life Planner',
  'fd-bonds': 'Conservative Saver',
  retirement: 'Retiree',
}

const COOKIE_NAME = 'navansh_persona'
const MAX_PERSONAS = 5
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl

  // Extract persona slug from ?service= or ?utm_campaign=
  const slug = searchParams.get('service') || searchParams.get('utm_campaign')
  if (!slug) return NextResponse.next()

  const persona = PERSONA_MAP[slug]
  if (!persona) return NextResponse.next()

  // Read existing cookie → parse comma-separated list
  const existing = request.cookies.get(COOKIE_NAME)?.value || ''
  const personas = existing ? existing.split(',').map((p) => p.trim()) : []

  // Skip if this persona is already the most recent
  if (personas[0] === persona) return NextResponse.next()

  // Remove duplicate if it exists elsewhere in the list
  const filtered = personas.filter((p) => p !== persona)

  // Prepend new persona, cap at MAX_PERSONAS
  const updated = [persona, ...filtered].slice(0, MAX_PERSONAS).join(',')

  // Set cookie on the response
  const response = NextResponse.next()
  response.cookies.set(COOKIE_NAME, updated, {
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
    httpOnly: false, // Readable by client if needed later
  })

  return response
}

// Only run on page routes — skip static assets, images, API routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest|xml|txt)$).*)',
  ],
}
