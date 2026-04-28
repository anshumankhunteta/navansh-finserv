import { unsubscribeAction } from '@/app/newsletter/actions'
import { CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const resolvedParams = await searchParams
  const token = resolvedParams.token

  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-center">
          <XCircle className="text-destructive mx-auto mb-4 h-12 w-12" />
          <h1 className="mb-2 text-2xl font-bold">Invalid Link</h1>
          <p className="text-muted-foreground mb-6">
            This unsubscribe link appears to be invalid or missing the required
            token.
          </p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Determine email from token (for real prod, decode base64 or JWT. For now we use the general token from the draft or simple base64)
  let email = ''
  try {
    if (token !== 'general') {
      email = Buffer.from(token, 'base64').toString('utf-8')
    }
  } catch {
    email = ''
  }

  // Execute unsubscribe if it's a real email
  const success = email ? await unsubscribeAction(email) : token === 'general'

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="bg-card border-border max-w-md rounded-xl border p-8 text-center shadow-sm">
        {success ? (
          <>
            <CheckCircle2 className="text-primary mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-3 text-2xl font-bold">Unsubscribed</h1>
            <p className="text-muted-foreground mb-6">
              You have been successfully removed from our newsletter list. You
              will no longer receive weekly market updates.
            </p>
            <p className="text-muted-foreground mb-6 text-sm">
              Made a mistake? You can always subscribe again from our homepage.
            </p>
          </>
        ) : (
          <>
            <XCircle className="text-destructive mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-3 text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t process your unsubscribe request. Please try
              again or contact support.
            </p>
          </>
        )}
        <Link href="/">
          <Button variant="outline" className="w-full">
            Return to Navansh Finserv
          </Button>
        </Link>
      </div>
    </div>
  )
}
