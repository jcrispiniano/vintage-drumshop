import ProductForm from '../_components/ProductForm'
import { categories } from '@/lib/products'

// "Novo produto" aberto de dentro de uma categoria já vem com ela escolhida
export default async function NovoProductPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams
  const category = categories.some(c => c.id === categoria) ? categoria : undefined
  return <ProductForm mode="create" initialData={category ? { category, brand: category === 'pratos' ? 'istanbul' : 'outro' } : undefined} />
}
