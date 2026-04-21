'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Eye, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface PreviewItem {
  id: number
  name: string
  localPath: string
  exists: boolean
}

interface ResultItem {
  id: number
  name: string
  old: string
  new: string
  status: string
}

export default function MigrarImagensPage() {
  const [preview, setPreview] = useState<PreviewItem[] | null>(null)
  const [results, setResults] = useState<ResultItem[] | null>(null)
  const [stats, setStats] = useState<{ migrated: number; updated: number; failed: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePreview() {
    setLoading(true)
    setError('')
    setResults(null)
    const res = await fetch('/api/admin/migrate-images')
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setPreview(data.preview)
    setLoading(false)
  }

  async function handleMigrate() {
    if (!confirm(`Migrar ${preview?.filter(p => p.exists).length} imagens para o Vercel Blob e atualizar o banco?`)) return
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/migrate-images', { method: 'POST' })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setResults(data.results)
    setStats({ migrated: data.migrated, updated: data.updated, failed: data.failed })
    setPreview(null)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center gap-4 shadow-lg">
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-white transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-bold text-lg leading-none">Migrar Imagens</h1>
          <p className="text-gray-400 text-xs">Mover imagens existentes para o Vercel Blob</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Info card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800 space-y-1">
          <p className="font-bold">O que isso faz:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Encontra todos os produtos com imagens locais (<code className="bg-blue-100 px-1 rounded">/produtos/...</code>)</li>
            <li>Envia cada imagem para o Vercel Blob</li>
            <li>Atualiza o URL no banco de dados automaticamente</li>
            <li>Imagens já enviadas não são duplicadas</li>
          </ul>
        </div>

        {/* Actions */}
        {!results && (
          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-sm disabled:opacity-50"
            >
              <Eye size={15} />
              {loading && !preview ? 'Verificando...' : 'Ver o que será migrado'}
            </button>
            {preview && (
              <button
                onClick={handleMigrate}
                disabled={loading || preview.filter(p => p.exists).length === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition text-sm disabled:opacity-50"
              >
                {loading ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />}
                {loading ? 'Migrando...' : `Migrar ${preview.filter(p => p.exists).length} imagens`}
              </button>
            )}
          </div>
        )}

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
        )}

        {/* Preview table */}
        {preview && !results && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-sm text-gray-800">
                {preview.length} imagem{preview.length !== 1 ? 's' : ''} para migrar
              </h2>
              <span className="text-xs text-gray-400">
                {preview.filter(p => !p.exists).length} arquivo(s) não encontrado(s)
              </span>
            </div>
            <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
              {preview.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                  {item.exists
                    ? <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                    : <XCircle size={15} className="text-red-400 flex-shrink-0" />
                  }
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 font-mono truncate">{item.localPath}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results && stats && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Migradas', value: stats.migrated, color: 'text-green-600 bg-green-50 border-green-200' },
                { label: 'Já existiam', value: stats.updated, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                { label: 'Não encontradas', value: stats.failed, color: 'text-red-500 bg-red-50 border-red-200' },
              ].map(s => (
                <div key={s.label} className={`rounded-xl border p-4 text-center ${s.color}`}>
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-xs font-semibold mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h2 className="font-bold text-sm text-gray-800">Resultado detalhado</h2>
              </div>
              <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                {results.map(item => (
                  <div key={item.id} className="flex items-start gap-3 px-5 py-3">
                    {item.status === 'arquivo não encontrado'
                      ? <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                      : <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                    }
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 truncate">{item.new || item.old}</p>
                      <p className="text-xs text-gray-400 italic">{item.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/admin/dashboard"
              className="block text-center bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition text-sm"
            >
              Voltar ao Dashboard
            </Link>
          </>
        )}
      </main>
    </div>
  )
}
