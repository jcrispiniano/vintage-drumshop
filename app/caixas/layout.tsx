import { sectionMetadata } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export const metadata = sectionMetadata('caixas')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="caixas">{children}</SectionLayout>
}
