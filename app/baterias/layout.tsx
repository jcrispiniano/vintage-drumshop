import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Baterias | Vintage Drum Shop',
  description: 'Baterias completas para todos os estilos.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
