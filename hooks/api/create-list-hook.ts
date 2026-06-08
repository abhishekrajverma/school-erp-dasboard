'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ListQueryParams } from '@/lib/api/types/common'
import { useAuthQueryEnabled } from './use-auth-query'
import { useQueryFinancialYear } from '@/hooks/use-query-financial-year'

type ResourceApi<T, Create = Partial<T>, Update = Partial<T>> = {
  list: (params?: ListQueryParams) => Promise<{ items: T[] }>
  getById?: (id: string) => Promise<T>
  create?: (body: Create) => Promise<T>
  update?: (id: string, body: Update) => Promise<T>
  delete?: (id: string) => Promise<void>
}

export function createListHook<T>(
  queryKeyBase: readonly unknown[],
  api: Pick<ResourceApi<T>, 'list'>,
) {
  return function useList(params?: ListQueryParams) {
    const enabled = useAuthQueryEnabled()
    const financialYear = useQueryFinancialYear()
    return useQuery({
      queryKey: [...queryKeyBase, { ...(params ?? {}), financialYear }],
      queryFn: () => api.list(params),
      enabled,
    })
  }
}

export function createCrudHooks<T, Create = Partial<T>, Update = Partial<T>>(
  queryKeyBase: readonly unknown[],
  api: ResourceApi<T, Create, Update>,
) {
  const useList = createListHook(queryKeyBase, api)

  function useDetail(id: string) {
    const enabled = useAuthQueryEnabled()
    return useQuery({
      queryKey: [...queryKeyBase, 'detail', id],
      queryFn: () => api.getById!(id),
      enabled: enabled && Boolean(id) && Boolean(api.getById),
    })
  }

  function useCreate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (body: Create) => api.create!(body),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeyBase }),
    })
  }

  function useUpdate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, body }: { id: string; body: Update }) => api.update!(id, body),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeyBase }),
    })
  }

  function useDelete() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => api.delete!(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeyBase }),
    })
  }

  return { useList, useDetail, useCreate, useUpdate, useDelete }
}
