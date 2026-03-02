'use client'

import { Slider } from '@/components/ui/slider'
import {
  buildShareUrl,
  useCalculatorStore,
  type MediclaimMember,
} from '@/lib/calculator-store'
import {
  estimateMediclaimPremium,
  formatINR,
  formatINRCompact,
  type MediclaimInput,
} from '@/lib/finance-math'
import { Heart, Minus, Plus, Users } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CalculatorActionButtons from './CalculatorActionButtons'

const SUM_INSURED_OPTIONS = [
  { value: 300000, label: '₹3 Lakh' },
  { value: 500000, label: '₹5 Lakh' },
  { value: 1000000, label: '₹10 Lakh' },
  { value: 1500000, label: '₹15 Lakh' },
  { value: 2500000, label: '₹25 Lakh' },
  { value: 5000000, label: '₹50 Lakh' },
  { value: 10000000, label: '₹1 Crore' },
]

const FLOATER_SLOTS: string[] = [
  'Self',
  'Spouse',
  'Child 1',
  'Child 2',
  'Parent 1',
  'Parent 2',
]
const INDIVIDUAL_SLOTS: string[] = [
  'Person 1',
  'Person 2',
  'Person 3',
  'Person 4',
  'Person 5',
  'Person 6',
]

interface MediclaimEstimatorProps {
  onConsult?: (msg: string) => void
}

