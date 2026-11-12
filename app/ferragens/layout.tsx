import { sectionMetadataWithImage } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export function generateMetadata() {
  return sectionMetadataWithImage('ferragens')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="ferragens">{children}</SectionLayout>
}
