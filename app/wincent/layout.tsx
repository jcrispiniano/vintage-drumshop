import { sectionMetadata } from '@/lib/seo'
import SectionLayout from '@/components/seo/SectionLayout'

export const metadata = sectionMetadata('wincent')

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout id="wincent">{children}</SectionLayout>
}
