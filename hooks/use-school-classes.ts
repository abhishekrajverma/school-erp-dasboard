'use client'

import * as React from 'react'
import { buildClassRange, mergeClassNames, parseSectionList } from '@/lib/master-data/format'
import { useMasterData } from '@/hooks/use-master-data'

export function useSchoolClasses() {
  const { data: masterData } = useMasterData()

  const classes = React.useMemo(() => buildClassRange(masterData), [masterData])

  const sections = React.useMemo(() => {
    const parsed = parseSectionList(masterData.defaultSections)
    return parsed.length > 0 ? parsed : ['A', 'B', 'C', 'D']
  }, [masterData.defaultSections])

  const mergeWith = React.useCallback(
    (extra: string[]) => mergeClassNames(classes, extra),
    [classes],
  )

  return { classes, sections, masterData, mergeWith }
}
