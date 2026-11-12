import { sectionMetadata } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export const metadata = sectionMetadata('dynabeat')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="dynabeat">{children}</SectionLayout>
}
