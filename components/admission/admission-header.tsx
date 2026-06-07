'use client'

import { GraduationCap, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { NavbarGreetingContainer } from '@/components/festivals/festival-greeting'
import { SCHOOL_CONFIG } from '@/lib/admission/constants'

interface AdmissionHeaderProps {
  academicSession?: string
}

export function AdmissionHeader({ academicSession }: AdmissionHeaderProps) {
  const session = academicSession ?? SCHOOL_CONFIG.academicSession

  return (
    <header className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              aria-hidden
            >
              <span className="text-lg font-bold tracking-tight">
                {SCHOOL_CONFIG.logoInitials}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Online Admission Portal
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {SCHOOL_CONFIG.name}
              </h1>
              <p className="text-base text-muted-foreground">
                Admission Application Form
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
            <NavbarGreetingContainer />
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
              <Calendar className="h-3.5 w-3.5" />
              Session {session}
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm">
              <GraduationCap className="h-3.5 w-3.5" />
              New Admission
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
