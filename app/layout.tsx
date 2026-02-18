import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Vintage Drum Shop - Baterias e Acessórios Profissionais',
  description: 'Revenda oficial Wincent e Istanbul Cymbals. A melhor seleção de baterias, pratos e acessórios musicais.',
  keywords: 'baterias, pratos, wincent, istanbul cymbals, drum shop, instrumentos musicais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}