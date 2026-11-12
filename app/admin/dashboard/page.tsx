'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Package, Search, Undo2, X } from 'lucide-react'
import AdminHeader from './_components/AdminHeader'
import { categoryName } from '@/lib/products'

interface DbProduct {
  id: number
  name: string
  category: string
  brand: string
  price: number
  old_price?: number
  image: string
  images?: string[] | null
  audio?: string | null
  videos?: string[] | null
  badge?: string
  description?: string
  active: boolean
  featured: boolean
  sold_out?: boolean
  created_at: string
}

type QuickFilter = 'todos' | 'esgotados' | 'inativos' | 'sem-descricao' | 'poucas-fotos' | 'sem-som' | 'destaques'

/** Descrição curta demais para ajudar o cliente a escolher (meta da análise de UX) */
const SHORT_DESCRIPTION = 200
const UNDO_MS = 6000

/** Só a foto principal: cliente compra melhor vendo o prato/caixa de vários ângulos */
const fewPhotos = (p: DbProduct) => (p.images?.filter(Boolean).length ?? 0) === 0

/** Prato sem áudio nem vídeo: o cliente não tem como ouvir antes de comprar */
const noSound = (p: DbProduct) => p.category === 'pratos' && !p.audio && !(p.videos?.filter(Boolean).length)

const isShort = (p: DbProduct) => (p.description ?? '').trim().length < SHORT_DESCRIPTION

const QUICK_FILTERS: { id: QuickFilter; label: string; test: (p: DbProduct) => boolean }[] = [
  { id: 'todos', label: 'Todos', test: () => true },
  { id: 'esgotados', label: 'Esgotados', test: p => !!p.sold_out },
  { id: 'inativos', label: 'Fora do site', test: p => !p.active },
  { id: 'sem-descricao', label: 'Descrição curta', test: isShort },
  { id: 'sem-som', label: 'Prato sem som', test: noSound },
  { id: 'poucas-fotos', label: 'Só 1 foto', test: fewPhotos },
  { id: 'destaques', label: 'Destaques', test: p => p.featured },
]

/** Devolve o produto ao lugar dele (lista ordenada do mais novo para o mais antigo) */
const restore = (list: DbProduct[], product: DbProduct) =>
  [...list, product].sort((a, b) => b.created_at.localeCompare(a.created_at))

