import { products } from '@/lib/products';
import { notFound } from 'next/navigation';
import ProdutoClient from './ProdutoClient';

export async function generateStaticParams() {
  return products.map(product => ({
    id: product.id.toString()
  }));
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
