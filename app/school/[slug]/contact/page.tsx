import { notFound } from 'next/navigation'
import { SchoolContactPageClient } from '@/components/school-website/school-contact-page'
import { getSchoolWebsiteStatic } from '@/lib/school-website'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function SchoolContactPage({ params }: PageProps) {
  const { slug } = await params
  const site = await getSchoolWebsiteStatic(slug)
  if (!site) notFound()

  return <SchoolContactPageClient site={site} />
}
