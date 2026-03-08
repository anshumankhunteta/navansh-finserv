'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect, useRef } from 'react'

// ══════════════════════════════════════════════════
// State types for each calculator
// ══════════════════════════════════════════════════

export type InvestmentFrequency =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'custom'
  | 'lumpsum'

export interface SipState {
  goalMode: boolean
  investmentAmount: number
  returnRate: number
  timePeriod: number
  frequency: InvestmentFrequency
  customDays: number
  stepUpEnabled: boolean
  stepUpPercent: number
  targetAmount: number
}

export interface FdState {
  mode: 'calculate' | 'goal'
  principal: number
  interestRate: number
  inflationRate: number
  timePeriod: number
  targetAmount: number
}

export interface SwpState {
  goalMode: boolean
  corpus: number
  monthlyWithdrawal: number
  returnRate: number
  desiredYears: number
}

export interface HlvState {
  monthlyIncome: number
  monthlyExpenses: number
  yearsToRetirement: number
  liabilitiesEnabled: boolean
  liabilities: number
}

export interface EducationState {
  currentCost: number
  inflationRate: number
  years: number
}

export interface MediclaimMember {
  age: number
  label: string
  enabled: boolean
}

export interface MediclaimState {
  planType: 'individual' | 'floater'
  sumInsured: number
  isMetro: boolean
  hasPreExisting: boolean
  individualMembers: MediclaimMember[]
  floaterMembers: MediclaimMember[]
}

// ══════════════════════════════════════════════════
// Defaults
// ══════════════════════════════════════════════════

const DEFAULT_SIP: SipState = {
  goalMode: false,
  investmentAmount: 10000,
  returnRate: 12,
  timePeriod: 20,
  frequency: 'monthly',
  customDays: 30,
  stepUpEnabled: false,
  stepUpPercent: 10,
  targetAmount: 10000000,
}

const DEFAULT_FD: FdState = {
  mode: 'calculate',
  principal: 500000,
  interestRate: 7,
  inflationRate: 6,
  timePeriod: 5,
  targetAmount: 1000000,
}

const DEFAULT_SWP: SwpState = {
  goalMode: false,
  corpus: 10000000,
  monthlyWithdrawal: 50000,
  returnRate: 8,
  desiredYears: 25,
}

const DEFAULT_HLV: HlvState = {
  monthlyIncome: 100000,
  monthlyExpenses: 30000,
  yearsToRetirement: 25,
  liabilitiesEnabled: false,
  liabilities: 2000000,
}

const DEFAULT_EDUCATION: EducationState = {
  currentCost: 1500000,
  inflationRate: 10,
  years: 12,
}

const DEFAULT_MEDICLAIM: MediclaimState = {
  planType: 'floater',
  sumInsured: 500000,
  isMetro: true,
  hasPreExisting: false,
  individualMembers: [{ age: 30, label: 'Self', enabled: true }],
  floaterMembers: [
    { age: 30, label: 'Self', enabled: true },
    { age: 28, label: 'Spouse', enabled: true },
  ],
}

// ══════════════════════════════════════════════════
// Store interface
// ══════════════════════════════════════════════════

interface CalculatorStore {
  sip: SipState
  fd: FdState
  swp: SwpState
  hlv: HlvState
  education: EducationState
  mediclaim: MediclaimState

  // Atomic setters
  setSip: (partial: Partial<SipState>) => void
  setFd: (partial: Partial<FdState>) => void
  setSwp: (partial: Partial<SwpState>) => void
  setHlv: (partial: Partial<HlvState>) => void
  setEducation: (partial: Partial<EducationState>) => void
  setMediclaim: (partial: Partial<MediclaimState>) => void
}

// ══════════════════════════════════════════════════
// Store creation
// ══════════════════════════════════════════════════

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set) => ({
      sip: { ...DEFAULT_SIP },
      fd: { ...DEFAULT_FD },
      swp: { ...DEFAULT_SWP },
      hlv: { ...DEFAULT_HLV },
      education: { ...DEFAULT_EDUCATION },
      mediclaim: { ...DEFAULT_MEDICLAIM },

      setSip: (partial) => set((s) => ({ sip: { ...s.sip, ...partial } })),
      setFd: (partial) => set((s) => ({ fd: { ...s.fd, ...partial } })),
      setSwp: (partial) => set((s) => ({ swp: { ...s.swp, ...partial } })),
      setHlv: (partial) => set((s) => ({ hlv: { ...s.hlv, ...partial } })),
      setEducation: (partial) =>
        set((s) => ({ education: { ...s.education, ...partial } })),
      setMediclaim: (partial) =>
        set((s) => ({ mediclaim: { ...s.mediclaim, ...partial } })),
    }),
    {
      name: 'navansh-calculators',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null
          const str = sessionStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return
          sessionStorage.removeItem(name)
        },
      },
      skipHydration: true,
    }
  )
)

/**
 * Call once near the top of any client component that reads the store.
 * Triggers Zustand persist rehydration from sessionStorage on first mount.
 * Safe to call multiple times — only rehydrates once.
 */
export function useHydrateStore() {
  const hydrated = useRef(false)
  useEffect(() => {
    if (!hydrated.current) {
      useCalculatorStore.persist.rehydrate()
      hydrated.current = true
    }
  }, [])
}

// ══════════════════════════════════════════════════
// URL Serialize / Parse helpers (for Share via Link)
// ══════════════════════════════════════════════════

type CalcKey = 'sip' | 'fd' | 'swp' | 'hlv' | 'education' | 'mediclaim'

