'use client'

import { motion, useInView } from 'motion/react'
import { ReactNode, useRef } from 'react'
import { cn } from '@/lib/utils'

interface RefractiveContainerProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function RefractiveContainer({
  children,
  className,
  delay = 0,
}: RefractiveContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ filter: 'blur(12px)', opacity: 0, y: 20 }}
      animate={
        isInView
          ? { filter: 'blur(0px)', opacity: 1, y: 0 }
          : { filter: 'blur(12px)', opacity: 0, y: 20 }
      }
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={cn('will-change-[transform,opacity,filter]', className)}
    >
      {children}
    </motion.div>
  )
}
