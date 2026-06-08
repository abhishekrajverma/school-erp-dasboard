'use client'

import * as React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/auth-provider'
import { useTenant } from '@/components/providers/tenant-provider'
import { financialYearSettingsApi } from '@/lib/api/financial-year-settings'
import {
  FINANCIAL_YEAR_UPDATED_EVENT,
  loadFinancialYearConfig,
  loadActiveFinancialYear,
  parseFinancialYearsList,
  saveActiveFinancialYear,
  saveFinancialYearConfig,
  formatFinancialYearsList,
  type FinancialYearConfig,
} from '@/lib/financial-year'
import { MASTER_DATA_UPDATED_EVENT } from '@/lib/master-data/types'

export type FinancialYearContextValue = {
  activeFinancialYear: string
  availableFinancialYears: string[]
  hideFinancialYearUi: boolean
  config: FinancialYearConfig
  setActiveFinancialYear: (financialYear: string) => Promise<void>
  saveConfig: (config: FinancialYearConfig) => void
}

const FinancialYearContext = React.createContext<FinancialYearContextValue | null>(null)

async function syncFinancialYearCookie(financialYear: string) {
  await fetch('/api/financial-year', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ financialYear }),
  }).catch(() => undefined)
}

export function FinancialYearProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { tenantId } = useTenant()
  const { user, isAuthenticated } = useAuth()
  const id = tenantId ?? 'default'

  const [config, setConfigState] = React.useState<FinancialYearConfig>(() =>
    loadFinancialYearConfig(id),
  )

  const [activeFinancialYear, setActiveState] = React.useState<string>(() =>
    loadActiveFinancialYear(id, config.defaultFinancialYear),
  )

  const { data: remoteSettings, refetch: refetchSettings } = useQuery({
    queryKey: ['financial-year-settings', id],
    queryFn: () => financialYearSettingsApi.get(),
    enabled: isAuthenticated && user?.role === 'admin' && Boolean(tenantId),
    staleTime: 5 * 60 * 1000,
  })

  React.useEffect(() => {
    const nextConfig = loadFinancialYearConfig(id)
    setConfigState(nextConfig)
    setActiveState(loadActiveFinancialYear(id, nextConfig.defaultFinancialYear))
  }, [id])

  React.useEffect(() => {
    if (!remoteSettings) return

    const years = remoteSettings.years.map((year) => year.name)
    const nextConfig: FinancialYearConfig = {
      financialYearsList: formatFinancialYearsList(years),
      defaultFinancialYear: remoteSettings.defaultYear,
      hideFinancialYearUi: remoteSettings.hideInUi,
    }
    setConfigState(nextConfig)
    saveFinancialYearConfig(id, nextConfig)

    const current =
      remoteSettings.years.find((year) => year.isCurrent)?.name ??
      remoteSettings.defaultYear ??
      years[years.length - 1]

    if (current) {
      saveActiveFinancialYear(id, current)
      setActiveState(current)
      void syncFinancialYearCookie(current)
    }
  }, [remoteSettings, id])

  const reload = React.useCallback(() => {
    if (isAuthenticated && user?.role === 'admin') {
      void refetchSettings()
      return
    }

    const nextConfig = loadFinancialYearConfig(id)
    setConfigState(nextConfig)
    setActiveState(loadActiveFinancialYear(id, nextConfig.defaultFinancialYear))
  }, [id, isAuthenticated, refetchSettings, user?.role])

  React.useEffect(() => {
    const onConfigUpdate = () => reload()
    window.addEventListener(MASTER_DATA_UPDATED_EVENT, onConfigUpdate)
    window.addEventListener(FINANCIAL_YEAR_UPDATED_EVENT, onConfigUpdate)
    return () => {
      window.removeEventListener(MASTER_DATA_UPDATED_EVENT, onConfigUpdate)
      window.removeEventListener(FINANCIAL_YEAR_UPDATED_EVENT, onConfigUpdate)
    }
  }, [reload])

  const availableFinancialYears = React.useMemo(
    () => parseFinancialYearsList(config.financialYearsList),
    [config.financialYearsList],
  )

  const setActiveFinancialYear = React.useCallback(
    async (financialYear: string) => {
      if (user?.role === 'admin') {
        await financialYearSettingsApi.setCurrent(financialYear)
        await refetchSettings()
      } else {
        saveActiveFinancialYear(id, financialYear)
        setActiveState(loadActiveFinancialYear(id, config.defaultFinancialYear))
      }

      await syncFinancialYearCookie(financialYear)
      await queryClient.invalidateQueries()
    },
    [id, config.defaultFinancialYear, queryClient, refetchSettings, user?.role],
  )

  const saveConfig = React.useCallback(
    (next: FinancialYearConfig) => {
      saveFinancialYearConfig(id, next)
      setConfigState(next)
      window.dispatchEvent(new CustomEvent(FINANCIAL_YEAR_UPDATED_EVENT))
    },
    [id],
  )

  const value = React.useMemo<FinancialYearContextValue>(
    () => ({
      activeFinancialYear,
      availableFinancialYears,
      hideFinancialYearUi: config.hideFinancialYearUi,
      config,
      setActiveFinancialYear,
      saveConfig,
    }),
    [
      activeFinancialYear,
      availableFinancialYears,
      config,
      setActiveFinancialYear,
      saveConfig,
    ],
  )

  return (
    <FinancialYearContext.Provider value={value}>{children}</FinancialYearContext.Provider>
  )
}

export function useFinancialYear(): FinancialYearContextValue {
  const context = React.useContext(FinancialYearContext)
  if (!context) {
    throw new Error('useFinancialYear must be used within FinancialYearProvider')
  }
  return context
}
