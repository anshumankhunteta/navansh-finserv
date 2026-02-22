import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Security: Hide X-Powered-By header
  compress: true, // Enable gzip compression
  async rewrites() {
    return [
      { source: '/card', destination: '/milee' },
      { source: '/businesscard', destination: '/milee' },
      { source: '/home', destination: '/' },
      { source: '/quote', destination: '/enquire' },
    ]
  },
}

export default nextConfig
