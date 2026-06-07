import { FESTIVAL_PREFERENCE_KEY } from './types'

export function isFestivalEffectsEnabled(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const raw = localStorage.getItem(FESTIVAL_PREFERENCE_KEY)
    if (raw === null) return true
    return raw !== 'false'
  } catch {
    return true
  }
}

export function setFestivalEffectsEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(FESTIVAL_PREFERENCE_KEY, enabled ? 'true' : 'false')
  window.dispatchEvent(new CustomEvent('edusync-festival-preference-updated'))
}
