'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { categories } from '@/lib/products';
import { useProductsStore } from '@/lib/productsStore';
import { CYMBAL_SERIES } from '@/lib/cymbals';

interface CategoryNavProps {
  currentCategory?: string;
}

const MAIN = ['baterias', 'pratos', 'caixas', 'peles', 'baquetas', 'acessorios'];

type MenuItem = { href: string; label: string };
type MenuGroup = { title?: string; items: MenuItem[] };

// Pratos são 3/4 do catálogo: o menu abre por tipo e pela série da Istanbul Agop
const SUBMENUS: Record<string, MenuGroup[]> = {
  pratos: [
    {
      title: 'Por tipo',
      items: [
        { href: '/pratos', label: 'Todos os pratos' },
        { href: '/pratos?tipo=sets', label: 'Set de pratos' },
        { href: '/pratos?tipo=crash', label: 'Crash' },
        { href: '/pratos?tipo=ride', label: 'Ride' },
        { href: '/pratos?tipo=hihat', label: 'Hi-Hat' },
        { href: '/pratos?tipo=effects', label: 'Efeitos e stacks' },
      ],
    },
    {
      title: 'Por série',
      items: CYMBAL_SERIES.filter(sr => sr.id !== 'art').map(sr => ({ href: `/pratos?serie=${sr.id}`, label: sr.label })),
    },
  ],
  baquetas: [
    {
      items: [
        { href: '/baquetas', label: 'Todas as baquetas' },
        { href: '/wincent', label: 'Wincent' },
        { href: '/dynabeat', label: 'Dynabeat' },
        { href: '/vassourinhas', label: 'Vassourinhas' },
        { href: '/mallets', label: 'Mallets' },
      ],
    },
  ],
};

const linkBase =
  'relative flex h-11 items-center gap-1 whitespace-nowrap px-3 font-display text-[15px] font-medium uppercase tracking-wide transition-colors md:px-4';

function Dropdown({ groups }: { groups: MenuGroup[] }) {
  return (
    <div className="invisible absolute left-0 top-full z-[70] flex min-w-[220px] translate-y-1 gap-2 rounded-b-lg bg-white py-2 opacity-0 shadow-[0_16px_32px_-12px_rgba(43,29,20,0.35)] ring-1 ring-line transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
      {groups.map((group, i) => (
        <div key={group.title ?? i} className={`min-w-[200px] ${i > 0 ? 'border-l border-line' : ''}`}>
          {group.title && <p className="px-5 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-ink-soft">{group.title}</p>}
          <ul>
            {group.items.map(item => (
              <li key={item.href}>
                <Link href={item.href} className="block px-5 py-2 text-sm text-ink hover:bg-paper hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function CategoryNav({ currentCategory }: CategoryNavProps) {
  const products = useProductsStore(state => state.products);
  const loaded = useProductsStore(state => state.loaded);
  // Categoria sem nenhum produto sai do menu (a página continua existindo, como encomenda)
  const hasStock = (id: string) => !loaded || products.some(p => p.category === id);
  const allCategories = categories.filter(cat => hasStock(cat.id));

  return (
    <nav
      aria-label="Categorias de produtos"
      className="sticky top-16 z-[64] border-b border-line bg-white md:top-20"
    >
      {/* No celular a faixa rola para o lado; o degradê na borda mostra que tem mais */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent md:hidden" aria-hidden />
      <ul className="container mx-auto flex items-center gap-1 overflow-x-auto px-2 pr-8 scrollbar-hide md:justify-center md:overflow-visible md:pr-2">
        <li className="group relative hidden md:block">
          <button type="button" className={`${linkBase} text-ink hover:text-accent`} aria-haspopup="true">
            Todos os produtos <ChevronDown size={14} aria-hidden />
          </button>
          <Dropdown groups={[{ items: allCategories.map(cat => ({ href: `/${cat.id}`, label: cat.name })) }]} />
        </li>

        {MAIN.map(catId => {
          const cat = categories.find(c => c.id === catId);
          if (!cat || !hasStock(cat.id)) return null;
          const active = currentCategory === cat.id;
          const submenu = SUBMENUS[cat.id];

          return (
            <li key={cat.id} className="group relative">
              <Link
                href={`/${cat.id}`}
                aria-current={active ? 'page' : undefined}
                className={`${linkBase} ${active ? 'text-accent' : 'text-ink hover:text-accent'}`}
              >
                {cat.name}
                {submenu && <ChevronDown size={14} aria-hidden className="hidden md:block" />}
                {active && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t bg-accent md:inset-x-4" aria-hidden />}
              </Link>
              {submenu && <div className="hidden md:block"><Dropdown groups={submenu} /></div>}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