export function MediclaimEstimator({ onConsult }: MediclaimEstimatorProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true) // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  const planType = useCalculatorStore((s) => s.mediclaim.planType)
  const sumInsured = useCalculatorStore((s) => s.mediclaim.sumInsured)
  const isMetro = useCalculatorStore((s) => s.mediclaim.isMetro)
  const hasPreExisting = useCalculatorStore((s) => s.mediclaim.hasPreExisting)
  const individualMembers = useCalculatorStore(
    (s) => s.mediclaim.individualMembers
  )
  const floaterMembers = useCalculatorStore((s) => s.mediclaim.floaterMembers)
  const setMediclaim = useCalculatorStore((s) => s.setMediclaim)

  const [copied, setCopied] = useState(false)

  const members = planType === 'individual' ? individualMembers : floaterMembers
  const slotLabels =
    planType === 'individual' ? INDIVIDUAL_SLOTS : FLOATER_SLOTS

  const selfMember = floaterMembers.find((m) => m.label === 'Self')
  const selfAge = selfMember?.age ?? 30
  const selfOver24 = selfAge > 24
  const selfUnder18 = selfAge < 18

  const isParentSlot = (label: string) =>
    label === 'Parent 1' || label === 'Parent 2'
  const isChildSlot = (label: string) =>
    label === 'Child 1' || label === 'Child 2'
  const isSpouseSlot = (label: string) => label === 'Spouse'

  const setMembers = useCallback(
    (newMembers: MediclaimMember[]) => {
      if (planType === 'individual') {
        setMediclaim({ individualMembers: newMembers })
      } else {
        setMediclaim({ floaterMembers: newMembers })
      }
    },
    [planType, setMediclaim]
  )

  const addMember = useCallback(() => {
    if (members.length >= 6) return
    const nextLabel =
      slotLabels[members.length] || `Member ${members.length + 1}`
    const defaultAge = isChildSlot(nextLabel)
      ? 5
      : isSpouseSlot(nextLabel)
        ? 25
        : 40
    setMembers([
      ...members,
      { age: defaultAge, label: nextLabel, enabled: true },
    ])
  }, [members, setMembers, slotLabels])

  const removeMember = useCallback(() => {
    if (members.length <= 1) return
    setMembers(members.slice(0, -1))
  }, [members, setMembers])

  const updateMemberAge = useCallback(
    (index: number, age: number) => {
      const member = members[index]
      const maxAge =
        planType === 'floater' && isChildSlot(member.label) ? 24 : 100
      const updated = [...members]
      updated[index] = {
        ...updated[index],
        age: Math.max(0, Math.min(maxAge, age)),
      }
      setMembers(updated)
    },
    [members, setMembers, planType]
  )

  const toggleMember = useCallback(
    (index: number) => {
      if (members[index].label === 'Self') return
      const updated = [...members]
      updated[index] = { ...updated[index], enabled: !updated[index].enabled }
      setMembers(updated)
    },
    [members, setMembers]
  )

  const activeMembers = useMemo(() => {
    return members.filter((m) => {
      if (!m.enabled) return false
      if (planType === 'floater' && selfOver24 && isParentSlot(m.label))
        return false
      if (planType === 'floater' && selfUnder18 && isChildSlot(m.label))
        return false
      if (planType === 'floater' && selfUnder18 && isSpouseSlot(m.label))
        return false
      return true
    })
  }, [members, planType, selfOver24, selfUnder18])

  const result = useMemo(() => {
    if (activeMembers.length === 0) {
      return {
        lowEstimate: 0,
        highEstimate: 0,
        midEstimate: 0,
        perMonth: 0,
        perDay: 0,
      }
    }
    const input: MediclaimInput = {
      planType,
      ages: activeMembers.map((m) => m.age),
      sumInsured,
      isMetro,
      hasPreExisting,
    }
    return estimateMediclaimPremium(input)
  }, [planType, activeMembers, sumInsured, isMetro, hasPreExisting])

  const handleConsult = () => {
    const memberStr = activeMembers
      .map((m) => `${m.label} (${m.age})`)
      .join(', ')
    onConsult?.(
      `Mediclaim Enquiry: ${planType === 'floater' ? 'Family Floater' : 'Individual'} plan, ${formatINRCompact(sumInsured)} cover, members: ${memberStr}. Est. premium: ${formatINR(result.lowEstimate)}–${formatINR(result.highEstimate)}/yr`
    )
  }

  const handleShare = async () => {
    const url = buildShareUrl('mediclaim')
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!mounted) return null

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-lg p-2">
          <Heart className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold md:text-2xl">
            Mediclaim Premium Estimator
          </h2>
          <p className="text-muted-foreground text-xs">
            Get a quick ballpark for your health insurance premium.
          </p>
        </div>
      </div>

      {/* Plan Type Toggle */}
      <div className="bg-muted ring-ring mb-5 flex rounded-md p-1 ring-1">
        <button
          onClick={() => setMediclaim({ planType: 'individual' })}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
            planType === 'individual'
              ? 'bg-primary/70 text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Heart className="h-3.5 w-3.5" /> Individual
        </button>
        <button
          onClick={() => setMediclaim({ planType: 'floater' })}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
            planType === 'floater'
              ? 'bg-primary/70 text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-3.5 w-3.5" /> Family Floater
        </button>
      </div>

      {/* Family Members */}
      <div className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-muted-foreground text-sm font-medium">
            Family Members
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={removeMember}
              disabled={members.length <= 1 || planType === 'individual'}
              className="bg-muted border-border hover:bg-muted/80 rounded-md border p-1.5 transition-colors disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-sm font-semibold tabular-nums">
              {members.length}
            </span>
            <button
              onClick={addMember}
              disabled={members.length >= 6 || planType === 'individual'}
              className="bg-muted border-border hover:bg-muted/80 rounded-md border p-1.5 transition-colors disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {members.map((member, idx) => {
            const isRestricted =
              planType === 'floater' &&
              ((selfOver24 && isParentSlot(member.label)) ||
                (selfUnder18 &&
                  (isChildSlot(member.label) || isSpouseSlot(member.label))))
            const isDisabled = !member.enabled || isRestricted
            const isSelf = member.label === 'Self'
            const maxAge =
              planType === 'floater' && isChildSlot(member.label) ? 24 : 100

            return (
              <div
                key={`${planType}-${idx}`}
                className={`border-border flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-opacity ${
                  isDisabled ? 'bg-muted/10 opacity-40' : 'bg-muted/30'
                }`}
              >
                {!isSelf ? (
                  <input
                    type="checkbox"
                    checked={member.enabled && !isRestricted}
                    disabled={isRestricted}
                    onChange={() => toggleMember(idx)}
                    className="border-border text-primary focus:ring-primary/20 h-3.5 w-3.5 shrink-0 rounded focus:ring-1"
                    title={
                      isRestricted
                        ? "Adults over 24 cannot be on parents' floater"
                        : member.enabled
                          ? `Disable ${member.label}`
                          : `Enable ${member.label}`
                    }
                  />
                ) : (
                  <div className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="text-muted-foreground w-14 text-xs font-medium">
                  {member.label}
                </span>
                <div className="flex flex-1 items-center gap-2">
                  <Slider
                    min={0}
                    max={maxAge}
                    step={1}
                    value={[member.age]}
                    onValueChange={(value) => updateMemberAge(idx, value[0])}
                    className="flex-1"
                    disabled={isDisabled}
                  />
                  <input
                    type="number"
                    min={0}
                    max={maxAge}
                    value={member.age}
                    onChange={(e) =>
                      updateMemberAge(idx, Number(e.target.value))
                    }
                    disabled={isDisabled}
                    className="border-border bg-background focus:ring-primary/50 w-14 rounded border px-2 py-1 text-center text-sm font-semibold focus:ring-1 focus:outline-none disabled:opacity-50"
                  />
                  <span className="text-muted-foreground text-xs">yrs</span>
                </div>
              </div>
            )
          })}
        </div>
        {planType === 'floater' &&
          selfOver24 &&
          members.some((m) => isParentSlot(m.label)) && (
            <p className="text-destructive mt-2 text-xs">
              ⚠ Adults over 24 cannot be on a parent&apos;s floater plan (IRDAI
              guideline).
            </p>
          )}
      </div>

      {/* Sum Insured */}
      <div className="mb-5">
        <label className="text-muted-foreground mb-2 block text-sm">
          Sum Insured (Coverage)
        </label>
        <div className="flex flex-wrap gap-2">
          {SUM_INSURED_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMediclaim({ sumInsured: opt.value })}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                sumInsured === opt.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border bg-muted/50 text-muted-foreground hover:border-primary/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* City Tier */}
      <div className="mb-5">
        <label className="text-muted-foreground mb-2 block text-sm">
          City Type
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setMediclaim({ isMetro: true })}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
              isMetro
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-border text-muted-foreground hover:border-primary/50'
            }`}
          >
            🏙️ Metro
            <span className="text-muted-foreground mt-0.5 block text-[10px]">
              Kolkata, Delhi, Mumbai…
            </span>
          </button>
          <button
            onClick={() => setMediclaim({ isMetro: false })}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
              !isMetro
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-border text-muted-foreground hover:border-primary/50'
            }`}
          >
            🏡 Non-Metro
            <span className="text-muted-foreground mt-0.5 block text-[10px]">
              Tier 2 & 3 cities
            </span>
          </button>
        </div>
      </div>

      {/* Pre-Existing Conditions */}
      <div className="mb-5">
        <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={hasPreExisting}
            onChange={(e) => setMediclaim({ hasPreExisting: e.target.checked })}
            className="border-border text-primary focus:ring-primary/20 h-4 w-4 rounded focus:ring-2"
          />
          Pre-existing conditions (Diabetes, BP, etc.)
        </label>
        {hasPreExisting && (
          <p className="text-muted-foreground mt-1 ml-6 text-xs">
            Adds ~25% loading. Covered after 3-year waiting period (IRDAI 2025).
          </p>
        )}
      </div>

      <div className="border-border/50 my-5 border-t" />

      {/* Results */}
      <div className="mb-5 text-center">
        <p className="text-muted-foreground mb-1 text-sm">
          Estimated annual premium
        </p>
        <p className="text-primary text-2xl font-bold md:text-3xl">
          {activeMembers.length > 0
            ? `${formatINR(result.lowEstimate)} – ${formatINR(result.highEstimate)}`
            : '—'}
        </p>
        {activeMembers.length > 0 && (
          <p className="text-muted-foreground mt-2 text-xs">
            That&apos;s just{' '}
            <span className="text-foreground font-semibold">
              ₹{result.perDay}/day
            </span>{' '}
            for{' '}
            <span className="text-foreground font-semibold">
              {formatINRCompact(sumInsured)}
            </span>{' '}
            of health cover
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="border-border bg-muted/30 rounded-lg border p-3 text-center">
          <p className="text-muted-foreground text-xs">Monthly EMI</p>
          <p className="text-sm font-bold">
            {activeMembers.length > 0 ? `~${formatINR(result.perMonth)}` : '—'}
          </p>
        </div>
        <div className="border-border bg-muted/30 rounded-lg border p-3 text-center">
          <p className="text-muted-foreground text-xs">Per Day</p>
          <p className="text-sm font-bold">
            {activeMembers.length > 0 ? `~₹${result.perDay}` : '—'}
          </p>
        </div>
      </div>

      {/* Tip */}
      <div className="bg-primary/5 border-primary/20 mb-2 rounded-lg border p-3">
        <p className="text-muted-foreground text-xs">
          💡{' '}
          {activeMembers.some((m) => m.age < 30)
            ? 'Buying health insurance before 30 can save ~40% in lifetime premiums!'
            : activeMembers.some((m) => m.age > 55)
              ? 'IRDAI 2025: No insurer can deny coverage based on age. Senior citizen plans are now mandatory.'
              : 'Tax benefit: Premiums up to ₹25,000 (₹50,000 for 60+) are deductible under Section 80D.'}
        </p>
      </div>

      <p className="text-muted-foreground mb-3 text-center text-[10px]">
        *Estimates based on market averages. Actual premiums vary by insurer.
      </p>

      {/* Action buttons */}
      <CalculatorActionButtons
        onConsult={onConsult}
        handleConsult={handleConsult}
        handleShare={handleShare}
        copied={copied}
      />
    </div>
  )
}
