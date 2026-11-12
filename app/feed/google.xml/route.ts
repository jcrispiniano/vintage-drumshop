import { getAllProducts } from '@/lib/db'
import { absoluteUrl, productUrl, siteUrl } from '@/lib/products'
import { brandLabel, isGenericBrand } from '@/lib/brands'
import { cymbalType, CYMBAL_TYPE_LABELS } from '@/lib/cymbals'
import { productAliases } from '@/lib/searchTerms'

/**
 * Feed de produtos para o Google Merchant Center (listagens gratuitas na aba Shopping
 * e no Google Imagens). Cadastre esta URL no Merchant Center como "feed agendado".
 */
export const revalidate = 3600

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const GOOGLE_CATEGORY: Record<string, string> = {
  pratos: 'Arts & Entertainment > Hobbies & Creative Arts > Musical Instruments > Percussion > Cymbals',
  baquetas: 'Arts & Entertainment > Hobbies & Creative Arts > Musical Instrument & Orchestra Accessories > Percussion Accessories > Drum Stick & Brush Accessories',
  caixas: 'Arts & Entertainment > Hobbies & Creative Arts > Musical Instruments > Percussion > Drums > Snare Drums',
  baterias: 'Arts & Entertainment > Hobbies & Creative Arts > Musical Instruments > Percussion > Drum Kits',
}

/** Data no formato que o Google pede (ISO 8601 com fuso): 2026-12-12T12:00+0000 */
const googleDate = (d: Date) => `${d.toISOString().slice(0, 16)}+0000`

export async function GET() {
  const products = await getAllProducts()
  // Esgotado vai como "sob encomenda" (backorder), que exige data prevista de chegada.
  // A loja não informa prazo por produto, então usamos 30 dias a partir de hoje (prazo típico de encomenda)
  const backorderDate = googleDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
  const items = products.map(p => {
    const type = p.category === 'pratos' ? CYMBAL_TYPE_LABELS[cymbalType(p.name)] : null
    const aliases = productAliases(p.name)
    const title = aliases.length ? `${p.name} (${aliases[0]})` : p.name
    const extraImages = (p.images ?? []).slice(0, 10).map(img => `<g:additional_image_link>${esc(absoluteUrl(img))}</g:additional_image_link>`).join('')
    return `
    <item>
      <g:id>VDS-${p.id}</g:id>
      <g:title>${esc(title.slice(0, 150))}</g:title>
      <g:description>${esc(p.description.slice(0, 5000))}</g:description>
      <g:link>${esc(productUrl(p))}</g:link>
      <g:image_link>${esc(absoluteUrl(p.image))}</g:image_link>${extraImages}
      <g:availability>${p.soldOut ? 'backorder' : 'in_stock'}</g:availability>${p.soldOut ? `
      <g:availability_date>${backorderDate}</g:availability_date>` : ''}
      <g:price>${p.price.toFixed(2)} BRL</g:price>
      <g:condition>new</g:condition>
      ${isGenericBrand(p.brand) ? '' : `<g:brand>${esc(brandLabel(p.brand))}</g:brand>`}
      <g:identifier_exists>no</g:identifier_exists>
      ${GOOGLE_CATEGORY[p.category] ? `<g:google_product_category>${esc(GOOGLE_CATEGORY[p.category])}</g:google_product_category>` : ''}
      <g:product_type>${esc([p.category, type].filter(Boolean).join(' > '))}</g:product_type>
    </item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Vintage Drum Shop</title>
    <link>${siteUrl}</link>
    <description>Pratos Istanbul Agop, baquetas Wincent e Dynabeat, caixas e baterias</description>${items}
  </channel>
</rss>`

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
