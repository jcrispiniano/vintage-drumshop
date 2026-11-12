import type { MetadataRoute } from 'next'
import { isProductionSite, siteUrl } from '@/lib/products'

export default function robots(): MetadataRoute.Robots {
  if (!isProductionSite) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
