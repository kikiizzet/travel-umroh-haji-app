import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'rvhpoczsbtcyyhawpqsg.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  },
}

export default nextConfig
