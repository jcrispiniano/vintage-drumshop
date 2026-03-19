'use client';

import { ShoppingCart, Heart, Search, Menu, Instagram } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { products, formatPrice, contactInfo } from '@/lib/products';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { cartItems, favorites } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header className={`fixed top-0 left-0 right-0 z-[65] transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-white/85 shadow-lg shadow-black/10' : 'bg-white shadow-md'}`}>
        {/* Top Bar - apenas desktop */}
        <div className="hidden md:block bg-darkBg text-white py-2">
          <div className="container mx-auto px-4 flex justify-between text-sm">
            <div className="flex space-x-4">
              <span>{contactInfo.phoneFormatted}</span>
              <span>{contactInfo.email}</span>
              <span>{contactInfo.instagramHandle}</span>
            </div>
          </div>
        </div>
        <div className="bg-lightBg py-2">
          <div className="container mx-auto px-4 flex items-center justify-between gap-4">

            {/* Hambúrguer (mobile only) */}
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition text-primary"
              aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <motion.img
                src="/logo-small.png"
                alt="Vintage Drum Shop"
                className="h-10 md:h-20 w-auto cursor-pointer"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 400 }}
              />
            </Link>

            {/* Busca - desktop e mobile */}
            <div className="flex-1 max-w-xl relative">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar produtos, marcas..." 
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
                <div className="fixed md:absolute top-[56px] md:top-full left-2 right-2 md:left-0 md:right-0 mt-0 md:mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
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
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              <ThemeToggle />
              <motion.a
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer me"
                className="flex flex-col items-center text-primary hover:text-accent transition"
                aria-label="Seguir no Instagram"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
              >
                <Instagram size={20} className="md:w-6 md:h-6" />
                <span className="text-xs hidden md:inline">Instagram</span>
              </motion.a>
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.92 }}>
                <Link href="/favoritos" className="text-primary hover:text-accent transition relative flex flex-col items-center" aria-label={`Favoritos (${favorites.length})`}>
                  <Heart size={20} className="md:w-6 md:h-6" fill={favorites.length > 0 ? 'currentColor' : 'none'} />
                  <span className="text-xs hidden md:inline">Favoritos</span>
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.92 }}>
                <Link href="/carrinho" className="text-primary hover:text-accent transition relative flex flex-col items-center" aria-label={`Carrinho (${cartItems.length})`}>
                  <ShoppingCart size={20} className="md:w-6 md:h-6" />
                  <span className="text-xs hidden md:inline">Carrinho</span>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Espaçador para compensar header fixed + top bar + CategoryNav fixed */}
      <div className="h-[100px] md:h-[166px]"></div>
    </>
  );
}
