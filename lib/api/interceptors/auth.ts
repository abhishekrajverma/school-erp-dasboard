let refreshPromise: Promise<boolean> | null = null

/** Attempt silent token refresh via BFF */
export async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })
      return res.ok
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export async function handleUnauthorized(): Promise<boolean> {
  const refreshed = await refreshAccessToken()
  if (refreshed) return true

  if (typeof window !== 'undefined') {
    const { clearSession } = await import('@/lib/auth/session')
    clearSession()
    if (!window.location.pathname.startsWith('/login')) {
      window.location.assign('/login')
    }
  }
  return false
}
