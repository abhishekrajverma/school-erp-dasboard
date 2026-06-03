'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col gap-3 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:max-w-[420px]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  [
    'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden',
    'rounded-xl border p-4 pr-10 shadow-2xl backdrop-blur-xl',
    'transition-all duration-300 ease-out',
    'data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full',
    'data-[state=open]:duration-300 data-[state=closed]:duration-200',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'border-primary/20 bg-background/92 text-foreground shadow-primary/10 dark:border-primary/25 dark:bg-card/88',
        success:
          'border-emerald-500/25 bg-background/92 text-foreground shadow-emerald-500/10 dark:border-emerald-400/20 dark:bg-card/88',
        warning:
          'border-amber-500/25 bg-background/92 text-foreground shadow-amber-500/10 dark:border-amber-400/20 dark:bg-card/88',
        destructive:
          'destructive group border-destructive/30 bg-destructive/95 text-destructive-foreground shadow-destructive/20 backdrop-blur-md',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/60 px-3 text-sm font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none disabled:opacity-50',
      'group-[.destructive]:border-destructive-foreground/20 group-[.destructive]:bg-destructive-foreground/10 group-[.destructive]:hover:bg-destructive-foreground/20',
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg',
      'text-muted-foreground/70 opacity-70 transition-all hover:bg-muted/80 hover:text-foreground hover:opacity-100',
      'focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring',
      'group-[.destructive]:text-destructive-foreground/70 group-[.destructive]:hover:bg-destructive-foreground/15 group-[.destructive]:hover:text-destructive-foreground',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-3.5 w-3.5" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold leading-snug tracking-tight', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm leading-relaxed text-muted-foreground group-[.destructive]:text-destructive-foreground/85', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
