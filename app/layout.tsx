import type { Metadata } from 'next'
import { Inter, Oswald } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import WhatsAppButton from '@/components/WhatsAppButton'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'
import ProductsInitializer from '@/components/ProductsInitializer'
import { campaign, siteUrl } from '@/lib/products'
import { getAllProducts } from '@/lib/db'
import { ProductsProvider } from '@/lib/productsStore'
import SiteSchema from '@/components/schemas/SiteSchema'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', preload: true })
const oswald = Oswald({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-oswald', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Vintage Drum Shop | Pratos Istanbul Agop, baquetas Wincent e baterias',
    template: '%s',
  },
  description: 'Loja de bateria em São Paulo: pratos Istanbul Agop (chimbal, crash, ride), baquetas Wincent e Dynabeat, caixas e baterias. 10% no Pix ou 10x sem juros. Enviamos para todo o Brasil.',
  keywords: 'pratos istanbul agop, chimbal, hi-hat, crash, ride, baquetas wincent, baquetas dynabeat, caixa de bateria, bateria, drum shop, loja de bateria são paulo',
  applicationName: 'Vintage Drum Shop',
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    title: 'Vintage Drum Shop - Percussão Profissional',
    description: 'Revenda oficial Wincent e Istanbul Agop em São Paulo',
    siteName: 'Vintage Drum Shop',
    images: [
      {
        url: '/og-vintage.jpg',
        width: 1200,
        height: 630,
        alt: 'Vintage Drum Shop - Percussão Profissional',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vintage Drum Shop - Percussão Profissional',
    description: 'Revenda oficial Wincent e Istanbul Agop em São Paulo',
    images: ['/og-vintage.jpg'],
  },
}

// Produtos buscados no servidor a cada 5 min: as páginas já saem com o catálogo real no HTML
export const revalidate = 300

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Descrição curta no catálogo da página (a completa vem na página do produto)
  const initialProducts = (await getAllProducts()).map(p => ({ ...p, description: p.description.slice(0, 240) }))

  return (
    <html lang="pt-BR" className={`${inter.variable} ${oswald.variable}`} suppressHydrationWarning>
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body className={campaign ? 'antialiased black-november' : 'antialiased'}>
        <SiteSchema />
        <CartProvider>
          <ProductsProvider initialProducts={initialProducts}>
          <ProductsInitializer />
          <div className="overflow-x-clip w-full">
            <PageTransition>
              {children}
            </PageTransition>
            <Footer />
            <WhatsAppButton />
          </div>
          </ProductsProvider>
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}