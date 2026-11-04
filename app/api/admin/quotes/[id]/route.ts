import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { customerIdFromBody, toQuoteRow } from '@/lib/quote'
import { linkQuoteToCustomer } from '@/lib/customerMatch'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }
  const { id } = await params
  const { data, error } = await supabaseAdmin.from('quotes').select('*').eq('id', id).single()

  if (error) return NextResponse.json({ error: 'Orçamento não encontrado' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: Request, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Corpo inválido' }, { status: 400 })

  const { row, error: validationError } = toQuoteRow(body)
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

  const { data, error } = await supabaseAdmin.from('quotes').update(row).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const customerId = await linkQuoteToCustomer(data.id, {
    name: data.client_name,
    contact: data.client_contact,
    customerId: customerIdFromBody(body),
  })
  return NextResponse.json({ ...data, customer_id: customerId ?? data.customer_id ?? null })
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }
  const { id } = await params
  const { error } = await supabaseAdmin.from('quotes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
