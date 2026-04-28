'use client'

import { LazyMotion, domAnimation, m, type Variants } from 'motion/react'
import { AuraBackground } from '@/components/landing/AuraBackground'
import { SubscribeInput } from '@/components/landing/SubscribeInput'

export function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 20 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative flex min-h-[95vh] items-center justify-center overflow-hidden py-24">
      <AuraBackground />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <LazyMotion features={domAnimation}>
          <m.div
            className="mx-auto max-w-5xl text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <m.h1
              variants={itemVariants}
              className="mb-6 text-5xl font-bold tracking-tight will-change-[transform,opacity,filter] md:text-6xl lg:text-7xl"
            >
              Gain <span className="italic">Absolute</span> Financial{' '}
              <span className="text-primary italic">Clarity</span>
            </m.h1>

            <m.p
              variants={itemVariants}
              className="mb-4 text-xl font-bold tracking-wide text-white will-change-[transform,opacity,filter] md:text-3xl"
            >
              Precision. Foresight. Transparency.
            </m.p>

            <m.p
              variants={itemVariants}
              className="text-muted-foreground mx-auto mb-10 max-w-2xl text-sm font-semibold will-change-[transform,opacity,filter] sm:text-xl"
            >
              Market noise is everywhere. Clarity is rare. Look no further for
              personalised advice and a wide range of services.
            </m.p>

            <m.div
              variants={itemVariants}
              className="will-change-[transform,opacity,filter]"
            >
              <SubscribeInput />
            </m.div>
          </m.div>
        </LazyMotion>
      </div>
    </section>
  )
}
