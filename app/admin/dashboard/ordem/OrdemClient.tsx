'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp, ExternalLink, GripVertical, Pin, PinOff, Search, X } from 'lucide-react'
import AdminHeader from '../_components/AdminHeader'
import { categoryName } from '@/lib/products'

interface DbProduct {
  id: number
  name: string
  category: string
  brand: string
  price: number
  image: string
  active: boolean
  sold_out?: boolean
  created_at: string
  sort_order?: number | null
}

// Mesma ordem das categorias do painel de produtos
const CATEGORY_ORDER = ['pratos', 'baquetas', 'caixas', 'baterias', 'acessorios', 'estudo', 'peles', 'ferragens', 'bags', 'pecas', 'cajon', 'kids', 'livros']

const money = (n: number) => (n > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n) : 'Sem preço')

const sameIds = (a: number[], b: number[]) => a.length === b.length && a.every((id, i) => id === b[i])

/** Ordem em que a loja mostra quem NÃO foi fixado: mais novos primeiro, esgotados no fim */
const automatic = (list: DbProduct[]) =>
  [...list].sort((a, b) => Number(!!a.sold_out) - Number(!!b.sold_out) || b.created_at.localeCompare(a.created_at))

function Thumb({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- prévia de URL qualquer no admin
    <img src={src} alt="" className="h-14 w-14 flex-shrink-0 rounded-lg bg-paper object-contain p-1" onError={e => { (e.target as HTMLImageElement).src = '/placeholder-produto.jpg' }} />
  )
}

function Badges({ p }: { p: DbProduct }) {
  return (
    <>
      {!p.active && <span className="rounded bg-ink px-1.5 py-0.5 text-xs font-semibold text-white">Fora do site</span>}
      {p.sold_out && <span className="rounded bg-cream px-1.5 py-0.5 text-xs font-semibold text-ink">Esgotado</span>}
    </>
  )
}

const iconBtn = 'flex h-11 w-11 items-center justify-center rounded-lg text-ink ring-1 ring-line transition hover:ring-ink/40 disabled:opacity-30 disabled:hover:ring-line'

