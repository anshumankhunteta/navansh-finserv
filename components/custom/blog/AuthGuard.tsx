'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function AuthGuard({
  hasSession,
  children,
}: {
  hasSession: boolean
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!hasSession && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [hasSession, pathname, router])

  if (!hasSession && pathname !== '/admin/login') {
    return null // or a loading spinner
  }

  return <>{children}</>
}
