import { products, formatPrice } from '@/lib/products';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProdutoClient from './ProdutoClient';

export async function generateStaticParams() {
  return products.map(product => ({
    id: product.id.toString()
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return {
      title: 'Produto não encontrado | Vintage Drum Shop',
    };
  }

  const brandName = product.brand === 'wincent' ? 'Wincent' : 
                    product.brand === 'istanbul' ? 'Istanbul Agop' :
                    product.brand === 'dynabeat' ? 'Dynabeat' : 'Vintage Drum Shop';

  return {
    title: `${product.name} | Vintage Drum Shop`,
    description: `${product.description.substring(0, 155)}... Compre na Vintage Drum Shop com os melhores preços. ${formatPrice(product.price)}`,
    keywords: `${product.name}, ${brandName}, ${product.category}, bateria, percussão, são paulo`,
    openGraph: {
      title: `${product.name} - ${brandName}`,
      description: product.description.substring(0, 200),
      url: `https://jcrispiniano.github.io/vintage-drumshop/produto/${product.id}`,
      images: [
        {
          url: `https://jcrispiniano.github.io${product.image}`,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${brandName}`,
      description: product.description.substring(0, 200),
      images: [`https://jcrispiniano.github.io${product.image}`],
    },
  };
}

export default async function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    notFound();
  }

  return <ProdutoClient product={product} />;
}
