import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favoritos | Vintage Drum Shop',
  description: 'Produtos que você guardou para comparar.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
