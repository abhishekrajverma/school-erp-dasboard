'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Phone, RefreshCw } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { env } from '@/lib/config/env'
import { cn } from '@/lib/utils'
import {
  getApiErrorCode,
  getApiErrorMessage,
  isServerUnavailableError,
} from '@/lib/api/interceptors/errors'
import { ServerErrorIllustration } from '@/components/shared/server-error-illustration'
import { ServerWaitGame } from '@/components/shared/server-wait-game'

const easeOut = [0.22, 1, 0.36, 1] as const

const linkClass =
  'font-medium text-[#FF5A5F] underline-offset-4 hover:underline dark:text-rose-400'

function getFriendlyCopy(serverDown: boolean, resourceName: string, message?: string) {
  if (serverDown) {
    return {
      headline: 'Shoot!',
      subhead: 'Well, this is unexpected…',
      body: [
        'An error occurred and we’re working on fixing the problem. We should be up and running again shortly.',
      ],
    }
  }

  return {
    headline: 'Oops!',
    subhead: 'Something didn’t load correctly.',
    body: [
      message ??
        getApiErrorMessage(
          undefined,
          `We couldn’t load ${resourceName} right now. Our team has been notified.`,
        ),
      'Try refreshing the page. If the problem continues, contact your school administrator.',
    ],
  }
}

export function ApiPageLoading({ rows = 4 }: { rows?: number }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </DashboardLayout>
  )
}

type ApiErrorStateProps = {
  error?: unknown
  message?: string
  resourceName?: string
  onRetry?: () => void
  isRetrying?: boolean
  className?: string
}

/** Friendly full-page error — two-column layout with illustration */
export function ApiErrorState({
  error,
  message,
  resourceName = 'this page',
  onRetry,
  isRetrying = false,
  className,
}: ApiErrorStateProps) {
  const reduceMotion = useReducedMotion()
  const serverDown = isServerUnavailableError(error)
  const errorCode = error ? getApiErrorCode(error) : serverDown ? '503' : '500'
  const copy = getFriendlyCopy(
    serverDown,
    resourceName,
    message ?? (error ? getApiErrorMessage(error) : undefined),
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: easeOut }}
      className={cn(
        'flex min-h-[min(640px,75vh)] flex-col items-center justify-center rounded-2xl bg-[#FAFAFA] px-4 py-10 dark:bg-muted/15 sm:px-8 sm:py-14',
        className,
      )}
    >
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="text-4xl font-bold tracking-tight text-[#484848] dark:text-foreground sm:text-5xl"
          >
            {copy.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06, ease: easeOut }}
            className="mt-3 text-xl text-[#484848] dark:text-foreground sm:text-2xl"
          >
            {copy.subhead}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-5 text-base font-medium text-[#767676] dark:text-muted-foreground"
          >
            Error code: {errorCode}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14, ease: easeOut }}
            className="mt-8 space-y-4 text-base leading-relaxed text-[#767676] dark:text-muted-foreground"
          >
            {copy.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {serverDown && (
              <p>
                If you need immediate help with your school records, please{' '}
                <Link href="/settings" className={linkClass}>
                  contact your administrator
                </Link>{' '}
                or visit{' '}
                <Link href="/settings" className={linkClass}>
                  Settings
                </Link>
                .
              </p>
            )}
          </motion.div>

          {onRetry ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: easeOut }}
              className="mt-8 flex flex-col items-center gap-4 lg:items-start"
            >
              <Button
                onClick={onRetry}
                disabled={isRetrying}
                size="lg"
                className="gap-2 rounded-lg bg-[#FF5A5F] px-8 text-white hover:bg-[#E04E52] dark:bg-rose-500 dark:hover:bg-rose-600"
              >
                <RefreshCw className={cn('h-4 w-4', isRetrying && 'animate-spin')} />
                {isRetrying ? 'Reconnecting…' : 'Try again'}
              </Button>
            </motion.div>
          ) : null}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.26, duration: 0.4 }}
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-[#FF5A5F] dark:text-rose-400"
          >
            <Phone className="h-4 w-4" />
            For urgent situations please contact your school office
          </motion.p>

          {serverDown && env.isDev ? (
            <p className="mt-4 font-mono text-xs text-muted-foreground/70">
              Dev: start API at {env.apiUrl}
            </p>
          ) : null}
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          {serverDown ? <ServerWaitGame className="max-w-md lg:max-w-none" /> : <ServerErrorIllustration />}
        </div>
      </div>
    </motion.div>
  )
}

type ApiPageErrorProps = ApiErrorStateProps

export function ApiPageError(props: ApiPageErrorProps) {
  return (
    <DashboardLayout>
      <ApiErrorState {...props} />
    </DashboardLayout>
  )
}

type InlineApiErrorProps = {
  error: unknown
  className?: string
}

export function InlineApiError({ error, className }: InlineApiErrorProps) {
  const reduceMotion = useReducedMotion()
  const serverDown = isServerUnavailableError(error)
  const errorCode = getApiErrorCode(error)

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: easeOut }}
      role="alert"
      className={cn(
        'rounded-xl border border-[#EBEBEB] bg-[#FAFAFA] px-4 py-4 text-sm dark:border-border dark:bg-muted/20',
        className,
      )}
    >
      <p className="text-lg font-bold text-[#484848] dark:text-foreground">
        {serverDown ? 'Shoot!' : 'Sign-in failed'}
      </p>
      <p className="mt-1 text-[#484848] dark:text-foreground">
        {serverDown ? 'Well, this is unexpected…' : 'Please check your credentials.'}
      </p>
      <p className="mt-2 text-xs font-medium text-[#767676] dark:text-muted-foreground">
        Error code: {errorCode}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-[#767676] dark:text-muted-foreground">
        {getApiErrorMessage(
          error,
          'Invalid email or password. Check your credentials and try again.',
        )}
      </p>
      {serverDown && env.isDev ? (
        <p className="mt-2 font-mono text-[11px] text-muted-foreground/70">Dev: {env.apiUrl}</p>
      ) : null}
    </motion.div>
  )
}
