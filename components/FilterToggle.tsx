import { ChevronDown, SlidersHorizontal } from 'lucide-react';

/**
 * Botão que abre o painel de filtros (série, tamanho, marca...). Fica sempre no começo (à esquerda)
 * da barra fixa de filtros, para o cliente ver assim que abre a página. Mesmo visual em todas as categorias.
 */
export default function FilterToggle({
  open,
  selectedCount,
  onClick,
  label,
  mobileLabel,
}: {
  open: boolean;
  selectedCount: number;
  onClick: () => void;
  label: string;
  /** Texto curto para telas pequenas (padrão: o mesmo texto) */
  mobileLabel?: string;
}) {
  const on = open || selectedCount > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="painel-filtros"
      className={`flex h-11 flex-shrink-0 items-center gap-1.5 rounded-md px-3 text-sm font-semibold ring-1 transition ${
        on ? 'bg-ink text-white ring-ink' : 'bg-cream text-ink ring-ink/30 hover:ring-ink'
      }`}
    >
      <SlidersHorizontal size={16} aria-hidden />
      {mobileLabel ? (
        <>
          <span className="md:hidden">{mobileLabel}</span>
          <span className="hidden md:inline">{label}</span>
        </>
      ) : (
        <span>{label}</span>
      )}
      {selectedCount > 0 && <span className="tabular-nums">({selectedCount})</span>}
      <ChevronDown size={16} aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  );
}
