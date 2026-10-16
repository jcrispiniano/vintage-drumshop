'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { categories, contactInfo } from '@/lib/products';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAIN = ['pratos', 'baquetas', 'caixas', 'peles', 'baterias', 'acessorios'];
const EXTRA = [
  { href: '/wincent', label: 'Wincent' },
  { href: '/dynabeat', label: 'Dynabeat' },
  { href: '/vassourinhas', label: 'Vassourinhas' },
  { href: '/mallets', label: 'Mallets' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Esc fecha o menu e o foco vai para dentro dele ao abrir
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const main = MAIN.map(id => categories.find(c => c.id === id)).filter(Boolean) as typeof categories;
  const others = categories.filter(c => !MAIN.includes(c.id));

  const link = 'flex min-h-12 items-center px-5 text-base text-ink transition hover:bg-paper hover:text-accent';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/60 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed left-0 top-0 z-[70] flex h-full w-[86%] max-w-80 flex-col bg-white shadow-2xl md:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <span className="font-display text-xl font-semibold uppercase text-ink">Menu</span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-md text-ink transition hover:bg-paper"
                aria-label="Fechar menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-2" aria-label="Categorias">
              <ul>
                {main.map(cat => (
                  <li key={cat.id}>
                    <Link href={`/${cat.id}`} onClick={onClose} className={`${link} font-display font-medium uppercase tracking-wide`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 px-5 pb-1 text-xs font-bold uppercase tracking-wider text-ink-soft">Mais</p>
              <ul>
                {[...EXTRA, ...others.map(c => ({ href: `/${c.id}`, label: c.name }))].map(item => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={onClose} className={`${link} text-sm`}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-line bg-paper p-4 text-sm text-ink-soft">
              <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="block font-semibold text-ink hover:text-accent">
                WhatsApp {contactInfo.phoneFormatted}
              </a>
              <p>{contactInfo.hours}</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