export default function OrdemClient({ initialCategory }: { initialCategory?: string }) {
  const router = useRouter()
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [pinned, setPinned] = useState<number[]>([])
  const [saved, setSaved] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ text: string; tone?: 'error' } | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const loadedCategory = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const res = await fetch('/api/admin/products').catch(() => null)
      if (cancelled) return
      if (res?.status === 401) { router.push('/admin'); return }
      if (!res?.ok) {
        setError('Não foi possível carregar os produtos. Recarregue a página; se continuar, fale com quem cuida do site.')
        setLoading(false)
        return
      }
      const data: DbProduct[] = await res.json()
      setProducts(data)
      const counts = data.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.category]: (acc[p.category] ?? 0) + 1 }), {})
      const wanted = initialCategory && counts[initialCategory] ? initialCategory : Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
      setCategory(wanted)
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [router, initialCategory])

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    products.forEach(p => counts.set(p.category, (counts.get(p.category) ?? 0) + 1))
    return [...counts.entries()].sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a[0]); const ib = CATEGORY_ORDER.indexOf(b[0])
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
    })
  }, [products])

  // Ao abrir (ou trocar) a categoria, parte da ordem que já está salva no banco
  useEffect(() => {
    if (!category || loadedCategory.current === category) return
    loadedCategory.current = category
    const ids = products
      .filter(p => p.category === category && typeof p.sort_order === 'number')
      .sort((a, b) => (a.sort_order as number) - (b.sort_order as number))
      .map(p => p.id)
    setPinned(ids)
    setSaved(ids)
    setSearch('')
  }, [category, products])

  const dirty = !sameIds(pinned, saved)

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const byId = useMemo(() => new Map(products.map(p => [p.id, p])), [products])
  const inCategory = useMemo(() => products.filter(p => p.category === category), [products, category])
  const pinnedProducts = pinned.map(id => byId.get(id)).filter((p): p is DbProduct => !!p)
  const q = search.toLowerCase().trim()
  const rest = automatic(inCategory.filter(p => !pinned.includes(p.id)))
    .filter(p => !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))

  function chooseCategory(id: string) {
    if (id === category) return
    if (dirty && !window.confirm('Você mexeu na ordem e ainda não salvou. Descartar as mudanças e trocar de categoria?')) return
    loadedCategory.current = null
    setCategory(id)
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= pinned.length || from === to) return
    setPinned(prev => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }
  const pin = (id: number, first = false) => setPinned(prev => (first ? [id, ...prev] : [...prev, id]))
  const unpin = (id: number) => setPinned(prev => prev.filter(x => x !== id))

  async function save() {
    if (!category) return
    setSaving(true)
    const res = await fetch('/api/admin/products/ordem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, ids: pinned }),
    }).catch(() => null)
    setSaving(false)
    if (!res?.ok) {
      const msg = res ? (await res.json().catch(() => null))?.error : null
      setToast({ text: msg ? `Não foi possível salvar: ${msg}` : 'Não foi possível salvar. Tente de novo.', tone: 'error' })
      return
    }
    // Reflete no estado local o que foi gravado
    setProducts(prev => prev.map(p => (p.category !== category ? p : { ...p, sort_order: pinned.includes(p.id) ? pinned.indexOf(p.id) + 1 : null })))
    setSaved(pinned)
    setToast({ text: pinned.length ? 'Ordem salva. Já vale na loja.' : 'Ordem salva: a loja volta para a ordem automática.' })
  }

  return (
    <div className="min-h-screen bg-paper pb-28 text-ink">
      <AdminHeader />
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-8">
        <h1 className="font-display text-3xl font-semibold uppercase leading-none">Ordem na loja</h1>
        <p className="mt-2 max-w-[65ch] text-sm text-ink-soft">
          Escolha o que aparece primeiro para o cliente. Os produtos <strong className="text-ink">fixados</strong> vão no topo, na ordem que você
          definir. O resto segue automático (mais novos primeiro, esgotados no fim). Vale para &quot;Destaques&quot;, que é a ordem que a loja
          mostra quando o cliente não escolhe outra.
        </p>

        {loading ? (
          <p className="py-20 text-center text-ink-soft">Carregando produtos…</p>
        ) : error ? (
          <p className="py-20 text-center text-red-700">{error}</p>
        ) : (
          <>
            <nav aria-label="Categorias" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1">
              {categories.map(([id, count]) => {
                const active = id === category
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => chooseCategory(id)}
                    aria-pressed={active}
                    className={`flex h-11 flex-shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${active ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'}`}
                  >
                    {categoryName(id)} <span className={`tabular-nums ${active ? 'text-white/70' : 'text-ink-soft'}`}>{count}</span>
                  </button>
                )
              })}
            </nav>

            {category && (
              <>
                <section aria-labelledby="fixados-titulo" className="mt-8">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h2 id="fixados-titulo" className="flex items-baseline gap-2 text-xs font-bold uppercase tracking-wider text-ink-soft">
                      No topo da loja <span className="font-normal tabular-nums">{pinnedProducts.length}</span>
                    </h2>
                    <a href={`/${category}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                      <ExternalLink size={15} aria-hidden /> Ver como o cliente vê
                    </a>
                  </div>

                  {pinnedProducts.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-line bg-white px-4 py-8 text-center text-sm text-ink-soft">
                      Nada fixado em {categoryName(category)}: a loja usa só a ordem automática. Toque em <strong className="text-ink">Fixar</strong> em um produto abaixo para colocá-lo no topo.
                    </div>
                  ) : (
                    <ol className="divide-y divide-line overflow-hidden rounded-xl bg-white ring-1 ring-line">
                      {pinnedProducts.map((p, i) => (
                        <li
                          key={p.id}
                          draggable
                          onDragStart={e => { setDragIndex(i); e.dataTransfer.effectAllowed = 'move' }}
                          onDragOver={e => { e.preventDefault(); if (overIndex !== i) setOverIndex(i) }}
                          onDrop={e => { e.preventDefault(); if (dragIndex !== null) move(dragIndex, i); setDragIndex(null); setOverIndex(null) }}
                          onDragEnd={() => { setDragIndex(null); setOverIndex(null) }}
                          className={`flex flex-col gap-3 p-3 sm:flex-row sm:items-center ${dragIndex === i ? 'opacity-40' : ''} ${overIndex === i && dragIndex !== null && dragIndex !== i ? 'bg-cream' : ''}`}
                        >
                          <span className="flex min-w-0 flex-1 items-center gap-3">
                            <span aria-hidden className="hidden cursor-grab text-ink-soft sm:block"><GripVertical size={20} /></span>
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold tabular-nums text-white" aria-label={`Posição ${i + 1}`}>{i + 1}</span>
                            <Thumb src={p.image} />
                            <span className="min-w-0">
                              <span className="block font-semibold leading-snug">{p.name}</span>
                              <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                                <span className="tabular-nums text-ink-soft">{money(p.price)}</span>
                                <Badges p={p} />
                              </span>
                            </span>
                          </span>
                          <span className="flex flex-shrink-0 items-center justify-end gap-1">
                            <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Subir ${p.name}`} className={iconBtn}><ArrowUp size={18} aria-hidden /></button>
                            <button type="button" onClick={() => move(i, i + 1)} disabled={i === pinnedProducts.length - 1} aria-label={`Descer ${p.name}`} className={iconBtn}><ArrowDown size={18} aria-hidden /></button>
                            <button type="button" onClick={() => unpin(p.id)} aria-label={`Tirar ${p.name} do topo`} title="Tirar do topo" className={iconBtn}><PinOff size={18} aria-hidden /></button>
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>

                <section aria-labelledby="resto-titulo" className="mt-10">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <h2 id="resto-titulo" className="flex items-baseline gap-2 text-xs font-bold uppercase tracking-wider text-ink-soft">
                      Ordem automática <span className="font-normal tabular-nums">{inCategory.length - pinned.length}</span>
                    </h2>
                    <div className="relative w-full sm:w-72">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
                      <label htmlFor="busca-ordem" className="sr-only">Buscar produto para fixar</label>
                      <input
                        id="busca-ordem"
                        type="search"
                        placeholder="Buscar para fixar"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="h-11 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-base placeholder:text-ink-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                      />
                    </div>
                  </div>
                  {rest.length === 0 ? (
                    <p className="rounded-xl bg-white px-4 py-8 text-center text-sm text-ink-soft ring-1 ring-line">
                      {q ? 'Nenhum produto com essa busca.' : 'Todos os produtos desta categoria estão fixados.'}
                    </p>
                  ) : (
                    <ul className="divide-y divide-line overflow-hidden rounded-xl bg-white ring-1 ring-line">
                      {rest.map(p => (
                        <li key={p.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                          <span className="flex min-w-0 flex-1 items-center gap-3">
                            <Thumb src={p.image} />
                            <span className="min-w-0">
                              <span className="block font-semibold leading-snug">{p.name}</span>
                              <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                                <span className="tabular-nums text-ink-soft">{money(p.price)}</span>
                                <Badges p={p} />
                              </span>
                            </span>
                          </span>
                          <span className="flex flex-shrink-0 items-center gap-2">
                            <button type="button" onClick={() => pin(p.id, true)} className="flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-ink/40">
                              <Pin size={16} aria-hidden /> Em 1º lugar
                            </button>
                            <button type="button" onClick={() => pin(p.id)} className="flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-ink/40">
                              Fixar no fim
                            </button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </div>

      {/* Barra de salvar: só aparece quando há mudança */}
      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(43,29,20,0.3)]">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
            <p className="text-xs text-ink-soft sm:text-sm">Mudanças na ordem ainda não salvas.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPinned(saved)} disabled={saving} className="h-11 whitespace-nowrap rounded-lg px-4 text-sm font-semibold text-ink ring-1 ring-line hover:ring-ink/40 disabled:opacity-50">Descartar</button>
              <button type="button" onClick={save} disabled={saving} className="h-11 whitespace-nowrap rounded-lg bg-accent px-5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-secondary disabled:opacity-60">
                {saving ? 'Salvando…' : 'Salvar ordem'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className={`fixed inset-x-4 ${dirty ? 'bottom-24' : 'bottom-6'} z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${toast.tone === 'error' ? 'bg-red-700' : 'bg-ink'}`}>
          <span>{toast.text}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Fechar aviso" className="flex h-8 w-8 items-center justify-center rounded text-white/80 hover:text-white"><X size={16} /></button>
        </div>
      )}
    </div>
  )
}
