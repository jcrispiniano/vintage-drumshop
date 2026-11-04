'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, Plus, Save } from 'lucide-react'
import AdminHeader from './AdminHeader'
import { Customer, formatWhatsapp } from '@/lib/customers'
import { Quote, formatQuoteDate, quoteNumber, quoteTotal } from '@/lib/quote'
import { formatPrice } from '@/lib/products'

export interface CustomerFormData {
  name: string
  whatsapp: string
  email: string
  instagram: string
  city: string
  notes: string
  acceptsMarketing: boolean
}

export function customerToForm(c?: Customer): CustomerFormData {
  return {
    name: c?.name ?? '',
    whatsapp: c?.whatsapp ? formatWhatsapp(c.whatsapp) : '',
    email: c?.email ?? '',
    instagram: c?.instagram ?? '',
    city: c?.city ?? '',
    notes: c?.notes ?? '',
    acceptsMarketing: c?.accepts_marketing ?? false,
  }
}

interface CustomerFormProps {
  mode: 'create' | 'edit'
  customer?: Customer
  quotes?: Quote[]
}

export default function CustomerForm({ mode, customer, quotes = [] }: CustomerFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<CustomerFormData>(customerToForm(customer))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  function set<K extends keyof CustomerFormData>(field: K, value: CustomerFormData[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(mode === 'edit' ? `/api/admin/customers/${customer!.id}` : '/api/admin/customers', {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        if (mode === 'create') {
          router.push(`/admin/dashboard/clientes/${data.id}`)
          return
        }
        setForm(customerToForm(data))
        setSaved(true)
      } else {
        setError(data.error ?? 'Erro ao salvar cliente.')
      }
    } catch {
      setError('Falha de conexão ao salvar cliente.')
    }
    setSaving(false)
  }

  const input = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white'
  const label = 'block text-sm font-semibold text-gray-700 mb-1.5'
  const optional = <span className="text-gray-400 font-normal">opcional</span>

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin/dashboard/clientes" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft size={16} /> Clientes
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{mode === 'edit' ? customer!.name : 'Novo cliente'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="nome" className={label}>Nome *</label>
              <input id="nome" required value={form.name} onChange={e => set('name', e.target.value)} className={input} placeholder="Nome do cliente, igreja ou empresa" />
            </div>
            <div>
              <label htmlFor="whatsapp" className={label}>WhatsApp {optional}</label>
              <input id="whatsapp" type="tel" inputMode="tel" autoComplete="tel" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} className={input} placeholder="(11) 96440-5519" />
            </div>
            <div>
              <label htmlFor="email" className={label}>E-mail {optional}</label>
              <input id="email" type="email" autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} className={input} placeholder="cliente@email.com" />
            </div>
            <div>
              <label htmlFor="instagram" className={label}>Instagram {optional}</label>
              <input id="instagram" value={form.instagram} onChange={e => set('instagram', e.target.value)} className={input} placeholder="@usuario" />
            </div>
            <div>
              <label htmlFor="cidade" className={label}>Cidade {optional}</label>
              <input id="cidade" value={form.city} onChange={e => set('city', e.target.value)} className={input} placeholder="São Paulo - SP" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="obs" className={label}>Observações {optional}</label>
              <textarea id="obs" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} className={input} placeholder="Ex.: toca em igreja, procura pratos dark, prefere Pix" />
            </div>
            <label className="md:col-span-2 flex items-start gap-3 rounded-lg bg-gray-50 p-4 cursor-pointer">
              <input type="checkbox" checked={form.acceptsMarketing} onChange={e => set('acceptsMarketing', e.target.checked)} className="mt-0.5 w-4 h-4 accent-orange-500" />
              <span className="text-sm">
                <strong className="text-gray-900">Aceita receber e-mails da loja</strong> (novidades e promoções)
                <span className="block text-gray-500">
                  Só marque se o cliente concordou. Pela LGPD, os disparos de e-mail vão apenas para quem aceitou.
                  {customer?.accepts_marketing && customer.marketing_consent_at && ` Aceitou em ${new Date(customer.marketing_consent_at).toLocaleDateString('pt-BR')}.`}
                </span>
              </span>
            </label>
          </section>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>}
          {saved && <p role="status" className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">Cliente salvo.</p>}

          <div className="flex justify-end gap-3">
            <Link href="/admin/dashboard/clientes" className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100">
              {mode === 'edit' ? 'Voltar' : 'Cancelar'}
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition"
            >
              <Save size={16} />
              {saving ? 'Salvando...' : mode === 'edit' ? 'Salvar alterações' : 'Cadastrar cliente'}
            </button>
          </div>
        </form>

        {mode === 'edit' && (
          <section className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Orçamentos ({quotes.length})</h3>
              <Link
                href={`/admin/dashboard/orcamentos/novo?cliente=${customer!.id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                <Plus size={16} /> Novo orçamento para este cliente
              </Link>
            </div>
            {quotes.length === 0 ? (
              <p className="bg-white rounded-xl border border-gray-100 p-6 text-sm text-gray-500 text-center">Nenhum orçamento ainda.</p>
            ) : (
              <ul className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                {quotes.map(q => (
                  <li key={q.id}>
                    <Link href={`/admin/dashboard/orcamentos/${q.id}/documento`} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition">
                      <FileText size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="font-mono text-sm text-gray-500 whitespace-nowrap">{quoteNumber(q.id)}</span>
                      <span className="min-w-0 flex-1 truncate text-sm text-gray-700">{q.items.map(i => i.description).join(' · ')}</span>
                      <span className="hidden sm:block text-sm text-gray-500 whitespace-nowrap">{formatQuoteDate(q.quote_date)}</span>
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap tabular-nums">{formatPrice(quoteTotal(q.items))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
