'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, Gift, Plus, Search, Trash2 } from 'lucide-react'
import AdminHeader from './AdminHeader'
import { DEFAULT_NOTES, QuoteItem, emptyItem, itemTotal, quoteTotal, todayISO } from '@/lib/quote'
import { formatPrice } from '@/lib/products'

interface CatalogProduct {
  id: number
  name: string
  price: number
  active: boolean
}

export interface QuoteFormData {
  clientName: string
  clientContact: string
  quoteDate: string
  items: QuoteItem[]
  notes: string
}

interface QuoteFormProps {
  mode: 'create' | 'edit'
  id?: number
  initialData?: QuoteFormData
}

export function blankQuote(): QuoteFormData {
  return { clientName: '', clientContact: '', quoteDate: todayISO(), items: [emptyItem()], notes: DEFAULT_NOTES }
}

export default function QuoteForm({ mode, id, initialData }: QuoteFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<QuoteFormData>(initialData ?? blankQuote())
  const [catalog, setCatalog] = useState<CatalogProduct[]>([])
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => (res.ok ? res.json() : []))
      .then(data => Array.isArray(data) && setCatalog(data))
      .catch(() => {})
  }, [])

  const matches = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (term.length < 2) return []
    return catalog.filter(p => p.name.toLowerCase().includes(term)).slice(0, 8)
  }, [catalog, search])

  const total = quoteTotal(form.items)

  function set<K extends keyof QuoteFormData>(field: K, value: QuoteFormData[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function setItem(index: number, patch: Partial<QuoteItem>) {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }))
  }

  function addItem(item: QuoteItem = emptyItem()) {
    setForm(prev => {
      // Reaproveita a última linha se ela ainda estiver em branco
      const last = prev.items[prev.items.length - 1]
      const items = last && !last.description.trim() ? prev.items.slice(0, -1) : prev.items
      return { ...prev, items: [...items, item] }
    })
  }

  function removeItem(index: number) {
    setForm(prev => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((_, i) => i !== index) : [emptyItem()],
    }))
  }

  function addFromCatalog(product: CatalogProduct) {
    addItem({ ...emptyItem(), description: product.name, price: Number(product.price) })
    setSearch('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(mode === 'edit' ? `/api/admin/quotes/${id}` : '/api/admin/quotes', {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        router.push(`/admin/dashboard/orcamentos/${data.id}/documento`)
        router.refresh()
        return
      }
      setError(data.error ?? 'Erro ao salvar orçamento.')
    } catch {
      setError('Falha de conexão ao salvar orçamento.')
    }
    setSaving(false)
  }

  const input = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white'
  const label = 'block text-sm font-semibold text-gray-700 mb-1.5'

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/admin/dashboard/orcamentos" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft size={16} /> Orçamentos
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{mode === 'edit' ? 'Editar orçamento' : 'Novo orçamento'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 grid gap-5 md:grid-cols-[2fr_1.2fr_1fr]">
            <div>
              <label htmlFor="cliente" className={label}>Cliente *</label>
              <input id="cliente" required value={form.clientName} onChange={e => set('clientName', e.target.value)} className={input} placeholder="Nome do cliente ou da igreja/empresa" />
            </div>
            <div>
              <label htmlFor="contato" className={label}>Contato <span className="text-gray-400 font-normal">opcional</span></label>
              <input id="contato" value={form.clientContact} onChange={e => set('clientContact', e.target.value)} className={input} placeholder="WhatsApp ou e-mail" />
            </div>
            <div>
              <label htmlFor="data" className={label}>Data</label>
              <input id="data" type="date" value={form.quoteDate} onChange={e => set('quoteDate', e.target.value)} className={input} />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Itens</h3>
              <div className="relative w-full sm:w-96">
                <label htmlFor="catalogo" className="sr-only">Adicionar produto do catálogo</label>
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="catalogo"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Adicionar do catálogo (busque pelo nome)"
                  className={`${input} pl-9`}
                  autoComplete="off"
                />
                {matches.length > 0 && (
                  <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
                    {matches.map(p => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => addFromCatalog(p)}
                          className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left text-sm hover:bg-orange-50"
                        >
                          <span className={`truncate ${p.active ? 'text-gray-900' : 'text-gray-400'}`}>{p.name}</span>
                          <span className="flex-shrink-0 font-semibold text-gray-700">{formatPrice(Number(p.price))}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="hidden md:grid grid-cols-[1fr_120px_150px_70px_70px_120px_40px] gap-2 px-1 pb-2 text-xs font-semibold text-gray-500 uppercase">
              <span>Item</span><span>Preço</span><span>Condição</span><span>Qt.</span><span className="text-center">Brinde</span><span className="text-right">Total</span><span />
            </div>

            <ol className="space-y-3">
              {form.items.map((item, i) => (
                <li key={i} className="grid gap-2 rounded-lg border border-gray-100 p-3 md:border-0 md:p-1 md:grid-cols-[1fr_120px_150px_70px_70px_120px_40px] md:items-center">
                  <textarea
                    aria-label={`Descrição do item ${i + 1}`}
                    value={item.description}
                    onChange={e => setItem(i, { description: e.target.value })}
                    rows={1}
                    placeholder="Descrição (ex.: Surdo de chão 14x14)"
                    className={`${input} resize-y min-h-[42px]`}
                  />
                  <div className="grid grid-cols-3 gap-2 md:contents">
                    <input
                      aria-label={`Preço do item ${i + 1}`}
                      type="number"
                      min={0}
                      step="0.01"
                      inputMode="decimal"
                      value={item.gift ? '' : item.price || ''}
                      disabled={item.gift}
                      placeholder={item.gift ? 'Brinde' : '0,00'}
                      onChange={e => setItem(i, { price: e.target.valueAsNumber || 0 })}
                      className={`${input} disabled:bg-gray-50`}
                    />
                    <input
                      aria-label={`Condição de pagamento do item ${i + 1}`}
                      value={item.payment}
                      disabled={item.gift}
                      onChange={e => setItem(i, { payment: e.target.value })}
                      className={`${input} disabled:bg-gray-50`}
                    />
                    <input
                      aria-label={`Quantidade do item ${i + 1}`}
                      type="number"
                      min={1}
                      step={1}
                      value={item.qty}
                      onChange={e => setItem(i, { qty: Math.max(1, e.target.valueAsNumber || 1) })}
                      className={input}
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700 md:justify-center cursor-pointer">
                    <input type="checkbox" checked={item.gift} onChange={e => setItem(i, { gift: e.target.checked })} className="w-4 h-4 accent-orange-500" />
                    <Gift size={15} className="md:hidden" /> <span className="md:sr-only">Brinde</span>
                  </label>
                  <div className="flex items-center justify-between md:contents">
                    <span className="text-sm font-semibold text-gray-900 md:text-right tabular-nums">
                      {item.gift ? 'BRINDE' : formatPrice(itemTotal(item))}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition justify-self-center"
                      aria-label={`Remover item ${i + 1}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <button type="button" onClick={() => addItem()} className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700">
                <Plus size={16} /> Adicionar item
              </button>
              <p className="text-lg font-bold text-gray-900 tabular-nums">Total: {formatPrice(total)}</p>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label htmlFor="obs" className={label}>Observação importante</label>
            <textarea id="obs" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} className={input} />
            <p className="mt-1 text-xs text-gray-500">Aparece no documento abaixo da tabela. Deixe em branco para não mostrar.</p>
          </section>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>}

          <div className="flex justify-end gap-3">
            <Link href="/admin/dashboard/orcamentos" className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition"
            >
              <FileText size={16} />
              {saving ? 'Salvando...' : 'Salvar e gerar documento'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
