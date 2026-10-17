'use client';
import { useProductsStore } from '@/lib/productsStore';
import CatalogGrid from '@/components/CatalogGrid';
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

      <CatalogGrid
        products={mallets}
        categoryName="Mallets"
        typeLabel={() => 'Mallet'}
      />
    </div>
  );
}
