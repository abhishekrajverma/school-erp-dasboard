'use client'

import { useAuth } from '@/components/providers/auth-provider'

/** Shared React Query options — only fetch when logged in */
export function useAuthQueryEnabled(): boolean {
  const { isAuthenticated, isLoading } = useAuth()
  return !isLoading && isAuthenticated
}
