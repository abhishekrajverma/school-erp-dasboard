'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const ease = [0.16, 1, 0.3, 1] as const

const transition = {
  duration: 0.55,
  ease,
}

function RotatingWord({
  word,
  isDark,
  className,
}: {
  word: string
  isDark: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'block whitespace-nowrap font-bold',
        isDark
          ? 'text-primary'
          : 'bg-linear-to-r from-primary via-indigo-600 to-violet-600 bg-clip-text text-transparent',
        className,
      )}
    >
      {word}
    </span>
  )
}

export function RotatingText({
  words,
  intervalMs = 3000,
  className,
  wordClassName,
}: {
  words: readonly string[]
  intervalMs?: number
  className?: string
  wordClassName?: string
}) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [index, setIndex] = React.useState(0)

  const longest = React.useMemo(
    () => words.reduce((a, b) => (a.length >= b.length ? a : b)),
    [words],
  )

  const isDark = resolvedTheme !== 'light'
  const reduceMotion = useReducedMotion()

  const slideTransition = reduceMotion
    ? { duration: 0.2, ease }
    : transition

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted || words.length <= 1) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [mounted, words.length, intervalMs])

  return (
    <span
      className={cn('relative inline-block align-bottom text-left', className)}
      aria-live="polite"
    >
      <span className={cn('invisible block whitespace-nowrap font-bold', wordClassName)} aria-hidden>
        {longest}
      </span>

      <span className="absolute left-0 top-0 inline-block w-full overflow-hidden leading-[1.12]">
        <span
          className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-full origin-left rounded-full bg-linear-to-r from-transparent via-primary to-transparent landing-hero-accent-line"
          aria-hidden
        />

        {mounted && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={words[index]}
              initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
              animate={reduceMotion ? { opacity: 1 } : { y: '0%' }}
              exit={reduceMotion ? { opacity: 0 } : { y: '-100%' }}
              transition={slideTransition}
              className="block will-change-transform motion-reduce:transition-none"
            >
              <RotatingWord word={words[index]} isDark={isDark} className={wordClassName} />
            </motion.span>
          </AnimatePresence>
        )}
      </span>
    </span>
  )
}
