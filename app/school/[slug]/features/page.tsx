import { notFound } from 'next/navigation'
import { SchoolFeaturesPage } from '@/components/school-website/school-features-page'
import { getSchoolWebsiteStatic } from '@/lib/school-website'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function SchoolFeaturesRoute({ params }: PageProps) {
  const { slug } = await params
  const site = getSchoolWebsiteStatic(slug)
  if (!site) notFound()

  return <SchoolFeaturesPage site={site} />
}
