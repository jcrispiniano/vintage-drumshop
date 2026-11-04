// Liga orçamentos a clientes (só no servidor: usa a chave service_role).
import { supabaseAdmin } from '@/lib/supabase'
import { parseContact } from '@/lib/customers'

interface MatchInput {
  name: string
  contact: string | null
  /** Cliente escolhido no formulário do orçamento */
  customerId?: number | null
}

/**
 * Encontra o cliente do orçamento ou cria um novo (origem "orcamento"). Ordem:
 * 1. cliente escolhido no formulário;
 * 2. mesmo WhatsApp ou e-mail do campo "Contato";
 * 3. sem contato: mesmo nome, se houver exatamente um cliente com esse nome.
 * Devolve null se a tabela customers ainda não existir (orçamento salva normalmente).
 */
export async function matchCustomer({ name, contact, customerId }: MatchInput): Promise<number | null> {
  if (customerId) {
    const { data } = await supabaseAdmin.from('customers').select('id').eq('id', customerId).maybeSingle()
    if (data) return data.id
  }

  const { email, whatsapp } = parseContact(contact)

  if (whatsapp || email) {
    const column = whatsapp ? 'whatsapp' : 'email'
    const value = whatsapp ?? email!
    const { data, error } = await supabaseAdmin.from('customers').select('id').eq(column, value).maybeSingle()
    if (error) return null
    if (data) return data.id
  } else {
    const { data, error } = await supabaseAdmin.from('customers').select('id').ilike('name', escapeLike(name.trim())).limit(2)
    if (error) return null
    if (data?.length === 1) return data[0].id
  }

  const { data, error } = await supabaseAdmin
    .from('customers')
    .insert([{ name: name.trim(), email, whatsapp, source: 'orcamento' }])
    .select('id')
    .single()
  if (error) return null
  return data.id
}

/** Grava o cliente no orçamento. Falha em silêncio se a coluna ainda não existir. */
export async function linkQuoteToCustomer(quoteId: number, input: MatchInput): Promise<number | null> {
  try {
    const customerId = await matchCustomer(input)
    if (!customerId) return null
    const { error } = await supabaseAdmin.from('quotes').update({ customer_id: customerId }).eq('id', quoteId)
    return error ? null : customerId
  } catch {
    return null
  }
}

/** ilike sem curingas: o nome precisa ser igual (ignorando maiúsculas). */
function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, c => `\\${c}`)
}
