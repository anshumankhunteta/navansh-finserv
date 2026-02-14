import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Security: Hide X-Powered-By header
  compress: true, // Enable gzip compression
}

export default nextConfig
