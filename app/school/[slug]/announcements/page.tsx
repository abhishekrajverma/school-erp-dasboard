import { notFound } from 'next/navigation'
import { AnnouncementsList } from '@/components/school-website/announcements-list'
import { getSchoolWebsiteStatic } from '@/lib/school-website'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function SchoolAnnouncementsPage({ params }: PageProps) {
  const { slug } = await params
  const site = getSchoolWebsiteStatic(slug)
  if (!site) notFound()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Announcements</h1>
      <p className="mt-2 text-muted-foreground">
        News, holidays, exam updates, and events from {site.schoolName}.
      </p>
      <div className="mt-8">
        <AnnouncementsList announcements={site.announcements} />
      </div>
    </div>
  )
}
