import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/match-statistics',
        permanent: true,
      },
      {
        source: '/round-statistics',
        destination: '/round-statistics/1',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
