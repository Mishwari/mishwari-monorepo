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
