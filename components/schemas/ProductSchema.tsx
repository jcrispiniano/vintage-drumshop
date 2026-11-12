import { absoluteUrl, productUrl, siteUrl, type Product } from '@/lib/products';
import { brandLabel, isGenericBrand } from '@/lib/brands';
import { productAliases } from '@/lib/searchTerms';
import { cymbalSeries, cymbalType, CYMBAL_TYPE_LABELS } from '@/lib/cymbals';
import { productSizes } from '@/lib/productText';

interface ProductSchemaProps {
  product: Product;
}

/**
 * Dados estruturados do produto (schema.org/Product): é o que permite ao Google
 * mostrar preço, disponibilidade e foto direto no resultado da busca.
 */
export default function ProductSchema({ product }: ProductSchemaProps) {
  const url = productUrl(product);
  const aliases = productAliases(product.name);
  const images = [product.image, ...(product.images ?? [])].filter(Boolean).map(absoluteUrl);
  const size = productSizes(product.name);
  // Preço válido até o fim do ano seguinte (o Google pede uma data; o preço real é o do site)
  const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#produto`,
    name: product.name,
    ...(aliases.length && { alternateName: aliases }),
    description: product.description,
    url,
    sku: `VDS-${product.id}`,
    image: images,
    ...(!isGenericBrand(product.brand) && { brand: { '@type': 'Brand', name: brandLabel(product.brand) } }),
    category: product.category === 'pratos'
      ? `Pratos > ${CYMBAL_TYPE_LABELS[cymbalType(product.name)]}`
      : product.category,
    ...(size && { size }),
    ...(product.category === 'pratos' && cymbalSeries(product.name) && {
      additionalProperty: [{ '@type': 'PropertyValue', name: 'Série', value: cymbalSeries(product.name)!.label }],
    }),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'BRL',
      price: product.price.toFixed(2),
      priceValidUntil,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.soldOut ? 'https://schema.org/BackOrder' : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Vintage Drum Shop', url: siteUrl },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'BR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
