'use client'

import * as React from 'react'
import Link from 'next/link'
import { ExternalLink, Globe, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/shared/page-components'
import { useToast } from '@/hooks/use-toast'
import {
  DEFAULT_SCHOOL_WEBSITE_SLUG,
  getDefaultSchoolWebsite,
  getSchoolWebsite,
  getSchoolWebsitePath,
  isWebsiteIncludedInPlan,
  saveSchoolWebsiteOverrides,
} from '@/lib/school-website'
import type { SchoolWebsitePatch } from '@/lib/school-website/types'

export function SchoolWebsiteAdminPanel() {
  const { toast } = useToast()
  const seed = getDefaultSchoolWebsite()
  const [draft, setDraft] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return getSchoolWebsite(DEFAULT_SCHOOL_WEBSITE_SLUG) ?? seed
    }
    return seed
  })

  React.useEffect(() => {
    const merged = getSchoolWebsite(DEFAULT_SCHOOL_WEBSITE_SLUG)
    if (merged) setDraft(merged)
  }, [])

  const publicPath = getSchoolWebsitePath(draft.slug)
  const websiteIncluded = isWebsiteIncludedInPlan(draft.subscriptionPlan)

  const update = (patch: SchoolWebsitePatch) => {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  const handleSave = () => {
    const { slug, tenantId, ...overrides } = draft
    void slug
    void tenantId
    saveSchoolWebsiteOverrides(DEFAULT_SCHOOL_WEBSITE_SLUG, overrides)
    toast({
      title: 'School website updated',
      description: 'Changes are live on your public website.',
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4" />
            Your Public School Website
          </CardTitle>
          <CardDescription>
            Included with Professional and Enterprise subscriptions. Share fees, announcements, admissions, and contact details with parents and visitors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4">
            <div>
              <p className="text-sm text-muted-foreground">Live URL</p>
              <p className="font-medium">{publicPath}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Plan: {draft.subscriptionPlan} · Website {websiteIncluded ? 'enabled' : 'not included on Starter'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href={publicPath} target="_blank">
                  Preview
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium">Publish website</p>
              <p className="text-sm text-muted-foreground">When off, visitors see a not-found page</p>
            </div>
            <Switch
              checked={draft.published}
              onCheckedChange={(published) => update({ published })}
              disabled={!websiteIncluded}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Homepage Content</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField label="Tagline" className="sm:col-span-2">
            <Input value={draft.tagline} onChange={(e) => update({ tagline: e.target.value })} />
          </FormField>
          <FormField label="About (short)" className="sm:col-span-2">
            <Textarea
              rows={4}
              value={draft.about}
              onChange={(e) => update({ about: e.target.value })}
            />
          </FormField>
          <FormField label="Principal message" className="sm:col-span-2">
            <Textarea
              rows={3}
              value={draft.principalMessage}
              onChange={(e) => update({ principalMessage: e.target.value })}
            />
          </FormField>
          <FormField label="Primary brand color">
            <Input
              type="color"
              value={draft.primaryColor}
              onChange={(e) => update({ primaryColor: e.target.value })}
              className="h-10 w-20"
            />
          </FormField>
          <FormField label="Office hours">
            <Input
              value={draft.officeHours}
              onChange={(e) => update({ officeHours: e.target.value })}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fee Notes</CardTitle>
          <CardDescription>Shown below the fee table on your public fees page</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            value={draft.feeNotes ?? ''}
            onChange={(e) => update({ feeNotes: e.target.value })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Admissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Accepting applications</span>
            <Switch
              checked={draft.admissionOpen}
              onCheckedChange={(admissionOpen) => update({ admissionOpen })}
            />
          </div>
          <FormField label="Application deadline">
            <Input
              type="date"
              value={draft.admissionDeadline ?? ''}
              onChange={(e) => update({ admissionDeadline: e.target.value })}
            />
          </FormField>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Save Website
        </Button>
      </div>
    </div>
  )
}
