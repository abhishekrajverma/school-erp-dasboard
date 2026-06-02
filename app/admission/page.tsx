'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { AdmissionFormWizard } from '@/components/admission/admission-form-wizard'
import { ClipboardList } from 'lucide-react'

export default function AdmissionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ClipboardList className="h-4 w-4" />
          <span>Admissions</span>
          <span>/</span>
          <span className="text-foreground font-medium">New Application</span>
        </div>
        <AdmissionFormWizard />
      </div>
    </DashboardLayout>
  )
}
