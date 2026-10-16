'use client';

import Link from 'next/link';
import { BadgePercent, CreditCard, Headphones, Heart, MessageCircle, Share2, ShoppingCart, Truck, X, ZoomIn } from 'lucide-react';
import { Product, contactInfo, discountPercent, formatPrice, paymentTerms, pixPrice, productImage } from '@/lib/products';
import { useProductsStore } from '@/lib/productsStore';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import Breadcrumb from '@/components/Breadcrumb';
import PriceBlock from '@/components/PriceBlock';
import ProductCard from '@/components/ProductCard';
import SmartImage from '@/components/SmartImage';
import { brandLabel } from '@/lib/brands';
import { categories } from '@/lib/products';

export default function ProdutoClient({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, favorites } = useCart();
  const allProducts = useProductsStore(state => state.products);
  const isFavorite = favorites.includes(product.id);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [currentImage, setCurrentImage] = useState(product.image);
  const [shared, setShared] = useState(false);

  const gallery = [product.image, ...(product.images ?? [])].filter(Boolean);
  const off = discountPercent(product.price, product.oldPrice);
  const category = categories.find(c => c.id === product.category);
  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id && p.image)
    .slice(0, 4);

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

  const whatsappHref = `${contactInfo.whatsapp}?text=${encodeURIComponent(`Olá! Tenho uma dúvida sobre: ${product.name}`)}`;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CategoryNav currentCategory={product.category} />

      <div className="container mx-auto px-4 pb-28 pt-6 md:pb-16">
        <Breadcrumb
          items={[
            { name: 'Início', url: '/' },
            ...(category ? [{ name: category.name, url: `/${category.id}` }] : []),
            { name: product.name, url: `/produto/${product.id}` },
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
              className="group relative aspect-square w-full flex-1 cursor-zoom-in overflow-hidden rounded-xl bg-cream"
              onClick={() => setIsImageExpanded(true)}
              aria-label="Ampliar imagem"
            >
              <SmartImage
                src={productImage(currentImage)}
                alt=""
                fill
                sizes="10vw"
                className="scale-110 object-cover opacity-60 blur-2xl"
                aria-hidden
              />
              <SmartImage
                src={productImage(currentImage)}
                alt={product.name}
                fill
                priority
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
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {brandLabel(product.brand)}
              {product.badge && <span className="ml-2 rounded bg-cream px-1.5 py-0.5 text-ink">{product.badge}</span>}
            </p>
            <h1 className="mb-6 text-3xl font-semibold uppercase leading-[1.1] text-ink md:text-4xl">
              {product.name}
            </h1>

            <div className="border-y border-line py-5">
              <PriceBlock price={product.price} oldPrice={product.oldPrice} size="page" />
            </div>

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

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.soldOut}
                className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-md text-base font-bold uppercase tracking-wide transition-colors ${
                  product.soldOut
                    ? 'cursor-not-allowed bg-line text-ink-soft'
                    : 'bg-accent text-white hover:bg-secondary active:scale-[0.99]'
                }`}
              >
                <ShoppingCart size={20} aria-hidden />
                {product.soldOut ? 'Produto esgotado' : 'Comprar'}
              </button>
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

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex h-12 items-center justify-center gap-2 rounded-md bg-paper text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-ink/40"
            >
              <MessageCircle size={18} className="text-[#1f9d55]" aria-hidden />
              Tire suas dúvidas pelo WhatsApp
            </a>

            <ul className="mt-6 space-y-3 text-sm text-ink-soft">
              <li className="flex items-center gap-3">
                <BadgePercent size={18} className="text-primary" aria-hidden />
                <span><strong className="text-ink">{Math.round(paymentTerms.pixDiscount * 100)}% de desconto</strong> no Pix ou boleto</span>
              </li>
              <li className="flex items-center gap-3">
                <CreditCard size={18} className="text-primary" aria-hidden />
                <span>Até <strong className="text-ink">{paymentTerms.maxInstallments}x sem juros</strong> no cartão de crédito</span>
              </li>
              <li className="flex items-center gap-3">
                <Truck size={18} className="text-primary" aria-hidden />
                <span><strong className="text-ink">Frete grátis</strong> em compras acima de R$ {paymentTerms.freeShippingFrom}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Descrição */}
        <section className="mx-auto mt-14 max-w-[68ch] border-t-2 border-ink pt-8">
          <h2 className="mb-4 text-2xl font-semibold uppercase text-ink">Descrição</h2>
          <p className="whitespace-pre-line leading-relaxed text-ink-soft">
            {product.description}
          </p>
        </section>

        {related.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold uppercase text-ink md:text-3xl">Veja também</h2>
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
      {!product.soldOut && (
        <div className="fixed inset-x-0 bottom-0 z-[60] flex items-center gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur md:hidden">
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
