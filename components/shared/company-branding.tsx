'use client'

import * as React from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { companyBrand, companyCopyright } from '@/lib/company-branding'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type CompanyBrandingProps = {
  variant?: 'sidebar' | 'footer' | 'compact'
  collapsed?: boolean
  className?: string
}

export function CompanyBranding({
  variant = 'sidebar',
  collapsed = false,
  className,
}: CompanyBrandingProps) {
  const mark = (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-lg bg-primary',
        variant === 'compact' ? 'h-7 w-7' : 'h-8 w-8',
      )}
    >
      <Sparkles
        className={cn('text-primary-foreground', variant === 'compact' ? 'h-3.5 w-3.5' : 'h-4 w-4')}
      />
    </div>
  )

  if (variant === 'footer') {
    return (
      <div className={cn('text-center text-xs text-muted-foreground', className)}>
        <p>
          {companyBrand.poweredByLabel}{' '}
          <Link
            href={companyBrand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground/80 hover:text-primary hover:underline"
          >
            {companyBrand.name}
          </Link>
        </p>
        <p className="mt-1">{companyCopyright()}</p>
      </div>
    )
  }

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={companyBrand.website}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('mx-auto block w-fit', className)}
            aria-label={`${companyBrand.poweredByLabel} ${companyBrand.name}`}
          >
            {mark}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p className="font-medium">{companyBrand.name}</p>
          <p className="text-xs text-muted-foreground">{companyBrand.tagline}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Link
      href={companyBrand.website}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/30 p-2.5 transition-colors hover:border-primary/30 hover:bg-muted/50',
        className,
      )}
    >
      {mark}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {companyBrand.poweredByLabel}
        </p>
        <p className="truncate text-sm font-semibold leading-tight text-foreground group-hover:text-primary">
          {companyBrand.name}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">{companyBrand.tagline}</p>
        {variant === 'sidebar' && (
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground/80">{companyBrand.websiteLabel}</p>
        )}
      </div>
    </Link>
  )
}
