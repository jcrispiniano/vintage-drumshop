'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

const CATEGORIES = [
  'acessorios', 'bags', 'baquetas', 'baterias', 'caixas',
  'cajon', 'dynabeat', 'estudo', 'ferragens', 'kids',
  'livros', 'mallets', 'pecas', 'peles', 'pratos',
  'vassourinhas', 'wincent',
]

const BRANDS = [
  'istanbul', 'wincent', 'dynabeat', 'evans', 'remo',
  'pearl', 'tama', 'dw', 'mapex', 'yamaha',
  'sonor', 'gretsch', 'ludwig', 'zildjian', 'sabian', 'meinl', 'outro',
]

const BADGES = ['Novo', 'Premium', 'Signature', 'Effect', 'Oferta', 'Destaque', '']

interface FormData {
  name: string
  category: string
  brand: string
  price: string
  oldPrice: string
  image: string
  badge: string
  description: string
  featured: boolean
  active: boolean
}

interface ProductFormProps {
  initialData?: Partial<FormData> & { id?: number }
  mode: 'create' | 'edit'
}

const emptyForm: FormData = {
  name: '', category: 'pratos', brand: 'istanbul',
  price: '', oldPrice: '', image: '', badge: '',
  description: '', featured: false, active: true,
}

export default function ProductForm({ initialData, mode }: ProductFormProps) {
  const [form, setForm] = useState<FormData>({ ...emptyForm, ...initialData })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function set(field: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      category: form.category,
      brand: form.brand,
      price: parseFloat(form.price),
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
      image: form.image.trim(),
      badge: form.badge || undefined,
      description: form.description.trim(),
      featured: form.featured,
      active: form.active,
    }

    const url = mode === 'edit' && initialData?.id
      ? `/api/admin/products/${initialData.id}`
      : '/api/admin/products'

    const res = await fetch(url, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Erro ao salvar produto.')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center gap-4 shadow-lg">
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-white transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-bold text-lg leading-none">
            {mode === 'edit' ? 'Editar Produto' : 'Novo Produto'}
          </h1>
          <p className="text-gray-400 text-xs">Vintage Drum Shop — Admin</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic info */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Informações Básicas</h2>

            <div>
              <label className="label">Nome do produto *</label>
              <input
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Ex: Prato Istanbul Agop Xist Crash 18&quot;"
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Categoria *</label>
                <select required value={form.category} onChange={e => set('category', e.target.value)} className="input">
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Marca *</label>
                <select required value={form.brand} onChange={e => set('brand', e.target.value)} className="input">
                  {BRANDS.map(b => (
                    <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Descrição *</label>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Descreva o produto, suas características e diferenciais..."
                className="input resize-none"
              />
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Preços</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Preço atual (R$) *</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  placeholder="0,00"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Preço antigo (R$) <span className="text-gray-400 font-normal">opcional</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.oldPrice}
                  onChange={e => set('oldPrice', e.target.value)}
                  placeholder="0,00"
                  className="input"
                />
                <p className="text-xs text-gray-400 mt-1">Aparece riscado para indicar desconto</p>
              </div>
            </div>
          </section>

          {/* Image & badge */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Imagem e Badge</h2>

            <div>
              <label className="label">Caminho da imagem *</label>
              <input
                required
                value={form.image}
                onChange={e => set('image', e.target.value)}
                placeholder="/produtos/pratos/nome-do-produto.jpg"
                className="input font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Faça upload da imagem para a pasta <code className="bg-gray-100 px-1 rounded">public/produtos/</code> e informe o caminho aqui.
              </p>
            </div>

            {form.image && (
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-16 h-16 object-contain rounded border border-gray-200 bg-white"
                  onError={e => { (e.target as HTMLImageElement).src = '/logo.svg' }}
                />
                <p className="text-sm text-gray-500">Preview da imagem</p>
              </div>
            )}

            <div>
              <label className="label">Badge <span className="text-gray-400 font-normal">opcional</span></label>
              <select value={form.badge} onChange={e => set('badge', e.target.value)} className="input">
                {BADGES.map(b => (
                  <option key={b} value={b}>{b || '— Nenhum —'}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Flags */}
          <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4">Configurações</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => set('featured', e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Produto em destaque</p>
                  <p className="text-xs text-gray-400">Aparece na seção de destaques da homepage</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={e => set('active', e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Produto ativo</p>
                  <p className="text-xs text-gray-400">Desative para ocultar o produto do site sem excluir</p>
                </div>
              </label>
            </div>
          </section>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 pb-8">
            <Link
              href="/admin/dashboard"
              className="flex-1 text-center border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition text-sm"
            >
              <Save size={16} />
              {saving ? 'Salvando...' : mode === 'edit' ? 'Salvar Alterações' : 'Criar Produto'}
            </button>
          </div>
        </form>
      </main>

      <style jsx global>{`
        .label { display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.375rem; }
        .input { width: 100%; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.625rem 0.875rem; font-size: 0.875rem; transition: all 0.15s; outline: none; }
        .input:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.15); }
      `}</style>
    </div>
  )
}
