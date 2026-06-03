'use client'

import * as React from 'react'
import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from '@tanstack/react-query'
import { reportError } from '@/lib/observability/report-error'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      },
      mutations: {
        onError: (error) => reportError(error),
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (isServer) return makeQueryClient()
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(getQueryClient)

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
