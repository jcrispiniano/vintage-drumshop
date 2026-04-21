'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProductForm from '../_components/ProductForm'

interface DbProduct {
  id: number
  name: string
  category: string
  brand: string
  price: number
  old_price?: number
  image: string
  badge?: string
  description: string
  featured: boolean
  active: boolean
}

export default function EditProductPage() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<DbProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError('Produto não encontrado.')
        } else {
          setProduct(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar produto.')
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error || 'Produto não encontrado.'}</p>
      </div>
    )
  }

  return (
    <ProductForm
      mode="edit"
      initialData={{
        id: product.id,
        name: product.name,
        category: product.category,
        brand: product.brand,
        price: String(product.price),
        oldPrice: product.old_price ? String(product.old_price) : '',
        image: product.image,
        badge: product.badge ?? '',
        description: product.description,
        featured: product.featured,
        active: product.active,
      }}
    />
  )
}
