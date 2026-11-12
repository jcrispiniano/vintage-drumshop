import { sectionMetadataWithImage } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export function generateMetadata() {
  return sectionMetadataWithImage('trocas-e-devolucoes')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="trocas-e-devolucoes">{children}</SectionLayout>
}
