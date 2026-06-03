import { notFound } from 'next/navigation'
import { FeeStructureTable } from '@/components/school-website/fee-structure-table'
import { getSchoolWebsiteStatic } from '@/lib/school-website'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function SchoolFeesPage({ params }: PageProps) {
  const { slug } = await params
  const site = getSchoolWebsiteStatic(slug)
  if (!site) notFound()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Fee Structure</h1>
        <p className="mt-2 text-muted-foreground">
          Complete fee details for {site.schoolName}. Academic year {new Date().getFullYear()}–
          {(new Date().getFullYear() + 1).toString().slice(-2)}.
        </p>
      </div>
      <FeeStructureTable fees={site.feeStructure} notes={site.feeNotes} accentColor={site.primaryColor} />
    </div>
  )
}
