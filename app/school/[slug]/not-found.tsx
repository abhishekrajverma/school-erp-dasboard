import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SchoolNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold">School website not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        This school may not have an active subscription website, or the link may be incorrect.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to EduSync</Link>
      </Button>
    </div>
  )
}
