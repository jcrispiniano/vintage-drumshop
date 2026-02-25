import { contactInfo } from '@/lib/products';

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Vintage Drum Shop",
    "description": "Revenda oficial Wincent e Istanbul Agop em São Paulo. Especializada em baterias, pratos e acessórios para percussão profissional.",
    "url": "https://jcrispiniano.github.io/vintage-drumshop",
    "telephone": contactInfo.phone,
    "email": contactInfo.email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "São Paulo",
      "addressRegion": "SP",
      "addressCountry": "BR"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "13:00"
      }
    ],
    "sameAs": [
      contactInfo.instagram,
      contactInfo.whatsapp
    ],
    "image": "https://jcrispiniano.github.io/vintage-drumshop/logo.png",
    "priceRange": "R$ 50 - R$ 6000"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
