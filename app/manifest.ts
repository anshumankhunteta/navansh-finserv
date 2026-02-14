import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Navansh Finserv',
    short_name: 'Navansh',
    description: 'Insurance & Wealth Expert in Kolkata, India',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0D9488',
    // icons: [
    //     {
    //         src: '/icon-192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //     },
    //     {
    //         src: '/icon-512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //     },
    // ],
  }
}
