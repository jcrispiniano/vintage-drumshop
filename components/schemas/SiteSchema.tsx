import { contactInfo, siteUrl } from '@/lib/products'

/**
 * Identidade da loja para o Google em todas as páginas: a loja (nome, logo, contato,
 * Instagram) e o site, com a busca interna (permite a caixa de busca no resultado).
 */
export default function SiteSchema() {
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'MusicStore',
      '@id': `${siteUrl}/#loja`,
      name: 'Vintage Drum Shop',
      url: siteUrl,
      logo: `${siteUrl}/icon-512.png`,
      image: `${siteUrl}/og-vintage.jpg`,
      description: 'Loja de bateria em São Paulo: pratos Istanbul Agop, baquetas Wincent e Dynabeat, caixas e baterias. Revenda oficial, envio para todo o Brasil.',
      telephone: contactInfo.phone,
      email: contactInfo.email,
      priceRange: 'R$ 50 - R$ 7.000',
      currenciesAccepted: 'BRL',
      paymentAccepted: 'Pix, Cartão de crédito',
      areaServed: { '@type': 'Country', name: 'Brasil' },
      address: { '@type': 'PostalAddress', addressLocality: 'São Paulo', addressRegion: 'SP', addressCountry: 'BR' },
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
      ],
      sameAs: [contactInfo.instagram],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#site`,
      name: 'Vintage Drum Shop',
      url: siteUrl,
      inLanguage: 'pt-BR',
      publisher: { '@id': `${siteUrl}/#loja` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/busca?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ]
  return (
    <>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  )
}
