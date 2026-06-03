'use client'

import * as React from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import type { SchoolWebsite } from '@/lib/school-website/types'

type SchoolContactPageProps = {
  site: SchoolWebsite
}

export function SchoolContactPageClient({ site }: SchoolContactPageProps) {
  const { toast } = useToast()
  const [submitting, setSubmitting] = React.useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      toast({
        title: 'Message sent',
        description: `${site.schoolName} will respond to your enquiry shortly.`,
      })
      ;(event.target as HTMLFormElement).reset()
    }, 600)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-2 text-muted-foreground">
        Reach the {site.schoolName} office during {site.officeHours}.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex gap-3 rounded-xl border border-border/60 p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0" style={{ color: site.primaryColor }} />
            <div>
              <p className="font-medium">Address</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {site.address}, {site.city}, {site.state} – {site.pincode}
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-xl border border-border/60 p-4">
            <Phone className="h-5 w-5 shrink-0" style={{ color: site.primaryColor }} />
            <div>
              <p className="font-medium">Phone</p>
              <a href={`tel:${site.phone}`} className="mt-1 block text-sm text-muted-foreground hover:text-foreground">
                {site.phone}
              </a>
            </div>
          </div>
          <div className="flex gap-3 rounded-xl border border-border/60 p-4">
            <Mail className="h-5 w-5 shrink-0" style={{ color: site.primaryColor }} />
            <div>
              <p className="font-medium">Email</p>
              <a href={`mailto:${site.email}`} className="mt-1 block text-sm text-muted-foreground hover:text-foreground">
                {site.email}
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Send an Enquiry</h2>
          <Input name="name" placeholder="Your name" required />
          <Input name="email" type="email" placeholder="Email address" required />
          <Input name="phone" placeholder="Phone number" />
          <Textarea name="message" placeholder="How can we help you?" rows={4} required />
          <Button
            type="submit"
            disabled={submitting}
            style={{ backgroundColor: site.primaryColor }}
            className="w-full text-white hover:opacity-90"
          >
            {submitting ? 'Sending…' : 'Submit Enquiry'}
          </Button>
        </form>
      </div>
    </div>
  )
}
