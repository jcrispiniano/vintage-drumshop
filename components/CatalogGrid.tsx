'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product, contactInfo } from '@/lib/products';
import { productSizeValue } from '@/lib/productText';

export type SortKey = 'relevancia' | 'menor-preco' | 'maior-preco' | 'tamanho';

export const SORTS: { id: SortKey; label: string }[] = [
  { id: 'relevancia', label: 'Destaques' },
  { id: 'menor-preco', label: 'Menor preço' },
  { id: 'maior-preco', label: 'Maior preço' },
  { id: 'tamanho', label: 'Tamanho' },
];

const PAGE_SIZE = 24;

const SHORTCUTS = [
  { href: '/pratos', label: 'Pratos' },
  { href: '/baquetas', label: 'Baquetas' },
  { href: '/caixas', label: 'Caixas' },
];

interface CatalogGridProps {
  products: Product[];
  /** Nome da categoria no plural, para o estado "sob encomenda" (ex.: "Peles") */
  categoryName: string;
  /** Total da categoria antes dos filtros da página: 0 → "sob encomenda" */
  totalInCategory?: number;
  /** Limpa os filtros da página (tipo, marca, som) quando nada sobra */
  onClearFilters?: () => void;
  typeLabel?: (p: Product) => string | undefined;
  tags?: (p: Product) => string[];
  /** Palavra usada na contagem: "prato", "produto"... */
  noun?: [singular: string, plural: string];
  /** Opcional: a página controla ordem e tamanho (ex.: para guardar na URL) */
  sort?: SortKey;
  onSortChange?: (sort: SortKey) => void;
  size?: number | null;
  onSizeChange?: (size: number | null) => void;
  /** false quando a página desenha o filtro de tamanho no próprio painel */
  showSizeFilter?: boolean;
}

/** Grade de produtos com ordenação, filtro de tamanho e "ver mais". */
export default function CatalogGrid({
  products,
  categoryName,
  totalInCategory = products.length,
  onClearFilters,
  typeLabel,
  tags,
  noun = ['produto', 'produtos'],
  sort: sortProp,
  onSortChange,
  size: sizeProp,
  onSizeChange,
  showSizeFilter = true,
}: CatalogGridProps) {
  const [sortState, setSortState] = useState<SortKey>('relevancia');
  const [sizeState, setSizeState] = useState<number | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const sort = sortProp ?? sortState;
  const size = sizeProp !== undefined ? sizeProp : sizeState;
  const setSort = (v: SortKey) => { setSortState(v); onSortChange?.(v); };
  const setSize = (v: number | null) => { setSizeState(v); onSizeChange?.(v); };

  const sizes = useMemo(() => {
    const values = products.map(p => productSizeValue(p.name)).filter((v): v is number => v !== null);
    return [...new Set(values)].sort((a, b) => a - b);
  }, [products]);

  const visible = useMemo(() => {
    const list = size === null ? [...products] : products.filter(p => productSizeValue(p.name) === size);
    if (sort === 'menor-preco') list.sort((a, b) => a.price - b.price);
    if (sort === 'maior-preco') list.sort((a, b) => b.price - a.price);
    if (sort === 'tamanho') {
      list.sort((a, b) => (productSizeValue(a.name) ?? 99) - (productSizeValue(b.name) ?? 99));
    }
    return list;
  }, [products, size, sort]);

  // Categoria sem nenhum produto: vira encomenda pelo WhatsApp em vez de beco sem saída
  if (totalInCategory === 0) {
    const message = encodeURIComponent(`Olá! Vocês trabalham com ${categoryName.toLowerCase()} sob encomenda?`);
    return (
      <section className="py-14 md:py-20">
        <div className="container mx-auto max-w-xl px-4 text-center">
          <h2 className="text-3xl font-semibold uppercase text-ink md:text-4xl">{categoryName} sob encomenda</h2>
          <p className="mt-4 text-ink-soft">
            No momento não temos {categoryName.toLowerCase()} no site, mas trazemos para você. Conte o que procura e respondemos com preço e prazo.
          </p>
          <a
            href={`${contactInfo.whatsapp}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-[#167a42] px-6 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#11643a]"
          >
            <MessageCircle size={18} aria-hidden /> Encomendar pelo WhatsApp
          </a>
          <p className="mt-10 text-sm text-ink-soft">Enquanto isso, veja:</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {SHORTCUTS.map(s => (
              <li key={s.href}>
                <Link href={s.href} className="inline-flex h-11 items-center rounded-md bg-white px-5 text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-ink/50">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  const chip = (active: boolean) =>
    `flex h-11 flex-shrink-0 items-center rounded-full px-4 text-sm font-semibold tabular-nums transition ${
      active ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'
    }`;

  return (
    <section className="py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-sans text-sm font-normal tracking-normal text-ink-soft">
            {visible.length} {visible.length === 1 ? noun[0] : noun[1]}
          </h2>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            Ordenar por
            <select
              value={sort}
              onChange={e => { setSort(e.target.value as SortKey); setLimit(PAGE_SIZE); }}
              className="h-11 rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink focus:border-accent"
            >
              {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
        </div>

        {showSizeFilter && sizes.length >= 3 && (
          <div className="-mx-4 mb-6 flex items-center gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide" role="group" aria-label="Filtrar por tamanho">
            <span className="flex-shrink-0 pr-1 text-xs font-bold uppercase tracking-wider text-ink-soft">Tamanho</span>
            <button type="button" onClick={() => { setSize(null); setLimit(PAGE_SIZE); }} aria-pressed={size === null} className={chip(size === null)}>
              Todos
            </button>
            {sizes.map(v => (
              <button key={v} type="button" onClick={() => { setSize(size === v ? null : v); setLimit(PAGE_SIZE); }} aria-pressed={size === v} className={chip(size === v)}>
                {String(v).replace('.', ',')}&quot;
              </button>
            ))}
          </div>
        )}

        {visible.length === 0 ? (
          <div className="py-14 text-center">
            <h3 className="mb-2 font-display text-2xl font-semibold uppercase text-ink">Nada com esse filtro</h3>
            <p className="mb-6 text-ink-soft">Tente outra combinação ou veja tudo de novo.</p>
            <button
              type="button"
              onClick={() => { setSize(null); onClearFilters?.(); }}
              className="inline-flex h-11 items-center rounded-md bg-accent px-6 text-sm font-bold uppercase tracking-wide text-white hover:bg-secondary"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {visible.slice(0, limit).map(product => (
                <ProductCard key={product.id} product={product} typeLabel={typeLabel?.(product)} tags={tags?.(product)} />
              ))}
            </div>
            {visible.length > limit && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setLimit(l => l + PAGE_SIZE)}
                  className="inline-flex h-12 items-center rounded-md bg-white px-8 text-sm font-bold uppercase tracking-wide text-ink ring-1 ring-ink/30 transition hover:bg-ink hover:text-white"
                >
                  Ver mais {Math.min(PAGE_SIZE, visible.length - limit)} de {visible.length - limit}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

