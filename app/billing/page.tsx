'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { PageHeader } from '@/components/shared/page-components'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function BillingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Billing & Subscription"
          description="Manage your EduSync subscription and invoices."
          breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Billing' }]}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Billing API not available yet</CardTitle>
            <CardDescription>
              Subscription plans and invoice history will appear here once the backend billing API is connected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="py-12 text-center text-sm text-muted-foreground">
              Billing API not available on backend yet
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
