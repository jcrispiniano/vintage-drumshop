import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Vintage Drum Shop - Baterias e Acessórios Profissionais',
  description: 'Revenda oficial Wincent e Istanbul Agop. A melhor seleção de baterias, pratos e acessórios musicais.',
  keywords: 'baterias, pratos, wincent, istanbul agop, drum shop, instrumentos musicais',
  icons: {
    icon: '/vintage-drumshop/logo.svg',
    apple: '/vintage-drumshop/logo.png',
  },
  openGraph: {
    title: 'Vintage Drum Shop',
    description: 'Revenda oficial Wincent e Istanbul Agop',
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
      <body className="antialiased">
        <CartProvider>
          {children}
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  )
}