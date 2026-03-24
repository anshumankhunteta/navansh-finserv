import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Security: Hide X-Powered-By header
  compress: true, // Enable gzip compression
  images: {
    domains: ['lnwdmhdvvnzjfbfgcdxw.supabase.co'],
  },
  experimental: {
    staleTimes: {
      dynamic: 30, // Cache dynamic routes in router cache for 30s
    },
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      { source: '/card', destination: '/milee' },
      { source: '/businesscard', destination: '/milee' },
    ]
  },
}

export default nextConfig
