/**
 * Shared financial math utilities for calculator components.
 * Keeps all formulas in one place so the UI components stay clean.
 */

/** Format a number in Indian currency style: ₹ 1,23,456 */
export function formatINR(num: number): string {
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })
  return `₹ ${formatted}`
}

/** Compact Indian format: ₹12.5L, ₹1.2Cr */
export function formatINRCompact(num: number): string {
  if (num >= 1_00_00_000) {
    return `₹${(num / 1_00_00_000).toFixed(1)}Cr`
  }
  if (num >= 1_00_000) {
    return `₹${(num / 1_00_000).toFixed(1)}L`
  }
  return formatINR(num)
}

/**
 * Standard SIP Future Value
 * FV = P × ((1+r)^n − 1) / r × (1+r)
 */
export function calcSIPFutureValue(
  P: number,
  annualRate: number,
  years: number,
  periodsPerYear: number
): { investedAmount: number; futureValue: number } {
  const r = annualRate / 100 / periodsPerYear
  const n = years * periodsPerYear
  const investedAmount = P * n
  const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  return { investedAmount, futureValue: Math.round(futureValue) }
}

/**
 * Step-Up SIP Future Value
 * Each year the monthly investment P increases by stepUpPercent%.
 * We compute each year's contribution separately and compound.
 */
