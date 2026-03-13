'use client'

import { motion, Variants } from 'motion/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AuraBackground } from '@/components/landing/AuraBackground'

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
        <motion.div
          className="mx-auto max-w-5xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="mb-6 text-5xl font-bold tracking-tight will-change-[transform,opacity,filter] md:text-6xl lg:text-7xl"
          >
            Gain <span className="italic">Absolute</span> Financial{' '}
            <span className="text-primary italic">Clarity</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mb-4 text-xl font-bold tracking-wide text-white will-change-[transform,opacity,filter] md:text-3xl"
          >
            Precision. Foresight. Transparency.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-muted-foreground mx-auto mb-10 max-w-2xl text-sm font-semibold will-change-[transform,opacity,filter] sm:text-xl"
          >
            Market noise is everywhere. Clarity is rare. Look no further for
            personalised advice and a wide range of services.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="will-change-[transform,opacity,filter]"
          >
            <Button
              asChild
              size="lg"
              className="group bg-primary/20 hover:bg-primary/30 text-primary hover:text-primary-foreground border-primary/50 text-md active:bg-primary/30 relative animate-pulse overflow-hidden rounded-full border-2 px-8 py-6 font-semibold backdrop-blur-md transition-all duration-300 active:animate-none sm:text-lg"
            >
              <Link href="/enquire">
                <span className="relative z-10 font-[family-name:var(--font-inter)] font-bold tracking-wider">
                  GET A FREE PORTFOLIO REVIEW
                </span>
                <div className="bg-primary absolute inset-0 -z-0 -translate-x-full transition-transform duration-500 ease-in-out group-hover:translate-x-0" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
