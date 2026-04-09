import { ImageResponse } from 'next/og'
import { createPublicClient } from '@/lib/supabase/server'

// Image metadata
export const alt = 'Navansh Finserv Blog Post'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const supabase = createPublicClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (post?.cover_image_url) {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#0a2e1a',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.cover_image_url}
          alt={post.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>,
      {
        ...size,
      }
    )
  }

  const title = post?.title || 'Navansh Finserv Blog'

  return new ImageResponse(
    <div
      style={{
        background:
          'linear-gradient(135deg, #0a2e1a 0%, #143d28 40%, #1a4a30 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        padding: '80px',
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          display: 'flex',
        }}
      />

      {/* Accent line at top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background:
            'linear-gradient(90deg, #409e54 0%, #d4a840 50%, #409e54 100%)',
          display: 'flex',
        }}
      />

      {/* Top section: Logo + Navansh Blog */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg
            width="80"
            height="58"
            viewBox="0 0 260 185"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(-20.012491,-51.022797)">
              <path
                d="m 60.752301,231.01498 29.25119,-0.004 29.438199,-54.54352 -16.03219,-25.09163 z"
                fill="#409e54"
              />
              <path
                d="m 205.23351,210.56356 -9.0166,20.45924 -30.83009,-9e-5 -63.66388,-98.00794 -52.015769,98.00106 H 20.012491 L 99.465446,82.41333 179.5195,207.40096 190.01884,186.59583 Z"
                fill="#e8e8e8"
              />
              <path
                d="m 129.55565,113.68572 15.96673,24.85247 9.67782,-20.35558 55.64244,84.73387 13.78939,-24.37938 -71.3674,-110.294656 z"
                fill="#409e54"
              />
              <path
                d="m 213.10494,144.50607 16.7869,25.6601 44.23879,-86.047267 -23.78112,-10.777632 z"
                fill="#e8e8e8"
              />
              <path
                d="m 0,0 -28.802,-17.577 c -1.092,-0.666 -1.063,-2.261 0.052,-2.888 L 0.828,-37.09 c 1.131,-0.636 2.524,0.201 2.494,1.497 L 2.546,-1.391 C 2.517,-0.101 1.101,0.672 0,0"
                transform="matrix(1.3357927,0,0,-1.3068551,275.57435,51.346372)"
                fill="#e8e8e8"
              />
              <ellipse
                cx="242.23303"
                cy="215.91342"
                rx="20"
                ry="20.109383"
                fill="#d4a840"
              />
            </g>
          </svg>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            fontWeight: 700,
            color: '#ffffff',
            marginLeft: '24px',
            letterSpacing: '-0.5px',
          }}
        >
          Navansh
          <span style={{ color: '#409e54', marginLeft: '10px' }}>Blog</span>
        </div>
      </div>

      {/* Center section: Blog Title */}
      <div
        style={{
          display: 'flex',
          fontSize: '64px',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-1.5px',
          lineHeight: 1.2,
          marginTop: 'auto',
          marginBottom: 'auto',
          width: '100%',
          maxWidth: '900px',
          flexWrap: 'wrap',
        }}
      >
        {title}
      </div>

      {/* Bottom section: Divider and URL */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '3px',
            background: '#409e54',
            marginBottom: '24px',
            display: 'flex',
          }}
        />
        <div
          style={{
            fontSize: '24px',
            color: '#6b9e72',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          navansh.in/blog
        </div>
      </div>

      {/* Accent line at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background:
            'linear-gradient(90deg, #409e54 0%, #d4a840 50%, #409e54 100%)',
          display: 'flex',
        }}
      />
    </div>,
    {
      ...size,
    }
  )
}
