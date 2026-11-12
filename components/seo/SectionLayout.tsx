import { getAllProducts } from '@/lib/db'
import { absoluteUrl, productUrl, siteUrl } from '@/lib/products'
import { SECTIONS } from '@/lib/seo'

/**
 * Envolve uma página de lista: publica para o Google a trilha (Início › Categoria)
 * e a lista de produtos da página em dados estruturados.
 */
export default async function SectionLayout({ id, children }: { id: string; children: React.ReactNode }) {
  const section = SECTIONS[id]
  const products = section.match ? (await getAllProducts()).filter(section.match).filter(p => !p.soldOut) : []

  const schemas: object[] = [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: section.name, item: `${siteUrl}${section.path}` },
    ],
  }]
  if (products.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: section.name,
      numberOfItems: products.length,
      itemListElement: products.slice(0, 50).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: productUrl(p),
        name: p.name,
        image: absoluteUrl(p.image),
      })),
    })
  }

  return (
    <>
      {!section.noindex && schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      {children}
    </>
  )
}
