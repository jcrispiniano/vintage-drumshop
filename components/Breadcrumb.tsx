import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight size={16} className="text-gray-400" />}
            {index === items.length - 1 ? (
              <span className="text-gray-900 font-semibold" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.url}
                className="text-gray-600 hover:text-accent transition"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
