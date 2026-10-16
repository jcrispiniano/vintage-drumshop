'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { categories } from '@/lib/products';

interface CategoryNavProps {
  currentCategory?: string;
}

const MAIN = ['baterias', 'pratos', 'caixas', 'peles', 'baquetas', 'acessorios'];

const SUBMENUS: Record<string, { href: string; label: string }[]> = {
  pratos: [
    { href: '/pratos', label: 'Todos os pratos' },
    { href: '/pratos#istanbul-agop', label: 'Istanbul Agop' },
  ],
  baquetas: [
    { href: '/baquetas', label: 'Todas as baquetas' },
    { href: '/wincent', label: 'Wincent' },
    { href: '/dynabeat', label: 'Dynabeat' },
    { href: '/vassourinhas', label: 'Vassourinhas' },
    { href: '/mallets', label: 'Mallets' },
  ],
};

const linkBase =
  'relative flex h-11 items-center gap-1 whitespace-nowrap px-3 font-display text-[15px] font-medium uppercase tracking-wide transition-colors md:px-4';

function Dropdown({ items }: { items: { href: string; label: string }[] }) {
  return (
    <div className="invisible absolute left-0 top-full z-[70] min-w-[220px] translate-y-1 rounded-b-lg bg-white py-2 opacity-0 shadow-[0_16px_32px_-12px_rgba(43,29,20,0.35)] ring-1 ring-line transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
      <ul>
        {items.map(item => (
          <li key={item.href}>
            <Link href={item.href} className="block px-5 py-2 text-sm text-ink hover:bg-paper hover:text-accent">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CategoryNav({ currentCategory }: CategoryNavProps) {
  return (
    <nav
      aria-label="Categorias de produtos"
      className="sticky top-16 z-[64] border-b border-line bg-white md:top-20"
    >
      <ul className="container mx-auto flex items-center gap-1 overflow-x-auto px-2 scrollbar-hide md:justify-center md:overflow-visible">
        <li className="group relative hidden md:block">
          <button type="button" className={`${linkBase} text-ink hover:text-accent`} aria-haspopup="true">
            Todos os produtos <ChevronDown size={14} aria-hidden />
          </button>
          <Dropdown items={categories.map(cat => ({ href: `/${cat.id}`, label: cat.name }))} />
        </li>

        {MAIN.map(catId => {
          const cat = categories.find(c => c.id === catId);
          if (!cat) return null;
          const active = currentCategory === cat.id;
          const submenu = SUBMENUS[cat.id];

          return (
            <li key={cat.id} className={`group relative ${cat.id === 'acessorios' ? 'hidden md:block' : ''}`}>
              <Link
                href={`/${cat.id}`}
                aria-current={active ? 'page' : undefined}
                className={`${linkBase} ${active ? 'text-accent' : 'text-ink hover:text-accent'}`}
              >
                {cat.name}
                {submenu && <ChevronDown size={14} aria-hidden className="hidden md:block" />}
                {active && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t bg-accent md:inset-x-4" aria-hidden />}
              </Link>
              {submenu && <div className="hidden md:block"><Dropdown items={submenu} /></div>}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
