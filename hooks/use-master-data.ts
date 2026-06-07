'use client'

import * as React from 'react'
import { useTenant } from '@/components/providers/tenant-provider'
import { DEFAULT_MASTER_DATA } from '@/lib/master-data/defaults'
import { loadMasterData, saveMasterData } from '@/lib/master-data/storage'
import type { MasterData } from '@/lib/master-data/types'
import { MASTER_DATA_UPDATED_EVENT } from '@/lib/master-data/types'

export function useMasterData() {
  const { tenantId } = useTenant()
  const id = tenantId ?? 'default'

  const [data, setData] = React.useState<MasterData>(() =>
    typeof window === 'undefined' ? DEFAULT_MASTER_DATA : loadMasterData(id),
  )

  React.useEffect(() => {
    setData(loadMasterData(id))
  }, [id])

  React.useEffect(() => {
    const onUpdate = () => setData(loadMasterData(id))
    window.addEventListener(MASTER_DATA_UPDATED_EVENT, onUpdate)
    return () => window.removeEventListener(MASTER_DATA_UPDATED_EVENT, onUpdate)
  }, [id])

  const save = React.useCallback(
    (next: MasterData) => {
      saveMasterData(id, next)
      setData(next)
    },
    [id],
  )

  return { data, save, tenantId: id }
}
