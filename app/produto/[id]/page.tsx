import { formatPrice } from '@/lib/products';
import { getAllProductIds, getProductById } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProdutoClient from './ProdutoClient';

export async function generateStaticParams() {
  const ids = await getAllProductIds();
  return ids.map(id => ({ id: id.toString() }));
}

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(parseInt(id));

  if (!product) return { title: 'Produto não encontrado | Vintage Drum Shop' };

  const brandName = product.brand === 'wincent' ? 'Wincent' :
                    product.brand === 'istanbul' ? 'Istanbul Agop' :
                    product.brand === 'dynabeat' ? 'Dynabeat' : 'Vintage Drum Shop';

  const imageUrl = product.image.startsWith('http')
    ? product.image
    : `https://vintagedrumshop.com.br${product.image}`;

  return {
    title: `${product.name} | Vintage Drum Shop`,
    description: `${product.description.substring(0, 155)}... Compre na Vintage Drum Shop com os melhores preços. ${formatPrice(product.price)}`,
    keywords: `${product.name}, ${brandName}, ${product.category}, bateria, percussão, são paulo`,
    openGraph: {
      title: `${product.name} - ${brandName}`,
      description: product.description.substring(0, 200),
      url: `https://vintagedrumshop.com.br/produto/${product.id}`,
      images: [{ url: imageUrl, width: 800, height: 600, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${brandName}`,
      description: product.description.substring(0, 200),
      images: [imageUrl],
    },
  };
}

export default async function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(parseInt(id));

  if (!product) notFound();

  return <ProdutoClient product={product} />;
}
