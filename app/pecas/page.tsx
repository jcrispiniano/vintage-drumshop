'use client';
import { useState } from 'react';
import { products } from '@/lib/products';
import ProductCard, { brandLabel } from '@/components/ProductCard';
import Link from 'next/link';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

export default function PecasPage() {
  const [activeBrand, setActiveBrand] = useState('todas');

  const allProducts = products.filter(p => p.category === 'pecas');
  const brands = [...new Set(allProducts.map(p => p.brand))];
  const filtered = activeBrand === 'todas'
    ? allProducts
    : allProducts.filter(p => p.brand === activeBrand);

  return (
    <div className="min-h-screen bg-orange-50">
      <Header showBackButton={true} />
      <CategoryNav currentCategory="pecas" />

      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Peças de Reparo e Manutenção</h1>
          <p className="text-xl text-gray-300">Tudo para manter seu equipamento em perfeito estado</p>
        </div>
      </section>

      {brands.length > 1 && (
        <div className="bg-white border-b border-gray-200 sticky top-[104px] md:top-[132px] z-40">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveBrand('todas')}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${activeBrand === 'todas' ? 'bg-accent text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Todas ({allProducts.length})
              </button>
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${activeBrand === brand ? 'bg-accent text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {brandLabel(brand)} ({allProducts.filter(p => p.brand === brand).length})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="py-12 bg-white">
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
              <p className="text-sm text-gray-400 mb-6">{filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'} encontrados</p>
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
