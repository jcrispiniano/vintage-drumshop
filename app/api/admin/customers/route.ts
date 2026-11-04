import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { CustomerWithStats, duplicateMessage, toCustomerRow } from '@/lib/customers'
import { quoteTotal, QuoteItem } from '@/lib/quote'
import { missingTableResponse } from './missingTable'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }

  const { data: customers, error } = await supabaseAdmin
    .from('customers')
    .select('*')
    .order('name', { ascending: true })
  if (error) return missingTableResponse(error) ?? NextResponse.json({ error: error.message }, { status: 500 })

  // Resumo dos orçamentos de cada cliente (a loja tem poucos orçamentos: soma aqui mesmo)
  const { data: quotes } = await supabaseAdmin
    .from('quotes')
    .select('customer_id, items, quote_date')
    .not('customer_id', 'is', null)

  const stats = new Map<number, { count: number; total: number; last: string | null }>()
  for (const q of (quotes ?? []) as { customer_id: number; items: QuoteItem[]; quote_date: string }[]) {
    const s = stats.get(q.customer_id) ?? { count: 0, total: 0, last: null }
    s.count += 1
    s.total += quoteTotal(q.items ?? [])
    if (!s.last || q.quote_date > s.last) s.last = q.quote_date
    stats.set(q.customer_id, s)
  }

  const result: CustomerWithStats[] = customers.map(c => {
    const s = stats.get(c.id)
    return { ...c, quote_count: s?.count ?? 0, quote_total: s?.total ?? 0, last_quote_date: s?.last ?? null }
  })
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Corpo inválido' }, { status: 400 })

  const { row, error: validationError } = toCustomerRow(body)
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

  const { data, error } = await supabaseAdmin.from('customers').insert([{ ...row, source: 'manual' }]).select().single()
  if (error) {
    const duplicate = duplicateMessage(error.message)
    if (duplicate) return NextResponse.json({ error: duplicate }, { status: 409 })
    return missingTableResponse(error) ?? NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
