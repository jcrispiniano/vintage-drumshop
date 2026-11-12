import { sectionMetadata } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export const metadata = sectionMetadata('politica-de-privacidade')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="politica-de-privacidade">{children}</SectionLayout>
}
