'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NAV, SITE } from '@/data/site'
import Logo from './Logo'

export default function Header() {
  const [open, setOpen] = useState(false)

  // Lock scroll while the mobile drawer is open, and close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    // A 3px gold rule along the very top — the brand signature, echoing the
    // gold bars in the logo's "E". Costs nothing to render.
    <header className="sticky top-0 z-50 border-t-[3px] border-t-gold border-b border-b-white/10 bg-navy-950">
      <div className="wrap flex h-[84px] items-center justify-between gap-4">
        <Link href="/" aria-label={`${SITE.name} — home`} className="shrink-0">
          {/* The logo carries three lines of type (tagline, wordmark, strapline),
              so it needs real height to stay legible. */}
          <Logo className="h-11 w-auto md:h-14" priority />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3.5 py-2.5 text-[0.95rem] font-medium text-white/80 transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact/" className="btn btn-gold hidden sm:inline-flex">
            Contact Us
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-11 w-11 place-items-center rounded-lg border border-white/20 text-white lg:hidden"
          >
            <span aria-hidden className="relative block h-4 w-5">
              <span
                className="absolute left-0 h-0.5 w-5 bg-current transition-all duration-200"
                style={{ top: open ? '7px' : '1px', rotate: open ? '45deg' : '0deg' }}
              />
              <span
                className="absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-opacity duration-200"
                style={{ opacity: open ? 0 : 1 }}
              />
              <span
                className="absolute left-0 h-0.5 w-5 bg-current transition-all duration-200"
                style={{ top: open ? '7px' : '13px', rotate: open ? '-45deg' : '0deg' }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-white/10 bg-navy-950 lg:hidden"
      >
        <nav aria-label="Mobile" className="wrap flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3.5 text-base font-medium text-white/85 hover:bg-white/5 hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact/" onClick={() => setOpen(false)} className="btn btn-gold mt-3">
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  )
}
