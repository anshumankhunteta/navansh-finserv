import Navansh from '@/components/icons/Navansh'
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
        border: '2px solid #409e54', // var(--primary)
        borderRadius: '15%',
        background: '#c4dbc7ee', // var(--muted)
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Navansh hideTitle height={100} />
    </div>,
    {
      ...size,
    }
  )
}
