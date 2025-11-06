/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  distDir: 'build',
  transpilePackages: ['@mishwari/api', '@mishwari/features-auth', '@mishwari/types', '@mishwari/utils'],
}
