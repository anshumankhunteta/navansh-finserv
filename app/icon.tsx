import Navansh from '@/components/icons/Navansh'
import { sharedIconOptions } from '@/lib/icon-shared'
import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        ...sharedIconOptions.style,
        border: '1px solid #409e54', // var(--primary)
      }}
    >
      <Navansh hideTitle height={18} />
    </div>,
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}
