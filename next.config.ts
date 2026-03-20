import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [],
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
