import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSchoolWebsiteStatic } from '@/lib/school-website'
import { SchoolSiteShell } from '@/components/school-website/school-site-shell'

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const site = getSchoolWebsiteStatic(slug)
  if (!site || !site.published) {
    return { title: 'School Not Found' }
  }
  return {
    title: `${site.schoolName} | Official Website`,
    description: `${site.about.slice(0, 120)} Parent portal, mobile app, fees, admissions & more.`,
  }
}

export default async function SchoolWebsiteLayout({ children, params }: LayoutProps) {
  const { slug } = await params
  const site = getSchoolWebsiteStatic(slug)

  if (!site || !site.published) {
    notFound()
  }

  return <SchoolSiteShell site={site}>{children}</SchoolSiteShell>
}
