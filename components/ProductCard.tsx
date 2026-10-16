'use client';

import SmartImage from '@/components/SmartImage';
import PriceBlock from '@/components/PriceBlock';
import Link from 'next/link';
import { Headphones, Heart, ShoppingCart } from 'lucide-react';
import { discountPercent, productImage } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import { brandLabel } from '@/lib/brands';
import { productSizes, shortTitle } from '@/lib/productText';

export { brandLabel };

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  brand: string;
  badge?: string;
  description: string;
  soldOut?: boolean;
  audio?: string;
}

interface ProductCardProps {
  product: Product;
  /** Secondary label shown after brand (tipo, série, etc.) */
  typeLabel?: string;
  /** Mantido por compatibilidade: o parcelamento agora aparece sempre. */
  showInstallments?: boolean;
}

export default function ProductCard({ product, typeLabel }: ProductCardProps) {
  const { addToCart, toggleFavorite, favorites } = useCart();
  const isFavorite = favorites.includes(product.id);
  const off = discountPercent(product.price, product.oldPrice);
  const href = `/produto/${product.id}`;
  const size = productSizes(product.name);
  const title = shortTitle(product.name, product.brand);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
    });
  };

  return (
    <div className="group relative flex h-full flex-col rounded-xl bg-white ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_12px_28px_-12px_rgba(43,29,20,0.35)]">
      <Link href={href} className="relative block aspect-square overflow-hidden rounded-t-xl bg-cream" tabIndex={-1} aria-hidden>
        <SmartImage
          src={productImage(product.image)}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${product.soldOut ? 'opacity-40 grayscale' : ''}`}
        />
        {product.soldOut ? (
          <span className="absolute inset-x-0 top-1/2 mx-auto w-fit -translate-y-1/2 rounded bg-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
            Esgotado
          </span>
        ) : off > 0 ? (
          <span className="absolute left-3 top-3 rounded bg-ink px-2 py-1 text-center text-[11px] font-bold leading-tight text-white">
            {off}%<br />OFF
          </span>
        ) : product.badge ? (
          <span className="absolute left-3 top-3 rounded bg-cream px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
            {product.badge}
          </span>
        ) : null}
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(product.id)}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remover ${product.name} dos favoritos` : `Favoritar ${product.name}`}
        className={`absolute right-1.5 top-1.5 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 backdrop-blur-sm transition ${
          isFavorite ? 'text-accent' : 'text-ink-soft hover:text-accent'
        }`}
      >
        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>

      <div className="flex flex-1 flex-col border-t border-line p-3 md:p-4">
        <p className="mb-1 truncate text-[11px] font-semibold uppercase tracking-wider text-primary">
          {brandLabel(product.brand)}
          {typeLabel && <span className="hidden font-normal text-ink-soft sm:inline"> · {typeLabel}</span>}
        </p>

        <h3 className="mb-2 line-clamp-2 min-h-[2.5em] text-sm font-semibold leading-tight text-ink md:text-[15px]">
          <Link href={href} className="hover:text-accent" title={product.name}>
            {title}
          </Link>
        </h3>
        {(size || product.audio) && (
          <p className="mb-3 -mt-0.5 flex flex-wrap gap-1.5">
            {size && <span className="inline-block rounded bg-paper px-1.5 py-0.5 text-xs font-bold tabular-nums text-ink ring-1 ring-line">{size}</span>}
            {product.audio && (
              <span className="inline-flex items-center gap-1 rounded bg-cream px-1.5 py-0.5 text-xs font-bold text-ink">
                <Headphones size={12} aria-hidden /> Com áudio
              </span>
            )}
          </p>
        )}

        <div className="mb-3 mt-auto">
          <PriceBlock price={product.price} oldPrice={product.oldPrice} />
        </div>

        {product.soldOut ? (
          <button
            type="button"
            disabled
            className="h-11 w-full cursor-not-allowed rounded-md bg-line text-sm font-bold uppercase tracking-wide text-ink-soft"
          >
            Esgotado
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Comprar ${product.name}`}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-secondary active:scale-[0.98]"
          >
            <ShoppingCart size={16} aria-hidden />
            Comprar
          </button>
        )}
      </div>
    </div>
  );
}
