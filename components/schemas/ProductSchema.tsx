interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  brand: string;
  category: string;
}

interface ProductSchemaProps {
  product: Product;
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": `https://jcrispiniano.github.io${product.image}`,
    "brand": {
      "@type": "Brand",
      "name": product.brand === 'wincent' ? 'Wincent' : 
             product.brand === 'istanbul' ? 'Istanbul Agop' :
             product.brand === 'dynabeat' ? 'Dynabeat' :
             product.brand === 'pinguim' ? 'Pinguim' :
             product.brand === 'dw' ? 'DW' :
             product.brand === 'rockkey' ? 'RockKey' : 'Vintage Drum Shop'
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": `https://jcrispiniano.github.io/vintage-drumshop/produto/${product.id}`,
      "priceCurrency": "BRL",
      "price": product.price.toFixed(2),
      "availability": "https://schema.org/InStock",
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
