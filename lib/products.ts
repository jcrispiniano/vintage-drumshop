export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  description: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Istanbul Agop Traditional Clap Stack Set (11"/13"/15") CSFX',
    category: 'pratos',
    brand: 'istanbul',
    price: 2999.00,
    image: '/vintage-drumshop/produtos/pratos/clap-stack-set.jpg',
    badge: 'Effect',
    description: 'O Istanbul Agop Traditional Clap Stack Set é uma coleção indispensável para bateristas que buscam um som autêntico e versátil. Disponível em três tamanhos — 11", 13" e 15" — este conjunto é ideal para diversos estilos musicais, desde o jazz sutil até o rock enérgico. Com design clássico e acabamento de alta qualidade, oferece um som vibrante, cheio de nuances e caráter. A construção artesanal e as técnicas de martelagem especializadas proporcionam uma resposta rápida e um ataque explosivo.',
    featured: true
  },
  {
    id: 2,
    name: 'Prato Istanbul Agop Xist Dry Dark Brilliant Crash 19"',
    category: 'pratos',
    brand: 'istanbul',
    price: 2099.00,
    image: '/vintage-drumshop/produtos/pratos/crash-19-xist-dry-dark-brilliant.jpg',
    badge: 'Novo',
    description: 'O Prato Istanbul Agop Xist Dry Dark Brilliant Crash 19" possui timbre grave, dark e trash, mas com um ataque brilhante e preciso. Prato com espessura fina, que ao atacado possui decay curto, mas cortante. Pelo seu martelamento profundo, pode ser até usado como ride quando tocado mais leve. As linhas "Dry Dark" possuem características sonoras mais particulares, inclinação para ritmos mais modernos, como Worship, Drum N\' Bass e estilos que envolvem misturas com elementos eletrônicos.',
    featured: true
  },
  {
    id: 3,
    name: 'Prato Istanbul Agop "Joey Waronker" Signature Ride 24"',
    category: 'pratos',
    brand: 'istanbul',
    price: 5500.00,
    image: '/vintage-drumshop/produtos/pratos/ride-24-joey-waronker.jpg',
    badge: 'Signature',
    description: 'Prato Ride 24" assinado por Joey Waronker, baterista conhecido por seu trabalho com Beck, R.E.M. e Atoms for Peace. Desenvolvido em colaboração direta com o artista, este ride oferece um som versátil e complexo, ideal para uma ampla gama de estilos musicais. Com acabamento tradicional e martelamento artesanal característico da Istanbul Agop, proporciona definição cristalina e sustain controlado.',
    featured: true
  },
  {
    id: 2,
    name: 'Crash Istanbul Agop Power Brilliant 22"',
    category: 'pratos',
    brand: 'istanbul',
    price: 2999.00,
    image: '🎵',
    badge: 'Novo',
    description: 'Prato crash com projeção e brilho excepcional',
    featured: true
  },
  {
    id: 5,
    name: 'Baqueta Wincent 5BXL Hickory',
    category: 'baquetas',
    brand: 'wincent',
    price: 120.00,
    oldPrice: 149.90,
    image: '🥢',
    badge: 'Promoção',
    description: 'Baqueta profissional 5B extra longa',
    featured: true
  },
  {
    id: 9,
    name: 'Caixa Pinguim Real Alumínio 14x6,5"',
    category: 'caixas',
    brand: 'pinguim',
    price: 2099.00,
    image: '📦',
    badge: 'Destaque',
    description: 'Caixa profissional em alumínio com som definido',
    featured: true
  },
  {
    id: 12,
    name: 'Bateria Tama Superstar Classic 5 Peças',
    category: 'baterias',
    brand: 'tama',
    price: 8999.00,
    image: '🥁',
    badge: 'Novo',
    description: 'Kit completo profissional 5 peças',
    featured: true
  },
  {
    id: 15,
    name: 'Pedal Duplo DW 9002',
    category: 'ferragens',
    brand: 'dw',
    price: 4999.00,
    image: '🔧',
    badge: 'Premium',
    description: 'Pedal duplo profissional de alta performance',
    featured: true
  },
];

export const categories = [
  { id: 'baterias', name: 'Baterias' },
  { id: 'pratos', name: 'Pratos' },
  { id: 'caixas', name: 'Caixas' },
  { id: 'peles', name: 'Peles' },
  { id: 'baquetas', name: 'Baquetas' },
  { id: 'acessorios', name: 'Acessórios' },
  { id: 'ferragens', name: 'Ferragens' },
  { id: 'bags', name: 'Bags, Cases e Capas' },
  { id: 'pecas', name: 'Peças de Reparo e Manutenção' },
  { id: 'cajon', name: 'Cajón' },
  { id: 'estudo', name: 'Estudo' },
  { id: 'kids', name: 'Kids Musicalização Infantil' },
  { id: 'livros', name: 'Livros, DVDs e CDs' },
];

export function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export const contactInfo = {
  phone: '+55 11 94739-7347',
  phoneFormatted: '(11) 94739-7347',
  whatsapp: 'https://wa.me/5511947397347',
  email: 'drumshopvintage@gmail.com',
  instagram: 'https://www.instagram.com/vintage.drumshop',
  instagramHandle: '@vintage.drumshop',
  address: 'São Paulo - SP',
  hours: 'Seg-Sex: 9h-18h | Sáb: 9h-13h'
};