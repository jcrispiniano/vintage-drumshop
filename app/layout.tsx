import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import WhatsAppButton from '@/components/WhatsAppButton'
import PageTransition from '@/components/PageTransition'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', preload: true })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap', preload: false })

export const metadata: Metadata = {
  metadataBase: new URL('https://vintagedrumshop.com.br'),
  title: 'Vintage Drum Shop - Baterias e Acessórios Profissionais',
  description: 'Revenda oficial Wincent e Istanbul Agop em São Paulo. A melhor seleção de baterias, pratos e acessórios musicais para percussionistas profissionais.',
  keywords: 'baterias, pratos, wincent, istanbul agop, drum shop, instrumentos musicais, são paulo, percussão',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://vintagedrumshop.com.br',
    title: 'Vintage Drum Shop - Percussão Profissional',
    description: 'Revenda oficial Wincent e Istanbul Agop em São Paulo',
    siteName: 'Vintage Drum Shop',
    images: [
      {
        url: '/logo.png',
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
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="alternate" hrefLang="pt-BR" href="https://vintagedrumshop.com.br" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body className="antialiased overflow-x-hidden">
        <CartProvider>
          <div className="overflow-x-hidden w-full">
            <PageTransition>
              {children}
            </PageTransition>
            <WhatsAppButton />
          </div>
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}