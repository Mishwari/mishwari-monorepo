const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  distDir: 'build',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn', 'info'], // Keep error, warn, info logs
    } : false,
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'date-fns', 'lucide-react'],
  },
  transpilePackages: [
    '@mishwari/api',
    '@mishwari/types',
    '@mishwari/utils',
    '@mishwari/ui-web',
    '@mishwari/ui-primitives',
    '@mishwari/features-auth',
    '@mishwari/features-bookings',
    '@mishwari/features-passengers',
    '@mishwari/features-profile',
    '@mishwari/features-trips'
  ],
  
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.yallabus.app';
    return [
      {
        source: '/sitemap.xml',
        destination: `${apiUrl}/sitemap.xml`
      }
    ];
  },
  
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
                {
                  name: 'removeDimensions',
                  active: true,
                },
              ],
            },
          },
        },
      ],
    });
    return config;
  },
}
