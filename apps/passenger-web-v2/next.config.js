/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  distDir: 'build',
  transpilePackages: ['@mishwari/api', '@mishwari/types', '@mishwari/ui-web', '@mishwari/ui-primitives', '@mishwari/features-auth', '@mishwari/features-trips'],
}
