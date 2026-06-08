import type { PlanKey } from './types'

export const PLAN_LABELS: Record<PlanKey, string> = {
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
}

export function planLabel(key: PlanKey): string {
  return PLAN_LABELS[key] ?? key
}
