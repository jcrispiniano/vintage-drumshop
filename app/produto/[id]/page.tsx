import { absoluteUrl, categories, formatPrice, pixPrice, productPath, productUrl } from '@/lib/products';
import { getAllProductRefs, getProductById } from '@/lib/db';
import { brandLabel, isGenericBrand } from '@/lib/brands';
import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';
import ProdutoClient from './ProdutoClient';
import ProductSchema from '@/components/schemas/ProductSchema';
import BreadcrumbSchema from '@/components/schemas/BreadcrumbSchema';
import { productAliases } from '@/lib/searchTerms';

// O parâmetro é "150" ou "150-nome-do-produto": o número identifica o produto
const productId = (param: string) => parseInt(param, 10);

export async function generateStaticParams() {
  const refs = await getAllProductRefs();
  return refs.map(p => ({ id: productPath(p).replace('/produto/', '') }));
}

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(productId(id));

  if (!product) return { title: 'Produto não encontrado | Vintage Drum Shop', robots: { index: false } };

  const brandName = isGenericBrand(product.brand) ? '' : brandLabel(product.brand);
  // Outros nomes do produto (chimbal = hi-hat, baqueta = drumstick...): o Google acha pelos dois
  const aliases = productAliases(product.name);
  const aka = aliases.length ? ` (${aliases.slice(0, 2).join(', ')})` : '';
  const imageUrl = absoluteUrl(product.image);
  const price = product.soldOut
    ? 'Sob encomenda'
    : `${formatPrice(pixPrice(product.price))} no Pix ou ${formatPrice(product.price)} no cartão`;
  const description = [
    aliases.length ? `${product.name}, também chamado de ${aliases.join(', ')}.` : `${product.name}.`,
    price + '.',
    product.description.slice(0, 110).trim() + (product.description.length > 110 ? '…' : ''),
  ].join(' ');

  return {
    title: `${product.name}${aka} | Vintage Drum Shop`,
    description,
    keywords: [product.name, ...aliases, brandName, product.category, 'comprar', 'preço', 'bateria', 'são paulo'].filter(Boolean).join(', '),
    alternates: { canonical: productPath(product) },
    openGraph: {
      type: 'website',
      title: `${product.name}${aka}`,
      description,
      url: productUrl(product),
      images: [{ url: imageUrl, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name}${aka}`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(productId(id));

  if (!product) notFound();

  // Uma URL por produto: /produto/150 (ou nome desatualizado) vira a URL com o nome atual
  const canonical = productPath(product);
  if (`/produto/${id}` !== canonical) permanentRedirect(canonical);

  const category = categories.find(c => c.id === product.category);

  return (
    <>
      <ProductSchema product={product} />
      <BreadcrumbSchema
        items={[
          { name: 'Início', url: '/' },
          ...(category ? [{ name: category.name, url: `/${category.id}` }] : []),
          { name: product.name, url: canonical },
        ]}
      />
      <ProdutoClient key={product.id} product={product} />
    </>
  );
}
