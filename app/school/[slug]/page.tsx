import { notFound } from 'next/navigation'
import { SchoolHomeContent } from '@/components/school-website/school-home-content'
import { getSchoolWebsiteStatic } from '@/lib/school-website'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function SchoolHomePage({ params }: PageProps) {
  const { slug } = await params
  const site = getSchoolWebsiteStatic(slug)
  if (!site) notFound()

  return <SchoolHomeContent site={site} />
}
