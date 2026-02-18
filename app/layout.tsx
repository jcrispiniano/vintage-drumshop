import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vintage Drum Shop',
  description: 'Sua loja de baterias vintage',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
