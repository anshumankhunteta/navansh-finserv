import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'react-email'
import type { NewsletterContent } from '@/lib/newsletter-ai'

type WeeklyDigestProps = {
  content: NewsletterContent
  unsubscribeUrl: string
}

export function WeeklyDigest({ content, unsubscribeUrl }: WeeklyDigestProps) {
  const {
    subject,
    market_pulse,
    headlines,
    blog_highlights,
    fund_spotlight,
    tip_of_the_week,
    closing,
  } = content

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>NAVANSH FINSERV</Text>
            <Text style={tagline}>Weekly Market Clarity</Text>
          </Section>

          <Hr style={divider} />

          {/* Market Pulse */}
          <Section style={section}>
            <Heading as="h2" style={sectionTitle}>
              📊 Market Pulse
            </Heading>
            {market_pulse.map((bullet, i) => (
              <Text key={i} style={bulletPoint}>
                • {bullet}
              </Text>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Top Headlines */}
          {headlines && headlines.length > 0 && (
            <>
              <Section style={section}>
                <Heading as="h2" style={sectionTitle}>
                  📰 This Week&apos;s Headlines
                </Heading>
                {headlines.map((headline, i) => (
                  <Section key={i} style={headlineCard}>
                    <Link href={headline.url} style={headlineLink}>
                      {headline.title}
                    </Link>
                    {headline.summary && (
                      <Text style={headlineSummary}>{headline.summary}</Text>
                    )}
                  </Section>
                ))}
              </Section>
              <Hr style={divider} />
            </>
          )}

          {/* Blog Highlights */}
          {blog_highlights && blog_highlights.length > 0 && (
            <>
              <Section style={section}>
                <Heading as="h2" style={sectionTitle}>
                  ✍️ From Our Blog
                </Heading>
                {blog_highlights.map((blog, i) => (
                  <Section key={i} style={blogCard}>
                    <Link
                      href={`https://navansh.in${blog.url}`}
                      style={blogTitle}
                    >
                      {blog.title}
                    </Link>
                    <Text style={blogExcerpt}>{blog.excerpt}</Text>
                  </Section>
                ))}
              </Section>
              <Hr style={divider} />
            </>
          )}

          {/* Fund Spotlight */}
          {fund_spotlight && (
            <>
              <Section style={section}>
                <Heading as="h2" style={sectionTitle}>
                  🔍 Fund Spotlight
                </Heading>
                <Section style={spotlightCard}>
                  <Text style={fundName}>{fund_spotlight.name}</Text>
                  {fund_spotlight.return_1y !== null && (
                    <Text style={fundReturn}>
                      1Y Return: {fund_spotlight.return_1y.toFixed(2)}%
                    </Text>
                  )}
                  <Text style={fundInsight}>{fund_spotlight.insight}</Text>
                </Section>
              </Section>
              <Hr style={divider} />
            </>
          )}

          {/* Tip of the Week */}
          <Section style={section}>
            <Heading as="h2" style={sectionTitle}>
              💡 Tip of the Week
            </Heading>
            <Section style={tipCard}>
              <Text style={tipText}>{tip_of_the_week}</Text>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Closing */}
          <Section style={section}>
            <Text style={closingText}>{closing}</Text>
            <Text style={signoff}>
              — Team Navansh Finserv
              <br />
              <Link href="https://navansh.in" style={linkStyle}>
                navansh.in
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              You received this because you subscribed at navansh.in
              <br />
              <Link href={unsubscribeUrl} style={unsubLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// ---- Styles ---------------------------------------------------------

const main: React.CSSProperties = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
  borderRadius: '8px',
}

const header: React.CSSProperties = {
  padding: '24px 32px 8px',
  textAlign: 'center' as const,
}

const logoText: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 800,
  color: '#409e54',
  letterSpacing: '2px',
  margin: '0',
}

const tagline: React.CSSProperties = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '4px 0 0',
  letterSpacing: '0.5px',
}

const section: React.CSSProperties = {
  padding: '8px 32px',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: '#1f2937',
  margin: '16px 0 8px',
}

const bulletPoint: React.CSSProperties = {
  fontSize: '14px',
  color: '#374151',
  lineHeight: '1.6',
  margin: '4px 0',
}

const divider: React.CSSProperties = {
  borderColor: '#e5e7eb',
  margin: '8px 32px',
}

const headlineCard: React.CSSProperties = {
  marginBottom: '12px',
}

const headlineLink: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#409e54',
  textDecoration: 'none',
}

const headlineSummary: React.CSSProperties = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '2px 0 0',
  lineHeight: '1.5',
}

const blogCard: React.CSSProperties = {
  marginBottom: '12px',
}

const blogTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#409e54',
  textDecoration: 'none',
}

const blogExcerpt: React.CSSProperties = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '2px 0 0',
  lineHeight: '1.5',
}

const spotlightCard: React.CSSProperties = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  padding: '16px',
  border: '1px solid #bbf7d0',
}

const fundName: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#1f2937',
  margin: '0 0 4px',
}

const fundReturn: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 800,
  color: '#409e54',
  margin: '0 0 4px',
}

const fundInsight: React.CSSProperties = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '0',
  lineHeight: '1.5',
}

const tipCard: React.CSSProperties = {
  backgroundColor: '#fffbeb',
  borderRadius: '8px',
  padding: '16px',
  border: '1px solid #fde68a',
}

const tipText: React.CSSProperties = {
  fontSize: '14px',
  color: '#92400e',
  margin: '0',
  lineHeight: '1.6',
}

const closingText: React.CSSProperties = {
  fontSize: '14px',
  color: '#374151',
  lineHeight: '1.6',
  margin: '8px 0',
}

const signoff: React.CSSProperties = {
  fontSize: '14px',
  color: '#374151',
  fontWeight: 600,
  margin: '8px 0',
}

const linkStyle: React.CSSProperties = {
  color: '#409e54',
  textDecoration: 'none',
}

const footer: React.CSSProperties = {
  padding: '8px 32px 24px',
  textAlign: 'center' as const,
}

const footerText: React.CSSProperties = {
  fontSize: '12px',
  color: '#9ca3af',
  lineHeight: '1.5',
}

const unsubLink: React.CSSProperties = {
  color: '#9ca3af',
  textDecoration: 'underline',
}

export default WeeklyDigest
