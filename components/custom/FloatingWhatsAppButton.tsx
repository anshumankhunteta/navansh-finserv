'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Whatsapp from '../icons/Whatsapp'

const STORAGE_KEY = 'whatsapp-button-hidden'
const DRAG_THRESHOLD = 100 // pixels to drag before hiding

export function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isHiddenByDrag, setIsHiddenByDrag] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  const pathname = usePathname()
  const buttonRef = useRef<HTMLDivElement>(null)
  const contactPhone = process.env.NEXT_PUBLIC_PHONE_NUMBER || ''

  // Hide button on contact page
  const shouldHide = pathname === '/contact'

  useEffect(() => {
    const hidden = localStorage.getItem(STORAGE_KEY)
    if (hidden === 'true') {
      setIsHiddenByDrag(true) //eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [])

  useEffect(() => {
    if (pathname === '/') {
      const wasHidden = localStorage.getItem(STORAGE_KEY) === 'true'
      if (wasHidden) {
        localStorage.removeItem(STORAGE_KEY)
        setIsHiddenByDrag(false) //eslint-disable-line react-hooks/set-state-in-effect
      }
    }
  }, [pathname])

  useEffect(() => {
    if (shouldHide || isHiddenByDrag) {
      return
    }
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1200)

    return () => clearTimeout(timer)
  }, [shouldHide, isHiddenByDrag])

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setStartPos({ x: touch.clientX, y: touch.clientY })
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - startPos.x
    const deltaY = touch.clientY - startPos.y

    setPosition({ x: deltaX, y: deltaY })
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const distance = Math.sqrt(position.x ** 2 + position.y ** 2)

    if (distance > DRAG_THRESHOLD) {
      setIsHiddenByDrag(true)
      localStorage.setItem(STORAGE_KEY, 'true')
    }
    setIsDragging(false)
    setPosition({ x: 0, y: 0 })
  }

  if (shouldHide || isHiddenByDrag) {
    return null
  }

  const whatsappLink = `https://wa.me/${contactPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello')}`

  return (
    <div
      ref={buttonRef}
      className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ease-in-out ${isVisible ? 'animate-pop-in' : 'scale-0'} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} `}
      style={{
        transform: isDragging
          ? `translate(${position.x}px, ${position.y}px)`
          : 'translate(0, 0)',
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Link
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`outline-primary/20 block rounded-full bg-[#25D366] p-3 text-white shadow-lg outline-3 transition-colors duration-300 hover:bg-[#20BA5A] hover:shadow-xl sm:p-4`}
        aria-label="Contact us on WhatsApp"
        onClick={(e) => {
          // Prevent navigation if dragging
          if (
            isDragging ||
            Math.abs(position.x) > 5 ||
            Math.abs(position.y) > 5
          ) {
            e.preventDefault()
          }
        }}
      >
        <Whatsapp className="h-7 w-7 sm:h-8 sm:w-8" />
      </Link>
    </div>
  )
}
