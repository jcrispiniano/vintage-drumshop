import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { customerIdFromBody, toQuoteRow } from '@/lib/quote'
import { linkQuoteToCustomer } from '@/lib/customerMatch'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }

  const { data, error } = await supabaseAdmin
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Corpo inválido' }, { status: 400 })

  const { row, error: validationError } = toQuoteRow(body)
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

  const { data, error } = await supabaseAdmin.from('quotes').insert([row]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Liga ao cadastro de clientes (cria o cliente se for novo); não impede salvar o orçamento
  const customerId = await linkQuoteToCustomer(data.id, {
    name: data.client_name,
    contact: data.client_contact,
    customerId: customerIdFromBody(body),
  })
  return NextResponse.json({ ...data, customer_id: customerId ?? data.customer_id ?? null }, { status: 201 })
}
