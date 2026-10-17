import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Caixas de bateria | Vintage Drum Shop',
  description: 'Caixas de bateria Pinguim e outras marcas. Atendimento direto pelo WhatsApp.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
