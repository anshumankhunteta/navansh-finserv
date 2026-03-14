import Navansh from '@/components/icons/Navansh'
import { sharedIconOptions } from '@/lib/icon-shared'
import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        ...sharedIconOptions.style,
        border: '2px solid #409e54', // var(--primary)
      }}
    >
      <Navansh hideTitle height={100} />
    </div>,
    {
      ...size,
    }
  )
}