export function calcStepUpSIPFutureValue(
  P: number,
  annualStepUpPercent: number,
  annualRate: number,
  years: number
): { investedAmount: number; futureValue: number } {
  const monthlyRate = annualRate / 100 / 12
  let totalFV = 0
  let totalInvested = 0
  let currentP = P

  for (let year = 0; year < years; year++) {
    // This year's monthly SIP runs for 12 months
    const sipFV =
      currentP *
      ((Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate) *
      (1 + monthlyRate)
    // This year's SIP will compound for the remaining years
    const remainingYears = years - year - 1
    const compounded = sipFV * Math.pow(1 + annualRate / 100, remainingYears)
    totalFV += compounded
    totalInvested += currentP * 12
    currentP = currentP * (1 + annualStepUpPercent / 100)
  }

  return {
    investedAmount: Math.round(totalInvested),
    futureValue: Math.round(totalFV),
  }
}

/**
 * Lumpsum Future Value
 * FV = P × (1 + r)^t
 */
export function calcLumpsumFV(
  P: number,
  annualRate: number,
  years: number
): number {
  return Math.round(P * Math.pow(1 + annualRate / 100, years))
}

/**
 * Education Inflation Calculator
 * Future Cost = Current Cost × (1 + inflation)^years
 */
export function calcEducationInflation(
  currentCost: number,
  inflationRate: number,
  years: number
): number {
  return Math.round(currentCost * Math.pow(1 + inflationRate / 100, years))
}

/**
 * SWP (Systematic Withdrawal Plan) — Retirement Burn Rate
 * Calculates how many months a corpus lasts given monthly withdrawal and annual returns.
 * Returns { lastingMonths, totalWithdrawn, remainingCorpus }.
 * Caps at 600 months (50 years).
 */
export function calcSWPDepletion(
  corpus: number,
  monthlyWithdrawal: number,
  annualReturnRate: number
): { lastingMonths: number; totalWithdrawn: number; totalGains: number } {
  const monthlyRate = annualReturnRate / 100 / 12
  let balance = corpus
  let months = 0
  let totalWithdrawn = 0
  const maxMonths = 600 // 50 years cap

  // If monthly withdrawal is less than monthly returns, corpus never depletes
  if (monthlyWithdrawal <= balance * monthlyRate) {
    return {
      lastingMonths: maxMonths,
      totalWithdrawn: monthlyWithdrawal * maxMonths,
      totalGains: monthlyWithdrawal * maxMonths - corpus + corpus, // simplified
    }
  }

  while (balance > 0 && months < maxMonths) {
    balance = balance * (1 + monthlyRate) - monthlyWithdrawal
    months++
    totalWithdrawn += monthlyWithdrawal
    if (balance < 0) {
      totalWithdrawn += balance // adjust last partial withdrawal
      balance = 0
    }
  }

  return {
    lastingMonths: months,
    totalWithdrawn: Math.round(totalWithdrawn),
    totalGains: Math.round(totalWithdrawn - corpus),
  }
}

/**
 * Human Life Value (HLV)
 * HLV = (Annual Income − Annual Personal Expenses) × Years Until Retirement + Liabilities
 * Liabilities are outstanding loans that become the family's burden.
 */
export function calcHLV(
  monthlyIncome: number,
  monthlyExpenses: number,
  yearsToRetirement: number,
  liabilities: number = 0
): {
  hlvValue: number
  totalIncome: number
  totalExpenses: number
  liabilities: number
} {
  const annualSurplus = (monthlyIncome - monthlyExpenses) * 12
  const hlvValue = Math.max(0, annualSurplus * yearsToRetirement) + liabilities
  return {
    hlvValue: Math.round(hlvValue),
    totalIncome: Math.round(monthlyIncome * 12 * yearsToRetirement),
    totalExpenses: Math.round(monthlyExpenses * 12 * yearsToRetirement),
    liabilities: Math.round(liabilities),
  }
}

// ────────────────────────────────────────────
// GOAL SEEK (Reverse-Solve) Functions
// ────────────────────────────────────────────

/**
 * Reverse SIP: Given a target future value, find the required periodic investment.
 * P = FV × r / (((1+r)^n − 1) × (1+r))   (annuity-due PMT)
 */
export function calcSIPRequiredInvestment(
  targetAmount: number,
  annualRate: number,
  years: number,
  periodsPerYear: number
): number {
  if (annualRate === 0)
    return Math.round(targetAmount / (years * periodsPerYear))
  const r = annualRate / 100 / periodsPerYear
  const n = years * periodsPerYear
  const pmt = (targetAmount * r) / ((Math.pow(1 + r, n) - 1) * (1 + r))
  return Math.round(pmt)
}

/**
 * Reverse Step-Up SIP: Given a target FV, step-up %, rate, and years,
 * find the required initial monthly investment.
 * Exploits linearity: FV scales linearly with initial P, so P = target / (FV when P=1).
 */
export function calcStepUpSIPRequiredInvestment(
  targetAmount: number,
  annualStepUpPercent: number,
  annualRate: number,
  years: number
): number {
  const { futureValue: fvForOne } = calcStepUpSIPFutureValue(
    1,
    annualStepUpPercent,
    annualRate,
    years
  )
  if (fvForOne <= 0) return 0
  return Math.round(targetAmount / fvForOne)
}

/**
 * Reverse SWP: Given desired monthly withdrawal, return rate, and duration,
 * find the required corpus(Present Value of Annuity).
 * PV = PMT × (1 − (1 + r) ^ (−n)) / r
 * Returns { requiredCorpus, isPerpetual }
 */
export function calcSWPRequiredCorpus(
  monthlyWithdrawal: number,
  annualReturnRate: number,
  desiredYears: number
): { requiredCorpus: number; isPerpetual: boolean } {
  const monthlyRate = annualReturnRate / 100 / 12
  const n = desiredYears * 12

  // If rate is 0, simple multiplication
  if (monthlyRate === 0) {
    return {
      requiredCorpus: Math.round(monthlyWithdrawal * n),
      isPerpetual: false,
    }
  }

  // PV of annuity
  const pv =
    (monthlyWithdrawal * (1 - Math.pow(1 + monthlyRate, -n))) / monthlyRate
  return { requiredCorpus: Math.round(pv), isPerpetual: false }
}

// ────────────────────────────────────────────
// FD (Fixed Deposit) Functions
// ────────────────────────────────────────────

/**
 * FD Maturity with annual compounding
 * A = P × (1 + r)^t
 */
export function calcFDMaturity(
  principal: number,
  annualRate: number,
  years: number
): { maturityAmount: number; interestEarned: number } {
  const maturityAmount = principal * Math.pow(1 + annualRate / 100, years)
  return {
    maturityAmount: Math.round(maturityAmount),
    interestEarned: Math.round(maturityAmount - principal),
  }
}

/**
 * Reverse FD: Given a target maturity amount, find required principal.
 * P = A / (1 + r)^t
 */
export function calcFDRequiredPrincipal(
  targetAmount: number,
  annualRate: number,
  years: number
): number {
  if (annualRate === 0) return targetAmount
  return Math.round(targetAmount / Math.pow(1 + annualRate / 100, years))
}

/**
 * Inflation-adjusted (real) value of a future amount.
 * Real = Nominal / (1 + inflation)^years
 */
export function calcInflationAdjusted(
  futureValue: number,
  inflationRate: number,
  years: number
): number {
  return Math.round(futureValue / Math.pow(1 + inflationRate / 100, years))
}

// ────────────────────────────────────────────
// Mediclaim Premium Estimation
// ────────────────────────────────────────────

/** Base annual premium (₹) for ₹5L individual coverage by age band */
const MEDICLAIM_BASE_BY_AGE: [number, number, number][] = [
  // [minAge, maxAge, basePremium for ₹5L]
  [0, 1, 8000], // newborn – high NICU risk
  [2, 5, 4500], // toddler
  [6, 17, 3500], // school-age child
  [18, 25, 5000],
  [26, 35, 6500],
  [36, 45, 10000],
  [46, 55, 16000],
  [56, 65, 25000],
  [66, 75, 38000],
  [76, 100, 50000],
]

/** Multiplier for sum insured relative to the ₹5L base */
const SUM_INSURED_MULTIPLIER: Record<number, number> = {
  300000: 0.7,
  500000: 1.0,
  1000000: 1.6,
  1500000: 2.0,
  2500000: 2.8,
  5000000: 3.8,
  10000000: 5.5,
}

function getBasePremium(age: number): number {
  for (const [min, max, base] of MEDICLAIM_BASE_BY_AGE) {
    if (age >= min && age <= max) return base
  }
  return 50000 // fallback for very old
}

function getSumInsuredMultiplier(sumInsured: number): number {
  // Find the closest key
  const keys = Object.keys(SUM_INSURED_MULTIPLIER)
    .map(Number)
    .sort((a, b) => a - b)
  let closest = keys[0]
  for (const k of keys) {
    if (Math.abs(k - sumInsured) < Math.abs(closest - sumInsured)) closest = k
  }
  return SUM_INSURED_MULTIPLIER[closest]
}

export interface MediclaimInput {
  planType: 'individual' | 'floater'
  ages: number[] // array of member ages
  sumInsured: number
  isMetro: boolean
  hasPreExisting: boolean
}

export interface MediclaimResult {
  lowEstimate: number
  highEstimate: number
  midEstimate: number
  perMonth: number
  perDay: number
}

/**
 * Estimate mediclaim premium based on age, sum insured, city, and health.
 * Returns a range (±15%) to account for insurer variation.
 */
export function estimateMediclaimPremium(
  input: MediclaimInput
): MediclaimResult {
  const { planType, ages, sumInsured, isMetro, hasPreExisting } = input
  const siMultiplier = getSumInsuredMultiplier(sumInsured)
  const metroMultiplier = isMetro ? 1.15 : 1.0
  const pedMultiplier = hasPreExisting ? 1.25 : 1.0

  let annualPremium: number

  if (planType === 'individual') {
    // Individual: sum of each member's premium
    annualPremium = ages.reduce((sum, age) => {
      return sum + getBasePremium(age) * siMultiplier
    }, 0)
  } else {
    // Floater: premium based on eldest member's age, with family discount
    const eldestAge = Math.max(...ages)
    const basePremium = getBasePremium(eldestAge) * siMultiplier
    // Floater scaling: 1 member = 1×, 2 = 1.6×, 3 = 2.0×, 4 = 2.3×, 5 = 2.5×, 6 = 2.7×
    const floaterScale = [1, 1.6, 2.0, 2.3, 2.5, 2.7]
    const scale = floaterScale[Math.min(ages.length, 6) - 1] ?? 2.7
    annualPremium = basePremium * scale
  }

  annualPremium *= metroMultiplier * pedMultiplier

  const midEstimate = Math.round(annualPremium)
  const lowEstimate = Math.round(annualPremium * 0.85)
  const highEstimate = Math.round(annualPremium * 1.15)

  return {
    lowEstimate,
    highEstimate,
    midEstimate,
    perMonth: Math.round(midEstimate / 12),
    perDay: Math.round(midEstimate / 365),
  }
}
