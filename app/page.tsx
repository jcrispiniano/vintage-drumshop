'use client';

import SmartImage from '@/components/SmartImage';
import { categories, contactInfo, productImage } from '@/lib/products';
import { useProductsStore } from '@/lib/productsStore';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import OrganizationSchema from '@/components/schemas/OrganizationSchema';
import CategoryNav from '@/components/CategoryNav';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

const heroSlides = [
  { image: '/banner/slide-8.jpg', alt: 'Caixas de bateria vintage sobre um sofá de couro' },
  { image: '/banner/slide-5.jpg', alt: 'Baquetas Wincent e Dynabeat espalhadas sobre fundo claro' },
  { image: '/banner/slide-1.jpg', alt: 'Caixa de bateria com casco martelado cromado' },
  { image: '/banner/slide-9.jpg', alt: 'Caixa de bateria preta com detalhes cromados' },
  { image: '/banner/slide-6.jpg', alt: 'Par de baquetas Dynabeat sobre couro caramelo' },
  { image: '/banner/slide-3.jpg', alt: 'Caixa de bateria cromada montada na estante' },
];

const SLIDE_MS = 6000;

const brands = [
  {
    logo: '/wincent-logo.png', name: 'Wincent', label: 'Revenda autorizada',
    desc: 'Baquetas suecas com madeira selecionada e equilíbrio para todos os estilos.',
    href: '/wincent', cta: 'Ver baquetas Wincent',
  },
  {
    logo: '/istanbul-logo-wide.png', name: 'Istanbul Agop', label: 'Distribuidor oficial',
    desc: 'Pratos turcos feitos à mão, ricos em harmônicos e usados pelos grandes bateristas.',
    href: '/pratos', cta: 'Ver pratos Istanbul',
  },
  {
    logo: 'https://uhruevemqsmwamem.public.blob.vercel-storage.com/torelli-logo.png', name: 'Torelli', label: 'Revenda autorizada',
    desc: 'Marca brasileira de percussão, ferragens e acessórios com ótimo custo-benefício.',
    href: '/busca?q=torelli', cta: 'Ver produtos Torelli',
  },
];

