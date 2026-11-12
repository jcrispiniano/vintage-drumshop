import type { Metadata } from 'next'
import { absoluteUrl, type Product } from '@/lib/products'
import { getAllProducts } from '@/lib/db'

/**
 * SEO das páginas de lista (categorias, marcas e institucionais): título e descrição
 * com os termos que as pessoas buscam no Google (inclusive em inglês), endereço
 * canônico e quais produtos entram na lista estruturada da página.
 */
export type Section = {
  path: string
  name: string
  title: string
  description: string
  match?: (p: Product) => boolean
  /** Página sem valor para a busca (carrinho, favoritos, resultado de busca) */
  noindex?: boolean
}

const cat = (id: string) => (p: Product) => p.category === id

export const SECTIONS: Record<string, Section> = {
  pratos: {
    path: '/pratos', name: 'Pratos', match: cat('pratos'),
    title: 'Pratos Istanbul Agop: chimbal (hi-hat), crash, ride e sets | Vintage Drum Shop',
    description: 'Pratos (cymbals) Istanbul Agop feitos à mão na Turquia: chimbal / hi-hat, crash, ride, splash, china e sets de pratos Xist, Traditional e 30th Anniversary. 10% no Pix ou 10x sem juros.',
  },
  baquetas: {
    path: '/baquetas', name: 'Baquetas', match: cat('baquetas'),
    title: 'Baquetas Wincent e Dynabeat (drumsticks) | Vintage Drum Shop',
    description: 'Baquetas (drumsticks) Wincent e Dynabeat 5A, 5B, 7A e 2B, vassourinhas (brushes), rods e mallets. Revenda oficial em São Paulo, envio para todo o Brasil.',
  },
  caixas: {
    path: '/caixas', name: 'Caixas', match: cat('caixas'),
    title: 'Caixas de bateria (snare) Pinguim | Vintage Drum Shop',
    description: 'Caixas de bateria (snare drums) Pinguim em alumínio, latão e cobre martelado, de 13" a 14". 10% no Pix ou 10x sem juros, envio para todo o Brasil.',
  },
  baterias: {
    path: '/baterias', name: 'Baterias', match: cat('baterias'),
    title: 'Baterias acústicas DW e Pinguim (drum kits) | Vintage Drum Shop',
    description: 'Baterias acústicas completas (drum kits) DW e Pinguim: bumbo, tons, surdo e caixa. Compre com 10% no Pix ou 10x sem juros.',
  },
  acessorios: {
    path: '/acessorios', name: 'Acessórios', match: cat('acessorios'),
    title: 'Acessórios para bateria: afinador Tune-bot e chave | Vintage Drum Shop',
    description: 'Acessórios para bateria: afinador eletrônico Tune-bot, chave de afinação RockKey e mais. Envio para todo o Brasil.',
  },
  peles: {
    path: '/peles', name: 'Peles', match: cat('peles'),
    title: 'Peles de bateria (drumheads) sob encomenda | Vintage Drum Shop',
    description: 'Peles de bateria (drumheads) para caixa, tons, surdo e bumbo, sob encomenda. Fale com a loja pelo WhatsApp.',
  },
  estudo: {
    path: '/estudo', name: 'Estudo', match: cat('estudo'),
    title: 'Pad de estudo (practice pad) Wincent | Vintage Drum Shop',
    description: 'Pad de estudo (practice pad) Wincent para treinar técnica em casa. Envio para todo o Brasil.',
  },
  wincent: {
    path: '/wincent', name: 'Wincent', match: p => p.brand === 'wincent',
    title: 'Baquetas Wincent: 5A, 5B, 7A, brushes e mallets | Vintage Drum Shop',
    description: 'Baquetas Wincent originais da Suécia: 5A, 5B, 7A, Rock, SD, Precision, vassourinhas Pro Brushes, rods e mallets. Revenda oficial em São Paulo.',
  },
  dynabeat: {
    path: '/dynabeat', name: 'Dynabeat', match: p => p.brand === 'dynabeat',
    title: 'Baquetas Dynabeat 5A, 5B, 7A e 2B | Vintage Drum Shop',
    description: 'Baquetas Dynabeat (by Wincent) em hickory: 5A, 5B, 7A e 2B. Ótimo custo-benefício, envio para todo o Brasil.',
  },
  vassourinhas: {
    path: '/vassourinhas', name: 'Vassourinhas', match: p => /brush|rod/i.test(p.name),
    title: 'Vassourinhas (brushes) e rods Wincent | Vintage Drum Shop',
    description: 'Vassourinhas de bateria (brushes) Wincent Pro Brushes e rods de bambu para jazz, bossa e acústico.',
  },
  mallets: {
    path: '/mallets', name: 'Mallets', match: p => /mallet/i.test(p.name),
    title: 'Mallets Wincent (baqueta de feltro) | Vintage Drum Shop',
    description: 'Mallets Wincent (baquetas de feltro) para pratos e tons: Dual Soft e Swoosh Soft.',
  },
  ferragens: { path: '/ferragens', name: 'Ferragens', match: cat('ferragens'), title: 'Ferragens para bateria (estantes e pedais) | Vintage Drum Shop', description: 'Ferragens para bateria: estantes, pedais e suportes, sob encomenda.' },
  bags: { path: '/bags', name: 'Bags', match: cat('bags'), title: 'Bags, cases e capas para bateria e pratos | Vintage Drum Shop', description: 'Bags, cases e capas para pratos, caixas e baquetas.' },
  pecas: { path: '/pecas', name: 'Peças', match: cat('pecas'), title: 'Peças de reparo para bateria | Vintage Drum Shop', description: 'Peças de reparo e manutenção para bateria, sob encomenda.' },
  cajon: { path: '/cajon', name: 'Cajón', match: cat('cajon'), title: 'Cajón | Vintage Drum Shop', description: 'Cajóns e acessórios, sob encomenda.' },
  kids: { path: '/kids', name: 'Kids', match: cat('kids'), title: 'Bateria infantil | Vintage Drum Shop', description: 'Baterias e acessórios infantis, sob encomenda.' },
  livros: { path: '/livros', name: 'Livros', match: cat('livros'), title: 'Livros e métodos de bateria | Vintage Drum Shop', description: 'Livros e métodos para estudo de bateria.' },
  'politica-de-privacidade': { path: '/politica-de-privacidade', name: 'Política de privacidade', title: 'Política de privacidade | Vintage Drum Shop', description: 'Como a Vintage Drum Shop trata os seus dados.' },
  'termos-de-uso': { path: '/termos-de-uso', name: 'Termos de uso', title: 'Termos de uso | Vintage Drum Shop', description: 'Termos de uso do site da Vintage Drum Shop.' },
  'trocas-e-devolucoes': { path: '/trocas-e-devolucoes', name: 'Trocas e devoluções', title: 'Trocas e devoluções | Vintage Drum Shop', description: 'Prazos e condições para trocas e devoluções na Vintage Drum Shop.' },
  carrinho: { path: '/carrinho', name: 'Carrinho', noindex: true, title: 'Seu carrinho | Vintage Drum Shop', description: 'Revise seu pedido e finalize pelo WhatsApp com desconto no Pix.' },
  favoritos: { path: '/favoritos', name: 'Favoritos', noindex: true, title: 'Favoritos | Vintage Drum Shop', description: 'Produtos que você guardou para comparar.' },
  busca: { path: '/busca', name: 'Busca', noindex: true, title: 'Busca | Vintage Drum Shop', description: 'Resultados da busca na Vintage Drum Shop.' },
}

