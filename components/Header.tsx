'use client';

import SmartImage from '@/components/SmartImage';
import { ShoppingCart, Heart, Search, Menu, Instagram } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { Product, formatPrice, contactInfo, productImage, paymentTerms, pixPrice } from '@/lib/products';
import { useProductsStore } from '@/lib/productsStore';
import { searchScore } from '@/lib/productText';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Sidebar from '@/components/Sidebar';

const redirectMap: { [key: string]: string } = {
  'baterias': '/baterias', 'bateria': '/baterias',
  'pratos': '/pratos', 'prato': '/pratos',
  'caixas': '/caixas', 'caixa': '/caixas',
  'peles': '/peles', 'pele': '/peles',
  'baquetas': '/baquetas', 'baqueta': '/baquetas',
  'acessorios': '/acessorios', 'acessório': '/acessorios', 'acessórios': '/acessorios',
  'ferragens': '/ferragens', 'ferragem': '/ferragens',
  'bags': '/bags', 'bag': '/bags',
  'pecas': '/pecas', 'peças': '/pecas', 'peça': '/pecas',
  'wincent': '/wincent',
  'dynabeat': '/dynabeat',
  'istanbul': '/pratos#istanbul-agop', 'istanbul agop': '/pratos#istanbul-agop',
  'vassourinhas': '/vassourinhas', 'vassoura': '/vassourinhas', 'vassourinha': '/vassourinhas',
  'brush': '/vassourinhas', 'brushes': '/vassourinhas',
  'mallets': '/mallets', 'mallet': '/mallets',
  'rod': '/vassourinhas', 'rods': '/vassourinhas',
};

function SearchBox({ variant }: { variant: 'desktop' | 'mobile' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();
  const products = useProductsStore(state => state.products);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const ranked = products
      .map(product => ({ product, score: searchScore(product, term) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.product);

    setSearchResults(ranked.slice(0, 8));
    setShowSearchResults(true);
  };

  const submit = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;
    setShowSearchResults(false);
    router.push(redirectMap[term] ?? `/busca?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const isMobile = variant === 'mobile';

  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(e) => { e.preventDefault(); submit(); }}
    >
      <label htmlFor={`busca-${variant}`} className="sr-only">Buscar produtos</label>
      <input
        id={`busca-${variant}`}
        type="search"
        autoComplete="off"
        placeholder="Olá, o que você procura?"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
        onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
        className={
          isMobile
            ? 'w-full bg-transparent py-3 pr-10 text-base text-white placeholder:text-cream/90 outline-none'
            : 'w-full rounded-md border border-line bg-paper px-4 py-2.5 pr-10 text-sm text-ink placeholder:text-ink-soft outline-none transition focus:border-accent focus:bg-white'
        }
      />
      <button
        type="submit"
        aria-label="Buscar"
        className={`absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center ${isMobile ? 'text-cream' : 'text-ink-soft hover:text-accent'}`}
      >
        <Search size={isMobile ? 22 : 18} />
      </button>

      {showSearchResults && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl bg-white text-ink shadow-[0_16px_40px_-12px_rgba(43,29,20,0.4)] ring-1 ring-line">
          {searchResults.map(product => (
            <Link
              key={product.id}
              href={`/produto/${product.id}`}
              className="flex items-center gap-3 border-b border-line p-3 transition last:border-b-0 hover:bg-paper"
              onClick={() => { setShowSearchResults(false); setSearchTerm(''); }}
            >
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-white">
                <SmartImage src={productImage(product.image)} alt="" fill sizes="56px" className="object-contain mix-blend-multiply" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold">{product.name}</h4>
                <p className="text-sm font-bold text-accent tabular-nums">
                  {formatPrice(pixPrice(product.price))} <span className="text-xs font-semibold text-ink-soft">no Pix</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </form>
  );
}

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const { cartItems, favorites } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const pixOff = Math.round(paymentTerms.pixDiscount * 100);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Barra de aviso (padrão "Primeira compra? ... PRIMEIRA" da referência) */}
      <div className="border-b border-line bg-cream text-ink">
        <p className="container mx-auto flex items-center justify-center gap-x-2 px-4 py-2 text-center text-xs tracking-wide md:text-[13px]">
          Pague no Pix e ganhe <span className="coupon text-primary">{pixOff}% OFF</span>
          <span className="hidden sm:inline">· até {paymentTerms.maxInstallments}x sem juros · frete grátis acima de R$ {paymentTerms.freeShippingFrom}</span>
        </p>
      </div>

      <header className="sticky top-0 z-[65] border-b border-line bg-white">
        <div className="container mx-auto flex h-16 items-center gap-3 px-4 md:h-20 md:gap-8">
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="-ml-2 flex h-11 w-11 items-center justify-center rounded-md text-ink transition hover:bg-paper md:hidden"
            aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isSidebarOpen}
          >
            <Menu size={26} />
          </button>

          <Link href="/" className="flex-shrink-0" aria-label="Vintage Drum Shop — página inicial">
            <SmartImage
              src="/logo-vintage-header.png"
              alt="Vintage Drum Shop"
              width={440}
              height={338}
              priority
              className="h-12 w-auto md:h-[68px]"
            />
          </Link>

          <div className="hidden max-w-xl flex-1 md:block">
            <SearchBox variant="desktop" />
          </div>

          <nav aria-label="Atalhos" className="ml-auto flex items-center gap-1 md:gap-2">
            <a
              href={contactInfo.instagram}
              target="_blank"
              rel="noopener noreferrer me"
              className="hidden h-11 w-11 items-center justify-center rounded-md text-ink transition hover:text-accent lg:flex"
              aria-label="Instagram da Vintage Drum Shop"
            >
              <Instagram size={22} />
            </a>
            <Link
              href="/favoritos"
              className="relative flex h-11 w-11 items-center justify-center rounded-md text-ink transition hover:text-accent"
              aria-label={`Favoritos (${favorites.length})`}
            >
              <Heart size={22} fill={favorites.length > 0 ? 'currentColor' : 'none'} />
              {favorites.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              href="/carrinho"
              className="flex h-11 items-center gap-1.5 rounded-md px-2 text-ink transition hover:text-accent"
              aria-label={`Carrinho (${cartCount} ${cartCount === 1 ? 'item' : 'itens'})`}
            >
              <ShoppingCart size={24} />
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-white tabular-nums">
                {cartCount}
              </span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Busca de largura total no mobile (padrão da referência) */}
      <div className="bg-primary px-4 md:hidden">
        <SearchBox variant="mobile" />
      </div>
    </>
  );
}
