'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X, ImageIcon } from 'lucide-react'

// Precisa bater com os filtros das páginas de categoria (p.category === '...').
// Mallets e vassourinhas são baquetas; Wincent e Dynabeat são marcas.
const CATEGORIES = [
  'acessorios', 'bags', 'baquetas', 'baterias', 'caixas', 'cajon',
  'estudo', 'ferragens', 'kids', 'livros', 'pecas', 'peles', 'pratos',
]

const BRANDS = [
  'istanbul', 'wincent', 'dynabeat', 'torelli', 'pinguim',
  'evans', 'remo', 'pearl', 'tama', 'dw', 'mapex',
  'yamaha', 'sonor', 'gretsch', 'ludwig', 'zildjian',
  'sabian', 'meinl', 'rockkey', 'outro',
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
  soldOut: boolean
  audio: string
}

interface ProductFormProps {
  initialData?: Partial<FormData> & { id?: number }
  mode: 'create' | 'edit'
}

const emptyForm: FormData = {
  name: '', category: 'pratos', brand: 'istanbul',
  price: '', oldPrice: '', image: '', badge: '',
  description: '', featured: false, active: true, soldOut: false, audio: '',
}

function AudioUploader({
  value,
  category,
  onChange,
}: {
  value: string
  category: string
  onChange: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function uploadFile(file: File) {
    setUploading(true)
    setUploadError('')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('category', category)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) setUploadError(data.error ?? `Erro ao enviar áudio (HTTP ${res.status}).`)
      else onChange(data.url)
    } catch {
      setUploadError('Falha de conexão ao enviar áudio.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="label">
        Áudio do produto <span className="text-gray-400 font-normal">opcional · MP3 ou M4A até 4MB, de 5 a 15 segundos</span>
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          <Upload size={16} /> {uploading ? 'Enviando...' : 'Enviar áudio'}
          <input
            type="file"
            accept="audio/*"
            className="sr-only"
            disabled={uploading}
            onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])}
          />
        </label>
        {value && (
          <button type="button" onClick={() => onChange('')} className="text-sm text-red-600 hover:underline">
            Remover áudio
          </button>
        )}
      </div>
      <input
        type="url"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="ou cole o link do áudio"
        className="input"
      />
      {value && <audio controls src={value} className="w-full" preload="none" />}
      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
    </div>
  )
}

function ImageUploader({
  value,
  category,
  onChange,
}: {
  value: string
  category: string
  onChange: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    setUploading(true)
    setUploadError('')

    const fd = new FormData()
    fd.append('file', file)
    fd.append('category', category)

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      // Respostas de erro da plataforma (ex.: 413) podem não ser JSON
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setUploadError(data.error ?? `Erro ao enviar imagem (HTTP ${res.status}).`)
      } else {
        onChange(data.url)
      }
    } catch {
      setUploadError('Falha de conexão ao enviar imagem.')
    } finally {
      setUploading(false)
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return
    uploadFile(files[0])
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      <label className="label">Imagem do produto *</label>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition ${
          dragging
            ? 'border-orange-400 bg-orange-50'
            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />

        {uploading ? (
          <>
            <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Enviando imagem...</p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Upload size={18} className="text-orange-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Clique ou arraste a imagem aqui</p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP — máx. 4MB</p>
          </>
        )}
      </div>

      {uploadError && (
        <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {uploadError}
        </p>
      )}

      {/* Preview + URL manual */}
      {value && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element -- prévia de URL qualquer no admin */}
          <img
            src={value}
            alt="Preview"
            className="w-16 h-16 object-contain rounded-lg border border-gray-200 bg-white flex-shrink-0"
            onError={e => { (e.target as HTMLImageElement).src = '/placeholder-produto.jpg' }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 mb-1">Imagem selecionada</p>
            <p className="text-xs text-gray-400 truncate">{value}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
            title="Remover imagem"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Fallback: URL manual */}
      <details className="group">
        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition select-none">
          Ou informe a URL manualmente
        </summary>
        <div className="mt-2">
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://... ou /produtos/categoria/imagem.jpg"
            className="input font-mono text-xs"
          />
        </div>
      </details>
    </div>
  )
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
    if (!form.image.trim()) {
      setError('Adicione uma imagem ao produto.')
      return
    }
    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      category: form.category,
      brand: form.brand,
      price: parseFloat(form.price),
      // null (e não undefined) para que a edição consiga limpar esses campos
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
      image: form.image.trim(),
      badge: form.badge || null,
      description: form.description.trim(),
      featured: form.featured,
      active: form.active,
      soldOut: form.soldOut,
      audio: form.audio.trim() || null,
    }

    const url = mode === 'edit' && initialData?.id
      ? `/api/admin/products/${initialData.id}`
      : '/api/admin/products'

    try {
      const res = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/dashboard')
        router.refresh()
        return
      }
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Erro ao salvar produto.')
    } catch {
      setError('Falha de conexão ao salvar produto.')
    }
    setSaving(false)
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
                placeholder='Ex: Prato Istanbul Agop Xist Crash 18"'
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Categoria *</label>
                <select required value={form.category} onChange={e => set('category', e.target.value)} className="input">
                  {[...new Set([...CATEGORIES, form.category])].map(c => (
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
            <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
              <ImageIcon size={16} />
              Imagem, áudio e badge
            </h2>

            <ImageUploader
              value={form.image}
              category={form.category}
              onChange={url => set('image', url)}
            />

            <AudioUploader
              value={form.audio}
              category={form.category}
              onChange={url => set('audio', url)}
            />

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
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.soldOut}
                  onChange={e => set('soldOut', e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Produto esgotado</p>
                  <p className="text-xs text-gray-400">Mantém o produto visível, mas impede a compra</p>
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
