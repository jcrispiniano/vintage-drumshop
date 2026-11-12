import { formatPrice } from '@/lib/products';
import { getAllProductIds, getProductById } from '@/lib/db';
import { brandLabel } from '@/lib/brands';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProdutoClient from './ProdutoClient';
import ProductSchema from '@/components/schemas/ProductSchema';
import { productAliases } from '@/lib/searchTerms';

export async function generateStaticParams() {
  const ids = await getAllProductIds();
  return ids.map(id => ({ id: id.toString() }));
}

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(parseInt(id));

  if (!product) return { title: 'Produto não encontrado | Vintage Drum Shop' };

  const brandName = brandLabel(product.brand);
  // Outros nomes do produto (chimbal = hi-hat, baqueta = drumstick...): o Google acha pelos dois
  const aliases = productAliases(product.name);
  const aka = aliases.length ? ` (${aliases.slice(0, 2).join(', ')})` : '';

  const imageUrl = product.image.startsWith('http')
    ? product.image
    : `https://vintagedrumshop.com.br${product.image}`;

  return {
    title: `${product.name}${aka} | Vintage Drum Shop`,
    description: `${aliases.length ? `${product.name}, também chamado de ${aliases.join(', ')}. ` : ''}${product.description.substring(0, 140)}... ${formatPrice(product.price)} na Vintage Drum Shop.`,
    keywords: [product.name, ...aliases, brandName, product.category, 'bateria', 'percussão', 'são paulo'].join(', '),
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

  return (
    <>
      <ProductSchema product={product} />
      <ProdutoClient key={product.id} product={product} />
    </>
  );
}
