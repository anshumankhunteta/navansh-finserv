import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PostRow } from './actions'
import { AdminPostActions } from '@/components/custom/blog/AdminPostActions'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return (
      <div className="border-border bg-card mx-auto max-w-6xl rounded-xl border p-6 shadow-sm">
        <p className="text-destructive">
          Failed to load posts. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="border-border bg-card mx-auto max-w-6xl rounded-xl border shadow-sm">
      <div className="border-border flex items-center justify-between border-b p-6">
        <h1 className="text-foreground text-xl font-bold">All Posts</h1>
        <Link href="/blog/admin/new">
          <Button size="sm">New Post</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="text-muted-foreground w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-xs tracking-wider uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Created Date</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {posts?.map((post: PostRow) => (
              <tr
                key={post.id}
                className="hover:bg-muted/50 transition-colors dark:hover:bg-zinc-900/50"
              >
                <td className="text-foreground px-6 py-4 font-medium">
                  {post.title}
                </td>
                <td className="px-6 py-4">
                  {post.published ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <AdminPostActions
                    id={post.id}
                    slug={post.slug}
                    published={post.published}
                  />
                </td>
              </tr>
            ))}
            {(!posts || posts.length === 0) && (
              <tr>
                <td
                  colSpan={4}
                  className="text-muted-foreground px-6 py-12 text-center"
                >
                  No posts found. Create your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
