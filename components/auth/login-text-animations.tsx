'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as const

export function StaggeredWords({
  text,
  className,
  delay = 0,
  as: Tag = 'span',
}: {
  text: string
  className?: string
  delay?: number
  as?: 'span' | 'h1' | 'h2' | 'p'
}) {
  const words = text.split(/\s+/)
  const Component = Tag as React.ElementType

  return (
    <Component className={cn('flex flex-wrap', className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * 0.08,
            duration: 0.45,
            ease,
          }}
          className="mr-[0.28em] inline-block last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </Component>
  )
}

type TypewriterPhase = 'waiting' | 'typing' | 'hold' | 'deleting'

export function TypewriterText({
  text,
  className,
  delay = 0.6,
  speed = 20,
  deleteSpeed = 12,
  pauseAtEnd = 2800,
  loop = true,
}: {
  text: string
  className?: string
  delay?: number
  speed?: number
  deleteSpeed?: number
  pauseAtEnd?: number
  loop?: boolean
}) {
  const [length, setLength] = React.useState(0)
  const [phase, setPhase] = React.useState<TypewriterPhase>('waiting')
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  React.useEffect(() => {
    if (reduceMotion) {
      setLength(text.length)
      return
    }

    if (!loop && phase === 'typing' && length >= text.length) {
      return
    }

    const tickMs =
      phase === 'waiting'
        ? delay
        : phase === 'hold'
          ? pauseAtEnd
          : phase === 'deleting'
            ? deleteSpeed
            : speed

    const id = window.setTimeout(() => {
      switch (phase) {
        case 'waiting':
          setPhase('typing')
          break
        case 'typing':
          if (length < text.length) {
            setLength((n) => n + 1)
          } else if (loop) {
            setPhase('hold')
          }
          break
        case 'hold':
          setPhase('deleting')
          break
        case 'deleting':
          if (length > 0) {
            setLength((n) => n - 1)
          } else {
            setPhase('typing')
          }
          break
      }
    }, tickMs)

    return () => window.clearTimeout(id)
  }, [
    phase,
    length,
    text.length,
    delay,
    speed,
    deleteSpeed,
    pauseAtEnd,
    loop,
    reduceMotion,
  ])

  const showCursor = !reduceMotion && (loop || length < text.length)

  return (
    <p className={cn('min-h-18 sm:min-h-15', className)}>
      <span>{text.slice(0, length)}</span>
      {showCursor && (
        <motion.span
          aria-hidden
          className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-px bg-primary align-middle"
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </p>
  )
}

export function FadeUpLine({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
