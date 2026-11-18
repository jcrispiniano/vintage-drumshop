'use client';

import { useState } from 'react';
import type { ProductDetails } from '@/lib/products';
import SmartImage from '@/components/SmartImage';

type TabId = 'descricao' | 'caracteristicas' | 'ficha' | 'configuracoes' | 'avulsos' | 'acabamentos';

/**
 * Abas da página do produto (no estilo das páginas da Pearl): cada aba só aparece
 * se o produto tiver aquele conteúdo. No celular as abas rolam na horizontal.
 */
export default function ProductDetailsTabs({
  details,
  description,
  onPickConfig,
  onPickFinish,
}: {
  details: ProductDetails;
  description: string;
  onPickConfig?: (code: string) => void;
  onPickFinish?: (name: string) => void;
}) {
  const tabs: { id: TabId; label: string }[] = [
    { id: 'descricao' as const, label: 'Descrição' },
    ...(details.features?.length ? [{ id: 'caracteristicas' as const, label: 'Características' }] : []),
    ...(details.specs?.length ? [{ id: 'ficha' as const, label: 'Ficha técnica' }] : []),
    ...(details.configs?.length ? [{ id: 'configuracoes' as const, label: 'Configurações' }] : []),
    ...(details.addons?.length ? [{ id: 'avulsos' as const, label: 'Tambores avulsos' }] : []),
    ...(details.finishes?.length || details.palette ? [{ id: 'acabamentos' as const, label: 'Acabamentos' }] : []),
  ];
  const [tab, setTab] = useState<TabId>(tabs[1]?.id ?? 'descricao');

  return (
    <section aria-label="Detalhes do produto" className="mt-14 border-t-2 border-ink pt-6">
      <div role="tablist" aria-label="Detalhes do produto" className="-mx-4 flex gap-1 overflow-x-auto px-4 scrollbar-hide md:mx-0 md:px-0">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`aba-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`painel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`min-h-11 flex-shrink-0 rounded-full px-4 text-sm font-bold uppercase tracking-wide transition ${
              tab === t.id ? 'bg-ink text-white' : 'text-ink-soft ring-1 ring-line hover:text-ink hover:ring-ink/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`painel-${tab}`} aria-labelledby={`aba-${tab}`} className="mt-6">
        {tab === 'descricao' && (
          <p className="max-w-[65ch] whitespace-pre-line leading-relaxed text-ink-soft">{description}</p>
        )}

        {tab === 'caracteristicas' && (
          <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
            {details.features!.map(f => (
              <li key={f.title} className="border-l-2 border-accent pl-4">
                <h3 className="font-display text-lg font-semibold uppercase leading-tight text-ink">{f.title}</h3>
                <p className="mt-1 max-w-[60ch] text-sm leading-relaxed text-ink-soft">{f.text}</p>
              </li>
            ))}
          </ul>
        )}

        {tab === 'ficha' && (
          <dl className="max-w-3xl divide-y divide-line rounded-xl bg-paper ring-1 ring-line">
            {details.specs!.map(s => (
              <div key={s.label} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
                <dt className="font-semibold text-ink-soft">{s.label}</dt>
                <dd className="text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {tab === 'configuracoes' && (
          <>
            <p className="mb-4 max-w-[65ch] text-sm text-ink-soft">
              {details.configs!.length > 1
                ? 'Cada configuração é um kit com tambores e tamanhos próprios. Escolha a sua e pergunte valor e cores pelo WhatsApp.'
                : 'Tambores e tamanhos que vêm neste kit.'}
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {details.configs!.map(c => (
                <li key={c.code} className="flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-line">
                  {c.image && (
                    <div className="relative aspect-[4/3] bg-white">
                      <SmartImage src={c.image} alt={`Configuração ${c.code}`} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-contain p-2" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-display text-xl font-semibold uppercase text-ink">{c.code}</h3>
                    <ul className="mt-2 flex-1 space-y-1 text-sm text-ink-soft">
                      {c.pieces.map(p => <li key={p}>{p}</li>)}
                    </ul>
                    {c.note && <p className="mt-2 text-xs text-ink-soft">{c.note}</p>}
                    {onPickConfig && (
                      <button
                        type="button"
                        onClick={() => onPickConfig(c.code)}
                        className="mt-4 min-h-11 rounded-md text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-ink/50"
                      >
                        Escolher esta configuração
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === 'avulsos' && (
          <>
            <p className="mb-4 max-w-[65ch] text-sm text-ink-soft">
              Tambores vendidos separadamente para ampliar o kit. Consulte disponibilidade e valor pelo WhatsApp.
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {details.addons!.map(a => (
                <li key={a.title} className="flex gap-4 rounded-xl bg-white p-4 ring-1 ring-line">
                  {a.image && (
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <SmartImage src={a.image} alt={a.title} fill sizes="96px" className="object-contain" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold uppercase leading-tight text-ink">{a.title}</h3>
                    <table className="mt-2 w-full text-sm">
                      <thead className="sr-only"><tr><th>Medida</th><th>Código</th></tr></thead>
                      <tbody>
                        {a.items.map(i => (
                          <tr key={i.code} className="border-t border-line first:border-0">
                            <td className="py-1 pr-3 text-ink">{i.size}</td>
                            <td className="py-1 text-right font-mono text-xs text-ink-soft">{i.code}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {a.note && <p className="mt-2 text-xs text-ink-soft">{a.note}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === 'acabamentos' && (
          <>
            {details.finishes?.length ? (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {details.finishes.map(f => {
                  const label = f.code ? `#${f.code} ${f.name}` : f.name;
                  const inner = (
                    <>
                      <span className={`relative block overflow-hidden rounded-lg bg-paper ${f.image ? 'aspect-square' : 'h-14'}`}>
                        {f.image ? (
                          <SmartImage src={f.image} alt="" fill sizes="(min-width: 1024px) 18vw, 45vw" className="object-contain p-1" />
                        ) : (
                          <span className="flex h-full items-center justify-center font-display text-xl font-semibold text-ink-soft/70">{f.code ? `#${f.code}` : ''}</span>
                        )}
                      </span>
                      <span className="mt-2 block text-sm leading-tight text-ink">{label}</span>
                    </>
                  );
                  return (
                    <li key={label}>
                      {onPickFinish ? (
                        <button type="button" onClick={() => onPickFinish(f.name)} className="block w-full rounded-lg p-1 text-left transition hover:bg-cream">
                          {inner}
                        </button>
                      ) : <div className="p-1">{inner}</div>}
                    </li>
                  );
                })}
              </ul>
            ) : null}
            {details.palette && (
              <div className="relative mt-6 aspect-[3/1] max-w-4xl">
                <SmartImage src={details.palette} alt="Paleta de cores" fill sizes="(min-width: 1024px) 896px, 100vw" className="object-contain" />
              </div>
            )}
            {details.finishesNote && <p className="mt-4 text-sm text-ink-soft">{details.finishesNote}</p>}
            <p className="mt-2 text-xs text-ink-soft">Cores podem variar conforme a tela. Confirme o acabamento com a loja.</p>
          </>
        )}
      </div>
    </section>
  );
}
