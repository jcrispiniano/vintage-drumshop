import { brandLabel } from '@/lib/brands';

/** Tamanhos em polegadas citados no nome: 'Clap Stack (11"/13"/15")' → '11/13/15"'. */
export function productSizes(name: string): string | null {
  const sizes = [...name.matchAll(/(\d{1,2}(?:[.,]\d)?)\s*(?:"|”|″|'')/g)].map(m => m[1].replace(',', '.'));
  const unique = [...new Set(sizes)];
  if (unique.length === 0 || unique.length > 3) return null;
  return `${unique.join('/')}"`;
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
  { id: 'dark', label: 'Dark', match: /\bdark\b/i },
  { id: 'brilhante', label: 'Brilhante', match: /\bbrillian|\bbright/i },
  { id: 'seco', label: 'Seco', match: /\bdry\b/i },
  { id: 'jazz', label: 'Jazz', match: /\bjazz\b/i },
  { id: 'trash', label: 'Trash', match: /\btrash\b/i },
] as const;

export type TimbreId = (typeof TIMBRES)[number]['id'];

export function productTimbres(name: string): TimbreId[] {
  return TIMBRES.filter(t => t.match.test(name)).map(t => t.id);
}
