import { sectionMetadataWithImage } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export function generateMetadata() {
  return sectionMetadataWithImage('livros')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="livros">{children}</SectionLayout>
}
