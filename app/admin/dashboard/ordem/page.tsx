import OrdemClient from './OrdemClient'

export const metadata = { title: 'Ordem na loja | Painel', robots: { index: false } }

export default async function OrdemPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams
  return <OrdemClient initialCategory={categoria} />
}
