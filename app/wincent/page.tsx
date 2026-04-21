'use client';
import { useState } from 'react';
import { useProductsStore } from '@/lib/productsStore';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

type StickType = 'todos' | 'baquetas' | 'vassourinhas' | 'rods' | 'mallets';

function getStickType(name: string): Exclude<StickType, 'todos'> {
  const n = name.toLowerCase();
  if (n.includes('brush')) return 'vassourinhas';
  if (n.includes('rod') || n.includes('rods')) return 'rods';
  if (n.includes('mallet') || n.includes('mallets')) return 'mallets';
  return 'baquetas';
}

const TYPE_LABELS: Record<StickType, string> = {
  todos: 'Todos',
  baquetas: 'Baquetas',
  vassourinhas: 'Vassourinhas',
  rods: 'Rods',
  mallets: 'Mallets',
};

export default function WincentPage() {
  const products = useProductsStore(state => state.products);
  const [activeType, setActiveType] = useState<StickType>('todos');

  const allProducts = products.filter(p => p.brand === 'wincent' && p.category === 'baquetas');
  const filtered = activeType === 'todos'
    ? allProducts
    : allProducts.filter(p => getStickType(p.name) === activeType);

  const countByType = (type: Exclude<StickType, 'todos'>) =>
    allProducts.filter(p => getStickType(p.name) === type).length;

  return (
    <div className="min-h-screen bg-orange-50">
      <Header />
      <CategoryNav currentCategory="baquetas" />

      {/* Hero com imagem de fundo */}
      <section className="relative bg-gray-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/banner/wincent-bg.jpg" alt="Wincent Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Wincent</h1>
          <p className="text-xl text-white drop-shadow-md">Baquetas profissionais suecas com madeira de primeira qualidade</p>
        </div>
      </section>

      {/* Filtros por tipo */}
      <div className="bg-white border-b border-gray-200 sticky top-[104px] md:top-[132px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveType('todos')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${activeType === 'todos' ? 'bg-accent text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Todos ({allProducts.length})
            </button>
            {(['baquetas', 'vassourinhas', 'rods', 'mallets'] as const).map(type => {
              const count = countByType(type);
              if (count === 0) return null;
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${activeType === type ? 'bg-accent text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {TYPE_LABELS[type]} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Produtos */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-400 mb-6">{filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'} encontrados</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} typeLabel={TYPE_LABELS[getStickType(product.name)]} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher Wincent?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-4xl mb-4">🇸🇪</div>
              <h3 className="text-xl font-bold mb-2">Origem Sueca</h3>
              <p className="text-red-100">Tradição e qualidade escandinava</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-xl font-bold mb-2">Madeira Premium</h3>
              <p className="text-red-100">Hickory americano cuidadosamente selecionado</p>
            </div>
            <div>
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2">Linha Completa</h3>
              <p className="text-red-100">Modelos para todos os estilos musicais</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
