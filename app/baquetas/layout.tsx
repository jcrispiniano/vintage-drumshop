import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Baquetas Wincent e Dynabeat | Vintage Drum Shop',
  description: 'Baquetas Wincent e Dynabeat, vassourinhas e mallets. Revenda oficial em São Paulo.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
