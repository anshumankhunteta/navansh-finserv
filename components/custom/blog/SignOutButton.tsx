'use client'

import { logoutAction } from '@/app/blog/admin/actions'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    await logoutAction()
    router.push('/blog/admin/login')
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      Sign Out
    </Button>
  )
}
