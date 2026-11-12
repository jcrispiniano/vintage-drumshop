import { TIMBRES, productSizes, productTimbres } from '@/lib/productText';
import { brandLabel, isGenericBrand } from '@/lib/brands';
import { productAliases } from '@/lib/searchTerms';

/**
 * Tipo, série e ficha técnica dos pratos, tirados só do nome do produto
 * (nunca inferidos), para o filtro, o menu e a página do produto não prometerem
 * o que o produto não diz.
 */

export type CymbalType = 'sets' | 'crash' | 'ride' | 'hihat' | 'effects';

export const CYMBAL_TYPE_LABELS: Record<CymbalType, string> = {
  sets: 'Set de pratos',
  crash: 'Crash',
  ride: 'Ride',
  hihat: 'Chimbal / Hi-Hat',
  effects: 'Efeitos e stacks',
};

export function cymbalType(name: string): CymbalType {
  const n = name.toLowerCase();
  // Sets primeiro: o nome do set cita os pratos que vêm nele
  if (/\b(kit|set) de pratos\b/.test(n)) return 'sets';
  if (n.includes('crash')) return 'crash';
  if (n.includes('ride')) return 'ride';
  if (n.includes('hi-hat') || n.includes('chimbal') || n.includes('chimabl')) return 'hihat';
  return 'effects';
}

/** Linhas da Istanbul Agop, da mais específica para a mais geral. */
export const CYMBAL_SERIES = [
  { id: 'xist-ion', label: 'Xist Ion', match: /\bxist\s+ion\b/i },
  { id: 'xist', label: 'Xist', match: /\bxist\b/i },
  { id: '30th', label: '30th Anniversary', match: /\b30th anniversary\b/i },
  { id: 'traditional', label: 'Traditional', match: /\btraditional\b/i },
  { id: 'special-jazz', label: 'Special Jazz Edition', match: /special jazz/i },
  { id: 'sultan', label: 'Sultan', match: /\bsultan\b/i },
  { id: 'turk', label: 'Turk', match: /\bturk\b/i },
  { id: 'artistas', label: 'Assinaturas de artistas', match: /joey waronker|mel lewis|cindy blackman|aaron sterling|idris muhammad/i },
  { id: 'signature', label: 'Agop Signature', match: /\bsignature\b/i },
  { id: 'art', label: 'Art', match: /\bart\b/i },
] as const;

export type SeriesId = (typeof CYMBAL_SERIES)[number]['id'];

export function cymbalSeries(name: string) {
  return CYMBAL_SERIES.find(s => s.match.test(name)) ?? null;
}

const FINISHES = [
  { match: /\bdry dark brilliant\b/i, label: 'Dry Dark Brilliant (seco, com faixas polidas)' },
  { match: /\bbrilliant\b/i, label: 'Brilliant (polido, espelhado)' },
  { match: /\braw\b/i, label: 'Raw (sem polimento)' },
  { match: /\bnatural\b/i, label: 'Natural' },
];

export type Spec = { label: string; value: string };

/** Ficha técnica para a página do produto; só linhas que o nome sustenta. */
export function productSpecs(p: { name: string; brand: string; category: string }): Spec[] {
  const specs: Spec[] = [];
  if (!isGenericBrand(p.brand)) specs.push({ label: 'Marca', value: brandLabel(p.brand) });
  if (p.category === 'pratos') {
    const series = cymbalSeries(p.name);
    if (series) specs.push({ label: 'Série', value: series.label });
    specs.push({ label: 'Tipo', value: CYMBAL_TYPE_LABELS[cymbalType(p.name)] });
  }
  const size = productSizes(p.name);
  if (size) specs.push({ label: p.category === 'pratos' && size.includes('/') ? 'Tamanhos' : 'Tamanho', value: size.replace(/\//g, ' / ') });
  if (p.category === 'pratos') {
    const finish = FINISHES.find(f => f.match.test(p.name));
    if (finish) specs.push({ label: 'Acabamento', value: finish.label });
    const timbres = productTimbres(p.name);
    if (timbres.length) {
      specs.push({
        label: 'Som',
        value: timbres.map(id => {
          const t = TIMBRES.find(x => x.id === id)!;
          return `${t.label} (${t.hint})`;
        }).join('; '),
      });
    }
  }
  if (/\+\s*bag\b/i.test(p.name)) specs.push({ label: 'Inclui', value: 'Bag para transporte' });
  // Outros nomes do mesmo produto (ex.: chimbal = hi-hat): ajudam o cliente e o Google
  const aliases = productAliases(p.name);
  if (aliases.length) specs.push({ label: 'Também chamado', value: aliases.join(', ') });
  return specs;
}

/** Busca no YouTube pelo som do produto (a loja ainda não tem vídeos próprios). */
export function soundSearchUrl(name: string): string {
  const q = name.replace(/^(prato|chimbal|chimabl|crash|set de pratos)\s+/i, '').replace(/["”″]/g, '').replace(/\+\s*bag/i, '');
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${q} sound demo`)}`;
}
