import { sectionMetadataWithImage } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export function generateMetadata() {
  return sectionMetadataWithImage('baquetas')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="baquetas">{children}</SectionLayout>
}
