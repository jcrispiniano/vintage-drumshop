import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Seu carrinho | Vintage Drum Shop',
  description: 'Revise seu pedido e finalize pelo WhatsApp com desconto no Pix.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
