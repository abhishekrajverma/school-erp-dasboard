export const AUTH_STORAGE_KEY = 'erp-authenticated-user'

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

export function markLoggedIn() {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_STORAGE_KEY, 'true')
}

export function markLoggedOut() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
