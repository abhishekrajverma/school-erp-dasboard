import { DEFAULT_MASTER_DATA } from './defaults'
import { migrateMasterDataClassFields } from './format'
import type { MasterData } from './types'
import { MASTER_DATA_UPDATED_EVENT } from './types'

function storageKey(tenantId: string): string {
  return `edusync-master-data:${tenantId}`
}

export function loadMasterData(tenantId: string): MasterData {
  if (typeof window === 'undefined') return { ...DEFAULT_MASTER_DATA }
  try {
    const raw = localStorage.getItem(storageKey(tenantId))
    if (!raw) return { ...DEFAULT_MASTER_DATA }
    const parsed = { ...DEFAULT_MASTER_DATA, ...(JSON.parse(raw) as Partial<MasterData>) }
    return { ...parsed, ...migrateMasterDataClassFields(parsed) } as MasterData
  } catch {
    return { ...DEFAULT_MASTER_DATA }
  }
}

export function saveMasterData(tenantId: string, data: MasterData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(storageKey(tenantId), JSON.stringify(data))
  window.dispatchEvent(new CustomEvent(MASTER_DATA_UPDATED_EVENT))
}
