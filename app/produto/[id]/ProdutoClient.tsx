'use client';

import Link from 'next/link';
import { BadgePercent, CreditCard, Headphones, Heart, MessageCircle, Play, PlayCircle, Share2, ShoppingCart, Truck, X, ZoomIn } from 'lucide-react';
import { Product, campaign, contactInfo, discountPercent, formatPrice, paymentTerms, pixOffLabel, pixPrice, productImage, productPath, productUrl } from '@/lib/products';
import { cymbalSeries, cymbalType, productSpecs, soundSearchUrl } from '@/lib/cymbals';
import { parseYouTubeList } from '@/lib/youtube';
import YouTubeLite from '@/components/YouTubeLite';
import { productSizeValue } from '@/lib/productText';
import { useProductsStore } from '@/lib/productsStore';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import Breadcrumb from '@/components/Breadcrumb';
import PriceBlock from '@/components/PriceBlock';
import ProductCard from '@/components/ProductCard';
import SmartImage from '@/components/SmartImage';
import { brandLabel, isGenericBrand } from '@/lib/brands';
import { categories } from '@/lib/products';

export default function ProdutoClient({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, favorites } = useCart();
  const allProducts = useProductsStore(state => state.products);
  const isFavorite = favorites.includes(product.id);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [currentImage, setCurrentImage] = useState(product.image);
  const [shared, setShared] = useState(false);

  const gallery = [product.image, ...(product.images ?? [])].filter(Boolean);
  const promo = campaign && !product.soldOut ? campaign : null;
  const off = discountPercent(product.price, product.oldPrice);
  const category = categories.find(c => c.id === product.category);
  const specs = productSpecs(product);
  const videos = parseYouTubeList(product.videos);
  const shorts = videos.filter(v => v.short);
  const longVideos = videos.filter(v => !v.short);
  // Ordem em que aparecem na seção de vídeos: Shorts primeiro
  const firstVideo = shorts[0] ?? longVideos[0];
  const [playFirst, setPlayFirst] = useState(false);
  // A barra fixa do celular só aparece quando o "Comprar" da página sai da tela (sem dois botões iguais juntos)
  const buyRef = useRef<HTMLDivElement>(null);
  const [buyVisible, setBuyVisible] = useState(true);
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setBuyVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const isCymbal = product.category === 'pratos';
  const related = relatedProducts(product, allProducts);

  const handleAddToCart = () => {
    if (product.soldOut) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      // AbortError quando o usuário cancela o compartilhamento
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href)
        .then(() => { setShared(true); setTimeout(() => setShared(false), 2000); })
        .catch(() => {});
    }
  };

  // A mensagem já leva o produto e o link: a loja sabe na hora do que se trata
  const whatsappHref = `${contactInfo.whatsapp}?text=${encodeURIComponent(
    product.soldOut
      ? `Olá! Quero encomendar: ${product.name}\n${productUrl(product)}\nQual o prazo?`
      : `Olá! Quero saber mais sobre: ${product.name}\n${productUrl(product)}`
  )}`;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CategoryNav currentCategory={product.category} />

      <div className="container mx-auto px-4 pb-28 pt-6 md:pb-16">
        <Breadcrumb
          items={[
            { name: 'Início', url: '/' },
            ...(category ? [{ name: category.name, url: `/${category.id}` }] : []),
            { name: product.name, url: productPath(product) },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
          {/* Galeria: miniaturas à esquerda no desktop, abaixo no mobile */}
          <div className="flex flex-col-reverse gap-3 md:flex-row md:items-start">
            {gallery.length > 1 && (
              <ul className="flex gap-2 overflow-x-auto scrollbar-hide md:w-20 md:flex-col md:overflow-visible">
                {gallery.map((img, index) => (
                  <li key={img + index} className="flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setCurrentImage(img)}
                      aria-label={`Ver imagem ${index + 1}`}
                      aria-pressed={currentImage === img}
                      className={`relative block h-16 w-16 overflow-hidden rounded-md bg-white ring-1 transition md:h-20 md:w-20 ${
                        currentImage === img ? 'ring-2 ring-ink' : 'ring-line hover:ring-ink/50'
                      }`}
                    >
                      <SmartImage src={productImage(img)} alt="" fill sizes="80px" className="object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              className="group relative aspect-square w-full flex-1 cursor-zoom-in overflow-hidden rounded-xl bg-white ring-1 ring-line"
              onClick={() => setIsImageExpanded(true)}
              aria-label="Ampliar imagem"
            >
              <SmartImage
                src={productImage(currentImage)}
                alt={product.name}
                fill
                preload
                fetchPriority="high"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={`object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] ${product.soldOut ? 'opacity-50 grayscale' : ''}`}
              />
              {off > 0 && !product.soldOut && (
                <span className="absolute left-3 top-3 rounded bg-ink px-2.5 py-1.5 text-center text-xs font-bold leading-tight text-white">
                  {off}%<br />OFF
                </span>
              )}
              <span className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-ink opacity-0 shadow transition-opacity group-hover:opacity-100">
                <ZoomIn size={20} aria-hidden />
              </span>
            </button>
          </div>

          {/* Informações e compra */}
          <div className="lg:pt-4">
            <h1 className="text-3xl font-semibold uppercase leading-[1.1] text-ink md:text-4xl">
              {product.name}
            </h1>
            <p className="mb-6 mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              {!isGenericBrand(product.brand) && <span className="font-semibold text-primary">{brandLabel(product.brand)}</span>}
              {product.badge && <span className="rounded bg-cream px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-ink">{product.badge}</span>}
              {product.soldOut && <span className="rounded bg-ink px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">Esgotado no momento</span>}
            </p>

            {/* Esgotado: o preço fica de referência, sem disputar com a ação de encomendar */}
            <div className={`border-y border-line py-5 ${product.soldOut ? 'opacity-55' : ''}`}>
              <PriceBlock price={product.price} oldPrice={product.oldPrice} size="page" />
            </div>

            {/* Sem áudio próprio, o primeiro vídeo vira o "ouça" ao lado do preço: o som decide a compra */}
            {!product.audio && firstVideo && (
              <a
                href="#ouca"
                onClick={() => setPlayFirst(true)}
                className="group mt-5 flex items-center gap-4 rounded-lg bg-cream p-3 pr-4 transition hover:ring-1 hover:ring-ink/30"
              >
                <span className="relative h-14 w-24 flex-shrink-0 overflow-hidden rounded-md bg-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element -- miniatura do YouTube */}
                  <img src={`https://i.ytimg.com/vi/${firstVideo.id}/mqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-85" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
                      <Play size={14} fill="currentColor" aria-hidden />
                    </span>
                  </span>
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block text-sm font-bold uppercase tracking-wide text-ink">{isCymbal ? 'Ouça o som' : 'Veja em vídeo'}</span>
                  <span className="text-sm text-ink-soft">
                    {videos.length > 1 ? `${videos.length} vídeos` : '1 vídeo'}{isCymbal ? ' · use fone de ouvido' : ''}
                  </span>
                </span>
              </a>
            )}

            {product.audio && (
              <div className="mt-5 rounded-lg bg-cream p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink">
                  <Headphones size={18} className="text-primary" aria-hidden /> Ouça antes de comprar
                </p>
                <audio controls preload="none" src={product.audio} className="w-full" aria-label={`Áudio de ${product.name}`}>
                  Seu navegador não toca áudio.
                </audio>
              </div>
            )}

            <div ref={buyRef} className="mt-6 flex gap-3">
              {product.soldOut ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 flex-1 items-center justify-center gap-2 rounded-md bg-accent text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-secondary"
                >
                  <MessageCircle size={20} aria-hidden /> Encomendar pelo WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex h-14 flex-1 items-center justify-center gap-2 rounded-md bg-accent text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-secondary active:scale-[0.99]"
                >
                  <ShoppingCart size={20} aria-hidden /> Comprar
                </button>
              )}
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                className={`flex h-14 w-14 items-center justify-center rounded-md ring-1 transition ${
                  isFavorite ? 'text-accent ring-accent' : 'text-ink ring-line hover:ring-ink/50'
                }`}
              >
                <Heart size={22} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button
                type="button"
                onClick={handleShare}
                aria-label={shared ? 'Link copiado' : 'Compartilhar'}
                title={shared ? 'Link copiado' : 'Compartilhar'}
                className="flex h-14 w-14 items-center justify-center rounded-md text-ink ring-1 ring-line transition hover:ring-ink/50"
              >
                <Share2 size={20} />
              </button>
            </div>

            {product.soldOut ? (
              <p className="mt-3 text-sm text-ink-soft">
                Sem estoque agora. Pela encomenda a loja confirma prazo e valor antes de qualquer pagamento.
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm text-ink-soft">
                  Vai para o carrinho. Você finaliza pelo WhatsApp e nada é cobrado agora.
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-md bg-paper px-4 py-2.5 text-center text-sm font-semibold leading-tight text-ink ring-1 ring-line transition hover:ring-ink/40"
                >
                  <MessageCircle size={18} className="flex-shrink-0 text-[#1f9d55]" aria-hidden />
                  {isCymbal ? 'Pergunte sobre este prato no WhatsApp' : 'Tire suas dúvidas pelo WhatsApp'}
                </a>
              </>
            )}

            {/* Na campanha as condições ganham o painel preto da Black November (sem repetir a lista) */}
            <div className={promo ? 'mt-6 rounded-xl bg-ink px-5 py-4 text-on-dark-soft' : 'mt-6'}>
              {promo && (
                <p className="mb-3 font-display text-lg font-semibold uppercase leading-none tracking-wide text-gold">{promo.name}</p>
              )}
              <ul className={`space-y-3 text-sm ${promo ? '' : 'text-ink-soft'}`}>
                <li className="flex items-center gap-3">
                  <BadgePercent size={18} className={promo ? 'text-gold' : 'text-primary'} aria-hidden />
                  <span><strong className={promo ? 'text-white' : 'text-ink'}>{pixOffLabel}</strong> pagando no Pix</span>
                </li>
                <li className="flex items-center gap-3">
                  <CreditCard size={18} className={promo ? 'text-gold' : 'text-primary'} aria-hidden />
                  <span>Até <strong className={promo ? 'text-white' : 'text-ink'}>{paymentTerms.maxInstallments}x sem juros</strong> no cartão de crédito</span>
                </li>
                <li className="flex items-center gap-3">
                  <Truck size={18} className={promo ? 'text-gold' : 'text-primary'} aria-hidden />
                  <span><strong className={promo ? 'text-white' : 'text-ink'}>Enviamos para todo o Brasil</strong> · frete calculado pelo seu CEP</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Vídeos do produto: o som decide a compra de um prato */}
        {videos.length > 0 && (
          <section id="ouca" aria-labelledby="videos-titulo" className="mt-14 scroll-mt-40 border-t-2 border-ink pt-8">
            <h2 id="videos-titulo" className="mb-2 text-2xl font-semibold uppercase text-ink">
              {isCymbal ? 'Ouça o som' : 'Veja em vídeo'}
            </h2>
            <p className="mb-6 max-w-[65ch] text-sm text-ink-soft">
              {videos.length > 1 ? 'Vídeos' : 'Vídeo'} de {product.name}. Use fone de ouvido para perceber melhor o timbre.
            </p>
            {/* Todos os vídeos com a mesma altura: o Short (em pé) e o vídeo deitado ficam alinhados lado a lado.
                No celular cada um ocupa a largura (o Short limitado para não ficar enorme). */}
            <div className="flex flex-wrap gap-4">
              {shorts.map(v => (
                <YouTubeLite
                  key={`${v.id}-${playFirst && v.id === firstVideo?.id}`}
                  autoStart={playFirst && v.id === firstVideo?.id}
                  video={v}
                  title={`${product.name} (vídeo da Vintage Drum Shop)`}
                  className="w-[min(100%,260px)] md:h-[380px] md:w-auto xl:h-[440px]"
                />
              ))}
              {longVideos.map(v => (
                <YouTubeLite
                  key={`${v.id}-${playFirst && v.id === firstVideo?.id}`}
                  autoStart={playFirst && v.id === firstVideo?.id}
                  video={v}
                  title={`${product.name} (demonstração de som)`}
                  className="w-full md:h-[380px] md:w-auto md:max-w-full xl:h-[440px]"
                />
              ))}
            </div>
          </section>
        )}

        {/* Ficha técnica + descrição: o que diferencia este produto dos vizinhos */}
        <div className="mt-14 grid gap-10 border-t-2 border-ink pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
          {specs.length > 0 && (
            <section aria-labelledby="ficha-titulo">
              <h2 id="ficha-titulo" className="mb-4 text-2xl font-semibold uppercase text-ink">Ficha técnica</h2>
              <dl className="divide-y divide-line rounded-xl bg-paper ring-1 ring-line">
                {specs.map(spec => (
                  <div key={spec.label} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 px-4 py-3 text-sm">
                    <dt className="font-semibold text-ink-soft">{spec.label}</dt>
                    <dd className="text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              {isCymbal && !product.audio && videos.length === 0 && (
                <a
                  href={soundSearchUrl(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent hover:underline"
                >
                  <PlayCircle size={18} aria-hidden /> Ouvir o som no YouTube
                </a>
              )}
            </section>
          )}
          <section aria-labelledby="descricao-titulo" className={specs.length ? '' : 'lg:col-span-2'}>
            <h2 id="descricao-titulo" className="mb-4 text-2xl font-semibold uppercase text-ink">Descrição</h2>
            <p className="max-w-[65ch] whitespace-pre-line leading-relaxed text-ink-soft">
              {product.description}
            </p>
          </section>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold uppercase text-ink md:text-3xl">
                {isCymbal && cymbalSeries(product.name) ? `Mais da série ${cymbalSeries(product.name)!.label}` : 'Veja também'}
              </h2>
              {category && (
                <Link href={`/${category.id}`} className="text-sm font-semibold text-accent hover:underline">
                  Ver tudo em {category.name}
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
              {related.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Barra de compra fixa no celular */}
      {!product.soldOut && !buyVisible && (
        <div className="fixed inset-x-0 bottom-0 z-[60] flex items-center gap-3 border-t border-line bg-white px-4 py-3 md:hidden">
          <p className="min-w-0 flex-1 leading-tight tabular-nums">
            <span className="block text-lg font-bold text-accent">{formatPrice(pixPrice(product.price))}</span>
            <span className="text-xs text-ink-soft">no Pix · ou {paymentTerms.maxInstallments}x sem juros</span>
          </p>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex h-12 items-center gap-2 rounded-md bg-accent px-6 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-secondary"
          >
            <ShoppingCart size={18} aria-hidden /> Comprar
          </button>
        </div>
      )}

      {isImageExpanded && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4"
          onClick={() => setIsImageExpanded(false)}
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
        >
          <button
            type="button"
            onClick={() => setIsImageExpanded(false)}
            aria-label="Fechar"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- zoom usa a imagem original */}
          <img
            src={productImage(currentImage)}
            alt={product.name}
            className="max-h-[90vh] max-w-[90vw] rounded-lg bg-white object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

/**
 * "Veja também": a mesma série em outros tamanhos e tipos primeiro (ex.: o chimbal
 * e o ride que combinam com um crash Xist), depois o resto da categoria.
 */
function relatedProducts(product: Product, all: Product[]): Product[] {
  const pool = all.filter(p => p.id !== product.id && p.image && p.category === product.category && !p.soldOut);
  if (product.category !== 'pratos') return pool.slice(0, 4);
  const series = cymbalSeries(product.name)?.id;
  const type = cymbalType(product.name);
  const size = productSizeValue(product.name);
  const score = (p: Product) => {
    let s = 0;
    if (series && cymbalSeries(p.name)?.id === series) s += 10;
    const t = cymbalType(p.name);
    if (t !== type) s += 3; // completa o setup
    else if (size !== null && productSizeValue(p.name) !== size) s += 2; // mesmo tipo, outro tamanho
    return s;
  };
  return [...pool].sort((a, b) => score(b) - score(a)).slice(0, 4);
}
