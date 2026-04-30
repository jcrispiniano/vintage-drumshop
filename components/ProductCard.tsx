'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { formatPrice } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

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
  outOfStock?: boolean;
}

interface ProductCardProps {
  product: Product;
  /** Secondary label shown after brand (tipo, série, etc.) */
  typeLabel?: string;
  /** Show installment text instead of "NO PIX" */
  showInstallments?: boolean;
}

const BRAND_LABELS: Record<string, string> = {
  istanbul: 'Istanbul Agop',
  wincent: 'Wincent',
  dynabeat: 'Dynabeat',
  pinguim: 'Pinguim',
  dw: 'DW',
  rockkey: 'RockKey',
};

export function brandLabel(brand: string) {
  return BRAND_LABELS[brand] ?? brand.charAt(0).toUpperCase() + brand.slice(1);
}

export default function ProductCard({ product, typeLabel, showInstallments = false }: ProductCardProps) {
  const { addToCart, toggleFavorite, favorites } = useCart();

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
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 group"
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(139,69,19,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        href={`/produto/${product.id}`}
        className="relative h-52 md:h-64 bg-white flex items-center justify-center overflow-hidden block cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
        />
        {product.outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-lg">
              Esgotado
            </span>
          </div>
        )}
        {product.badge && !product.outOfStock && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-accent to-secondary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {product.badge}
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
          className={`absolute top-3 left-3 p-2 rounded-full transition shadow-lg ${
            favorites.includes(product.id)
              ? 'bg-accent text-white'
              : 'bg-white text-gray-400 hover:text-accent'
          }`}
        >
          <Heart size={16} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
        </button>
      </Link>

      <div className="p-4 md:p-5">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-xs text-accent uppercase font-bold tracking-wider">
            {brandLabel(product.brand)}
          </p>
          {typeLabel && (
            <>
              <span className="text-xs text-gray-400">·</span>
              <p className="text-xs text-gray-400">{typeLabel}</p>
            </>
          )}
        </div>

        <h3 className="font-bold text-sm md:text-base mb-2 line-clamp-2 text-gray-900 group-hover:text-accent transition leading-tight">
          {product.name}
        </h3>

        <div className="mb-3">
          {product.oldPrice && (
            <data value={product.oldPrice} className="text-xs text-gray-400 line-through block">
              {formatPrice(product.oldPrice)}
            </data>
          )}
          <data value={product.price} className="text-2xl md:text-3xl font-bold text-accent">
            {formatPrice(product.price)}
          </data>
          <p className="text-xs text-gray-500">
            {showInstallments
              ? `até 3x de ${formatPrice(product.price / 3)} sem juros`
              : 'NO PIX'}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {product.outOfStock ? (
            <button
              disabled
              className="w-full bg-gray-200 text-gray-400 py-2.5 md:py-3 rounded-lg font-bold text-sm cursor-not-allowed"
            >
              Esgotado
            </button>
          ) : (
            <motion.button
              onClick={handleAddToCart}
              className="w-full bg-accent text-white py-2.5 md:py-3 rounded-lg font-bold shadow-md text-sm"
              whileHover={{ backgroundColor: '#D2691E' }}
              whileTap={{ scale: 0.96 }}
            >
              Adicionar ao Carrinho
            </motion.button>
          )}
          <Link
            href={`/produto/${product.id}`}
            className="w-full border-2 border-accent text-accent py-2.5 md:py-3 rounded-lg font-semibold hover:bg-accent hover:text-white transition text-center block text-sm"
          >
            Ver Produto
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
