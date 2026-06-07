'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { useStudents } from '@/hooks/api'
import { useMasterData } from '@/hooks/use-master-data'
import { formatBirthdayNavbarMessage, isBirthdayToday } from '@/lib/master-data/birthday-message'

export type NavbarBirthdayGreeting = {
  message: string
}

export function useNavbarBirthdayGreeting(): NavbarBirthdayGreeting | null {
  const searchParams = useSearchParams()
  const preview = searchParams.get('birthday') === 'preview' || searchParams.get('birthday') === '1'
  const { data: masterData } = useMasterData()
  const { data: studentsResponse } = useStudents({ page: 1, pageSize: 500 })

  return React.useMemo(() => {
    if (!masterData.birthdayNavbarEnabled && !preview) return null

    const celebrants = preview
      ? ['Aarav', 'Priya']
      : (studentsResponse?.items ?? [])
          .filter((student) => isBirthdayToday(student.dateOfBirth))
          .map((student) => student.name.split(' ')[0] || student.name)

    if (celebrants.length === 0) return null

    return {
      message: formatBirthdayNavbarMessage(masterData.birthdayNavbarMessage, celebrants),
    }
  }, [masterData.birthdayNavbarEnabled, masterData.birthdayNavbarMessage, preview, studentsResponse?.items])
}
