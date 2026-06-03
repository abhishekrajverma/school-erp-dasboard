'use client'

import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api/auth'
import type { AuthContextValue, LoginCredentials } from '@/lib/auth/types'
import { saveSession, clearSession, getSession } from '@/lib/auth/session'
import { queryKeys } from '@/hooks/api/query-keys'

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      try {
        return await authApi.me()
      } catch {
        const cached = getSession()
        return cached
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: ({ user: nextUser }) => {
      saveSession(nextUser)
      queryClient.setQueryData(queryKeys.auth.me(), nextUser)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearSession()
      queryClient.setQueryData(queryKeys.auth.me(), null)
      queryClient.clear()
    },
  })

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isAuthenticated: Boolean(user),
      isLoading,
      login: async (credentials) => {
        const result = await loginMutation.mutateAsync(credentials)
        return result.user
      },
      logout: async () => {
        await logoutMutation.mutateAsync()
      },
      refreshSession: async () => {
        const result = await refetch()
        return result.data ?? null
      },
    }),
    [user, isLoading, loginMutation, logoutMutation, refetch],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