/** Serialize a specific calculator's current state into a full shareable URL. */
export function buildShareUrl(calcKey: CalcKey): string {
  const state = useCalculatorStore.getState()
  const params = new URLSearchParams()
  params.set('calc', calcKey)

  switch (calcKey) {
    case 'sip': {
      const s = state.sip
      params.set('goal', s.goalMode ? '1' : '0')
      params.set('amt', String(s.investmentAmount))
      params.set('rate', String(s.returnRate))
      params.set('yrs', String(s.timePeriod))
      params.set('freq', s.frequency)
      params.set('cdays', String(s.customDays))
      params.set('step', s.stepUpEnabled ? '1' : '0')
      params.set('steppct', String(s.stepUpPercent))
      params.set('target', String(s.targetAmount))
      break
    }
    case 'fd': {
      const s = state.fd
      params.set('mode', s.mode)
      params.set('amt', String(s.principal))
      params.set('rate', String(s.interestRate))
      params.set('inf', String(s.inflationRate))
      params.set('yrs', String(s.timePeriod))
      params.set('target', String(s.targetAmount))
      break
    }
    case 'swp': {
      const s = state.swp
      params.set('goal', s.goalMode ? '1' : '0')
      params.set('corpus', String(s.corpus))
      params.set('wd', String(s.monthlyWithdrawal))
      params.set('rate', String(s.returnRate))
      params.set('yrs', String(s.desiredYears))
      break
    }
    case 'hlv': {
      const s = state.hlv
      params.set('income', String(s.monthlyIncome))
      params.set('exp', String(s.monthlyExpenses))
      params.set('yrs', String(s.yearsToRetirement))
      params.set('liab', s.liabilitiesEnabled ? '1' : '0')
      params.set('liabamt', String(s.liabilities))
      break
    }
    case 'education': {
      const s = state.education
      params.set('cost', String(s.currentCost))
      params.set('inf', String(s.inflationRate))
      params.set('yrs', String(s.years))
      break
    }
    case 'mediclaim': {
      const s = state.mediclaim
      params.set('plan', s.planType)
      params.set('sum', String(s.sumInsured))
      params.set('metro', s.isMetro ? '1' : '0')
      params.set('preex', s.hasPreExisting ? '1' : '0')
      // Serialize active members compactly: "Self:30,Spouse:28"
      const members =
        s.planType === 'individual' ? s.individualMembers : s.floaterMembers
      params.set(
        'members',
        members
          .filter((m) => m.enabled)
          .map((m) => `${m.label}:${m.age}`)
          .join(',')
      )
      break
    }
  }

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://navansh.in'
  return `${baseUrl}/enquire?${params.toString()}`
}

/** Parse URL search params and apply them to the store. Returns the calc key if found. */
export function restoreFromUrl(searchParams: URLSearchParams): CalcKey | null {
  const calcKey = searchParams.get('calc') as CalcKey | null
  if (!calcKey) return null

  const num = (key: string, fallback: number) => {
    const v = searchParams.get(key)
    return v !== null ? Number(v) : fallback
  }
  const bool = (key: string) => searchParams.get(key) === '1'

  const { setSip, setFd, setSwp, setHlv, setEducation, setMediclaim } =
    useCalculatorStore.getState()

  switch (calcKey) {
    case 'sip':
      setSip({
        goalMode: bool('goal'),
        investmentAmount: num('amt', 10000),
        returnRate: num('rate', 12),
        timePeriod: num('yrs', 20),
        frequency:
          (searchParams.get('freq') as InvestmentFrequency) || 'monthly',
        customDays: num('cdays', 30),
        stepUpEnabled: bool('step'),
        stepUpPercent: num('steppct', 10),
        targetAmount: num('target', 10000000),
      })
      break
    case 'fd':
      setFd({
        mode: (searchParams.get('mode') as 'calculate' | 'goal') || 'calculate',
        principal: num('amt', 500000),
        interestRate: num('rate', 7),
        inflationRate: num('inf', 6),
        timePeriod: num('yrs', 5),
        targetAmount: num('target', 1000000),
      })
      break
    case 'swp':
      setSwp({
        goalMode: bool('goal'),
        corpus: num('corpus', 10000000),
        monthlyWithdrawal: num('wd', 50000),
        returnRate: num('rate', 8),
        desiredYears: num('yrs', 25),
      })
      break
    case 'hlv':
      setHlv({
        monthlyIncome: num('income', 100000),
        monthlyExpenses: num('exp', 30000),
        yearsToRetirement: num('yrs', 25),
        liabilitiesEnabled: bool('liab'),
        liabilities: num('liabamt', 2000000),
      })
      break
    case 'education':
      setEducation({
        currentCost: num('cost', 1500000),
        inflationRate: num('inf', 10),
        years: num('yrs', 12),
      })
      break
    case 'mediclaim': {
      const planType =
        (searchParams.get('plan') as 'individual' | 'floater') || 'floater'
      const membersStr = searchParams.get('members') || ''
      const members: MediclaimMember[] = membersStr
        ? membersStr.split(',').map((m) => {
            const [label, ageStr] = m.split(':')
            return { label, age: Number(ageStr) || 30, enabled: true }
          })
        : []

      const update: Partial<MediclaimState> = {
        planType,
        sumInsured: num('sum', 500000),
        isMetro: bool('metro'),
        hasPreExisting: bool('preex'),
      }

      if (planType === 'individual' && members.length > 0) {
        update.individualMembers = members
      } else if (members.length > 0) {
        update.floaterMembers = members
      }

      setMediclaim(update)
      break
    }
  }

  return calcKey
}
