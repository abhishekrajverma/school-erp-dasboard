import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import { getSchoolWebsiteStatic } from '@/lib/school-website'
import { getSchoolWebsitePath } from '@/lib/school-website/utils'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function SchoolAdmissionsPage({ params }: PageProps) {
  const { slug } = await params
  const site = await getSchoolWebsiteStatic(slug)
  if (!site) notFound()

  const base = getSchoolWebsitePath(slug)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admissions</h1>
          <p className="mt-2 text-muted-foreground">
            Join {site.schoolName} — {site.admissionOpen ? 'applications are open' : 'applications are closed'}.
          </p>
        </div>
        {site.admissionOpen && (
          <span
            className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
            style={{ backgroundColor: site.primaryColor }}
          >
            Open Now
          </span>
        )}
      </div>

      {site.admissionDeadline && (
        <div className="mb-8 rounded-xl border border-border/60 bg-muted/30 px-5 py-4 text-sm">
          <span className="font-medium">Application deadline:</span>{' '}
          <span className="text-muted-foreground">{formatDate(site.admissionDeadline)}</span>
        </div>
      )}

      <h2 className="text-xl font-semibold">Admission Process</h2>
      <ol className="mt-4 space-y-3">
        {site.admissionProcess.map((step, index) => (
          <li key={step} className="flex gap-3 rounded-xl border border-border/60 p-4">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: site.primaryColor }}
            >
              {index + 1}
            </span>
            <span className="pt-1 text-muted-foreground">{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 p-6">
          <h3 className="font-semibold">Documents Required</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {['Birth certificate', 'Previous school report card', 'Transfer certificate (if applicable)', 'Address proof', 'Passport-size photographs'].map((doc) => (
              <li key={doc} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: site.primaryColor }} />
                {doc}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border/60 p-6">
          <h3 className="font-semibold">Next Steps</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Review the fee structure and contact the admissions office to schedule a campus visit or submit your enquiry online.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild style={{ backgroundColor: site.primaryColor }} className="text-white hover:opacity-90">
              <Link href="/admission">Online Enquiry Form</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`${base}/fees`}>View Fees</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
