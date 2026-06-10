import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { SignOutButton } from '@/components/custom/blog/SignOutButton'
import { AuthGuard } from '@/components/custom/blog/AuthGuard'
import { FileText, Mail } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  return (
    <AuthGuard hasSession={!!user}>
      <div className="bg-muted min-h-screen">
        <header className="border-border bg-card sticky top-0 z-10 flex h-14 items-center justify-between border-b px-6">
          <div className="flex items-center gap-6">
            <span className="text-foreground text-lg font-bold tracking-tight">
              Admin
            </span>
            {user && (
              <nav className="flex items-center gap-4">
                <Link
                  href="/admin/blog"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Blog
                </Link>
                <Link
                  href="/admin/newsletter"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Newsletter
                </Link>
              </nav>
            )}
          </div>
          {user && <SignOutButton />}
        </header>
        <main className="p-6">{children}</main>
      </div>
    </AuthGuard>
  )
}
