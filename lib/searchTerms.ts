/**
 * Sinônimos de busca: o mesmo produto tem nomes diferentes em português e em inglês
 * (chimbal = hi-hat, baqueta = stick, caixa = snare...). A busca do site troca cada
 * apelido por uma chave comum, então "hi hat" acha "Chimbal" e vice-versa.
 *
 * Cada grupo: a chave (usada internamente) e todas as formas que o cliente pode digitar.
 * Formas com várias palavras vêm antes das curtas para casarem primeiro.
 */
const SYNONYM_GROUPS: { key: string; terms: string[]; aliases?: string[] }[] = [
  { key: 'chimbal', terms: ['chimbal', 'chimbais', 'chimabl', 'hi hat', 'hi hats', 'hihat', 'hihats', 'hat'], aliases: ['Hi-Hat', 'Chimbal'] },
  { key: 'bateria', terms: ['kit de bateria', 'drum kit', 'drum set', 'drumkit', 'drumset', 'bateria', 'baterias', 'drums'], aliases: ['Bateria', 'Drum kit'] },
  { key: 'prato', terms: ['prato', 'pratos', 'cymbal', 'cymbals', 'cimbalo', 'cimbalos'], aliases: ['Prato', 'Cymbal'] },
  { key: 'ride', terms: ['prato de conducao', 'ride', 'rides', 'conducao'], aliases: ['Ride', 'Prato de condução'] },
  { key: 'crash', terms: ['prato de ataque', 'crash', 'crashes', 'ataque'], aliases: ['Crash', 'Prato de ataque'] },
  { key: 'set', terms: ['set de pratos', 'kit de pratos', 'cymbal set', 'cymbal pack', 'box set', 'set', 'kit', 'pack', 'conjunto'], aliases: ['Set de pratos', 'Kit de pratos', 'Cymbal set'] },
  { key: 'baqueta', terms: ['baqueta', 'baquetas', 'drumstick', 'drumsticks', 'stick', 'sticks'], aliases: ['Baqueta', 'Drumstick'] },
  { key: 'vassourinha', terms: ['vassourinha', 'vassourinhas', 'vassoura', 'vassouras', 'brush', 'brushes', 'probrush'], aliases: ['Vassourinha', 'Brush'] },
  { key: 'rod', terms: ['hot rod', 'hot rods', 'rod', 'rods', 'bamboo'], aliases: ['Rods', 'Hot rod'] },
  { key: 'mallet', terms: ['mallet', 'mallets', 'macaneta', 'macanetas', 'baqueta de feltro'], aliases: ['Mallet', 'Maçaneta'] },
  { key: 'caixa', terms: ['snare drum', 'caixa de bateria', 'tarola', 'snare', 'snares', 'caixa', 'caixas'], aliases: ['Caixa', 'Snare'] },
  { key: 'pele', terms: ['drumhead', 'drumheads', 'pele', 'peles', 'head', 'heads'], aliases: ['Pele', 'Drumhead'] },
  { key: 'bumbo', terms: ['bass drum', 'kick drum', 'bumbo', 'bumbos', 'kick'], aliases: ['Bumbo', 'Kick'] },
  { key: 'surdo', terms: ['floor tom', 'surdo', 'surdos'], aliases: ['Surdo', 'Floor tom'] },
  { key: 'estante', terms: ['estante', 'estantes', 'stand', 'stands', 'pedestal'], aliases: ['Estante', 'Stand'] },
  { key: 'banco', terms: ['banco', 'banquinho', 'throne'], aliases: ['Banco', 'Throne'] },
  { key: 'bag', terms: ['bag', 'bags', 'case', 'capa', 'bolsa', 'semi case', 'hard case'] },
  { key: 'afinador', terms: ['afinador', 'afinadores', 'tuner', 'tune bot', 'tunebot'], aliases: ['Afinador', 'Tuner'] },
  { key: 'efeito', terms: ['efeito', 'efeitos', 'effect', 'effects', 'stack', 'stacks'], aliases: ['Efeito', 'Stack'] },
  { key: 'pad', terms: ['pad de estudo', 'practice pad', 'pad de treino', 'pad', 'pads', 'estudo'], aliases: ['Pad de estudo', 'Practice pad'] },
  { key: 'chave', terms: ['chave de afinacao', 'chave de bateria', 'drum key', 'tuning key', 'chave', 'key'], aliases: ['Chave de afinação', 'Drum key'] },
  { key: 'piccolo', terms: ['piccolo', 'picolo', 'caixa piccolo'] },
  { key: 'splash', terms: ['splash', 'splashes'] },
  { key: 'china', terms: ['china', 'chinas', 'chinese'] },
  { key: 'tom', terms: ['tom tom', 'tons', 'tom', 'toms'] },
  { key: 'pedal', terms: ['pedal', 'pedais', 'pedal duplo', 'double pedal'] },
  { key: 'martelado', terms: ['martelado', 'martelada', 'hammered'] },
  { key: 'cobre', terms: ['cobre', 'copper'] },
  { key: 'latao', terms: ['latao', 'brass'] },
  { key: 'aluminio', terms: ['aluminio', 'aluminum', 'aluminium'] },
  { key: 'cromado', terms: ['cromado', 'cromada', 'chrome', 'cromo'] },
  { key: 'madreperola', terms: ['madreperola', 'pearl finish', 'perolado'] },
  { key: 'fosco', terms: ['fosco', 'fosca', 'matte', 'matt'] },
  { key: 'preto', terms: ['preto', 'preta', 'black'] },
  { key: 'branco', terms: ['branco', 'branca', 'white'] },
  { key: 'verde', terms: ['verde', 'green'] },
  { key: 'brilhante', terms: ['brilhante', 'brilliant', 'bright', 'polido'] },
  { key: 'escuro', terms: ['escuro', 'dark'] },
  { key: 'seco', terms: ['seco', 'dry'] },
  { key: 'cajon', terms: ['cajon', 'cajons'] },
];

