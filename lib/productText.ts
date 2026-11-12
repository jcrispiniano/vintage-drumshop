import { brandLabel } from '@/lib/brands';
import { hasWord, normalizeSearch, searchTerms, synonymKeys } from '@/lib/searchTerms';

/** Tamanhos em polegadas citados no nome: 'Clap Stack (11"/13"/15")' → '11/13/15"'. */
export function productSizes(name: string): string | null {
  // Caixas e tambores: diâmetro × profundidade ("14×6,5")
  const dims = name.match(/(\d{1,2}(?:[.,]\d)?)\s*[x×]\s*(\d{1,2}(?:[.,]\d)?)/i);
  if (dims) return `${dims[1]}×${dims[2]}"`;
  const sizes = [...name.matchAll(/(\d{1,2}(?:[.,]\d)?)\s*(?:"|”|″|'')/g)].map(m => m[1].replace(',', '.'));
  const unique = [...new Set(sizes)];
  if (unique.length === 0) {
    // Sem aspas: "Chimbal Turk 14", "Turk Flat Ride 22" (tamanho no fim do nome)
    const trailing = trailingInches(name);
    return trailing ? `${trailing}"` : null;
  }
  if (unique.length > 3) return null;
  return `${unique.join('/')}"`;
}

function trailingInches(name: string): number | null {
  const m = name.trim().match(/\s(\d{1,2})$/);
  const n = m ? Number(m[1]) : NaN;
  return n >= 6 && n <= 24 ? n : null;
}

/** Diâmetro principal em polegadas, para ordenar e filtrar por tamanho. */
export function productSizeValue(name: string): number | null {
  const dims = name.match(/(\d{1,2}(?:[.,]\d)?)\s*[x×]\s*\d/i);
  if (dims) return Number(dims[1].replace(',', '.'));
  const inch = name.match(/(\d{1,2}(?:[.,]\d)?)\s*(?:"|”|″|'')/);
  if (inch) return Number(inch[1].replace(',', '.'));
  return trailingInches(name);
}

/**
 * Pontua o produto para a busca: nome pesa mais que marca/categoria, que pesam mais
 * que a descrição. Sinônimos contam como a mesma palavra ("hi hat" acha "Chimbal",
 * "baqueta" acha "stick"), e acento, hífen e maiúsculas não importam.
 */
export function searchScore(p: { name: string; brand?: string; category: string; description: string }, query: string): number {
  const terms = searchTerms(query);
  if (terms.length === 0) return 0;
  const name = normalizeSearch(p.name);
  const meta = normalizeSearch(`${p.brand ?? ''} ${brandLabel(p.brand ?? '')} ${p.category}`);
  const desc = normalizeSearch(p.description);
  const nameKeys = synonymKeys(name);
  const metaKeys = synonymKeys(meta);
  let score = 0;
  terms.forEach((t, i) => {
    if (score < 0) return;
    // A última palavra pode estar pela metade (o cliente ainda está digitando)
    const prefix = !t.key && i === terms.length - 1;
    const keyIn = (keys: Set<string>) => (t.key && keys.has(t.key)) || !!t.prefixKeys?.some(k => keys.has(k));
    if (hasWord(name, t.text, prefix) || keyIn(nameKeys)) score += 10;
    else if (hasWord(meta, t.text, prefix) || keyIn(metaKeys)) score += 4;
    else if (hasWord(desc, t.text, prefix)) score += 1;
    else score = -1; // todos os termos precisam aparecer em algum lugar
  });
  if (score <= 0) return 0;
  if (name.includes(normalizeSearch(query))) score += 5;
  return score;
}

/** Nome sem a marca, que já aparece na linha acima do título no card. */
export function shortTitle(name: string, brand: string): string {
  const label = brandLabel(brand);
  if (!label || label.length < 3) return name;
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const short = name.replace(new RegExp(`\\s*${escaped}\\s*`, 'i'), ' ').replace(/\s{2,}/g, ' ').trim();
  return short.length >= 6 ? short : name;
}

/**
 * Timbres citados no próprio nome do prato (Dark, Brilliant, Dry, Jazz...).
 * Vêm só do nome, nunca de inferência, para o filtro não prometer o que o produto não diz.
 */
export const TIMBRES = [
  { id: 'dark', label: 'Dark', hint: 'grave, escuro e quente', match: /\bdark\b/i },
  { id: 'brilhante', label: 'Brilhante', hint: 'agudo, cortante e projetado', match: /\bbrillian|\bbright/i },
  { id: 'seco', label: 'Seco', hint: 'ataque curto, pouca sustentação', match: /\bdry\b/i },
  { id: 'jazz', label: 'Jazz', hint: 'macio e cheio de nuances', match: /\bjazz\b/i },
  { id: 'trash', label: 'Trash', hint: 'sujo e explosivo, para efeitos', match: /\btrash\b/i },
] as const;

export type TimbreId = (typeof TIMBRES)[number]['id'];

export function productTimbres(name: string): TimbreId[] {
  return TIMBRES.filter(t => t.match.test(name)).map(t => t.id);
}
