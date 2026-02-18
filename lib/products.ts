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
    name: 'Crash Istanbul Agop Xist Dry Dark Brilliant 22"',
    category: 'pratos',
    brand: 'istanbul',
    price: 2999.00,
    image: '🎵',
    badge: 'Novo',
    description: 'Prato crash profissional com som seco e definido',
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
  { id: 'baterias', name: 'Baterias', icon: '🥁' },
  { id: 'pratos', name: 'Pratos', icon: '🎵' },
  { id: 'caixas', name: 'Caixas', icon: '📦' },
  { id: 'baquetas', name: 'Baquetas', icon: '🥢' },
  { id: 'ferragens', name: 'Ferragens', icon: '🔧' },
  { id: 'peles', name: 'Peles', icon: '🎯' },
  { id: 'acessorios', name: 'Acessórios', icon: '⚙️' },
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
  email: 'contato@vintagedrumshop.com',
  instagram: 'https://www.instagram.com/vintage.drumshop',
  instagramHandle: '@vintage.drumshop',
  address: 'São Paulo - SP',
  hours: 'Seg-Sex: 9h-18h | Sáb: 9h-13h'
};