import * as cheerio from 'cheerio'

// ---- Types ----------------------------------------------------------

export type PulseHeadline = {
  title: string
  summary: string
  source: string
  url: string
}

// ---- Excluded categories (non-financial noise) ----------------------

const EXCLUDED_KEYWORDS = [
  'cricket',
  'ipl',
  'bollywood',
  'ott release',
  'live streaming',
  'board result',
  'exam result',
  'cgbse',
  'movie',
  'trailer',
  'celebrity',
  'bigg boss',
]

function isRelevant(title: string): boolean {
  const lower = title.toLowerCase()
  return !EXCLUDED_KEYWORDS.some((kw) => lower.includes(kw))
}

// ---- Fetch + Parse --------------------------------------------------

/**
 * Fetches the Zerodha Pulse homepage and extracts structured headlines.
 * Pulse renders server-side HTML — no JS execution needed.
 *
 * Each headline card on Pulse has this structure:
 *   <li class="box"> or similar article wrapper
 *     <h2><a href="...">Title</a></h2>
 *     <span class="desc">Summary text</span>
 *     <span class="feed-source">Source Name</span>
 */
export async function fetchPulseHeadlines(
  limit = 20
): Promise<PulseHeadline[]> {
  const res = await fetch('https://pulse.zerodha.com/', {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: 'text/html',
    },
    signal: AbortSignal.timeout(10_000),
    next: { revalidate: 0 }, // no cache for cron
  })

  if (!res.ok) {
    console.error(`[pulse] Failed to fetch: HTTP ${res.status}`)
    return []
  }

  const html = await res.text()
  const $ = cheerio.load(html)
  const headlines: PulseHeadline[] = []

  // Pulse uses <li class="box"> for each news item
  // Each contains: h2 > a (title + url), .desc (summary), .feed-source (source)
  $('li.box').each((_i, el) => {
    const $el = $(el)
    const $link = $el.find('h2 a, h3 a, .title a').first()
    const title = $link.text().trim()
    const url = $link.attr('href') || ''
    const summary = $el.find('.desc').text().trim()
    const source = $el.find('.feed-source').text().trim()

    if (title && url && isRelevant(title)) {
      headlines.push({ title, summary, source, url })
    }
  })

  // If the CSS-class approach yields nothing, fall back to parsing
  // anchor tags with external URLs (the structure we saw in testing)
  if (headlines.length === 0) {
    const seen = new Set<string>()

    $('a[href]').each((_i, el) => {
      const $a = $(el)
      const href = $a.attr('href') || ''
      const text = $a.text().trim()

      // Only external links with substantial text (headlines)
      if (
        href.startsWith('http') &&
        !href.includes('pulse.zerodha.com') &&
        !href.includes('twitter.com') &&
        !href.includes('facebook.com') &&
        text.length > 30 &&
        !seen.has(text) &&
        isRelevant(text)
      ) {
        seen.add(text)

        // Try to find a sibling description
        const $parent = $a.closest('li, div, article')
        const desc =
          $parent
            .contents()
            .filter(function () {
              return (
                this.type === 'text' ||
                (this.type === 'tag' &&
                  !['a', 'h1', 'h2', 'h3', 'span'].includes(
                    (this as unknown as { tagName: string }).tagName
                  ))
              )
            })
            .text()
            .trim()
            .slice(0, 200) || ''

        headlines.push({
          title: text,
          summary: desc,
          source: '', // fallback mode — source not easily extractable
          url: href,
        })
      }
    })
  }

  return headlines.slice(0, limit)
}
