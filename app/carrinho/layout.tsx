import { sectionMetadata } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export const metadata = sectionMetadata('carrinho')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="carrinho">{children}</SectionLayout>
}
