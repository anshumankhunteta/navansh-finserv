'use client'

import { Button } from '@/components/ui/button'
import Whatsapp from '@/components/icons/Whatsapp'
import { Download } from 'lucide-react'
import { useCallback, useState } from 'react'

interface CardActionButtonProps {
  mode?: 'download' | 'share'
}

export default function CardActionButton({
  mode = 'download',
}: CardActionButtonProps) {
  const [busy, setBusy] = useState(false)

  const captureCard = useCallback(async () => {
    const cardElement = document.getElementById('business-card')
    if (!cardElement) return null

    const { toPng } = await import('html-to-image')
    return toPng(cardElement, { pixelRatio: 3, cacheBust: true })
  }, [])

  const handleDownload = useCallback(async () => {
    setBusy(true)
    try {
      const dataUrl = await captureCard()
      if (!dataUrl) return

      const link = document.createElement('a')
      link.download = 'Navansh-Milee.png'
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to download card:', error)
    } finally {
      setBusy(false)
    }
  }, [captureCard])

  const handleShare = useCallback(async () => {
    setBusy(true)
    try {
      const dataUrl = await captureCard()
      if (!dataUrl) return

      const res = await fetch(dataUrl)
      const blob = await res.blob()
      const file = new File([blob], 'Navansh-Milee.png', { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Navansh Finserv - Business Card',
          text: 'Check out my business card from Navansh Finserv!',
        })
      } else {
        const text = encodeURIComponent(
          'Check out my business card from Navansh Finserv! 🌿\nhttps://www.navansh.in/card'
        )
        window.open(`https://wa.me/?text=${text}`, '_blank')
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Failed to share card:', error)
      }
    } finally {
      setBusy(false)
    }
  }, [captureCard])

  const isShare = mode === 'share'

  return (
    <Button
      onClick={isShare ? handleShare : handleDownload}
      disabled={busy}
      variant="outline"
      className={
        isShare
          ? 'mt-4 rounded-full text-white'
          : 'mt-8 rounded-full text-white'
      }
    >
      {isShare ? <Whatsapp className="h-4 w-4" /> : <Download size={16} />}
      {busy
        ? isShare
          ? 'Sharing...'
          : 'Downloading...'
        : isShare
          ? 'Share via WhatsApp'
          : 'Download Card'}
    </Button>
  )
}
