import { sectionMetadata } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export const metadata = sectionMetadata('ferragens')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="ferragens">{children}</SectionLayout>
}
