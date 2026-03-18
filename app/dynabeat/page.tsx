'use client';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

export default function DynabeatPage() {
  const dynabeatProducts = products.filter(p => p.brand === 'dynabeat');

  return (
    <div className="min-h-screen bg-orange-50">
      <Header />
      <CategoryNav currentCategory="baquetas" />

      {/* Hero com imagem de fundo */}
      <section className="relative bg-gray-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/banner/dynabeat-bg.jpg" alt="Dynabeat Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Dynabeat</h1>
          <p className="text-xl text-white drop-shadow-md">Baquetas de alta qualidade com excelente custo-benefício</p>
        </div>
      </section>

      {/* Produtos */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {dynabeatProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🥁</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Sem disponibilidade no momento</h2>
              <p className="text-gray-600 mb-8">Estamos atualizando nosso estoque. Em breve teremos novidades!</p>
              <Link href="/" className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition">Voltar para Home</Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-6">{dynabeatProducts.length} {dynabeatProducts.length === 1 ? 'produto' : 'produtos'} encontrados</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {dynabeatProducts.map(product => <ProductCard key={product.id} product={product} typeLabel="Baqueta" />)}
              </div>
            </>
          )}
        </div>
      </section>

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
