'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Download, Edit, Mail, MessageCircle, Plus, RefreshCw, Search, Trash2, Users } from 'lucide-react'
import AdminHeader from '../_components/AdminHeader'
import { CustomerWithStats, customersToCsv, formatWhatsapp } from '@/lib/customers'
import { formatQuoteDate } from '@/lib/quote'
import { formatPrice } from '@/lib/products'

type Filter = 'todos' | 'aceitam' | 'com-orcamento'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'aceitam', label: 'Aceitam e-mails' },
  { id: 'com-orcamento', label: 'Com orçamento' },
]

export default function ClientesPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<CustomerWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [missingTable, setMissingTable] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('todos')
  const [syncing, setSyncing] = useState(false)
  const [notice, setNotice] = useState('')

  /** Busca a lista; o estado é aplicado no .then (fora do corpo do efeito). */
  async function fetchCustomers() {
    const res = await fetch('/api/admin/customers')
    const data = await res.json().catch(() => null)
    return { status: res.status, ok: res.ok, data }
  }

  function apply({ status, ok, data }: Awaited<ReturnType<typeof fetchCustomers>>) {
    if (status === 401) { router.push('/admin'); return }
    if (!ok) {
      setMissingTable(data?.code === 'missing_table')
      setError(data?.error ?? 'Erro ao carregar clientes.')
      return
    }
    setError('')
    setMissingTable(false)
    setCustomers(data)
  }

  useEffect(() => {
    fetchCustomers()
      .then(apply)
      .catch(() => setError('Erro ao carregar clientes.'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carrega uma vez ao abrir
  }, [])

  async function handleSync() {
    setSyncing(true)
    setNotice('')
    const res = await fetch('/api/admin/customers/sync', { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setNotice(data.checked === 0
        ? 'Todos os orçamentos já estão ligados a um cliente.'
        : `${data.linked} de ${data.checked} orçamentos ligados aos clientes.`)
      apply(await fetchCustomers())
    } else {
      setNotice(data.error ?? 'Erro ao importar dos orçamentos.')
    }
    setSyncing(false)
  }

  async function handleDelete(customer: CustomerWithStats) {
    const extra = customer.quote_count > 0 ? ` Os ${customer.quote_count} orçamentos dele continuam salvos.` : ''
    if (!confirm(`Excluir o cliente ${customer.name}?${extra}`)) return
    const res = await fetch(`/api/admin/customers/${customer.id}`, { method: 'DELETE' })
    if (res.ok) setCustomers(prev => prev.filter(c => c.id !== customer.id))
    else alert('Erro ao excluir cliente.')
  }

  const term = search.trim().toLowerCase()
  const digits = term.replace(/\D/g, '')
  const filtered = customers.filter(c =>
    (filter === 'todos' || (filter === 'aceitam' ? c.accepts_marketing : c.quote_count > 0)) &&
    (!term ||
      c.name.toLowerCase().includes(term) ||
      c.email?.includes(term) ||
      c.city?.toLowerCase().includes(term) ||
      (digits.length >= 3 && c.whatsapp?.includes(digits)))
  )

  function handleExport() {
    const blob = new Blob([customersToCsv(filtered)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clientes-vintage-${filter}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const acceptCount = customers.filter(c => c.accepts_marketing).length

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail, WhatsApp ou cidade..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSync}
              disabled={syncing || missingTable}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-semibold px-4 py-2.5 rounded-lg text-sm transition whitespace-nowrap"
              title="Cria e liga os clientes dos orçamentos que ainda não têm cadastro"
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              Importar dos orçamentos
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={filtered.length === 0}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-semibold px-4 py-2.5 rounded-lg text-sm transition whitespace-nowrap"
              title="Baixa a lista filtrada em planilha (CSV)"
            >
              <Download size={16} />
              Exportar CSV
            </button>
            <Link
              href="/admin/dashboard/clientes/novo"
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition whitespace-nowrap"
            >
              <Plus size={16} />
              Novo cliente
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6" role="group" aria-label="Filtrar clientes">
          {FILTERS.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition ${
                filter === f.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {f.label}
            </button>
          ))}
          {!loading && !error && (
            <p className="ml-auto text-sm text-gray-500">
              {customers.length} {customers.length === 1 ? 'cliente' : 'clientes'} · {acceptCount} {acceptCount === 1 ? 'aceita' : 'aceitam'} receber e-mails
            </p>
          )}
        </div>

        {notice && <p role="status" className="mb-4 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-4 py-3">{notice}</p>}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Carregando clientes...</div>
        ) : error ? (
          <div className="text-center py-20 max-w-lg mx-auto">
            <p className="text-red-500 mb-2">{error}</p>
            {missingTable && (
              <p className="text-sm text-gray-500">
                Rode o arquivo <code className="bg-gray-100 px-1 rounded">supabase/migrations/004_create_customers.sql</code> no SQL Editor do Supabase.
                Os orçamentos continuam funcionando normalmente enquanto isso.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Cliente</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Contato</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-semibold hidden md:table-cell">E-mails</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-semibold hidden md:table-cell">Orçamentos</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold hidden lg:table-cell">Último orçamento</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400">
                        <Users size={32} className="mx-auto mb-2 opacity-40" />
                        {customers.length === 0
                          ? 'Nenhum cliente ainda. Cadastre em "Novo cliente" ou traga os dos orçamentos em "Importar dos orçamentos".'
                          : 'Nenhum cliente com esse filtro.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <Link href={`/admin/dashboard/clientes/${c.id}`} className="font-semibold text-gray-900 hover:text-orange-600">
                            {c.name}
                          </Link>
                          <p className="text-xs text-gray-500">
                            {[c.city, c.instagram, c.source === 'orcamento' ? 'veio de orçamento' : null].filter(Boolean).join(' · ')}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5">
                            {c.whatsapp && (
                              <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-700 hover:text-green-700 whitespace-nowrap">
                                <MessageCircle size={14} className="text-green-600" /> {formatWhatsapp(c.whatsapp)}
                              </a>
                            )}
                            {c.email && (
                              <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1.5 text-gray-700 hover:text-orange-600 break-all">
                                <Mail size={14} className="text-gray-400 flex-shrink-0" /> {c.email}
                              </a>
                            )}
                            {!c.whatsapp && !c.email && <span className="text-xs text-gray-400">Sem contato</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center hidden md:table-cell">
                          {c.accepts_marketing
                            ? <span className="inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">Aceita</span>
                            : <span className="text-xs text-gray-400">Não</span>}
                        </td>
                        <td className="px-4 py-3 text-right hidden md:table-cell whitespace-nowrap tabular-nums">
                          {c.quote_count > 0 ? (
                            <>
                              <span className="font-semibold text-gray-900">{c.quote_count}</span>
                              <span className="block text-xs text-gray-500">{formatPrice(c.quote_total)}</span>
                            </>
                          ) : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden lg:table-cell whitespace-nowrap">
                          {c.last_quote_date ? formatQuoteDate(c.last_quote_date) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Link href={`/admin/dashboard/clientes/${c.id}`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Editar">
                              <Edit size={15} />
                            </Link>
                            <button onClick={() => handleDelete(c)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition" title="Excluir">
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
