'use client';

import { contactInfo } from '@/lib/products';
import { useProductsStore } from '@/lib/productsStore';
import { searchScore } from '@/lib/productText';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import CatalogGrid from '@/components/CatalogGrid';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const SHORTCUTS = [
  { href: '/pratos', label: 'Pratos' },
  { href: '/baquetas', label: 'Baquetas' },
  { href: '/caixas', label: 'Caixas' },
  { href: '/baterias', label: 'Baterias' },
];

function BuscaContent() {
  const products = useProductsStore(state => state.products);
  const query = (useSearchParams().get('q') || '').trim();

  // Nome do produto pesa mais que marca/categoria, que pesam mais que a descrição
  const results = query.length >= 2
    ? products
        .map(product => ({ product, score: searchScore(product, query) }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(r => r.product)
    : [];

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav />

      <section className="category-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="category-hero__title">Busca</h1>
          {query && <p className="category-hero__lead">Resultados para “{query}”</p>}
        </div>
      </section>

      {query.length < 2 ? (
        <div className="container mx-auto max-w-lg px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold uppercase text-ink">Digite o que procura</h2>
          <p className="mt-2 text-ink-soft">Use a busca no topo da página: nome, marca ou tamanho (ex.: “ride 22”).</p>
        </div>
      ) : results.length === 0 ? (
        <div className="container mx-auto max-w-lg px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold uppercase text-ink">Não achamos “{query}”</h2>
          <p className="mt-3 text-ink-soft">
            Pode ser que ainda não esteja no site. Mande para a gente: procuramos e respondemos com preço e prazo.
          </p>
          <a
            href={`${contactInfo.whatsapp}?text=${encodeURIComponent(`Olá! Vocês têm ${query}?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-[#167a42] px-6 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#11643a]"
          >
            <MessageCircle size={18} aria-hidden /> Perguntar pelo WhatsApp
          </a>
          <ul className="mt-10 flex flex-wrap justify-center gap-2">
            {SHORTCUTS.map(s => (
              <li key={s.href}>
                <Link href={s.href} className="inline-flex h-11 items-center rounded-md bg-white px-5 text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-ink/50">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <CatalogGrid products={results} categoryName="Resultados" noun={['resultado', 'resultados']} />
      )}
    </div>
  );
}

export default function BuscaPage() {
  return (
    <Suspense>
      <BuscaContent />
    </Suspense>
  );
}
