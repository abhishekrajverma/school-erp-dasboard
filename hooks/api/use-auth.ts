'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api/auth'
import { queryKeys } from '@/hooks/api/query-keys'
import type { LoginCredentials } from '@/lib/auth/types'

export { useAuth } from '@/components/providers/auth-provider'

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.auth.me(), user)
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authApi.me(),
    retry: false,
  })
}
