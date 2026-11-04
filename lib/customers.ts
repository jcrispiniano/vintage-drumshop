// Clientes do painel /admin → Clientes. Funções puras (sem banco), usadas no servidor e no painel.

export interface Customer {
  id: number
  name: string
  email: string | null
  /** Número de contato: só dígitos, com DDI: 5511964405519 */
  whatsapp: string | null
  /** Só os 11 dígitos */
  cpf: string | null
  /** Endereço completo; o CEP fica só com os 8 dígitos */
  cep: string | null
  street: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  /** UF, ex.: SP */
  state: string | null
  instagram: string | null
  /** AAAA-MM-DD */
  birth_date: string | null
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

/** CPF → 11 dígitos, se os dígitos verificadores baterem. */
export function normalizeCpf(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const cpf = value.replace(/\D/g, '')
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return null
  const digit = (len: number) => {
    let sum = 0
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]) ? cpf : null
}

/** 12345678909 → 123.456.789-09 */
export function formatCpf(cpf: string | null): string {
  if (!cpf) return ''
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`
}

export function normalizeCep(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const cep = value.replace(/\D/g, '')
  return cep.length === 8 ? cep : null
}

/** 01310100 → 01310-100 */
export function formatCep(cep: string | null): string {
  if (!cep) return ''
  return `${cep.slice(0, 5)}-${cep.slice(5)}`
}

export const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

type AddressParts = Pick<Customer, 'street' | 'number' | 'complement' | 'neighborhood' | 'city' | 'state' | 'cep'>

/** "Rua X, 123 - Apto 4 - Bairro, Cidade/UF - CEP 01310-100" */
export function formatAddress(c: AddressParts): string {
  const line1 = [c.street && c.number ? `${c.street}, ${c.number}` : c.street, c.complement].filter(Boolean).join(' - ')
  const place = c.city ? (c.state ? `${c.city}/${c.state}` : c.city) : null
  return [line1, [c.neighborhood, place].filter(Boolean).join(', '), c.cep ? `CEP ${formatCep(c.cep)}` : null]
    .filter(Boolean)
    .join(' - ')
}

/** Dados obrigatórios do cadastro; clientes criados pelo orçamento chegam só com nome e contato. */
export function missingFields(c: Pick<Customer, 'email' | 'whatsapp' | 'cpf' | 'cep' | 'street' | 'number' | 'neighborhood' | 'city' | 'state'>): string[] {
  const missing: string[] = []
  if (!c.cpf) missing.push('CPF')
  if (!c.email) missing.push('e-mail')
  if (!c.whatsapp) missing.push('contato')
  if (!c.cep || !c.street || !c.number || !c.neighborhood || !c.city || !c.state) missing.push('endereço')
  return missing
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

  const cpf = normalizeCpf(body.cpf)
  if (!cpf) return { row: {}, error: typeof body.cpf === 'string' && body.cpf.trim() ? 'CPF inválido. Confira os números.' : 'Informe o CPF.' }

  const email = normalizeEmail(body.email)
  if (!email) return { row: {}, error: typeof body.email === 'string' && body.email.trim() ? 'E-mail inválido.' : 'Informe o e-mail.' }

  const whatsapp = normalizeWhatsapp(body.whatsapp)
  if (!whatsapp) {
    return { row: {}, error: typeof body.whatsapp === 'string' && body.whatsapp.trim()
      ? 'Número de contato inválido. Use DDD + número, ex.: (11) 96440-5519.'
      : 'Informe o número de contato.' }
  }

  // Endereço completo: só o complemento é opcional
  const cep = normalizeCep(body.cep)
  if (!cep) return { row: {}, error: 'Informe o CEP com 8 números.' }
  const street = cleanText(body.street, 200)
  const number = cleanText(body.number, 20)
  const neighborhood = cleanText(body.neighborhood, 100)
  const city = cleanText(body.city, 100)
  const state = typeof body.state === 'string' ? body.state.trim().toUpperCase() : ''
  if (!street) return { row: {}, error: 'Informe a rua do endereço.' }
  if (!number) return { row: {}, error: 'Informe o número do endereço (use "s/n" se não tiver).' }
  if (!neighborhood) return { row: {}, error: 'Informe o bairro.' }
  if (!city) return { row: {}, error: 'Informe a cidade.' }
  if (!UFS.includes(state)) return { row: {}, error: 'Escolha o estado (UF).' }

  const birthDate = typeof body.birthDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.birthDate) ? body.birthDate : null

  const acceptsMarketing = body.acceptsMarketing === true
  // Guarda a data do aceite; mantém a original se já tinha aceitado antes
  const consentAt = acceptsMarketing
    ? previous?.accepts_marketing && previous.marketing_consent_at ? previous.marketing_consent_at : new Date().toISOString()
    : null

  const instagram = cleanText(body.instagram, 100)
  return {
    row: {
      name,
      cpf,
      email,
      whatsapp,
      cep,
      street,
      number,
      complement: cleanText(body.complement, 100),
      neighborhood,
      city,
      state,
      instagram: instagram ? (instagram.startsWith('@') ? instagram : `@${instagram}`) : null,
      birth_date: birthDate,
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
  if (dbMessage.includes('whatsapp')) return 'Já existe um cliente com esse número de contato.'
  if (dbMessage.includes('cpf')) return 'Já existe um cliente com esse CPF.'
  return 'Já existe um cliente com esses dados.'
}

/**
 * Planilha para importar na ferramenta de e-mail. O CPF fica de fora de propósito:
 * não serve para disparo e é o dado mais sensível do cadastro.
 */
export function customersToCsv(customers: CustomerWithStats[]): string {
  const header = ['Nome', 'E-mail', 'Contato', 'Cidade', 'UF', 'Endereço', 'Aniversário', 'Instagram', 'Aceita e-mails', 'Data do aceite', 'Orçamentos', 'Último orçamento']
  const escape = (v: string | number | null) => {
    const s = v === null ? '' : String(v)
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = customers.map(c => [
    c.name,
    c.email,
    c.whatsapp ? formatWhatsapp(c.whatsapp) : null,
    c.city,
    c.state,
    formatAddress(c) || null,
    c.birth_date ? c.birth_date.split('-').reverse().join('/') : null,
    c.instagram,
    c.accepts_marketing ? 'Sim' : 'Não',
    c.marketing_consent_at ? c.marketing_consent_at.slice(0, 10) : null,
    c.quote_count,
    c.last_quote_date,
  ].map(escape).join(';'))
  // BOM + ";" para o Excel em português abrir com acentos e colunas certas
  return '﻿' + [header.join(';'), ...lines].join('\n')
}
