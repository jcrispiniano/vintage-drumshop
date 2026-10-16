// Orçamentos (cotações) do painel /admin → Orçamentos

export interface QuoteItem {
  description: string
  price: number
  /** Condição de pagamento da linha, ex.: "A combinar" */
  payment: string
  qty: number
  /** Brinde: aparece como "BRINDE" e não soma no total */
  gift: boolean
}

export interface Quote {
  id: number
  client_name: string
  client_contact: string | null
  quote_date: string // AAAA-MM-DD
  items: QuoteItem[]
  notes: string | null
  created_at: string
  updated_at: string
}

/** Dados da loja impressos no rodapé do documento (modelo do Canva). */
export const quoteCompany = {
  instagram: '@vintage.drumshop',
  phone: '(11) 96440-5519',
  cnpj: '42.477.046/0001-46',
}

export const DEFAULT_PAYMENT = 'A combinar'

export const DEFAULT_NOTES =
  'O valor final terá um desconto de 5% no Pix ou até 6x sem juros no cartão; a partir de 7x tem o acréscimo da taxa. As duas condições contêm frete grátis!'

export function emptyItem(): QuoteItem {
  return { description: '', price: 0, payment: DEFAULT_PAYMENT, qty: 1, gift: false }
}

export function itemTotal(item: QuoteItem): number {
  return item.gift ? 0 : item.price * item.qty
}

export function quoteTotal(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + itemTotal(item), 0)
}

/** Número exibido no documento e na lista: Nº 0007 */
export function quoteNumber(id: number): string {
  return `Nº ${String(id).padStart(4, '0')}`
}

/** "2026-10-16" → "16 de Outubro de 2026" (sem fuso: a data é de calendário) */
export function formatQuoteDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return isoDate
  const month = new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('pt-BR', { month: 'long', timeZone: 'UTC' })
  return `${d} de ${month.charAt(0).toUpperCase()}${month.slice(1)} de ${y}`
}

export function todayISO(): string {
  // Data de São Paulo, não a do servidor em UTC
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' })
}

type Row = Record<string, unknown>

/** Valida o corpo enviado pelo painel e devolve a linha para a tabela quotes. */
export function toQuoteRow(body: Row): { row: Row; error?: string } {
  const clientName = typeof body.clientName === 'string' ? body.clientName.trim() : ''
  if (!clientName) return { row: {}, error: 'Informe o nome do cliente.' }

  const quoteDate = typeof body.quoteDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.quoteDate)
    ? body.quoteDate
    : todayISO()

  if (!Array.isArray(body.items)) return { row: {}, error: 'Itens inválidos.' }
  const items: QuoteItem[] = []
  for (const raw of body.items as Row[]) {
    const description = typeof raw?.description === 'string' ? raw.description.trim() : ''
    if (!description) continue // linha em branco é ignorada
    const price = Number(raw.price)
    const qty = Number(raw.qty)
    const gift = raw.gift === true
    if (!gift && (!Number.isFinite(price) || price < 0)) return { row: {}, error: `Preço inválido em "${description}".` }
    if (!Number.isFinite(qty) || qty <= 0) return { row: {}, error: `Quantidade inválida em "${description}".` }
    items.push({
      description,
      price: gift ? 0 : Math.round(price * 100) / 100,
      payment: typeof raw.payment === 'string' && raw.payment.trim() ? raw.payment.trim() : DEFAULT_PAYMENT,
      qty,
      gift,
    })
  }
  if (items.length === 0) return { row: {}, error: 'Adicione pelo menos um item.' }

  const contact = typeof body.clientContact === 'string' ? body.clientContact.trim() : ''
  const notes = typeof body.notes === 'string' ? body.notes.trim() : ''

  return {
    row: {
      client_name: clientName,
      client_contact: contact || null,
      quote_date: quoteDate,
      items,
      notes: notes || null,
    },
  }
}