const price = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [quick, setQuick] = useState<QuickFilter>('todos')
  const [category, setCategory] = useState('')
  const [toast, setToast] = useState<{ text: string; undo?: () => void; tone?: 'error' } | null>(null)
  const [busy, setBusy] = useState<number | null>(null)
  // Exclusão fica pendente alguns segundos para dar tempo de desfazer
  const pendingDelete = useRef<{ product: DbProduct; timer: ReturnType<typeof setTimeout> } | null>(null)
  const router = useRouter()

  async function loadProducts() {
    setLoading(true)
    const res = await fetch('/api/admin/products')
    if (res.status === 401) {
      router.push('/admin')
      return
    }
    if (!res.ok) {
      setError('Não foi possível carregar os produtos. Recarregue a página; se continuar, fale com quem cuida do site.')
      setLoading(false)
      return
    }
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { loadProducts() }, [])

  // O aviso some sozinho
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), UNDO_MS)
    return () => clearTimeout(t)
  }, [toast])

  // Saiu da página com uma exclusão pendente: conclui a exclusão
  useEffect(() => () => {
    const pending = pendingDelete.current
    if (!pending) return
    clearTimeout(pending.timer)
    fetch(`/api/admin/products/${pending.product.id}`, { method: 'DELETE', keepalive: true }).catch(() => {})
  }, [])

  async function commitDelete(product: DbProduct) {
    pendingDelete.current = null
    const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' }).catch(() => null)
    if (!res?.ok) {
      setProducts(prev => restore(prev, product))
      setToast({ text: `Não foi possível excluir "${product.name}". Ele voltou para a lista.`, tone: 'error' })
    }
  }

  function handleDelete(product: DbProduct) {
    // Uma exclusão por vez: a anterior é concluída antes
    if (pendingDelete.current) {
      clearTimeout(pendingDelete.current.timer)
      commitDelete(pendingDelete.current.product)
    }
    setProducts(prev => prev.filter(p => p.id !== product.id))
    const timer = setTimeout(() => commitDelete(product), UNDO_MS)
    pendingDelete.current = { product, timer }
    setToast({
      text: `"${product.name}" excluído.`,
      undo: () => {
        clearTimeout(timer)
        pendingDelete.current = null
        setProducts(prev => restore(prev, product))
        setToast(null)
      },
    })
  }

  async function updateFlag(product: DbProduct, patch: { active?: boolean; soldOut?: boolean }, isUndo = false) {
    setBusy(product.id)
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }).catch(() => null)
    setBusy(null)
    if (!res?.ok) {
      setToast({ text: `Não foi possível salvar "${product.name}". Tente de novo.`, tone: 'error' })
      return
    }
    setProducts(prev => prev.map(p => p.id === product.id
      ? { ...p, ...(patch.active !== undefined && { active: patch.active }), ...(patch.soldOut !== undefined && { sold_out: patch.soldOut }) }
      : p))
    // Um toque muda o site na hora: confirma o que aconteceu e deixa desfazer
    if (isUndo) { setToast(null); return }
    const text = patch.soldOut !== undefined
      ? `"${product.name}" ${patch.soldOut ? 'marcado como esgotado' : 'voltou ao estoque'}.`
      : `"${product.name}" ${patch.active ? 'voltou para o site' : 'saiu do site'}.`
    const inverse = patch.soldOut !== undefined ? { soldOut: !patch.soldOut } : { active: !patch.active }
    setToast({ text, undo: () => updateFlag(product, inverse, true) })
  }

  const categories = [...new Set(products.map(p => p.category))].sort()
  const q = search.toLowerCase().trim()
  const quickTest = QUICK_FILTERS.find(f => f.id === quick)!.test
  const filtered = products.filter(p =>
    quickTest(p) &&
    (!category || p.category === category) &&
    (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
  )
  const hasFilters = quick !== 'todos' || !!category || !!q

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Atalhos: cada número é um filtro do que precisa de atenção */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtros rápidos">
          {QUICK_FILTERS.map(f => {
            const count = products.filter(f.test).length
            const active = quick === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setQuick(f.id)}
                aria-pressed={active}
                className={`flex h-11 flex-shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
                  active ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-gray-400'
                }`}
              >
                {f.label}
                <span className={`tabular-nums ${active ? 'text-white/70' : 'text-gray-400'}`}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
            <label htmlFor="busca-admin" className="sr-only">Buscar produtos</label>
            <input
              id="busca-admin"
              type="text"
              placeholder="Buscar por nome, categoria ou marca..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pl-9 pr-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <label htmlFor="categoria-admin" className="sr-only">Categoria</label>
          <select
            id="categoria-admin"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Todas as categorias</option>
            {categories.map(c => <option key={c} value={c}>{categoryName(c)}</option>)}
          </select>
          <Link
            href="/admin/dashboard/novo"
            className="flex h-11 items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 rounded-lg text-sm transition whitespace-nowrap"
          >
            <Plus size={16} aria-hidden />
            Novo Produto
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Carregando produtos...</div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button type="button" onClick={() => { setError(''); loadProducts() }} className="h-11 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white">
              Tentar de novo
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package size={32} className="mx-auto mb-2 opacity-40" aria-hidden />
                {hasFilters ? (
                  <>
                    <p>Nenhum produto com esses filtros.</p>
                    <button type="button" onClick={() => { setQuick('todos'); setCategory(''); setSearch('') }} className="mt-3 h-11 px-4 text-sm font-semibold text-orange-600 hover:underline">
                      Limpar filtros
                    </button>
                  </>
                ) : (
                  <p>Nenhum produto cadastrado ainda.</p>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filtered.map(product => (
                  <li key={product.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap">
                    <div className={`flex min-w-0 flex-1 items-center gap-3 ${!product.active ? 'opacity-50' : ''}`}>
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element -- prévia de URL qualquer no admin */}
                        <img
                          src={product.image}
                          alt=""
                          className="w-full h-full object-contain p-1"
                          onError={e => { (e.target as HTMLImageElement).src = '/placeholder-produto.jpg' }}
                        />
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/dashboard/${product.id}`} className="block truncate font-semibold text-gray-900 hover:text-orange-600">
                          {product.name}
                        </Link>
                        <p className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
                          <span className="capitalize">{product.category}</span>
                          <span aria-hidden>·</span>
                          <span className="font-semibold text-gray-800 tabular-nums">{price(product.price)}</span>
                          {product.badge && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-orange-700">{product.badge}</span>}
                          {isShort(product) && <span className="text-amber-700">descrição curta</span>}
                          {noSound(product) && <span className="text-amber-700">sem som</span>}
                          {fewPhotos(product) && <span className="text-amber-700">só 1 foto</span>}
                        </p>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                      <button
                        type="button"
                        onClick={() => updateFlag(product, { soldOut: !product.sold_out })}
                        disabled={busy === product.id}
                        aria-pressed={!!product.sold_out}
                        title={product.sold_out ? 'Toque para voltar ao estoque' : 'Toque para marcar como esgotado'}
                        className={`h-10 rounded-full px-3 text-xs font-semibold transition disabled:opacity-50 ${
                          product.sold_out ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-gray-400'
                        }`}
                      >
                        {product.sold_out ? 'Esgotado' : 'Em estoque'}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFlag(product, { active: !product.active })}
                        disabled={busy === product.id}
                        aria-pressed={product.active}
                        title={product.active ? 'Toque para tirar do site' : 'Toque para mostrar no site'}
                        className={`h-10 rounded-full px-3 text-xs font-semibold transition disabled:opacity-50 ${
                          product.active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {product.active ? 'No site' : 'Fora do site'}
                      </button>
                      <Link
                        href={`/admin/dashboard/${product.id}`}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition"
                        aria-label={`Editar ${product.name}`}
                      >
                        <Edit size={16} aria-hidden />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition"
                        aria-label={`Excluir ${product.name}`}
                      >
                        <Trash2 size={16} aria-hidden />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {filtered.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
                {filtered.length} de {products.length} produto{products.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}
      </main>

      {toast && (
        <div
          role="status"
          className={`fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-lg items-center gap-3 rounded-xl px-4 py-3 text-sm text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)] ${
            toast.tone === 'error' ? 'bg-red-700' : 'bg-gray-900'
          }`}
          style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <span className="min-w-0 flex-1">{toast.text}</span>
          {toast.undo && (
            <button type="button" onClick={toast.undo} className="flex h-10 items-center gap-1.5 rounded-md px-3 font-bold text-orange-300 hover:bg-white/10">
              <Undo2 size={16} aria-hidden /> Desfazer
            </button>
          )}
          <button type="button" onClick={() => setToast(null)} className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10" aria-label="Fechar aviso">
            <X size={16} aria-hidden />
          </button>
        </div>
      )}
    </div>
  )
}
