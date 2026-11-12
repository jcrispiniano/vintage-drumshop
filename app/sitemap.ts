import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/db'
import { absoluteUrl, productUrl, siteUrl } from '@/lib/products'
import { SECTIONS } from '@/lib/seo'

export const revalidate = 3600

/** Mapa do site para o Google: páginas de lista e todos os produtos, com fotos e data de alteração */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts()
  const has = (match?: (p: (typeof products)[number]) => boolean) => !match || products.some(match)

  const sections = Object.values(SECTIONS)
    .filter(s => !s.noindex && has(s.match))
    .map(s => ({
      url: `${siteUrl}${s.path}`,
      changeFrequency: 'daily' as const,
      priority: s.match ? 0.8 : 0.3,
    }))

  return [
    { url: siteUrl, changeFrequency: 'daily', priority: 1 },
    ...sections,
    ...products.map(p => ({
      url: productUrl(p),
      ...(p.updatedAt && { lastModified: new Date(p.updatedAt) }),
      changeFrequency: 'weekly' as const,
      priority: p.soldOut ? 0.4 : 0.7,
      images: [p.image, ...(p.images ?? [])].filter(Boolean).map(absoluteUrl),
    })),
  ]
}
