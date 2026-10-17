const BRAND_LABELS: Record<string, string> = {
  istanbul: 'Istanbul Agop',
  wincent: 'Wincent',
  dynabeat: 'Dynabeat',
  torelli: 'Torelli',
  pinguim: 'Pinguim',
  dw: 'DW',
  rockkey: 'RockKey',
};

/** Marca genérica do cadastro ("outro") não deve aparecer para o cliente. */
export function isGenericBrand(brand: string) {
  return !brand || brand === 'outro';
}

export function brandLabel(brand: string) {
  return BRAND_LABELS[brand] ?? brand.charAt(0).toUpperCase() + brand.slice(1);
}
