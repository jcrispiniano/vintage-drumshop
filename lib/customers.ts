// Clientes do painel /admin → Clientes. Funções puras (sem banco), usadas no servidor e no painel.

export interface Customer {
  id: number
  name: string
  email: string | null
  /** Só dígitos, com DDI: 5511964405519 */
  whatsapp: string | null
  instagram: string | null
  city: string | null
  notes: string | null
  accepts_marketing: boolean
  marketing_consent_at: string | null
  source: 'manual' | 'orcamento'
  created_at: string
  updated_at: string
}

/** Cliente com o resumo dos orçamentos (lista do painel). */
export interface CustomerWithStats extends Customer {
  quote_count: number
  quote_total: number
  last_quote_date: string | null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  return EMAIL_RE.test(email) ? email : null
}

/**
 * Telefone brasileiro → dígitos com DDI 55. Aceita "(11) 96440-5519", "11964405519",
 * "+55 11 96440-5519". Devolve null se não parecer um celular/fixo com DDD.
 */
export function normalizeWhatsapp(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10 || digits.length === 11) return `55${digits}`
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) return digits
  return null
}

/** 5511964405519 → (11) 96440-5519 */
export function formatWhatsapp(whatsapp: string | null): string {
  if (!whatsapp) return ''
  const local = whatsapp.startsWith('55') ? whatsapp.slice(2) : whatsapp
  const ddd = local.slice(0, 2)
  const number = local.slice(2)
  const split = number.length - 4
  return `(${ddd}) ${number.slice(0, split)}-${number.slice(split)}`
}

/** O campo "Contato" do orçamento é livre: separa e-mail de WhatsApp. */
export function parseContact(contact: unknown): { email: string | null; whatsapp: string | null } {
  if (typeof contact !== 'string' || !contact.trim()) return { email: null, whatsapp: null }
  if (contact.includes('@')) return { email: normalizeEmail(contact), whatsapp: null }
  return { email: null, whatsapp: normalizeWhatsapp(contact) }
}

/** Texto do campo "Contato" do orçamento a partir do cadastro (WhatsApp tem preferência). */
export function contactFromCustomer(customer: Pick<Customer, 'whatsapp' | 'email'>): string {
  return customer.whatsapp ? formatWhatsapp(customer.whatsapp) : customer.email ?? ''
}

function cleanText(value: unknown, max = 500): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim().slice(0, max)
  return text || null
}

type Row = Record<string, unknown>

/** Valida o corpo enviado pelo formulário de cliente e devolve a linha para a tabela customers. */
export function toCustomerRow(body: Row, previous?: Pick<Customer, 'accepts_marketing' | 'marketing_consent_at'>): { row: Row; error?: string } {
  const name = cleanText(body.name, 200)
  if (!name) return { row: {}, error: 'Informe o nome do cliente.' }

  const rawEmail = typeof body.email === 'string' ? body.email.trim() : ''
  const email = normalizeEmail(rawEmail)
  if (rawEmail && !email) return { row: {}, error: 'E-mail inválido.' }

  const rawWhatsapp = typeof body.whatsapp === 'string' ? body.whatsapp.trim() : ''
  const whatsapp = normalizeWhatsapp(rawWhatsapp)
  if (rawWhatsapp && !whatsapp) return { row: {}, error: 'WhatsApp inválido. Use DDD + número, ex.: (11) 96440-5519.' }

  const acceptsMarketing = body.acceptsMarketing === true
  if (acceptsMarketing && !email) return { row: {}, error: 'Para marcar que aceita e-mails, informe o e-mail.' }

  // Guarda a data do aceite; mantém a original se já tinha aceitado antes
  const consentAt = acceptsMarketing
    ? previous?.accepts_marketing && previous.marketing_consent_at ? previous.marketing_consent_at : new Date().toISOString()
    : null

  const instagram = cleanText(body.instagram, 100)
  return {
    row: {
      name,
      email,
      whatsapp,
      instagram: instagram ? (instagram.startsWith('@') ? instagram : `@${instagram}`) : null,
      city: cleanText(body.city, 100),
      notes: cleanText(body.notes, 2000),
      accepts_marketing: acceptsMarketing,
      marketing_consent_at: consentAt,
    },
  }
}

/** Mensagem amigável quando o e-mail ou WhatsApp já pertence a outro cliente. */
export function duplicateMessage(dbMessage: string): string | null {
  if (!/duplicate key|unique/i.test(dbMessage)) return null
  if (dbMessage.includes('email')) return 'Já existe um cliente com esse e-mail.'
  if (dbMessage.includes('whatsapp')) return 'Já existe um cliente com esse WhatsApp.'
  return 'Já existe um cliente com esses dados.'
}

/** Planilha para importar na ferramenta de e-mail (só quem aceitou receber, se pedido). */
export function customersToCsv(customers: CustomerWithStats[]): string {
  const header = ['Nome', 'E-mail', 'WhatsApp', 'Instagram', 'Cidade', 'Aceita e-mails', 'Data do aceite', 'Orçamentos', 'Último orçamento']
  const escape = (v: string | number | null) => {
    const s = v === null ? '' : String(v)
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = customers.map(c => [
    c.name,
    c.email,
    c.whatsapp ? formatWhatsapp(c.whatsapp) : null,
    c.instagram,
    c.city,
    c.accepts_marketing ? 'Sim' : 'Não',
    c.marketing_consent_at ? c.marketing_consent_at.slice(0, 10) : null,
    c.quote_count,
    c.last_quote_date,
  ].map(escape).join(';'))
  // BOM + ";" para o Excel em português abrir com acentos e colunas certas
  return '﻿' + [header.join(';'), ...lines].join('\n')
}
