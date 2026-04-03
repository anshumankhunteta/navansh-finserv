'use client'

import { NAVChart } from '@/components/custom/MFScreener/NAVChart'
import type { MFNav, MFScheme } from '@/lib/mf-utils'

interface NAVChartWrapperProps {
  scheme: MFScheme
  history: MFNav[]
}

export function NAVChartWrapper({ scheme, history }: NAVChartWrapperProps) {
  return <NAVChart scheme={scheme} initialData={history} />
}
