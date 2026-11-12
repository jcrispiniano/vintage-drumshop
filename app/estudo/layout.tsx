import { sectionMetadata } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export const metadata = sectionMetadata('estudo')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="estudo">{children}</SectionLayout>
}
