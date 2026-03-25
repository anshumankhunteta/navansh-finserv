'use client'

import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  className?: string
  duration?: number
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  className,
  duration = 2,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState('0')
  const inView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration,
        ease: 'easeOut',
        onUpdate: (latest) => {
          setDisplayValue(Math.floor(latest).toString())
        },
      })
      return controls.stop
    }
  }, [inView, value, duration])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}
