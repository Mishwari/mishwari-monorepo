/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  distDir: 'build',
  transpilePackages: ['@mishwari/api', '@mishwari/types'],
}
