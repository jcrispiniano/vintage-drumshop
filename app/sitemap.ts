import type { MetadataRoute } from 'next'
import { getAllProductIds } from '@/lib/db'

const BASE_URL = 'https://vintagedrumshop.com.br'

const STATIC_ROUTES = [
  '', 'baterias', 'pratos', 'caixas', 'peles', 'baquetas', 'acessorios', 'ferragens',
  'bags', 'pecas', 'cajon', 'kids', 'estudo', 'livros', 'wincent', 'dynabeat',
  'mallets', 'vassourinhas', 'politica-de-privacidade', 'termos-de-uso', 'trocas-e-devolucoes',
]

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ids = await getAllProductIds()

  return [
    ...STATIC_ROUTES.map(route => ({
      url: route ? `${BASE_URL}/${route}` : BASE_URL,
      changeFrequency: 'weekly' as const,
      priority: route ? 0.8 : 1,
    })),
    ...ids.map(id => ({
      url: `${BASE_URL}/produto/${id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
