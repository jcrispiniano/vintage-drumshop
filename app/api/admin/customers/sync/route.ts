import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { linkQuoteToCustomer } from '@/lib/customerMatch'
import { missingTableResponse } from '../missingTable'

/**
 * "Importar dos orçamentos": liga cada orçamento ainda sem cliente, criando os clientes
 * que faltarem. Pode rodar quantas vezes quiser: só mexe em orçamentos sem vínculo.
 */
export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }

  // Confere antes se a migração já rodou
  const check = await supabaseAdmin.from('customers').select('id').limit(1)
  if (check.error) return missingTableResponse(check.error) ?? NextResponse.json({ error: check.error.message }, { status: 500 })

  const { data: quotes, error } = await supabaseAdmin
    .from('quotes')
    .select('id, client_name, client_contact')
    .is('customer_id', null)
    .order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let linked = 0
  for (const q of quotes ?? []) {
    const customerId = await linkQuoteToCustomer(q.id, { name: q.client_name, contact: q.client_contact })
    if (customerId) linked += 1
  }
  return NextResponse.json({ checked: quotes?.length ?? 0, linked })
}