/** Minúsculas, sem acento, hífen e pontuação viram espaço: "Hi-Hat" → "hi hat" */
export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Palavras que não ajudam a achar nada ("caixa DE bateria", "drum" sozinho em "snare drum")
const STOPWORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'para', 'pra', 'com', 'em', 'the', 'of', 'for', 'and', 'drum', 'drums']);

/**
 * O termo aparece como palavra no texto. Plural e medidas contam ("brush" acha
 * "Brushes", "14" acha "14x5"), mas parte de outra palavra não ("black" não acha
 * "Blackman"). Com `prefix`, vale o começo da palavra: é o termo que o cliente
 * ainda está digitando ("chim" já mostra os chimbais).
 */
export function hasWord(normalized: string, term: string, prefix = false): boolean {
  const end = prefix ? '' : '(?=$|\\s|x?\\d|s(?:$|\\s)|es(?:$|\\s))';
  return new RegExp(`(?:^|\\s)${escape(term)}${end}`).test(normalized);
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Uma expressão por grupo, com as formas mais longas primeiro e palavra inteira
const GROUP_PATTERNS = SYNONYM_GROUPS.map(g => ({
  key: g.key,
  pattern: new RegExp(`\\b(?:${[...g.terms].sort((a, b) => b.length - a.length).map(escape).join('|')})\\b`, 'g'),
}));

/** Chaves de sinônimo presentes num texto já normalizado */
export function synonymKeys(normalized: string): Set<string> {
  const keys = new Set<string>();
  for (const { key, pattern } of GROUP_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(normalized)) keys.add(key);
  }
  return keys;
}

/**
 * Quebra a busca em termos. Um apelido de várias palavras ("hi hat", "set de pratos")
 * vira um termo só, para não exigir "hi" e "hat" separados.
 */
export type SearchTerm = { text: string; key?: string; prefixKeys?: string[] };

export function searchTerms(query: string): SearchTerm[] {
  let rest = ` ${normalizeSearch(query)} `;
  const terms: SearchTerm[] = [];
  for (const { key, pattern } of GROUP_PATTERNS) {
    pattern.lastIndex = 0;
    rest = rest.replace(pattern, match => {
      terms.push({ text: match, key });
      return ' ';
    });
  }
  for (const word of rest.split(/\s+/)) {
    if (word.length >= 2 && !STOPWORDS.has(word)) terms.push({ text: word });
  }
  // Última palavra pela metade ("snar", "drumst"): vale também para os sinônimos que começam assim
  const last = terms[terms.length - 1];
  const typing = normalizeSearch(query).split(' ').pop() ?? '';
  if (last && !last.key && last.text === typing && typing.length >= 3) {
    const keys = SYNONYM_GROUPS.filter(g => g.terms.some(t => t.startsWith(typing))).map(g => g.key);
    if (keys.length) last.prefixKeys = keys;
  }
  return terms;
}

/** Outros nomes do produto, para mostrar ao cliente e ao Google ("Também chamado de") */
export function productAliases(name: string): string[] {
  const normalized = normalizeSearch(name);
  // Singular e plural contam como a mesma palavra ("pratos" já cobre "Prato")
  const stem = (w: string) => w.replace(/s$/, '');
  const own = new Set(normalized.split(' ').map(stem));
  const aliases: string[] = [];
  for (const g of SYNONYM_GROUPS) {
    if (!g.aliases) continue;
    const pattern = GROUP_PATTERNS.find(p => p.key === g.key)!.pattern;
    pattern.lastIndex = 0;
    if (!pattern.test(normalized)) continue;
    // Só os nomes que o próprio título ainda não usa
    for (const alias of g.aliases) {
      const words = normalizeSearch(alias).split(' ');
      if (!words.every(w => own.has(stem(w)))) aliases.push(alias);
    }
  }
  return [...new Set(aliases)];
}
