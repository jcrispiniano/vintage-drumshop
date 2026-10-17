import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acessórios para bateria | Vintage Drum Shop',
  description: 'Acessórios para bateria e percussão.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
