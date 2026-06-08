'use client'

import { QueryProvider } from '@/components/providers/query-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { TenantProvider } from '@/components/providers/tenant-provider'
import { FinancialYearProvider } from '@/components/providers/financial-year-provider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <TenantProvider>
          <FinancialYearProvider>{children}</FinancialYearProvider>
        </TenantProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
