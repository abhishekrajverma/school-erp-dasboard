import { notFound } from 'next/navigation'
import { getSchoolWebsiteStatic } from '@/lib/school-website'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function SchoolAboutPage({ params }: PageProps) {
  const { slug } = await params
  const site = await getSchoolWebsiteStatic(slug)
  if (!site) notFound()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">About {site.schoolName}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">{site.about}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 p-6">
          <h2 className="text-lg font-semibold">Our Mission</h2>
          <p className="mt-3 text-muted-foreground">{site.mission}</p>
        </div>
        <div className="rounded-2xl border border-border/60 p-6">
          <h2 className="text-lg font-semibold">Our Vision</h2>
          <p className="mt-3 text-muted-foreground">{site.vision}</p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-border/60 bg-muted/30 p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Principal&apos;s Message</p>
        <h2 className="mt-2 text-xl font-bold">{site.principalName}</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">{site.principalMessage}</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 p-4">
          <p className="text-sm text-muted-foreground">Affiliation</p>
          <p className="mt-1 font-semibold">{site.affiliationBoard}</p>
          <p className="text-sm text-muted-foreground">{site.affiliationNumber}</p>
        </div>
        <div className="rounded-xl border border-border/60 p-4">
          <p className="text-sm text-muted-foreground">Established</p>
          <p className="mt-1 font-semibold">{site.establishedYear}</p>
        </div>
        <div className="rounded-xl border border-border/60 p-4">
          <p className="text-sm text-muted-foreground">Campus</p>
          <p className="mt-1 font-semibold">{site.city}, {site.state}</p>
        </div>
      </div>
    </div>
  )
}
