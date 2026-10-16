'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useProductsStore } from '@/lib/productsStore';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';

export default function FavoritosPage() {
  const products = useProductsStore(state => state.products);
  const { favorites } = useCart();

  const favoriteProducts = products.filter(p => favorites.includes(p.id));
  const recommendedProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav />

      <div className="container mx-auto px-4 pb-16 pt-8">
        <h1 className="mb-2 text-3xl font-semibold uppercase text-ink md:text-4xl">Favoritos</h1>

        {favoriteProducts.length === 0 ? (
          <>
            <div className="mx-auto max-w-lg py-10 text-center">
              <Heart size={44} className="mx-auto mb-5 text-primary" aria-hidden />
              <h2 className="mb-2 text-2xl font-semibold uppercase text-ink">Nenhum favorito ainda</h2>
              <p className="mb-8 text-ink-soft">
                Toque no coração de um produto para guardar aqui e comparar depois.
              </p>
              <Link
                href="/pratos"
                className="inline-flex h-11 items-center rounded-md bg-accent px-6 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-secondary"
              >
                Ver pratos
              </Link>
            </div>

            {recommendedProducts.length > 0 && (
              <section className="mt-6" aria-labelledby="sugestoes-titulo">
                <h2 id="sugestoes-titulo" className="mb-6 text-2xl font-semibold uppercase text-ink">Escolhas da casa</h2>
                <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                  {recommendedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            <p className="mb-8 text-ink-soft">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'produto guardado' : 'produtos guardados'}
            </p>
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
              {favoriteProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
