'use client'

import { RetirementCalculator } from '@/components/custom/RetirementCalculator'
import { SIPCalculator } from '@/components/custom/SIPCalculator'
import { useCallback, useRef, useState } from 'react'

const TABS = [
  { id: 'sip', label: 'SIP Calculator' },
  { id: 'retirement', label: 'Retirement Calculator' },
] as const

type TabId = (typeof TABS)[number]['id']

export function CalculatorTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('sip')
  const touchStartX = useRef<number | null>(null)

  const activeIndex = TABS.findIndex((t) => t.id === activeTab)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return
      const delta = touchStartX.current - e.changedTouches[0].clientX
      if (Math.abs(delta) < 50) return // ignore small swipes
      if (delta > 0 && activeTab === 'sip') setActiveTab('retirement')
      if (delta < 0 && activeTab === 'retirement') setActiveTab('sip')
      touchStartX.current = null
    },
    [activeTab]
  )

  return (
    <div className="bg-card border-border/50 sticky top-24 flex flex-col overflow-hidden rounded-2xl border">
      {/* Tab Bar */}
      <div className="border-border/50 relative flex overflow-x-auto border-b">
        {TABS.map((tab, idx) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'relative flex min-w-[50%] flex-1 cursor-pointer items-center justify-center px-4 py-4 text-sm font-semibold transition-colors duration-200 select-none',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              <span className="text-center">{tab.label}</span>
              {/* Active indicator */}
              {isActive && (
                <span className="bg-primary absolute bottom-0 left-0 h-0.5 w-full rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Sliding Panels */}
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out will-change-transform"
          style={{
            width: '200%',
            transform: `translateX(${activeIndex === 0 ? '0%' : '-50%'})`,
          }}
        >
          {/* SIP Panel */}
          <div className="w-1/2 min-w-0 p-6 md:p-8">
            <SIPCalculator />
          </div>
          {/* Retirement Panel */}
          <div className="w-1/2 min-w-0 p-6 md:p-8">
            <RetirementCalculator />
          </div>
        </div>
      </div>
    </div>
  )
}
