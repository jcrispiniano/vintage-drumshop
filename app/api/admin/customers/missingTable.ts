import { NextResponse } from 'next/server'

/** A tabela customers só existe depois da migração 004: avisa o painel em vez de dar erro 500. */
export function missingTableResponse(error: { code?: string; message: string }) {
  const missing = error.code === '42P01' || error.code === 'PGRST205' || /customers.*(does not exist|could not find)|could not find the table/i.test(error.message)
  if (!missing) return null
  return NextResponse.json(
    { error: 'A tabela de clientes ainda não foi criada no banco.', code: 'missing_table' },
    { status: 503 }
  )
}
