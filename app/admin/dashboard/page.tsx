'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertCircle, ExternalLink, Pencil, Tag, ImageIcon, MoreHorizontal, Package, Plus, Search, Trash2, Undo2, Volume2, X, FileText,
} from 'lucide-react'
import AdminHeader from './_components/AdminHeader'
import { categoryName, productPath } from '@/lib/products'
import { cymbalSeries } from '@/lib/cymbals'

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

/** Descrição curta demais para ajudar o cliente a escolher */
const SHORT_DESCRIPTION = 200
const UNDO_MS = 6000

const fewPhotos = (p: DbProduct) => (p.images?.filter(Boolean).length ?? 0) === 0
const isCustom = (p: DbProduct) => p.badge === 'Custom'
/** Sem preço e não é custom: não pode ir para o site ainda */
const noPrice = (p: DbProduct) => !(p.price > 0) && !isCustom(p)
const noSound = (p: DbProduct) => p.category === 'pratos' && !p.audio && !(p.videos?.filter(Boolean).length)
const isShort = (p: DbProduct) => (p.description ?? '').trim().length < SHORT_DESCRIPTION

/** O que falta em cada produto, na ordem do que mais ajuda a vender */
function pending(p: DbProduct) {
  const list: { key: string; label: string; icon: typeof Volume2 }[] = []
  if (noPrice(p)) list.push({ key: 'preco', label: 'Sem preço', icon: Tag })
  if (noSound(p)) list.push({ key: 'som', label: 'Sem som', icon: Volume2 })
  if (fewPhotos(p)) list.push({ key: 'fotos', label: 'Só 1 foto', icon: ImageIcon })
  if (isShort(p)) list.push({ key: 'descricao', label: 'Descrição curta', icon: FileText })
  return list
}

// Ordem das categorias no menu: a mesma importância que têm na loja
const CATEGORY_ORDER = ['pratos', 'baquetas', 'caixas', 'baterias', 'acessorios', 'estudo', 'peles', 'ferragens', 'bags', 'pecas', 'cajon', 'kids', 'livros']

type View = { kind: 'categoria'; id: string } | { kind: 'todos' } | { kind: 'atencao' }
type StatusFilter = 'todos' | 'no-site' | 'fora' | 'esgotados' | 'destaques'
type Sort = 'recentes' | 'nome' | 'preco-asc' | 'preco-desc'

const STATUS: { id: StatusFilter; label: string; test: (p: DbProduct) => boolean }[] = [
  { id: 'todos', label: 'Todos', test: () => true },
  { id: 'no-site', label: 'No site', test: p => p.active },
  { id: 'fora', label: 'Fora do site', test: p => !p.active },
  { id: 'esgotados', label: 'Esgotados', test: p => !!p.sold_out },
  { id: 'destaques', label: 'Destaques', test: p => p.featured },
]

const restore = (list: DbProduct[], product: DbProduct) =>
  [...list, product].sort((a, b) => b.created_at.localeCompare(a.created_at))

const price = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

/** Subgrupo dentro da categoria: série nos pratos, marca nas outras */
function groupOf(p: DbProduct) {
  if (p.category === 'pratos') return cymbalSeries(p.name)?.label ?? 'Outras séries'
  const b = p.brand === 'outro' || !p.brand ? 'Outras marcas' : p.brand
  return b.charAt(0).toUpperCase() + b.slice(1)
}

