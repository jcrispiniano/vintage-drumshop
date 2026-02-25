import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  metadataBase: new URL('https://jcrispiniano.github.io/vintage-drumshop'),
  title: 'Vintage Drum Shop - Baterias e Acessórios Profissionais',
  description: 'Revenda oficial Wincent e Istanbul Agop em São Paulo. A melhor seleção de baterias, pratos e acessórios musicais para percussionistas profissionais.',
  keywords: 'baterias, pratos, wincent, istanbul agop, drum shop, instrumentos musicais, são paulo, percussão',
  icons: {
    icon: '/vintage-drumshop/logo.svg',
    apple: '/vintage-drumshop/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://jcrispiniano.github.io/vintage-drumshop',
    title: 'Vintage Drum Shop - Percussão Profissional',
    description: 'Revenda oficial Wincent e Istanbul Agop em São Paulo',
    siteName: 'Vintage Drum Shop',
    images: [
      {
        url: '/vintage-drumshop/logo.png',
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
    images: ['/vintage-drumshop/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="alternate" hrefLang="pt-BR" href="https://jcrispiniano.github.io/vintage-drumshop" />
        <link rel="sitemap" type="application/xml" href="/vintage-drumshop/sitemap.xml" />
      </head>
      <body className="antialiased">
        <CartProvider>
          {children}
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  )
}