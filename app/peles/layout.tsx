import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Peles de bateria | Vintage Drum Shop',
  description: 'Peles (drumheads) para caixa, tons, surdo e bumbo, sob encomenda.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
