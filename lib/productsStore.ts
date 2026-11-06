import { create } from 'zustand'
import { products as staticProducts, Product, soldOutLast } from '@/lib/products'

interface ProductsState {
  products: Product[]
  loaded: boolean
  setProducts: (products: Product[]) => void
}

export const useProductsStore = create<ProductsState>((set) => ({
  // Inicia com produtos estáticos; ProductsInitializer substitui pelo Supabase
  products: soldOutLast(staticProducts),
  loaded: false,
  setProducts: (products) => set({ products: soldOutLast(products), loaded: true }),
}))
