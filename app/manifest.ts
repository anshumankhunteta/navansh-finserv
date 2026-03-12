import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Navansh Finserv',
    short_name: 'Navansh',
    description: 'Insurance & Wealth Expert in Kolkata, India',
    start_url: '/',
    display: 'standalone',
    background_color: '#c4dbc7',
    theme_color: '#409e54',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
