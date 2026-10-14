/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Só WebP: cada formato conta como uma transformação na cota da Vercel
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // URLs do Blob são únicas por upload, então o cache pode durar mais
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
}

module.exports = nextConfig