export function sectionMetadata(id: keyof typeof SECTIONS): Metadata {
  const s = SECTIONS[id]
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: s.path },
    openGraph: { title: s.title, description: s.description, url: s.path, siteName: 'Vintage Drum Shop', locale: 'pt_BR', type: 'website' },
    ...(s.noindex && { robots: { index: false, follow: true } }),
  }
}

/**
 * Foto que representa a lista no Google e nas redes (og:image): a de um produto
 * disponível da própria categoria, em vez do logo genérico do site.
 */
export async function sectionImage(id: keyof typeof SECTIONS): Promise<string | null> {
  const s = SECTIONS[id]
  if (!s.match) return null
  const items = (await getAllProducts()).filter(s.match).filter(p => p.image && !p.image.includes('placeholder'))
  const pick = items.find(p => !p.soldOut && p.featured) ?? items.find(p => !p.soldOut) ?? items[0]
  return pick ? absoluteUrl(pick.image) : null
}

export async function sectionMetadataWithImage(id: keyof typeof SECTIONS): Promise<Metadata> {
  const base = sectionMetadata(id)
  const image = await sectionImage(id)
  if (!image) return base
  const s = SECTIONS[id]
  return {
    ...base,
    openGraph: { ...base.openGraph, images: [{ url: image, alt: s.name }] },
    twitter: { card: 'summary_large_image', title: s.title, description: s.description, images: [image] },
  }
}
