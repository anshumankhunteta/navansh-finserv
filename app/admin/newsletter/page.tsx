import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { IssueRow } from './actions'
import { NewsletterAdminActions } from '@/components/custom/newsletter/NewsletterAdminActions'

function getSevenDaysAgo() {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
}

export default async function NewsletterAdminPage() {
  const supabase = await createClient()

  // 1. Auth check
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  if (!user) {
    redirect('/admin/login')
  }

  // 2. Fetch issues
  const { data: issues, error } = await supabase
    .from('newsletter_issues')
    .select('*')
    .order('created_at', { ascending: false })

  // 3. Fetch subscriber stats
  const { count: activeCount } = await supabase
    .from('subscribers')
    .select('id', { count: 'exact' })
    .eq('is_active', true)

  const sevenDaysAgo = getSevenDaysAgo()
  const { count: newCount } = await supabase
    .from('subscribers')
    .select('id', { count: 'exact' })
    .eq('is_active', true)
    .gte('subscribed_at', sevenDaysAgo)

  if (error) {
    console.error('Error fetching newsletter issues:', error)
    return (
      <div className="border-border bg-card mx-auto max-w-6xl rounded-xl border p-6 shadow-sm">
        <p className="text-destructive">Failed to load issues.</p>
      </div>
    )
  }

  const draftIssue = issues?.find((i: IssueRow) => i.status === 'draft')
  const history = issues?.filter((i: IssueRow) => i.id !== draftIssue?.id) || []

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium">
            Active Subscribers
          </h3>
          <p className="text-foreground mt-2 text-3xl font-bold">
            {activeCount ?? 0}
          </p>
        </div>
        <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium">
            New This Week
          </h3>
          <p className="text-primary mt-2 text-3xl font-bold">
            +{newCount ?? 0}
          </p>
        </div>
      </div>

      {/* Draft Review Section */}
      <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="border-border bg-muted/30 flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-foreground text-lg font-bold">Current Draft</h2>
            <p className="text-muted-foreground text-sm">
              Review this week&apos;s AI-generated newsletter before sending.
            </p>
          </div>
          {draftIssue && (
            <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-500">
              Needs Review
            </span>
          )}
        </div>

        <div className="p-6">
          {draftIssue ? (
            <div className="space-y-6">
              <div className="bg-muted/30 border-border rounded-lg border p-4">
                <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                  Subject
                </p>
                <p className="text-foreground font-medium">
                  {draftIssue.subject}
                </p>
              </div>

              <div className="bg-muted/30 border-border rounded-lg border p-4">
                <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                  Content Preview
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold">Market Pulse</h4>
                    <ul className="text-muted-foreground mt-1 list-disc pl-5 text-sm">
                      {draftIssue.content_json.market_pulse?.map(
                        (p: string, i: number) => (
                          <li key={i}>{p}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">
                      Headlines (
                      {draftIssue.content_json.headlines?.length || 0})
                    </h4>
                    <ul className="text-muted-foreground mt-1 list-disc pl-5 text-sm">
                      {draftIssue.content_json.headlines?.map(
                        (h: { title: string }, i: number) => (
                          <li key={i}>{h.title}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">Fund Spotlight</h4>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {draftIssue.content_json.fund_spotlight?.name}
                    </p>
                  </div>
                </div>
              </div>

              <NewsletterAdminActions issueId={draftIssue.id} />
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No draft currently pending.
              </p>
              <p className="text-muted-foreground mt-2 text-xs">
                Next draft will be auto-generated on Monday.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="border-border bg-card rounded-xl border shadow-sm">
        <div className="border-border border-b p-6">
          <h2 className="text-foreground text-lg font-bold">Past Issues</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="text-muted-foreground w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs tracking-wider uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 text-right font-medium">Recipients</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {history.map((issue: IssueRow) => (
                <tr
                  key={issue.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="text-foreground max-w-[300px] truncate px-6 py-4 font-medium">
                    {issue.subject}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="px-6 py-4">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {issue.recipient_count > 0 ? issue.recipient_count : '-'}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-muted-foreground px-6 py-12 text-center"
                  >
                    No past issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'sent':
      return (
        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
          Sent
        </span>
      )
    case 'failed':
      return (
        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-400">
          Failed
        </span>
      )
    case 'rejected':
      return (
        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
          Rejected
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
          {status}
        </span>
      )
  }
}
