import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Peles de bateria | Vintage Drum Shop',
  description: 'Peles para caixa, tons e bumbo.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
