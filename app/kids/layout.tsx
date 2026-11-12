import { sectionMetadata } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export const metadata = sectionMetadata('kids')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="kids">{children}</SectionLayout>
}
