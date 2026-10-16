'use client';

import SmartImage from '@/components/SmartImage';
import { categories, contactInfo } from '@/lib/products';
import { useProductsStore } from '@/lib/productsStore';
import { TIMBRES } from '@/lib/productText';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import OrganizationSchema from '@/components/schemas/OrganizationSchema';
import CategoryNav from '@/components/CategoryNav';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

// Fotos do ensaio da Vintage (public/fotos)
const heroSlides = [
  { image: '/fotos/hero-baquetas-couro.jpg', alt: 'Baquetas Wincent sobre o sofá de couro, com um prato ao fundo', position: '50% 60%' },
  { image: '/fotos/hero-caixa-martelada.jpg', alt: 'Caixa de bateria com casco martelado cromado', position: '50% 50%' },
  { image: '/fotos/hero-daniel-baquetas.jpg', alt: 'Daniel recolhendo baquetas espalhadas ao lado de um prato Istanbul Agop', position: '50% 50%' },
  { image: '/fotos/hero-wincent.jpg', alt: 'Baquetas Wincent 5A e 5B empilhadas', position: '50% 50%' },
  { image: '/fotos/hero-caixa-preta.jpg', alt: 'Caixa de bateria preta com detalhes em latão', position: '50% 55%' },
  { image: '/fotos/hero-baquetas-mesa.jpg', alt: 'Baquetas Wincent e Dynabeat espalhadas sobre a mesa', position: '50% 50%' },
];

const SLIDE_MS = 6000;

// Foto de cada atalho de categoria (independe de haver produto com foto cadastrado)
const CATEGORY_PHOTOS: Record<string, { image: string; position?: string }> = {
  pratos: { image: '/fotos/cat-pratos-pufe.jpg', position: '50% 55%' },
  baquetas: { image: '/fotos/cat-baquetas.jpg' },
  caixas: { image: '/fotos/cat-caixas-sofa.jpg', position: '50% 70%' },
  peles: { image: '/fotos/cat-peles.jpg', position: '50% 45%' },
  baterias: { image: '/fotos/cat-baterias-kit.jpg', position: '50% 30%' },
  acessorios: { image: '/fotos/cat-acessorios.jpg' },
};
const CATEGORY_ORDER = ['pratos', 'baquetas', 'caixas', 'peles', 'baterias', 'acessorios'];

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
      className="grid bg-ink md:h-[min(78vh,720px)] md:min-h-[560px] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
      aria-roledescription="carrossel"
      aria-label="Destaques"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Foto: em cima no celular, à direita no desktop */}
      <div className="relative aspect-square overflow-hidden sm:aspect-[4/3] md:order-2 md:aspect-auto md:h-full">
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
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
              style={{ objectPosition: slide.position }}
            />
          </div>
        ))}

        <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-ink/75 p-1 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => go(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-white/20"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="min-w-10 text-center text-xs font-semibold tabular-nums text-white/90">
            {current + 1} / {heroSlides.length}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-white/20"
            aria-label="Próxima foto"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-center border-b-[3px] border-brass px-5 py-10 text-white md:order-1 md:border-b-0 md:border-r-[3px] md:px-10 lg:px-16">
        <h1 className="text-[2.5rem] font-semibold uppercase leading-[1.12] lg:text-6xl">
          <span className="block">Pratos turcos feitos à mão.</span>
          <span className="block text-[#E9B872]">Baquetas suecas.</span>
          <span className="block">Em São Paulo.</span>
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-[#F0E3D0] lg:text-lg">
          Revenda oficial Wincent, Istanbul Agop e Torelli. Você escolhe aqui e fecha o pedido direto com a loja pelo WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#categorias"
            className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-6 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-secondary"
          >
            Ver produtos <ArrowRight size={18} aria-hidden />
          </a>
          <a
            href={contactInfo.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-md px-6 text-sm font-bold uppercase tracking-wide text-white ring-1 ring-white/60 transition hover:bg-white/10"
          >
            <MessageCircle size={18} aria-hidden /> Fale com a loja
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-6 text-3xl font-semibold uppercase text-ink md:mb-8 md:text-5xl">
      {children}
    </h2>
  );
}

/** Painel grande de foto com título sobreposto (padrão "LENDAS DO ROCK" da referência). */
function PhotoPanel({ href, image, alt, title, text, position }: {
  href: string; image: string; alt: string; title: string; text: string; position?: string;
}) {
  return (
    <Link href={href} className="group relative block aspect-[4/5] overflow-hidden bg-ink md:aspect-[3/4]">
      <SmartImage
        src={image}
        alt={alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
        style={{ objectPosition: position }}
      />
      <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(28,17,10,0.88)_0%,rgba(28,17,10,0.25)_45%,transparent_70%)]" aria-hidden />
      <span className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10">
        <span className="block font-display text-3xl font-semibold uppercase leading-none md:text-5xl">{title}</span>
        <span className="mt-3 block max-w-sm text-sm text-[#F0E3D0] md:text-base">{text}</span>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#E9B872]">
          Ver coleção <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </span>
    </Link>
  );
}

