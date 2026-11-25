import { revalidatePath } from 'next/cache'
import { productPath } from '@/lib/products'

/**
 * Refaz só as páginas da loja afetadas por uma mudança de produto (próxima visita a cada uma):
 * a página do produto, a da categoria e a home. As páginas guardam o resultado por 7 dias, então
 * é isto que faz uma edição do admin aparecer logo, sem refazer a loja inteira a cada edição.
 */
export function revalidateShop(
  products: { id: number; name: string; category: string }[],
  extraCategories: string[] = []
) {
  try {
    const categories = new Set<string>(extraCategories)
    for (const p of products) {
      revalidatePath(productPath(p))
      categories.add(p.category)
    }
    categories.forEach(c => revalidatePath(`/${c}`))
    revalidatePath('/')
  } catch {
    // fora de uma requisição (scripts): nada para refazer
  }
}
