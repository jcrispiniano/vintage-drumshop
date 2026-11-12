import { sectionMetadata } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export const metadata = sectionMetadata('trocas-e-devolucoes')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="trocas-e-devolucoes">{children}</SectionLayout>
}
