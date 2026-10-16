'use client';
import { useProductsStore } from '@/lib/productsStore';
import CatalogGrid from '@/components/CatalogGrid';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

export default function VassourinhasPage() {
  const products = useProductsStore(state => state.products);
  const vassouras = products.filter(p =>
    p.category === 'baquetas' &&
    (p.name.toLowerCase().includes('brush') || p.name.toLowerCase().includes('vassoura'))
  );

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav currentCategory="baquetas" />

      <section className="category-hero category-hero--photo" style={{ '--hero-img': "url('/images/brushes-wincent-collection.jpg')" } as React.CSSProperties}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="category-hero__title">Vassourinhas</h1>
          <p className="category-hero__lead">Brushes Wincent para sons suaves e dinâmicos</p>
        </div>
      </section>

      <CatalogGrid
        products={vassouras}
        categoryName="Vassourinhas"
        typeLabel={() => 'Vassourinha'}
      />
    </div>
  );
}
