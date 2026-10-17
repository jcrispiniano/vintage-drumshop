'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Copy, Edit, FileText, Plus, Search, Trash2 } from 'lucide-react'
import AdminHeader from '../_components/AdminHeader'
import { Quote, formatQuoteDate, quoteNumber, quoteTotal, todayISO } from '@/lib/quote'
import { formatPrice } from '@/lib/products'

export default function OrcamentosPage() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/admin/quotes')
      .then(async res => {
        if (res.status === 401) { router.push('/admin'); return }
        if (!res.ok) throw new Error()
        setQuotes(await res.json())
      })
      .catch(() => setError('Erro ao carregar orçamentos.'))
      .finally(() => setLoading(false))
  }, [router])

  async function handleDelete(quote: Quote) {
    if (!confirm(`Excluir o orçamento ${quoteNumber(quote.id)} de ${quote.client_name}?`)) return
    setBusy(quote.id)
    const res = await fetch(`/api/admin/quotes/${quote.id}`, { method: 'DELETE' })
    if (res.ok) setQuotes(prev => prev.filter(q => q.id !== quote.id))
    else alert('Erro ao excluir orçamento.')
    setBusy(null)
  }

  // Duplicar: mesmo conteúdo com a data de hoje, já abrindo para edição
  async function handleDuplicate(quote: Quote) {
    setBusy(quote.id)
    const res = await fetch('/api/admin/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: quote.client_name,
        clientContact: quote.client_contact ?? '',
        quoteDate: todayISO(),
        items: quote.items,
        notes: quote.notes ?? '',
      }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(null)
    if (res.ok) router.push(`/admin/dashboard/orcamentos/${data.id}`)
    else alert(data.error ?? 'Erro ao duplicar orçamento.')
  }

  const term = search.trim().toLowerCase()
  const filtered = quotes.filter(q =>
    !term ||
    q.client_name.toLowerCase().includes(term) ||
    q.items.some(i => i.description.toLowerCase().includes(term)) ||
    quoteNumber(q.id).includes(term)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, item ou número..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <Link
            href="/admin/dashboard/orcamentos/novo"
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition whitespace-nowrap"
          >
            <Plus size={16} />
            Novo orçamento
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Carregando orçamentos...</div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-sm text-gray-500">Confira se a tabela quotes existe (supabase/migrations/003_create_quotes.sql).</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Nº</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Cliente</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold hidden md:table-cell">Data</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold hidden lg:table-cell">Itens</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-semibold">Total</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400">
                        <FileText size={32} className="mx-auto mb-2 opacity-40" />
                        {search ? 'Nenhum orçamento encontrado.' : 'Nenhum orçamento ainda. Crie o primeiro em "Novo orçamento".'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map(quote => (
                      <tr key={quote.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">{quoteNumber(quote.id)}</td>
                        <td className="px-4 py-3">
                          <Link href={`/admin/dashboard/orcamentos/${quote.id}/documento`} className="font-semibold text-gray-900 hover:text-orange-600">
                            {quote.client_name}
                          </Link>
                          {quote.client_contact && <p className="text-xs text-gray-500">{quote.client_contact}</p>}
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell whitespace-nowrap">{formatQuoteDate(quote.quote_date)}</td>
                        <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                          <span className="line-clamp-1 max-w-sm">{quote.items.map(i => i.description).join(' · ')}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap tabular-nums">
                          {formatPrice(quoteTotal(quote.items))}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Link href={`/admin/dashboard/orcamentos/${quote.id}/documento`} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition" title="Ver documento">
                              <FileText size={15} />
                            </Link>
                            <Link href={`/admin/dashboard/orcamentos/${quote.id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Editar">
                              <Edit size={15} />
                            </Link>
                            <button onClick={() => handleDuplicate(quote)} disabled={busy === quote.id} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition disabled:opacity-40" title="Duplicar">
                              <Copy size={15} />
                            </button>
                            <button onClick={() => handleDelete(quote)} disabled={busy === quote.id} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition disabled:opacity-40" title="Excluir">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
