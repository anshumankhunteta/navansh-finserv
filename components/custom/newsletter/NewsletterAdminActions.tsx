'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Check, X, RefreshCw } from 'lucide-react'
import {
  approveAndSendIssue,
  rejectIssue,
  regenerateIssue,
} from '@/app/admin/newsletter/actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function NewsletterAdminActions({ issueId }: { issueId: string }) {
  const [isPending, startTransition] = useTransition()
  const [showReject, setShowReject] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleApprove = () => {
    startTransition(async () => {
      try {
        await approveAndSendIssue(issueId)
        alert('Newsletter sent successfully!')
      } catch (err) {
        alert('Failed to send newsletter: ' + (err as Error).message)
      }
    })
  }

  const handleReject = () => {
    startTransition(async () => {
      try {
        await rejectIssue(issueId, feedback)
        setShowReject(false)

        // Auto-trigger regeneration after rejection
        await regenerateIssue(issueId)
      } catch (err) {
        alert('Failed to reject/regenerate: ' + (err as Error).message)
      }
    })
  }

  if (showReject) {
    return (
      <div className="bg-muted/30 border-border mt-4 rounded-lg border p-4">
        <h4 className="text-foreground mb-2 text-sm font-semibold">
          Reject with Feedback
        </h4>
        <Textarea
          placeholder="e.g. Too much focus on oil prices. Talk more about recent IT sector mutual fund performance."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="mb-4"
          disabled={isPending}
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setShowReject(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Reject & Regenerate
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 flex gap-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="flex-1 bg-green-600 text-white hover:bg-green-700"
            disabled={isPending}
          >
            <Check className="mr-2 h-4 w-4" />
            Approve & Send Now
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately send the newsletter to ALL active
              subscribers. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Yes, send it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="outline"
        className="flex-1"
        onClick={() => setShowReject(true)}
        disabled={isPending}
      >
        <X className="mr-2 h-4 w-4" />
        Reject Draft
      </Button>
    </div>
  )
}
