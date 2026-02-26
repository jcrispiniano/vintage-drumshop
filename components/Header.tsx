'use client';

import { ShoppingCart, Heart, Search, ArrowLeft, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { products, formatPrice } from '@/lib/products';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Sidebar from '@/components/Sidebar';

interface HeaderProps {
  showBackButton?: boolean;
  currentCategory?: string;
}

export default function Header({ showBackButton = false, currentCategory }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { cartItems, favorites } = useCart();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.category.toLowerCase().includes(term.toLowerCase()) ||
      product.brand?.toLowerCase().includes(term.toLowerCase()) ||
      product.description.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(filtered.slice(0, 8));
    setShowSearchResults(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      
      const redirectMap: { [key: string]: string } = {
        'baterias': '/baterias', 'bateria': '/baterias',
        'pratos': '/pratos', 'prato': '/pratos',
        'caixas': '/caixas', 'caixa': '/caixas',
        'peles': '/peles', 'pele': '/peles',
        'baquetas': '/baquetas', 'baqueta': '/baquetas',
        'acessorios': '/acessorios', 'acessório': '/acessorios', 'acessórios': '/acessorios',
        'ferragens': '/ferragens', 'ferragem': '/ferragens',
        'bags': '/bags', 'bag': '/bags',
        'estudo': '/estudo',
        'cajon': '/cajon', 'cajón': '/cajon',
        'kids': '/kids', 'infantil': '/kids',
        'livros': '/livros', 'livro': '/livros',
        'pecas': '/pecas', 'peças': '/pecas', 'peça': '/pecas',
        'wincent': '/wincent',
        'dynabeat': '/dynabeat',
        'istanbul': '/pratos#istanbul-agop', 'istanbul agop': '/pratos#istanbul-agop',
        'vassourinhas': '/vassourinhas', 'vassoura': '/vassourinhas', 'vassourinha': '/vassourinhas',
        'brush': '/vassourinhas', 'brushes': '/vassourinhas',
        'mallets': '/mallets', 'mallet': '/mallets',
        'rod': '/vassourinhas', 'rods': '/vassourinhas',
      };
      
      if (redirectMap[term]) {
        router.push(redirectMap[term]);
      } else {
        router.push(`/busca?q=${encodeURIComponent(searchTerm.trim())}`);
      }
    }
  };

  return (
    <>
      {/* Sidebar com toggle */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 z-[65] bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">

            {/* Hambúrguer (mobile) ou Voltar (desktop) */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                onClick={() => setIsSidebarOpen(prev => !prev)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition text-primary"
                aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                <Menu size={24} />
              </button>
              {showBackButton && (
                <Link href="/" className="hidden md:flex items-center gap-2 text-primary hover:text-accent transition">
                  <ArrowLeft size={24} />
                  <span className="font-bold">Voltar</span>
                </Link>
              )}
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <img 
                src="/vintage-drumshop/logo-small.png" 
                alt="Vintage Drum Shop" 
                className="h-10 md:h-20 w-auto cursor-pointer hover:opacity-80 transition"
              />
            </Link>

            {/* Busca - desktop e mobile */}
            <div className="flex-1 max-w-xl relative">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar produtos, marcas... (Enter para buscar)" 
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  className="w-full px-4 py-2 pr-10 text-sm rounded-full border-2 border-gray-300 focus:border-accent outline-none"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
              </div>

              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
                  {searchResults.map(product => (
                    <Link
                      key={product.id}
                      href={`/produto/${product.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-lightBg border-b border-gray-100 last:border-b-0 transition"
                      onClick={() => { setShowSearchResults(false); setSearchTerm(''); }}
                    >
                      <div className="w-16 h-16 flex-shrink-0 bg-lightBg rounded-lg overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                        <p className="text-xs text-gray-500">{product.category}</p>
                        <p className="text-accent font-bold">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Ícones */}
            <div className="flex gap-3 md:gap-4 flex-shrink-0">
              <Link href="/favoritos" className="text-primary hover:text-accent transition relative" aria-label={`Favoritos (${favorites.length})`}>
                <Heart size={24} fill={favorites.length > 0 ? 'currentColor' : 'none'} />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link href="/carrinho" className="text-primary hover:text-accent transition relative" aria-label={`Carrinho (${cartItems.length})`}>
                <ShoppingCart size={24} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Espaçador para compensar header fixed */}
      <div className="h-[60px] md:h-[88px]"></div>
    </>
  );
}
