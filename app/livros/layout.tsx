import { sectionMetadata } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export const metadata = sectionMetadata('livros')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="livros">{children}</SectionLayout>
}
