'use client'

import * as React from 'react'

export function useCounter(target: number, duration = 2000, enabled = true) {
  const [value, setValue] = React.useState(0)

  React.useEffect(() => {
    if (!enabled) return
    let start: number | null = null
    let frame: number

    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, enabled])

  return value
}
