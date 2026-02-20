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
    price: 5499.00,
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
    id: 8,
    name: 'Chimbal Istanbul Agop "Special Jazz Edition" Hi-Hat 14"',
    category: 'pratos',
    brand: 'istanbul',
    price: 3999.00,
    image: '/vintage-drumshop/produtos/pratos/hihat-14-special-jazz.jpg',
    badge: 'Premium',
    description: 'O Chimbal Istanbul Agop "Special Jazz Edition" Hi-Hat 14" faz parte da linha especial desenvolvida para bateristas de jazz que buscam autenticidade sonora. Com liga Bronze B20 e acabamento tradicional com lathing refinado e ranhuras características, oferece um som clássico e versátil. Produzido à mão na Turquia, garante qualidade artesanal e sonoridade única. Perfeito para quem busca aquele "chick" definido e wash controlado do jazz tradicional.',
    featured: true
  },
  {
    id: 9,
    name: 'Chimbal Istanbul Agop Traditional Jazz Hi-Hats 15"',
    category: 'pratos',
    brand: 'istanbul',
    price: 3999.00,
    image: '/vintage-drumshop/produtos/pratos/hihat-15-traditional-jazz.jpg',
    badge: 'Premium',
    description: 'Istanbul Agop Traditional Jazz Hi-Hats, das versões de 14″ e 15″, mostrando o acabamento tradicional, o trabalho manual com bronze B20 e o look artesanal característico. A série Traditional Jazz é parte da linha Traditional, que exibe excelência artesanal com afinação lathe em ambos os lados, resultando em timbres ricos, ressonantes e altamente musicais',
    featured: false
  },
  {
    id: 10,
    name: 'Chimbal Istanbul Agop Traditional Jazz Hi-Hats 14"',
    category: 'pratos',
    brand: 'istanbul',
    price: 3599.00,
    image: '/vintage-drumshop/produtos/pratos/hihat-14-traditional-jazz.jpg',
    badge: 'Premium',
    description: 'Istanbul Agop Traditional Jazz Hi-Hats, das versões de 14″ e 15″, mostrando o acabamento tradicional, o trabalho manual com bronze B20 e o look artesanal característico. A série Traditional Jazz é parte da linha Traditional, que exibe excelência artesanal com afinação lathe em ambos os lados, resultando em timbres ricos, ressonantes e altamente musicais',
    featured: false
  },
  {
    id: 11,
    name: 'Prato Istanbul Agop "Mel Lewis" Signature Ride 22"',
    category: 'pratos',
    brand: 'istanbul',
    price: 4499.00,
    image: '/vintage-drumshop/produtos/pratos/ride-22-mel-lewis.jpg',
    badge: 'Signature',
    description: 'Liga (Alloy): Bronze B20 (níquel-estanho), feito à mão e com acabamento polido (brilliant/glossy). Fabricado com base em protótipos usados por Mel Lewis, em prol de autenticidade sonora e estética clássica turca',
    featured: false
  },
  {
    id: 12,
    name: 'Prato Istanbul Agop Traditional Dark Ride 22"',
    category: 'pratos',
    brand: 'istanbul',
    price: 3999.00,
    image: '/vintage-drumshop/produtos/pratos/ride-22-traditional-dark.jpg',
    badge: 'Novo',
    description: 'Istanbul Agop 22″ Traditional Dark Ride, um belo prato feito à mão com acabamento tradicional, ideal para seu visual e sonoridade únicos. Material: Bronze B20 (níquel e estanho). Acabamento: Latonado (lathed) por cima e por baixo, com aparência tradicional, artesanal e visual clássico. Feito à mão: Sim, cada exemplar é hand-hammered por artesãos turcos',
    featured: false
  },
  {
    id: 13,
    name: 'Prato Istanbul Agop Traditional Dark Ride 21"',
    category: 'pratos',
    brand: 'istanbul',
    price: 3699.00,
    image: '/vintage-drumshop/produtos/pratos/ride-21-traditional-dark.jpg',
    badge: 'Novo',
    description: 'Istanbul Agop 21″ Traditional Dark Ride, um belo prato feito à mão com acabamento tradicional, ideal para seu visual e sonoridade únicos. Material: Bronze B20 (níquel e estanho). Acabamento: Latonado (lathed) por cima e por baixo, com aparência tradicional, artesanal e visual clássico. Feito à mão: Sim, cada exemplar é hand-hammered por artesãos turcos',
    featured: false
  },
  {
    id: 14,
    name: 'Prato Istanbul Agop Traditional Dark Crash 24"',
    category: 'pratos',
    brand: 'istanbul',
    price: 4599.00,
    image: '/vintage-drumshop/produtos/pratos/crash-24-traditional-dark.jpg',
    badge: 'Novo',
    description: 'Istanbul Agop 24″ Traditional Dark Crash, um belo prato feito à mão com acabamento tradicional, ideal para seu visual e sonoridade únicos. Material: Bronze B20 (níquel e estanho). Acabamento: Latonado (lathed) por cima e por baixo, com aparência tradicional, artesanal e visual clássico. Feito à mão: Sim, cada exemplar é hand-hammered por artesãos turcos',
    featured: false
  },
  {
    id: 15,
    name: 'Prato Istanbul Agop Traditional Medium Ride 21"',
    category: 'pratos',
    brand: 'istanbul',
    price: 3699.00,
    image: '/vintage-drumshop/produtos/pratos/ride-21-traditional-medium.jpg',
    badge: 'Novo',
    description: 'Istanbul Agop 21″ Traditional Medium Ride, um belo prato feito à mão com acabamento tradicional, ideal para seu visual e sonoridade únicos. Material: Bronze B20 (níquel e estanho). Acabamento: Latonado (lathed) por cima e por baixo, com aparência tradicional, artesanal e visual clássico. Feito à mão: Sim, cada exemplar é hand-hammered por artesãos turcos',
    featured: false
  },
  {
    id: 16,
    name: 'Prato Istanbul Agop Traditional Medium Crash 16"',
    category: 'pratos',
    brand: 'istanbul',
    price: 2149.00,
    image: '/vintage-drumshop/produtos/pratos/crash-16-traditional-medium.jpg',
    badge: 'Novo',
    description: 'A SÉRIE TRADITIONAL - Os pratos da série Traditional são completamente torneados na parte superior e inferior, produzindo tons ricos e quentes e uma presença altamente musical. Eles estão disponíveis em gramaturas que variam de paperthin a heavy, oferecendo uma ampla variedade de opções para complementar qualquer estilo de música. É uma série que tem uma sonoridade versátil, funcionando muito bem para praticamente todos os estilos. CARACTERÍSTICAS DO PRATO - O Prato Istanbul Agop Traditional Medium Crash 16" possui sonoridade média, com espessura também média. É um prato com ataque cortante, que combina muito bem com pratos de diversas séries. Bem pronunciado, possui bom volume e tem timbre diferenciado, mesmo tendo aquela sobra dark que a série Traditional costuma ter como característica marcante. CONSTRUÇÃO DE ALTA QUALIDADE - Cada prato da Istanbul Agop é feito à mão, assegurando não apenas durabilidade, mas também uma sonoridade única que se adapta ao seu estilo musical. A marca Istanbul Agop exemplifica a excelência artesanal da marca, garantindo um instrumento robusto e de destaque em qualquer performance. Transforme suas performances e descubra novas texturas sonoras com o Prato Istanbul Agop Traditional Medium Crash 16"',
    featured: false
  },
  {
    id: 17,
    name: 'Prato Istanbul Agop Traditional Medium Crash 20"',
    category: 'pratos',
    brand: 'istanbul',
    price: 3399.00,
    image: '/vintage-drumshop/produtos/pratos/crash-20-traditional-medium.jpg',
    badge: 'Novo',
    description: 'A SÉRIE TRADITIONAL - Os pratos da série Traditional são completamente torneados na parte superior e inferior, produzindo tons ricos e quentes e uma presença altamente musical. Eles estão disponíveis em gramaturas que variam de paperthin a heavy, oferecendo uma ampla variedade de opções para complementar qualquer estilo de música. É uma série que tem uma sonoridade versátil, funcionando muito bem para praticamente todos os estilos. CARACTERÍSTICAS DO PRATO - O Prato Istanbul Agop Traditional Medium Crash possui sonoridade média, com espessura também média. É um prato com ataque cortante, que combina muito bem com pratos de diversas séries. Bem pronunciado, possui bom volume e tem timbre diferenciado, mesmo tendo aquela sobra dark que a série Traditional costuma ter como característica marcante. CONSTRUÇÃO DE ALTA QUALIDADE - Cada prato da Istanbul Agop é feito à mão, assegurando não apenas durabilidade, mas também uma sonoridade única que se adapta ao seu estilo musical. A marca Istanbul Agop exemplifica a excelência artesanal da marca, garantindo um instrumento robusto e de destaque em qualquer performance. Transforme suas performances e descubra novas texturas sonoras com o Prato Istanbul Agop Traditional Medium Crash 20"',
    featured: false
  },
  {
    id: 18,
    name: 'Prato Istanbul Agop Traditional Medium Crash 19"',
    category: 'pratos',
    brand: 'istanbul',
    price: 2999.00,
    image: '/vintage-drumshop/produtos/pratos/crash-19-traditional-medium.jpg',
    badge: 'Novo',
    description: 'A SÉRIE TRADITIONAL - Os pratos da série Traditional são completamente torneados na parte superior e inferior, produzindo tons ricos e quentes e uma presença altamente musical. Eles estão disponíveis em gramaturas que variam de paperthin a heavy, oferecendo uma ampla variedade de opções para complementar qualquer estilo de música. É uma série que tem uma sonoridade versátil, funcionando muito bem para praticamente todos os estilos. CARACTERÍSTICAS DO PRATO - O Prato Istanbul Agop Traditional Medium Crash possui sonoridade média, com espessura também média. É um prato com ataque cortante, que combina muito bem com pratos de diversas séries. Bem pronunciado, possui bom volume e tem timbre diferenciado, mesmo tendo aquela sobra dark que a série Traditional costuma ter como característica marcante. CONSTRUÇÃO DE ALTA QUALIDADE - Cada prato da Istanbul Agop é feito à mão, assegurando não apenas durabilidade, mas também uma sonoridade única que se adapta ao seu estilo musical. A marca Istanbul Agop exemplifica a excelência artesanal da marca, garantindo um instrumento robusto e de destaque em qualquer performance. Transforme suas performances e descubra novas texturas sonoras com o Prato Istanbul Agop Traditional Medium Crash 19"',
    featured: false
  },
  {
    id: 19,
    name: 'Prato Istanbul Agop Traditional Medium Crash 18"',
    category: 'pratos',
    brand: 'istanbul',
    price: 2499.00,
    image: '/vintage-drumshop/produtos/pratos/crash-18-traditional-medium.jpg',
    badge: 'Novo',
    description: 'A SÉRIE TRADITIONAL - Os pratos da série Traditional são completamente torneados na parte superior e inferior, produzindo tons ricos e quentes e uma presença altamente musical. Eles estão disponíveis em gramaturas que variam de paperthin a heavy, oferecendo uma ampla variedade de opções para complementar qualquer estilo de música. É uma série que tem uma sonoridade versátil, funcionando muito bem para praticamente todos os estilos. CARACTERÍSTICAS DO PRATO - O Prato Istanbul Agop Traditional Medium Crash possui sonoridade média, com espessura também média. É um prato com ataque cortante, que combina muito bem com pratos de diversas séries. Bem pronunciado, possui bom volume e tem timbre diferenciado, mesmo tendo aquela sobra dark que a série Traditional costuma ter como característica marcante. CONSTRUÇÃO DE ALTA QUALIDADE - Cada prato da Istanbul Agop é feito à mão, assegurando não apenas durabilidade, mas também uma sonoridade única que se adapta ao seu estilo musical. A marca Istanbul Agop exemplifica a excelência artesanal da marca, garantindo um instrumento robusto e de destaque em qualquer performance. Transforme suas performances e descubra novas texturas sonoras com o Prato Istanbul Agop Traditional Medium Crash 18"',
    featured: false
  },
  {
    id: 20,
    name: 'Prato Istanbul Agop Traditional Medium Crash 17"',
    category: 'pratos',
    brand: 'istanbul',
    price: 2299.00,
    image: '/vintage-drumshop/produtos/pratos/crash-17-traditional-medium.jpg',
    badge: 'Novo',
    description: 'A SÉRIE TRADITIONAL - Os pratos da série Traditional são completamente torneados na parte superior e inferior, produzindo tons ricos e quentes e uma presença altamente musical. Eles estão disponíveis em gramaturas que variam de paperthin a heavy, oferecendo uma ampla variedade de opções para complementar qualquer estilo de música. É uma série que tem uma sonoridade versátil, funcionando muito bem para praticamente todos os estilos. CARACTERÍSTICAS DO PRATO - O Prato Istanbul Agop Traditional Medium Crash possui sonoridade média, com espessura também média. É um prato com ataque cortante, que combina muito bem com pratos de diversas séries. Bem pronunciado, possui bom volume e tem timbre diferenciado, mesmo tendo aquela sobra dark que a série Traditional costuma ter como característica marcante. CONSTRUÇÃO DE ALTA QUALIDADE - Cada prato da Istanbul Agop é feito à mão, assegurando não apenas durabilidade, mas também uma sonoridade única que se adapta ao seu estilo musical. A marca Istanbul Agop exemplifica a excelência artesanal da marca, garantindo um instrumento robusto e de destaque em qualquer performance. Transforme suas performances e descubra novas texturas sonoras com o Prato Istanbul Agop Traditional Medium Crash 17"',
    featured: false
  },
  {
    id: 7,
    name: 'Crash Istanbul Agop Xist Power Brilliant 22"',
    category: 'pratos',
    brand: 'istanbul',
    price: 2999.00,
    image: '/vintage-drumshop/produtos/pratos/crash-22-power-brilliant.jpg',
    badge: 'Novo',
    description: 'Prato crash com projeção e brilho excepcional da série Xist. Com acabamento brilhante e peso médio-pesado, oferece alta projeção e corte para performances que exigem volume. Ideal para rock, metal e estilos mais enérgicos.',
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
    featured: false
  },
  {
    id: 21,
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
    id: 22,
    name: 'Bateria Tama Superstar Classic 5 Peças',
    category: 'baterias',
    brand: 'tama',
    price: 8999.00,
    image: '🥁',
    badge: 'Novo',
    description: 'Kit completo profissional 5 peças',
    featured: false
  },
  {
    id: 23,
    name: 'Pedal Duplo DW 9002',
    category: 'ferragens',
    brand: 'dw',
    price: 4999.00,
    image: '🔧',
    badge: 'Premium',
    description: 'Pedal duplo profissional de alta performance',
    featured: false
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