import { sectionMetadataWithImage } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export function generateMetadata() {
  return sectionMetadataWithImage('termos-de-uso')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="termos-de-uso">{children}</SectionLayout>
}
