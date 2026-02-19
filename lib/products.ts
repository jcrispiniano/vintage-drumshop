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
    description: 'As linhas "Dry Dark" possuem características sonoras mais particulares, inclinação para ritmos mais modernos, como Worship, Drum N\' Bass e estilos que envolvem misturas com elementos eletrônicos. O Prato Istanbul Agop Xist Dry Dark Brilliant Crash 19" possui timbre grave, dark e trash, mas com um ataque brilhante e preciso. Prato com espessura fina, que ao atacado possui decay curto, mas cortante. Pelo seu martelamento profundo, pode ser até usado como ride quando tocado mais leve. É um dos queridinhos da marca. Cada prato é feito à mão, garantindo durabilidade e sonoridade exclusiva.',
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
    description: 'O Prato Istanbul Agop "Joey Waronker" Signature Ride 24" é projetado para bateristas que buscam um som distintivo e poderoso. Com design elegante e acabamento impecável, oferece um som rico e profundo, perfeito para diversos estilos musicais, desde o jazz sofisticado até o rock enérgico. Sua construção artesanal e técnicas de martelagem especializadas garantem uma resposta rápida e um ataque impressionante. Desenvolvida para atender às exigências de músicos de alto nível, a série Signature combina tradição e inovação.',
    featured: true
  },
  {
    id: 4,
    name: 'Prato Istanbul Agop Xist Ion Dark Trash 19"',
    category: 'pratos',
    brand: 'istanbul',
    price: 2099.00,
    image: '/vintage-drumshop/produtos/pratos/trash-19-xist-ion-dark.jpg',
    badge: 'Effect',
    description: 'A série XIST é a que possui mais modelos dentre as linhas da Istanbul Agop. Isso significa que as possibilidades que você pode alcançar com esses pratos não têm fim. Todos os pratos da série são feitos sob técnicas modernas de produção combinadas com processos tradicionais de fabricação de pratos manuais que oferecem aos bateristas uma seleção diversificada de sons, do clássico ao inovador. O Prato Istanbul Agop XIST "ION" Dark Trash 19" tem como característica principal sua complexidade que é diferente de todos os outros pratos da série. Possui resposta rápida ao toque e decay curto, com timbre grave e "trash". Sua complexidade permite que o baterista também possa usá-lo como ride, desde que toque de forma mais suave.',
    featured: true
  },
  {
    id: 5,
    name: 'Chimbal Istanbul Agop Xist Dry Dark Brilliant Hi-Hat 15"',
    category: 'pratos',
    brand: 'istanbul',
    price: 2799.00,
    image: '/vintage-drumshop/produtos/pratos/hihat-15-xist-dry-dark-brilliant.jpg',
    badge: 'Premium',
    description: 'As linhas "ION", "Dry Dark" e "Dry Dark Brilliant" possuem características sonoras mais particulares, com inclinação para ritmos mais modernos, como Worship, Drum N\' Bass e estilos que envolvem misturas com elementos eletrônicos. Têm timbres com corte rápido e decay curto, além de tonalidade mais grave e "trash". O Chimbal Istanbul Agop Xist Dry Dark Brilliant Hi-Hat 15" possui timbre grave, dark e trash, mas com um ataque brilhante e preciso. Prato "top" muito fino, combinado com um prato "bottom" médio-pesado, que também soa muito bem usado como stack. Quando não emparelhados, o prato superior cria um crash explosivo, porém seco.',
    featured: true
  },
  {
    id: 6,
    name: 'Prato Istanbul Agop "Special Jazz Edition" Ride 24"',
    category: 'pratos',
    brand: 'istanbul',
    price: 5699.00,
    image: '/vintage-drumshop/produtos/pratos/ride-24-special-jazz.jpg',
    badge: 'Premium',
    description: 'O Prato Istanbul Agop "Special Jazz Edition" Ride 24" é uma edição especial desenvolvida especificamente para bateristas de jazz que buscam um som autêntico e versátil. Liga Bronze B20, conhecida por sua durabilidade e qualidade sonora superior. Acabamento tradicional, com martelamento artesanal e lathing refinado, conferindo um visual clássico e sonoridade autêntica. Produção feita à mão na Turquia, garantindo a individualidade de cada peça. Com suas ranhuras características, este ride oferece um som quente, rico em harmônicos e com excelente definição de ponta de baqueta.',
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