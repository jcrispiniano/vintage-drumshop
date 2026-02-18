/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/vintage-drumshop',
  assetPrefix: '/vintage-drumshop/',
}

module.exports = nextConfig