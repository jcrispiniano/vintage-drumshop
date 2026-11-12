import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Baterias | Vintage Drum Shop',
  description: 'Baterias completas (drum kits) para todos os estilos: bumbo, tons, surdo e caixa.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
