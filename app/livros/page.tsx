'use client';
import { useState } from 'react';
import { useProductsStore } from '@/lib/productsStore';
import { brandLabel } from '@/components/ProductCard';
import CatalogGrid from '@/components/CatalogGrid';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

export default function LivrosPage() {
  const products = useProductsStore(state => state.products);
  const [activeBrand, setActiveBrand] = useState('todas');

  const allProducts = products.filter(p => p.category === 'livros');
  const brands = [...new Set(allProducts.map(p => p.brand))];
  const filtered = activeBrand === 'todas'
    ? allProducts
    : allProducts.filter(p => p.brand === activeBrand);

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav currentCategory="livros" />

      <section className="category-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="category-hero__title">Livros, DVDs e CDs</h1>
          <p className="category-hero__lead">Material didático e conteúdo para bateristas</p>
        </div>
      </section>

      {brands.length > 1 && (
        <div className="bg-white border-b border-line sticky top-[108px] md:top-[124px] z-40">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 py-2.5 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveBrand('todas')}
                className={`flex h-11 flex-shrink-0 items-center px-4 rounded-full text-sm font-semibold transition ${activeBrand === 'todas' ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'}`}
              >
                Todas ({allProducts.length})
              </button>
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`flex h-11 flex-shrink-0 items-center px-4 rounded-full text-sm font-semibold transition ${activeBrand === brand ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'}`}
                >
                  {brandLabel(brand)} ({allProducts.filter(p => p.brand === brand).length})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <CatalogGrid
        products={filtered}
        categoryName="Livros e DVDs"
        totalInCategory={allProducts.length}
        onClearFilters={() => setActiveBrand('todas')}
      />
    </div>
  );
}
