import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pratos Istanbul Agop | Vintage Drum Shop',
  description: 'Pratos Istanbul Agop feitos à mão: crash, ride, hi-hat e efeitos. Filtre pelo som: dark, brilhante, seco, jazz.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
