'use client';
import { useState } from 'react';
import { useProductsStore } from '@/lib/productsStore';
import ProductCard, { brandLabel } from '@/components/ProductCard';
import Link from 'next/link';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

export default function PecasPage() {
  const products = useProductsStore(state => state.products);
  const [activeBrand, setActiveBrand] = useState('todas');

  const allProducts = products.filter(p => p.category === 'pecas');
  const brands = [...new Set(allProducts.map(p => p.brand))];
  const filtered = activeBrand === 'todas'
    ? allProducts
    : allProducts.filter(p => p.brand === activeBrand);

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav currentCategory="pecas" />

      <section className="category-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="category-hero__title">Peças de Reparo e Manutenção</h1>
          <p className="category-hero__lead">Tudo para manter seu equipamento em perfeito estado</p>
        </div>
      </section>

      {brands.length > 1 && (
        <div className="bg-white border-b border-gray-200 sticky top-[108px] md:top-[124px] z-40">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveBrand('todas')}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${activeBrand === 'todas' ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'}`}
              >
                Todas ({allProducts.length})
              </button>
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${activeBrand === brand ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'}`}
                >
                  {brandLabel(brand)} ({allProducts.filter(p => p.brand === brand).length})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔧</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Sem disponibilidade no momento</h2>
              <p className="text-gray-600 mb-8">Estamos atualizando nosso estoque. Em breve teremos novidades!</p>
              <Link href="/" className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition">Voltar para Home</Link>
            </div>
          ) : (
            <>
              <h2 className="mb-6 font-sans text-sm font-normal tracking-normal text-ink-soft">{filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'} encontrados</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {filtered.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