function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((delta: number) => {
    setCurrent(prev => (prev + delta + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => go(1), SLIDE_MS);
    return () => clearInterval(id);
  }, [paused, go]);

  return (
    <section
      className="relative h-[440px] overflow-hidden bg-ink md:h-[560px]"
      aria-roledescription="carrossel"
      aria-label="Destaques"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {heroSlides.map((slide, i) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${i === current ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== current}
        >
          <SmartImage
            src={slide.image}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Véu para garantir leitura do texto sobre fotos claras */}
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(28,17,10,0.92)_0%,rgba(28,17,10,0.6)_55%,rgba(28,17,10,0.1)_100%)] md:bg-[linear-gradient(90deg,rgba(28,17,10,0.86)_0%,rgba(28,17,10,0.55)_45%,rgba(28,17,10,0.05)_80%)]" aria-hidden />

      <div className="container relative mx-auto flex h-full flex-col justify-end px-4 pb-14 md:justify-center md:pb-0">
        <div className="max-w-xl text-white">
          <h1 className="text-[2.6rem] font-semibold uppercase leading-[1.04] md:text-7xl">
            Baterias &amp; acessórios <span className="text-[#E9B872]">profissionais</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-[#F0E3D0] md:text-lg">
            Revenda oficial Wincent e Istanbul Agop em São Paulo.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#destaques"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-secondary"
            >
              Ver produtos <ArrowRight size={18} aria-hidden />
            </a>
            <a
              href={contactInfo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white ring-1 ring-white/60 transition hover:bg-white/10"
            >
              <MessageCircle size={18} aria-hidden /> Fale conosco
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 right-4 flex items-center gap-1 rounded-full bg-ink/70 p-1 backdrop-blur-sm md:right-8">
        <button
          type="button"
          onClick={() => go(-1)}
          className="rounded-full p-2 text-white transition hover:bg-white/20"
          aria-label="Foto anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="min-w-12 text-center text-xs font-semibold tabular-nums text-white/90" aria-live="polite">
          {current + 1} / {heroSlides.length}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          className="rounded-full p-2 text-white transition hover:bg-white/20"
          aria-label="Próxima foto"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-6 text-2xl font-semibold uppercase text-ink md:mb-8 md:text-4xl">{children}</h2>;
}

export default function Home() {
  const products = useProductsStore(state => state.products);

  const offers = products.filter(p => p.oldPrice && p.oldPrice > p.price && !p.soldOut).slice(0, 8);
  const featured = (products.some(p => p.featured) ? products.filter(p => p.featured) : products)
    .filter(p => !offers.includes(p))
    .slice(0, 8);

  // Atalhos por categoria usam a foto de um produto real da categoria
  const categoryTiles = categories.slice(0, 6).map(cat => ({
    ...cat,
    image: products.find(p => p.category === cat.id && p.image)?.image,
    count: products.filter(p => p.category === cat.id).length,
  }));

  return (
    <div className="min-h-screen bg-paper">
      <OrganizationSchema />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-white"
      >
        Ir para o conteúdo principal
      </a>

      <Header />
      <CategoryNav />

      <main id="main-content">
        <Hero />

        {/* Compre por categoria */}
        <section className="container mx-auto px-4 py-12 md:py-16" aria-labelledby="categorias-titulo">
          <h2 id="categorias-titulo" className="mb-6 text-2xl font-semibold uppercase text-ink md:mb-8 md:text-4xl">
            Compre por categoria
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
            {categoryTiles.map(cat => (
              <li key={cat.id}>
                <Link
                  href={`/${cat.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl bg-white ring-1 ring-line transition hover:ring-ink/40"
                >
                  <span className="relative block aspect-square">
                    <SmartImage
                      src={productImage(cat.image)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                      className="object-contain p-4 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </span>
                  <span className="flex items-center justify-between gap-2 border-t border-line px-3 py-3">
                    <span className="font-display text-base font-medium uppercase tracking-wide text-ink group-hover:text-accent">
                      {cat.name}
                    </span>
                    <ArrowRight size={16} className="text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {offers.length > 0 && (
          <section className="bg-white py-12 md:py-16" aria-labelledby="ofertas-titulo">
            <div className="container mx-auto px-4">
              <SectionTitle>
                <span id="ofertas-titulo">Ofertas</span>
              </SectionTitle>
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                {offers.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Marcas oficiais */}
        <section className="border-y border-line bg-cream py-12 md:py-16" aria-labelledby="marcas-titulo">
          <div className="container mx-auto px-4">
            <SectionTitle>
              <span id="marcas-titulo">Revendedor autorizado</span>
            </SectionTitle>
            <ul className="grid divide-y divide-[#DCC9AE] md:grid-cols-3 md:divide-x md:divide-y-0">
              {brands.map(brand => (
                <li key={brand.name} className="flex flex-col py-6 first:pt-0 last:pb-0 md:px-8 md:py-0 md:first:pl-0 md:last:pr-0">
                  <div className="relative mb-4 h-14 w-52">
                    <SmartImage
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      sizes="160px"
                      className="object-contain object-left mix-blend-multiply"
                    />
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{brand.label}</p>
                  <p className="mb-4 max-w-sm text-sm leading-relaxed text-ink-soft">{brand.desc}</p>
                  <Link href={brand.href} className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-accent hover:underline">
                    {brand.cta} <ArrowRight size={16} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {featured.length > 0 && (
          <section id="destaques" className="scroll-mt-32 py-12 md:py-16" aria-labelledby="destaques-titulo">
            <div className="container mx-auto px-4">
              <SectionTitle>
                <span id="destaques-titulo">Produtos em destaque</span>
              </SectionTitle>
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                {featured.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
