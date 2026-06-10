import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Security: Hide X-Powered-By header
  compress: true, // Enable gzip compression
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lnwdmhdvvnzjfbfgcdxw.supabase.co',
      },
    ],
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
      {
        source: '/blog/admin',
        destination: '/admin/blog',
        permanent: true,
      },
      {
        source: '/blog/admin/:path*',
        destination: '/admin/blog/:path*',
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
