import { Button } from '@/components/ui/button'
import { Check, MessageSquare, Share2 } from 'lucide-react'
import React from 'react'

function CalculatorActionButtons({
  onConsult,
  handleConsult,
  handleShare,
  copied,
}: {
  onConsult?: (msg: string) => void
  handleConsult: () => void
  handleShare: () => void
  copied: boolean
}) {
  return (
    <div className="mt-10 flex gap-2">
      {onConsult && (
        <Button onClick={handleConsult} className="flex-1">
          <MessageSquare className="h-4 w-4" />
          Consult on this Goal
        </Button>
      )}
      <Button
        variant="outline"
        size={onConsult ? 'icon' : 'default'}
        onClick={handleShare}
        className={onConsult ? 'shrink-0' : 'w-full'}
      >
        {copied ? (
          <Check className="text-primary h-4 w-4" />
        ) : (
          <Share2 className="text-primary h-4 w-4" />
        )}
        {!onConsult && (copied ? 'Copied!' : 'Share My Calculation')}
      </Button>
    </div>
  )
}

export default CalculatorActionButtons
