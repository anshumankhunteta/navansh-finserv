'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <Button
      className={'mb-4 rounded-full ' + className}
      variant="outline"
      size="sm"
      onClick={() => router.back()}
    >
      {' '}
      Back
    </Button>
  )
}
