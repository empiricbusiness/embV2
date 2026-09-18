'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CONSENT_KEY, CONSENT_OPEN_EVENT } from '@/lib/consent'

type Gtag = (...args: unknown[]) => void

/**
 * Cookie consent for Google Analytics (Consent Mode v2). The layout's gtag
 * snippet starts with analytics and ad storage denied and replays a stored
 * choice on every page, so GA sets no cookies until a visitor accepts here.
 * The choice lives in localStorage; "Cookie settings" in the footer reopens it,
 * which is how consent is withdrawn.
 */
export default function ConsentBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(CONSENT_KEY)
    } catch {
      // Storage blocked: ask every visit rather than assume consent.
    }
    if (!stored) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(CONSENT_OPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen)
  }, [])

  function choose(choice: 'granted' | 'denied') {
    try {
      localStorage.setItem(CONSENT_KEY, choice)
    } catch {}
    const gtag = (window as unknown as { gtag?: Gtag }).gtag
    gtag?.('consent', 'update', { analytics_storage: choice })
    // Withdrawal has to remove what an earlier "Accept" left behind. GA writes
    // its cookies on the registrable domain, so clear them there as well.
    if (choice === 'denied') {
      const root = '.' + location.hostname.replace(/^www\./, '')
      for (const name of document.cookie.split(';').map((c) => c.split('=')[0].trim())) {
        if (!name.startsWith('_ga')) continue
        for (const domain of ['', `; domain=${root}`]) {
          document.cookie = `${name}=; Max-Age=0; path=/${domain}`
        }
      }
    }
    setOpen(false)
  }

  if (!open) return null

  return (
    <div role="region" aria-label="Cookie consent" className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-white/15 bg-navy-900 p-5 shadow-2xl sm:flex-row sm:items-center sm:gap-6">
        <p className="text-[0.92rem] leading-relaxed text-white/80">
          We use Google Analytics cookies to understand how people use this site. They are set only
          if you accept.{' '}
          <Link href="/privacy-policy/" className="text-gold underline underline-offset-4">
            Privacy policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={() => choose('denied')} className="btn btn-ghost">
            Decline
          </button>
          <button type="button" onClick={() => choose('granted')} className="btn btn-gold">
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

/** Footer link that reopens the banner, so a visitor can change their answer. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className={className}
    >
      Cookie settings
    </button>
  )
}
