'use client';
import SmartImage from '@/components/SmartImage';
import { useProductsStore } from '@/lib/productsStore';
import CatalogGrid from '@/components/CatalogGrid';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
          <SmartImage src="/fotos/banner-dynabeat.jpg" alt="" fill preload fetchPriority="high" sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[rgba(28,17,10,0.5)]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="category-hero__title drop-shadow-lg">Baquetas Dynabeat</h1>
          <p className="text-xl text-white drop-shadow-md">A linha de baquetas da Wincent com ótimo custo-benefício</p>
        </div>
      </section>

      {/* Produtos */}
      <CatalogGrid
        products={dynabeatProducts}
        categoryName="Baquetas Dynabeat"
        typeLabel={() => 'Baqueta'}
      />

      {/* Guia de modelos: texto que responde o que quem busca "baqueta Dynabeat" quer saber */}
      <section className="border-t border-line bg-white py-12 md:py-16" aria-labelledby="dynabeat-guia">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-[1fr_1.2fr]">
          <div className="max-w-[60ch]">
            <h2 id="dynabeat-guia" className="text-3xl font-semibold uppercase leading-none text-ink md:text-4xl">Qual baqueta Dynabeat escolher?</h2>
            <p className="mt-5 text-ink-soft">
              Dynabeat é a linha de baquetas da Wincent, a fabricante sueca, pensada para quem quer
              uma baqueta de hickory equilibrada e durável sem pagar o preço da linha principal.
              Os modelos seguem os tamanhos clássicos, então a escolha é a mesma de qualquer baqueta:
              quanto mais grossa, mais peso e volume.
            </p>
            <p className="mt-4 text-ink-soft">
              Na dúvida entre dois modelos, chame a gente no WhatsApp: ajudamos a escolher pelo seu estilo e pela sua mão.
            </p>
            <Link href="/baquetas" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-wide text-secondary hover:underline">
              Ver todas as baquetas <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <dl className="divide-y divide-line border-y border-line">
            {[
              { model: '7A', text: 'A mais fina e leve. Toque delicado, para jazz, MPB, igreja e quem tem mão pequena.' },
              { model: '5A', text: 'A mais vendida no mundo. Equilíbrio entre controle e volume, serve para quase todo estilo.' },
              { model: '5B', text: 'Um pouco mais grossa que a 5A. Mais peso e volume para rock e para estudar resistência.' },
              { model: '2B', text: 'A mais grossa e pesada da linha. Para rock pesado, metal e para ganhar força no estudo.' },
            ].map(m => (
              <div key={m.model} className="grid grid-cols-[4.5rem_1fr] gap-4 py-4">
                <dt className="font-display text-3xl font-semibold leading-none text-ink">{m.model}</dt>
                <dd className="text-ink-soft">{m.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
