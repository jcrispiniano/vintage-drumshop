'use client';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

export default function MalletsPage() {
  const mallets = products.filter(p =>
    p.category === 'baquetas' &&
    p.name.toLowerCase().includes('mallet')
  );

  return (
    <div className="min-h-screen bg-orange-50">
      <Header showBackButton={true} />
      <CategoryNav currentCategory="baquetas" />

      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Mallets</h1>
          <p className="text-xl text-gray-300">Mallets Wincent com cabeças macias para sons expressivos</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {mallets.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🥁</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Sem disponibilidade no momento</h2>
              <p className="text-gray-600 mb-8">Em breve teremos novidades!</p>
              <Link href="/baquetas" className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition">Ver todas as Baquetas</Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-6">{mallets.length} {mallets.length === 1 ? 'produto' : 'produtos'} encontrados</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {mallets.map(product => (
                  <ProductCard key={product.id} product={product} typeLabel="Mallet" />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
