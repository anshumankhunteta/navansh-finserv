import { GoogleGenAI } from '@google/genai'
import { createServiceClient } from '@/lib/supabase/server'
import { fetchPulseHeadlines } from '@/lib/newsletter-pulse'

// ---- Types ----------------------------------------------------------

export type NewsletterContent = {
  subject: string
  market_pulse: string[]
  headlines: { title: string; summary: string; url: string }[]
  blog_highlights?: { title: string; excerpt: string; url: string }[]
  fund_spotlight: { name: string; return_1y: number | null; insight: string }
  tip_of_the_week: string
  closing: string
}

// ---- Context Gatherers ----------------------------------------------

async function fetchRecentBlogPosts(): Promise<
  { title: string; excerpt: string; slug: string }[]
> {
  const supabase = createServiceClient()
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString()

  const { data } = await supabase
    .from('posts')
    .select('title, excerpt, slug')
    .eq('published', true)
    .gte('published_at', sevenDaysAgo)
    .order('published_at', { ascending: false })
    .limit(5)

  return data ?? []
}

async function fetchTopFunds(): Promise<
  { scheme_name: string; return_1y: number | null }[]
> {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from('mf_schemes')
    .select('scheme_name, return_1y')
    .not('return_1y', 'is', null)
    .order('return_1y', { ascending: false })
    .limit(5)

  return data ?? []
}

// ---- Prompt Builder -------------------------------------------------

function buildPrompt(
  headlines: { title: string; summary: string; url: string }[],
  blogs: { title: string; excerpt: string; slug: string }[],
  funds: { scheme_name: string; return_1y: number | null }[],
  adminFeedback?: string
): string {
  const headlinesText = headlines
    .map((h, i) => `${i + 1}. "${h.title}" — ${h.summary || 'No summary'}`)
    .join('\n')

  const blogsText =
    blogs.length > 0
      ? blogs
          .map((b) => `- "${b.title}": ${b.excerpt || 'No excerpt'}`)
          .join('\n')
      : 'No new blog posts this week.'

  const fundsText = funds
    .map(
      (f) =>
        `- ${f.scheme_name}: ${f.return_1y !== null ? `${f.return_1y.toFixed(2)}% 1Y return` : 'N/A'}`
    )
    .join('\n')

  const feedbackSection = adminFeedback
    ? `\n\nADMIN FEEDBACK ON PREVIOUS DRAFT (address these issues):\n"${adminFeedback}"\n`
    : ''

  return `You are the financial content writer for Navansh Finserv, a trusted Indian financial advisory firm led by a woman with 20 years of market expertise.

Your audience: retail Indian investors who want clarity without jargon.

I'm providing you three sources of context:

1. TOP FINANCIAL HEADLINES (from Indian news today):
${headlinesText}

2. OUR RECENT BLOG POSTS:
${blogsText}

3. TOP-PERFORMING MUTUAL FUNDS THIS WEEK:
${fundsText}
${feedbackSection}
Write a weekly email newsletter. Output ONLY a valid JSON object (no markdown fences, no explanation) with these keys:

{
  "subject": "Catchy subject line, max 60 chars, no clickbait",
  "market_pulse": ["Bullet 1", "Bullet 2", "Bullet 3"],
  "headlines": [{"title": "...", "summary": "1-sentence summary", "url": "original URL"}],
  "blog_highlights": [{"title": "...", "excerpt": "2-sentence teaser", "url": "/blog/slug"}],
  "fund_spotlight": {"name": "Fund Name", "return_1y": 25.5, "insight": "Why this matters in 1 sentence"},
  "tip_of_the_week": "One actionable, jargon-free financial tip relevant to this week's news",
  "closing": "Warm, professional sign-off (2 sentences max)"
}

Rules:
- market_pulse: 3-4 bullets summarizing what mattered THIS week in Indian markets
- headlines: Pick the 3-5 MOST relevant financial headlines. Skip politics, entertainment, sports.
- blog_highlights: Only include if we published blogs this week. Use "/blog/{slug}" as the URL.
- fund_spotlight: Pick ONE fund from the list. return_1y should be the number provided.
- tip_of_the_week: Make it actionable and relevant to current news.
- Keep total content under 400 words.
- Do NOT give specific investment advice or buy/sell recommendations.
- Output ONLY the JSON. No code fences, no extra text.`
}

// ---- Generate -------------------------------------------------------

export async function generateNewsletterContent(
  adminFeedback?: string
): Promise<NewsletterContent> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

  // Gather context in parallel
  const [headlines, blogs, funds] = await Promise.all([
    fetchPulseHeadlines(15),
    fetchRecentBlogPosts(),
    fetchTopFunds(),
  ])

  const prompt = buildPrompt(headlines, blogs, funds, adminFeedback)

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  })

  const text = response.text ?? ''

  // Strip any markdown code fences the model might add
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  try {
    const content = JSON.parse(cleaned) as NewsletterContent
    return content
  } catch (parseError) {
    const errorMsg =
      parseError instanceof Error ? parseError.message : String(parseError)
    console.error(
      '[newsletter-ai] Failed to parse AI response:',
      cleaned.slice(0, 500)
    )
    throw new Error(
      `AI returned invalid JSON: ${errorMsg}. Raw snippet: ${cleaned.slice(0, 100)}`
    )
  }
}
