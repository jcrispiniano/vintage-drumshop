'use client';

import SmartImage from '@/components/SmartImage';
import PriceBlock from '@/components/PriceBlock';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { discountPercent, productImage } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import { brandLabel } from '@/lib/brands';

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
      <Link href={href} className="relative block aspect-square overflow-hidden rounded-t-xl bg-white">
        <SmartImage
          src={productImage(product.image)}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className={`object-contain p-4 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105 ${product.soldOut ? 'opacity-40 grayscale' : ''}`}
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
        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        className={`absolute right-2 top-2 rounded-full p-2 transition ${
          isFavorite ? 'text-accent' : 'text-ink-soft/60 hover:text-accent'
        }`}
      >
        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>

      <div className="flex flex-1 flex-col border-t border-line p-3 md:p-4">
        <p className="mb-1 truncate text-[11px] font-semibold uppercase tracking-wider text-primary">
          {brandLabel(product.brand)}
          {typeLabel && <span className="font-normal text-ink-soft"> · {typeLabel}</span>}
        </p>

        <h3 className="mb-3 line-clamp-2 min-h-[2.5em] text-sm font-semibold leading-tight text-ink md:text-[15px]">
          <Link href={href} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>

        <div className="mb-3 mt-auto">
          <PriceBlock price={product.price} oldPrice={product.oldPrice} />
        </div>

        {product.soldOut ? (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-md bg-line py-2.5 text-sm font-bold uppercase tracking-wide text-ink-soft"
          >
            Esgotado
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-secondary active:scale-[0.98]"
          >
            <ShoppingCart size={16} aria-hidden />
            Comprar
          </button>
        )}
      </div>
    </div>
  );
}
