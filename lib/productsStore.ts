'use client'

import { createContext, createElement, useContext, useState, type ReactNode } from 'react'
import { createStore, useStore, type StoreApi } from 'zustand'
import { products as staticProducts, Product, soldOutLast } from '@/lib/products'

interface ProductsState {
  products: Product[]
  loaded: boolean
  setProducts: (products: Product[]) => void
}

function makeStore(initial?: Product[]) {
  return createStore<ProductsState>(set => ({
    // Vem do servidor (layout): o HTML já sai com os produtos reais, que o Google lê
    products: soldOutLast(initial?.length ? initial : staticProducts),
    loaded: !!initial?.length,
    setProducts: (products) => set({ products: soldOutLast(products), loaded: true }),
  }))
}

const ProductsContext = createContext<StoreApi<ProductsState> | null>(null)
// Fora do provider (ex.: testes isolados) usa os produtos estáticos
const fallbackStore = makeStore()

/** Um store por requisição/aba, já com os produtos que o servidor buscou */
export function ProductsProvider({ initialProducts, children }: { initialProducts?: Product[]; children: ReactNode }) {
  const [store] = useState(() => makeStore(initialProducts))
  return createElement(ProductsContext.Provider, { value: store }, children)
}

export function useProductsStore<T>(selector: (state: ProductsState) => T): T {
  const store = useContext(ProductsContext) ?? fallbackStore
  return useStore(store, selector)
}
