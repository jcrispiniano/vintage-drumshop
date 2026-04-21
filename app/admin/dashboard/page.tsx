'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, LogOut, Package, Eye, EyeOff, Search } from 'lucide-react'

interface DbProduct {
  id: number
  name: string
  category: string
  brand: string
  price: number
  old_price?: number
  image: string
  badge?: string
  active: boolean
  featured: boolean
  created_at: string
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)
  const router = useRouter()

  async function loadProducts() {
    setLoading(true)
    const res = await fetch('/api/admin/products')
    if (res.status === 401) {
      router.push('/admin')
      return
    }
    if (!res.ok) {
      setError('Erro ao carregar produtos.')
      setLoading(false)
      return
    }
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => { loadProducts() }, [])

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Excluir "${name}"?`)) return
    setDeleting(id)
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id))
    } else {
      alert('Erro ao excluir produto.')
    }
    setDeleting(null)
  }

  async function handleToggleActive(product: DbProduct) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, oldPrice: product.old_price, active: !product.active }),
    })
    if (res.ok) {
      setProducts(prev =>
        prev.map(p => p.id === product.id ? { ...p, active: !p.active } : p)
      )
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🥁</span>
          <div>
            <h1 className="font-bold text-lg leading-none">Vintage Drum Shop</h1>
            <p className="text-gray-400 text-xs">Painel Admin</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-gray-400 hover:text-white text-sm transition hidden sm:block"
          >
            Ver site →
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total de produtos', value: products.length, color: 'bg-blue-500' },
            { label: 'Ativos', value: products.filter(p => p.active).length, color: 'bg-green-500' },
            { label: 'Inativos', value: products.filter(p => !p.active).length, color: 'bg-gray-400' },
            { label: 'Destaques', value: products.filter(p => p.featured).length, color: 'bg-orange-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className={`${stat.color} text-white text-2xl font-bold rounded-lg w-12 h-12 flex items-center justify-center mb-3`}>
                {stat.value}
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, categoria ou marca..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <Link
            href="/admin/dashboard/novo"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition whitespace-nowrap"
          >
            <Plus size={16} />
            Novo Produto
          </Link>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Carregando produtos...</div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-sm text-gray-500">Verifique se o Supabase está configurado nas variáveis de ambiente.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Produto</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold hidden md:table-cell">Categoria</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold hidden lg:table-cell">Marca</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-semibold">Preço</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-semibold hidden sm:table-cell">Status</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400">
                        <Package size={32} className="mx-auto mb-2 opacity-40" />
                        {search ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado ainda.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map(product => (
                      <tr key={product.id} className={`hover:bg-gray-50 transition ${!product.active ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain p-1"
                                onError={e => { (e.target as HTMLImageElement).src = '/logo.svg' }}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate max-w-[200px]">{product.name}</p>
                              {product.badge && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{product.badge}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell capitalize">{product.category}</td>
                        <td className="px-4 py-3 text-gray-600 hidden lg:table-cell capitalize">{product.brand}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </td>
                        <td className="px-4 py-3 text-center hidden sm:table-cell">
                          <button
                            onClick={() => handleToggleActive(product)}
                            title={product.active ? 'Desativar' : 'Ativar'}
                            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium transition ${
                              product.active
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {product.active ? <Eye size={12} /> : <EyeOff size={12} />}
                            {product.active ? 'Ativo' : 'Inativo'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/admin/dashboard/${product.id}`}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                              title="Editar"
                            >
                              <Edit size={15} />
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              disabled={deleting === product.id}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
                              title="Excluir"
                            >
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
            {filtered.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
                {filtered.length} produto{filtered.length !== 1 ? 's' : ''}
                {search ? ` encontrado${filtered.length !== 1 ? 's' : ''}` : ' no total'}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
