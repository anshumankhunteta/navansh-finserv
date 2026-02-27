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
