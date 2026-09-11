import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EBM Live Question Board',
  description:
    'Ask a question during the session, upvote the ones you want answered, and see what the room wants to discuss.',
  // A board URL is handed out by QR at an event. It has no business in search
  // results, and an indexed board would expose attendees' names and companies.
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#071d33',
  // No maximum-scale / user-scalable=no: pinch-zoom must keep working. People
  // read this on phones in a dark room.
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  )
}
