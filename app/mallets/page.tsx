'use client';
import { useProductsStore } from '@/lib/productsStore';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

export default function MalletsPage() {
  const products = useProductsStore(state => state.products);
  const mallets = products.filter(p =>
    p.category === 'baquetas' &&
    p.name.toLowerCase().includes('mallet')
  );

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav currentCategory="baquetas" />

      <section className="category-hero category-hero--photo" style={{ '--hero-img': "url('/images/mallets-wincent.jpg')" } as React.CSSProperties}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="category-hero__title">Mallets</h1>
          <p className="category-hero__lead">Mallets Wincent com cabeças macias para sons expressivos</p>
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4">
          {mallets.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Sem disponibilidade no momento</h2>
              <p className="text-gray-600 mb-8">Em breve teremos novidades!</p>
              <Link href="/baquetas" className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition">Ver todas as Baquetas</Link>
            </div>
          ) : (
            <>
              <h2 className="mb-6 font-sans text-sm font-normal tracking-normal text-ink-soft">{mallets.length} {mallets.length === 1 ? 'produto' : 'produtos'} encontrados</h2>
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
