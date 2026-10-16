'use client';
import SmartImage from '@/components/SmartImage';
import { useProductsStore } from '@/lib/productsStore';
import CatalogGrid from '@/components/CatalogGrid';
import Link from 'next/link';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

export default function DynabeatPage() {
  const products = useProductsStore(state => state.products);
  const dynabeatProducts = products.filter(p => p.brand === 'dynabeat');

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav currentCategory="baquetas" />

      {/* Hero com imagem de fundo */}
      <section className="relative overflow-hidden border-b-[3px] border-brass bg-ink py-14 text-white md:py-20">
        <div className="absolute inset-0">
          <SmartImage src="/fotos/banner-dynabeat.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[rgba(28,17,10,0.5)]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="category-hero__title drop-shadow-lg">Dynabeat</h1>
          <p className="text-xl text-white drop-shadow-md">Baquetas de alta qualidade com excelente custo-benefício</p>
        </div>
      </section>

      {/* Produtos */}
      <CatalogGrid
        products={dynabeatProducts}
        categoryName="Baquetas Dynabeat"
        typeLabel={() => 'Baqueta'}
      />

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher Dynabeat?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Melhor Custo-Benefício</h3>
              <p className="text-amber-100">Qualidade profissional por um preço acessível</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-xl font-bold mb-2">Madeira Hickory</h3>
              <p className="text-amber-100">Madeira americana de primeira qualidade</p>
            </div>
            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Durabilidade</h3>
              <p className="text-amber-100">Resistência e performance garantidas</p>
            </div>
          </div>
          <div className="mt-12">
            <Link
              href="/baquetas"
              className="inline-block bg-white text-amber-900 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition shadow-xl"
            >
              Ver Todas as Baquetas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
