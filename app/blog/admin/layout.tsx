import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { SignOutButton } from '@/components/custom/blog/SignOutButton'
import { AuthGuard } from '@/components/custom/blog/AuthGuard'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <AuthGuard hasSession={!!session}>
      <div className="bg-background min-h-screen">
        <header className="border-border bg-card sticky top-0 z-10 flex h-14 items-center justify-between border-b px-6">
          <Link
            href="/blog/admin"
            className="text-foreground text-lg font-semibold"
          >
            Blog Admin
          </Link>
          {session && <SignOutButton />}
        </header>
        <main className="p-6">{children}</main>
      </div>
    </AuthGuard>
  )
}
