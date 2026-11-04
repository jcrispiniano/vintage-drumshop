import QuoteForm from '../../_components/QuoteForm'

export default async function NovoOrcamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // ?cliente=ID: vindo de "Novo orçamento para este cliente" na aba Clientes
  const cliente = Number((await searchParams).cliente)
  return <QuoteForm mode="create" initialCustomerId={Number.isInteger(cliente) && cliente > 0 ? cliente : null} />
}