/** Interruptor com rótulo: o texto diz o que está ligado, sem adivinhar o que o toque faz */
function Switch({ on, label, onChange, disabled }: { on: boolean; label: string; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onChange}
      disabled={disabled}
      className="group flex min-h-11 items-center gap-2 rounded-md px-1.5 text-sm text-ink disabled:opacity-50"
    >
      <span className={`relative inline-flex h-6 w-10 flex-shrink-0 items-center rounded-full transition-colors ${on ? 'bg-[#167a42]' : 'bg-line'}`}>
        <span className={`absolute h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-transform ${on ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<View>({ kind: 'categoria', id: 'pratos' })
  const [status, setStatus] = useState<StatusFilter>('todos')
  const [sort, setSort] = useState<Sort>('recentes')
  const [menuFor, setMenuFor] = useState<number | null>(null)
  const [toast, setToast] = useState<{ text: string; undo?: () => void; tone?: 'error' } | null>(null)
  const [busy, setBusy] = useState<number | null>(null)
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
    const data: DbProduct[] = await res.json()
    setProducts(data)
    // Abre na categoria com mais produtos
    const counts = data.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.category]: (acc[p.category] ?? 0) + 1 }), {})
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
    if (top) setView({ kind: 'categoria', id: top })
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { loadProducts() }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), UNDO_MS)
    return () => clearTimeout(t)
  }, [toast])

  // Menu "…" fecha ao clicar fora ou com Esc
  useEffect(() => {
    if (menuFor === null) return
    const close = () => setMenuFor(null)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('click', close)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('click', close); window.removeEventListener('keydown', onKey) }
  }, [menuFor])

  useEffect(() => () => {
    const p = pendingDelete.current
    if (!p) return
    clearTimeout(p.timer)
    fetch(`/api/admin/products/${p.product.id}`, { method: 'DELETE', keepalive: true }).catch(() => {})
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
    // Produto sem preço não vai para o site (apareceria "preço sob consulta" sem ser custom)
    if (patch.active && noPrice(product)) {
      setToast({ text: `Defina o preço de "${product.name}" antes de colocar no site. Toque em Editar.`, tone: 'error' })
      return
    }
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
    if (isUndo) { setToast(null); return }
    const text = patch.soldOut !== undefined
      ? `"${product.name}" ${patch.soldOut ? 'marcado como esgotado' : 'voltou ao estoque'}.`
      : `"${product.name}" ${patch.active ? 'voltou para o site' : 'saiu do site'}.`
    const inverse = patch.soldOut !== undefined ? { soldOut: !patch.soldOut } : { active: !patch.active }
    setToast({ text, undo: () => updateFlag(product, inverse, true) })
  }

  // Categorias presentes, na ordem da loja
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    products.forEach(p => counts.set(p.category, (counts.get(p.category) ?? 0) + 1))
    return [...counts.entries()].sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a[0]); const ib = CATEGORY_ORDER.indexOf(b[0])
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
    })
  }, [products])
  const attentionCount = products.filter(p => pending(p).length > 0).length

  const q = search.toLowerCase().trim()
  // A busca procura em tudo, qualquer que seja a categoria aberta
  const inView = (p: DbProduct) =>
    q ? true
      : view.kind === 'todos' ? true
      : view.kind === 'atencao' ? pending(p).length > 0
      : p.category === view.id
  const statusTest = STATUS.find(s => s.id === status)!.test
  const filtered = products
    .filter(p => inView(p) && statusTest(p))
    .filter(p => !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || categoryName(p.category).toLowerCase().includes(q))
    .sort((a, b) =>
      sort === 'nome' ? a.name.localeCompare(b.name, 'pt-BR')
        : sort === 'preco-asc' ? a.price - b.price
        : sort === 'preco-desc' ? b.price - a.price
        : b.created_at.localeCompare(a.created_at))

  // Agrupa: na categoria, por série (pratos) ou marca; no resto, por categoria
  const groupBy = (p: DbProduct) => (view.kind === 'categoria' && !q ? groupOf(p) : categoryName(p.category))
  const groups = new Map<string, DbProduct[]>()
  filtered.forEach(p => {
    const g = groupBy(p)
    groups.set(g, [...(groups.get(g) ?? []), p])
  })
  const groupList = [...groups.entries()].sort((a, b) => b[1].length - a[1].length)

  const title = q ? `Busca: "${search.trim()}"`
    : view.kind === 'todos' ? 'Todos os produtos'
    : view.kind === 'atencao' ? 'Precisam de atenção'
    : categoryName(view.id)
  const newHref = view.kind === 'categoria' ? `/admin/dashboard/novo?categoria=${view.id}` : '/admin/dashboard/novo'

  const navItem = (active: boolean) =>
    `flex min-h-11 w-full flex-shrink-0 items-center justify-between gap-3 rounded-lg px-3 text-left text-sm font-semibold transition ${
      active ? 'bg-ink text-white' : 'text-ink hover:bg-cream'
    }`

  return (
    <div className="min-h-screen bg-paper text-ink">
      <AdminHeader />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:py-8">
        {/* Navegação por produto: cada categoria com a quantidade */}
        <nav aria-label="Categorias" className="md:sticky md:top-6 md:w-56 md:flex-shrink-0 md:self-start">
          <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0">
            {categoryCounts.map(([id, count]) => {
              const active = !q && view.kind === 'categoria' && view.id === id
              return (
                <li key={id}>
                  <button type="button" onClick={() => { setView({ kind: 'categoria', id }); setSearch('') }} aria-current={active ? 'page' : undefined} className={navItem(active)}>
                    {categoryName(id)}
                    <span className={`tabular-nums ${active ? 'text-white/70' : 'text-ink-soft'}`}>{count}</span>
                  </button>
                </li>
              )
            })}
            <li className="md:mt-3 md:border-t md:border-line md:pt-3">
              <button type="button" onClick={() => { setView({ kind: 'atencao' }); setSearch('') }} aria-current={!q && view.kind === 'atencao' ? 'page' : undefined} className={navItem(!q && view.kind === 'atencao')}>
                <span className="flex items-center gap-2"><AlertCircle size={16} aria-hidden /> Precisam de atenção</span>
                <span className={`tabular-nums ${!q && view.kind === 'atencao' ? 'text-white/70' : 'text-ink-soft'}`}>{attentionCount}</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => { setView({ kind: 'todos' }); setSearch('') }} aria-current={!q && view.kind === 'todos' ? 'page' : undefined} className={navItem(!q && view.kind === 'todos')}>
                Todos os produtos
                <span className={`tabular-nums ${!q && view.kind === 'todos' ? 'text-white/70' : 'text-ink-soft'}`}>{products.length}</span>
              </button>
            </li>
          </ul>
        </nav>

        <main className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
              <label htmlFor="busca-admin" className="sr-only">Buscar em todos os produtos</label>
              <input
                id="busca-admin"
                type="search"
                placeholder="Buscar produto ou marca"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-12 w-full rounded-lg border border-line bg-white pl-10 pr-4 text-base text-ink placeholder:text-ink-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
            </div>
            <Link href={newHref} className="flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-accent px-5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-secondary">
              <Plus size={18} aria-hidden /> Novo produto
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl font-semibold uppercase leading-none">{title}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'}
                {view.kind === 'atencao' && !q && ' com preço, som, fotos ou descrição faltando'}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              Ordenar
              <select value={sort} onChange={e => setSort(e.target.value as Sort)} className="h-11 rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-accent focus:outline-none">
                <option value="recentes">Mais recentes</option>
                <option value="nome">Nome (A–Z)</option>
                <option value="preco-asc">Menor preço</option>
                <option value="preco-desc">Maior preço</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar por situação">
            {STATUS.map(s => {
              const count = products.filter(p => inView(p) && s.test(p)).length
              if (s.id !== 'todos' && count === 0) return null
              const active = status === s.id
              return (
                <button key={s.id} type="button" onClick={() => setStatus(s.id)} aria-pressed={active}
                  className={`flex h-10 flex-shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${active ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'}`}>
                  {s.label} <span className={`tabular-nums ${active ? 'text-white/70' : 'text-ink-soft'}`}>{count}</span>
                </button>
              )
            })}
          </div>

          {loading ? (
            <p className="py-20 text-center text-ink-soft">Carregando produtos…</p>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="mb-4 text-red-700">{error}</p>
              <button type="button" onClick={() => { setError(''); loadProducts() }} className="h-11 rounded-lg bg-ink px-5 text-sm font-semibold text-white">Tentar de novo</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-6 rounded-xl bg-white py-14 text-center ring-1 ring-line">
              <Package size={32} className="mx-auto mb-3 text-ink-soft" aria-hidden />
              <p className="text-ink">
                {view.kind === 'atencao' && !q ? 'Nenhum produto precisa de atenção. Tudo com som, fotos e descrição.' : 'Nenhum produto encontrado.'}
              </p>
              {(q || status !== 'todos') && (
                <button type="button" onClick={() => { setSearch(''); setStatus('todos') }} className="mt-3 h-11 px-4 text-sm font-semibold text-secondary hover:underline">Limpar busca e filtros</button>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-8">
              {groupList.map(([group, list]) => (
                <section key={group} aria-labelledby={`g-${group}`}>
                  {groupList.length > 1 && (
                    <h3 id={`g-${group}`} className="mb-2 flex items-baseline gap-2 text-xs font-bold uppercase tracking-wider text-ink-soft">
                      {group} <span className="font-normal tabular-nums">{list.length}</span>
                    </h3>
                  )}
                  <ul className="divide-y divide-line overflow-visible rounded-xl bg-white ring-1 ring-line">
                    {list.map(product => {
                      const todo = pending(product)
                      return (
                        <li key={product.id} className="relative flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:px-4">
                          <Link href={`/admin/dashboard/${product.id}`} className={`group flex min-w-0 flex-1 items-center gap-3 ${product.active ? '' : 'opacity-60'}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element -- prévia de URL qualquer no admin */}
                            <img src={product.image} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg bg-paper object-contain p-1" onError={e => { (e.target as HTMLImageElement).src = '/placeholder-produto.jpg' }} />
                            <span className="min-w-0">
                              <span className="block font-semibold leading-snug text-ink group-hover:text-accent">{product.name}</span>
                              <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                                <span className="font-semibold tabular-nums">{product.price > 0 ? price(product.price) : isCustom(product) ? 'Preço sob consulta' : 'Sem preço'}</span>
                                {product.old_price && product.old_price > product.price && <span className="text-ink-soft line-through tabular-nums">{price(product.old_price)}</span>}
                                {!product.active && <span className="rounded bg-ink px-1.5 py-0.5 text-xs font-semibold text-white">Fora do site</span>}
                                {product.sold_out && <span className="rounded bg-cream px-1.5 py-0.5 text-xs font-semibold text-ink">Esgotado</span>}
                                {product.featured && <span className="rounded bg-cream px-1.5 py-0.5 text-xs font-semibold text-ink">Destaque</span>}
                                {isCustom(product) && <span className="rounded bg-cream px-1.5 py-0.5 text-xs font-semibold text-ink">Custom · sob consulta</span>}
                              </span>
                              {todo.length > 0 && (
                                <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-amber-800">
                                  {todo.map(t => <span key={t.key} className="inline-flex items-center gap-1"><t.icon size={13} aria-hidden /> {t.label}</span>)}
                                </span>
                              )}
                            </span>
                          </Link>

                          <div className="flex items-center gap-x-2 border-t border-line pt-2 sm:gap-x-3 sm:border-0 sm:pt-0">
                            <Switch on={product.active} label="No site" disabled={busy === product.id} onChange={() => updateFlag(product, { active: !product.active })} />
                            <Switch on={!product.sold_out} label="Em estoque" disabled={busy === product.id} onChange={() => updateFlag(product, { soldOut: !product.sold_out })} />
                            <div className="ml-auto flex items-center gap-1">
                              <Link href={`/admin/dashboard/${product.id}`} className="hidden h-11 items-center rounded-lg px-4 text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-ink/40 sm:flex">
                                Editar
                              </Link>
                              <div className="relative">
                                <button type="button" aria-label={`Mais ações para ${product.name}`} aria-expanded={menuFor === product.id} aria-haspopup="menu"
                                  onClick={e => { e.stopPropagation(); setMenuFor(menuFor === product.id ? null : product.id) }}
                                  className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-soft transition hover:bg-cream hover:text-ink">
                                  <MoreHorizontal size={20} aria-hidden />
                                </button>
                                {menuFor === product.id && (
                                  <div role="menu" className="absolute right-0 top-12 z-20 w-48 overflow-hidden rounded-lg bg-white py-1 shadow-[0_12px_28px_-8px_rgba(43,29,20,0.35)] ring-1 ring-line">
                                    {/* No celular o "Editar" mora aqui (tocar no produto também abre a edição) */}
                                    <Link role="menuitem" href={`/admin/dashboard/${product.id}`} className="flex min-h-11 items-center gap-2 px-4 text-sm font-semibold text-ink hover:bg-cream sm:hidden">
                                      <Pencil size={16} aria-hidden /> Editar
                                    </Link>
                                    <a role="menuitem" href={productPath(product)} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 px-4 text-sm text-ink hover:bg-cream">
                                      <ExternalLink size={16} aria-hidden /> Ver no site
                                    </a>
                                    <button role="menuitem" type="button" onClick={() => handleDelete(product)} className="flex min-h-11 w-full items-center gap-2 px-4 text-left text-sm text-red-700 hover:bg-red-50">
                                      <Trash2 size={16} aria-hidden /> Excluir produto
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>

      {toast && (
        <div role="status" className={`fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-lg items-center gap-3 rounded-xl px-4 py-3 text-sm text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)] ${toast.tone === 'error' ? 'bg-red-700' : 'bg-ink'}`}
          style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <span className="min-w-0 flex-1">{toast.text}</span>
          {toast.undo && (
            <button type="button" onClick={toast.undo} className="flex h-10 items-center gap-1.5 rounded-md px-3 font-bold text-gold hover:bg-white/10">
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
