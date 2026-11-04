import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { duplicateMessage, toCustomerRow } from '@/lib/customers'
import { missingTableResponse } from '../missingTable'

type Params = { params: Promise<{ id: string }> }

/** Cliente + orçamentos dele (mais recentes primeiro). */
export async function GET(_req: Request, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }
  const { id } = await params
  const { data, error } = await supabaseAdmin.from('customers').select('*').eq('id', id).single()
  if (error) return missingTableResponse(error) ?? NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })

  const { data: quotes } = await supabaseAdmin
    .from('quotes')
    .select('*')
    .eq('customer_id', id)
    .order('quote_date', { ascending: false })

  return NextResponse.json({ ...data, quotes: quotes ?? [] })
}

export async function PUT(req: Request, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }
  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Corpo inválido' }, { status: 400 })

  const { data: previous } = await supabaseAdmin
    .from('customers')
    .select('accepts_marketing, marketing_consent_at')
    .eq('id', id)
    .maybeSingle()

  const { row, error: validationError } = toCustomerRow(body, previous ?? undefined)
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

  const { data, error } = await supabaseAdmin.from('customers').update(row).eq('id', id).select().single()
  if (error) {
    const duplicate = duplicateMessage(error.message)
    if (duplicate) return NextResponse.json({ error: duplicate }, { status: 409 })
    return missingTableResponse(error) ?? NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

/** Apaga o cliente; os orçamentos dele ficam, só sem o vínculo (on delete set null). */
export async function DELETE(_req: Request, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }
  const { id } = await params
  const { error } = await supabaseAdmin.from('customers').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