export default function Home() {
  const products = useProductsStore(state => state.products);

  const offers = products.filter(p => p.oldPrice && p.oldPrice > p.price && !p.soldOut).slice(0, 8);
  const featured = (products.some(p => p.featured) ? products.filter(p => p.featured) : products)
    .filter(p => !offers.includes(p))
    .slice(0, 8);

  const categoryTiles = CATEGORY_ORDER
    .map(id => categories.find(c => c.id === id))
    .filter((c): c is (typeof categories)[number] => Boolean(c))
    .map(cat => ({ ...cat, ...CATEGORY_PHOTOS[cat.id] }));

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

        {/* Compre por categoria: fotos grandes do ensaio */}
        <section id="categorias" className="scroll-mt-32 py-12 md:py-20" aria-labelledby="categorias-titulo">
          <div className="container mx-auto px-4">
            <SectionTitle id="categorias-titulo">Compre por categoria</SectionTitle>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
              {categoryTiles.map(cat => (
                <li key={cat.id}>
                  <Link href={`/${cat.id}`} className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-ink">
                    <SmartImage
                      src={cat.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      style={{ objectPosition: cat.position }}
                    />
                    <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(28,17,10,0.85)_0%,rgba(28,17,10,0.1)_45%,transparent_65%)]" aria-hidden />
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 md:p-6">
                      <span className="font-display text-xl font-semibold uppercase leading-none text-white md:text-4xl">
                        {cat.name}
                      </span>
                      <ArrowRight className="mb-0.5 h-5 w-5 flex-shrink-0 text-[#E9B872] transition-transform group-hover:translate-x-1 md:h-7 md:w-7" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {offers.length > 0 && (
          <section className="bg-white py-12 md:py-20" aria-labelledby="ofertas-titulo">
            <div className="container mx-auto px-4">
              <SectionTitle id="ofertas-titulo">Ofertas da casa</SectionTitle>
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                {offers.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Dois painéis grandes de marca */}
        <section aria-label="Marcas em destaque" className="grid md:grid-cols-2">
          <PhotoPanel
            href="/pratos"
            image="/fotos/ed-istanbul.jpg"
            alt="Prato Istanbul Agop cobrindo metade do rosto do Daniel"
            title="Istanbul Agop"
            text="Pratos turcos martelados à mão, um a um. Cada peça tem voz própria."
            position="40% 50%"
          />
          <PhotoPanel
            href="/wincent"
            image="/fotos/ed-wincent-couro.jpg"
            alt="Baquetas Wincent sobre o sofá de couro, com pratos ao fundo"
            title="Wincent"
            text="Baquetas suecas com madeira selecionada e equilíbrio para todos os estilos."
            position="50% 70%"
          />
        </section>

        {/* Ouça antes de comprar: timbres dos pratos */}
        <section className="grid bg-ink text-white md:grid-cols-2" aria-labelledby="timbre-titulo">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[560px]">
            <SmartImage
              src="/fotos/ouca-pratos.jpg"
              alt="Prato Istanbul Agop Xist em primeiro plano"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: '50% 70%' }}
            />
          </div>
          <div className="flex flex-col justify-center px-5 py-12 md:px-12 lg:px-20">
            <h2 id="timbre-titulo" className="text-3xl font-semibold uppercase leading-none md:text-5xl">
              Escolha pelo <span className="text-[#E9B872]">som</span>
            </h2>
            <p className="mt-5 max-w-md text-[#E9D9C2]">
              Cada prato tem um timbre. Comece pelo som que você procura e, se ficar entre dois, pergunte pra gente pelo WhatsApp.
            </p>
            <ul className="mt-8 max-w-md divide-y divide-white/15 border-y border-white/15">
              {TIMBRES.map(t => (
                <li key={t.id}>
                  <Link
                    href={`/pratos?timbre=${t.id}`}
                    className="group flex min-h-12 items-center gap-4 py-3 transition hover:text-[#E9B872]"
                  >
                    <span className="w-24 flex-shrink-0 font-display text-lg font-semibold uppercase tracking-wide">{t.label}</span>
                    <span className="flex-1 text-sm text-[#E9D9C2]">{t.hint}</span>
                    <ArrowRight size={18} className="flex-shrink-0 text-[#E9B872] transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={`${contactInfo.whatsapp}?text=${encodeURIComponent('Olá! Estou em dúvida sobre o som de um prato.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#E9B872] hover:underline"
            >
              <MessageCircle size={18} aria-hidden /> Tirar dúvida sobre um prato
            </a>
          </div>
        </section>

        {featured.length > 0 && (
          <section id="destaques" className="scroll-mt-32 py-12 md:py-20" aria-labelledby="destaques-titulo">
            <div className="container mx-auto px-4">
              <SectionTitle id="destaques-titulo">Escolhas da casa</SectionTitle>
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                {featured.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Marcas oficiais */}
        <section className="border-t border-line bg-cream py-12 md:py-16" aria-labelledby="marcas-titulo">
          <div className="container mx-auto px-4">
            <SectionTitle id="marcas-titulo">Revendedor autorizado</SectionTitle>
            <ul className="grid divide-y divide-[#DCC9AE] md:grid-cols-3 md:divide-x md:divide-y-0">
              {brands.map(brand => (
                <li key={brand.name} className="flex flex-col py-6 first:pt-0 last:pb-0 md:px-8 md:py-0 md:first:pl-0 md:last:pr-0">
                  <div className="relative mb-4 h-14 w-52">
                    <SmartImage
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      sizes="208px"
                      className="object-contain object-left mix-blend-multiply"
                    />
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{brand.label}</p>
                  <p className="mb-4 max-w-sm text-sm leading-relaxed text-ink-soft">{brand.desc}</p>
                  <Link href={brand.href} className="mt-auto inline-flex min-h-11 items-center gap-1 text-sm font-bold text-secondary hover:underline">
                    {brand.cta} <ArrowRight size={16} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
