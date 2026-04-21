'use client'

import { useEffect } from 'react'
import { useProductsStore } from '@/lib/productsStore'

export default function ProductsInitializer() {
  const setProducts = useProductsStore(state => state.setProducts)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
        }
      })
      .catch(() => {})
  }, [setProducts])

  return null
}
