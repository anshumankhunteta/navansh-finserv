import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'Navansh Finserv'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background:
          'linear-gradient(135deg, #0a2e1a 0%, #143d28 40%, #1a4a30 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
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

      {/* Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}
      >
        <svg
          width="120"
          height="87"
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

      {/* Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '64px',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-1px',
          marginBottom: '16px',
        }}
      >
        Navansh
        <span style={{ color: '#409e54', marginLeft: '14px' }}>Finserv</span>
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: '22px',
          color: '#a3c4a8',
          textAlign: 'center',
          maxWidth: '700px',
          lineHeight: '1.4',
          display: 'flex',
        }}
      >
        Securing Families & Futures with Two Decades of Experience
      </div>

      {/* Divider */}
      <div
        style={{
          width: '80px',
          height: '2px',
          background: '#409e54',
          marginTop: '32px',
          marginBottom: '52px',
          display: 'flex',
        }}
      />

      {/* URL */}
      <div
        style={{
          fontSize: '25px',
          color: '#6b9e72',
          letterSpacing: '5px',
          textTransform: 'uppercase',
          display: 'flex',
        }}
      >
        navansh.in
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
