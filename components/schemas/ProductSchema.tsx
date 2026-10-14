import type { Product } from '@/lib/products';
import { brandLabel } from '@/lib/brands';

interface ProductSchemaProps {
  product: Product;
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image.startsWith('http') ? product.image : `https://vintagedrumshop.com.br${product.image}`,
    "brand": {
      "@type": "Brand",
      "name": brandLabel(product.brand)
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": `https://vintagedrumshop.com.br/produto/${product.id}`,
      "priceCurrency": "BRL",
      "price": product.price.toFixed(2),
      "availability": product.soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Vintage Drum Shop"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
