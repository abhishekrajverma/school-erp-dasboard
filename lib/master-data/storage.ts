import { DEFAULT_MASTER_DATA } from './defaults'
import { migrateMasterDataClassFields } from './format'
import { normalizeFinancialYear, currentFinancialYear } from '@/lib/financial-year/format'
import type { MasterData } from './types'
import { MASTER_DATA_UPDATED_EVENT } from './types'

function legacyStorageKey(tenantId: string): string {
  return `edusync-master-data:${tenantId}`
}

function storageKey(tenantId: string, financialYear: string): string {
  const fy = normalizeFinancialYear(financialYear)
  return `edusync-master-data:${tenantId}:${fy}`
}

function migrateLegacyMasterData(tenantId: string, financialYear: string): MasterData | null {
  if (typeof window === 'undefined') return null
  const legacy = localStorage.getItem(legacyStorageKey(tenantId))
  if (!legacy) return null

  try {
    const parsed = { ...DEFAULT_MASTER_DATA, ...(JSON.parse(legacy) as Partial<MasterData>) }
    const migrated = {
      ...parsed,
      ...migrateMasterDataClassFields(parsed),
      academicYear: normalizeFinancialYear(financialYear),
    } as MasterData
    localStorage.setItem(storageKey(tenantId, financialYear), JSON.stringify(migrated))
    return migrated
  } catch {
    return null
  }
}

export function loadMasterData(tenantId: string, financialYear?: string): MasterData {
  const fy = normalizeFinancialYear(financialYear ?? currentFinancialYear())
  if (typeof window === 'undefined') {
    return { ...DEFAULT_MASTER_DATA, academicYear: fy }
  }

  try {
    const raw = localStorage.getItem(storageKey(tenantId, fy))
    if (!raw) {
      const legacy = migrateLegacyMasterData(tenantId, fy)
      if (legacy) return legacy
      return { ...DEFAULT_MASTER_DATA, academicYear: fy }
    }

    const parsed = { ...DEFAULT_MASTER_DATA, ...(JSON.parse(raw) as Partial<MasterData>) }
    const merged = {
      ...parsed,
      ...migrateMasterDataClassFields(parsed),
      academicYear: fy,
    } as MasterData
    return merged
  } catch {
    return { ...DEFAULT_MASTER_DATA, academicYear: fy }
  }
}

export function saveMasterData(
  tenantId: string,
  data: MasterData,
  financialYear?: string,
): void {
  if (typeof window === 'undefined') return
  const fy = normalizeFinancialYear(financialYear ?? data.academicYear ?? currentFinancialYear())
  const payload = { ...data, academicYear: fy }
  localStorage.setItem(storageKey(tenantId, fy), JSON.stringify(payload))
  window.dispatchEvent(new CustomEvent(MASTER_DATA_UPDATED_EVENT))
}
