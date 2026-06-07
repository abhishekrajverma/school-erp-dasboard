'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { getActiveFestival } from '@/lib/festivals/calendar'
import { isFestivalEffectsEnabled } from '@/lib/festivals/storage'
import type { ActiveFestival } from '@/lib/festivals/types'

export function useActiveFestival(): ActiveFestival | null {
  const searchParams = useSearchParams()
  const previewId = searchParams.get('festival')
  const [enabled, setEnabled] = React.useState(true)
  const [festival, setFestival] = React.useState<ActiveFestival | null>(null)

  React.useEffect(() => {
    const refresh = () => {
      setEnabled(isFestivalEffectsEnabled())
      setFestival(getActiveFestival(new Date(), previewId))
    }

    refresh()
    window.addEventListener('edusync-festival-preference-updated', refresh)
    return () => window.removeEventListener('edusync-festival-preference-updated', refresh)
  }, [previewId])

  if (!enabled) return null
  return festival
}
