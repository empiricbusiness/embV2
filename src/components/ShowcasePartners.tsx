'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import type { EventPartner } from '@/data/event-content'
import Icon from './ShowcaseIcon'
import s from './EventShowcase.module.css'

const tierClass = (t: string) =>
  /gold/i.test(t) ? s.tierGold : /silver/i.test(t) ? s.tierSilver : /tech/i.test(t) ? s.tierTech : s.tierExhibit

type Open = { i: number; mode: 'hover' | 'click'; dx: number; dy: number }

/**
 * Partner cards in a 2 x 2 grid. The cards never grow in place: hovering one
 * (mouse only) opens its full profile in a panel centred on the screen, grown
 * out of the card, and moving off the card shrinks it back. Touch and keyboard
 * users get the same panel from "Read more", closed by the button or Esc.
 *
 * Every card carries its full copy in the static HTML (visually trimmed), so
 * search engines read all of it; the panel is a client-side copy.
 */
export default function ShowcasePartners({ partners }: { partners: EventPartner[] }) {
  const [open, setOpen] = useState<Open | null>(null)
  const [closing, setClosing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const cards = useRef<(HTMLElement | null)[]>([])

  useEffect(() => setMounted(true), [])

  const clear = () => {
    clearTimeout(openTimer.current)
    clearTimeout(closeTimer.current)
  }

  const show = useCallback((i: number, mode: Open['mode']) => {
    const el = cards.current[i]
    if (!el) return
    const r = el.getBoundingClientRect()
    // Start the panel where the card is, so it grows out of it.
    const dx = r.left + r.width / 2 - window.innerWidth / 2
    const dy = r.top + r.height / 2 - window.innerHeight / 2
    setClosing(false)
    setOpen({ i, mode, dx, dy })
  }, [])

  const hide = useCallback(() => {
    setClosing(true)
    closeTimer.current = setTimeout(() => {
      setOpen(null)
      setClosing(false)
    }, 220)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hide()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, hide])

  useEffect(() => clear, [])

  const enter = (i: number) => (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    clear()
    if (open?.i === i && !closing) return
    openTimer.current = setTimeout(() => show(i, 'hover'), open ? 0 : 160)
  }
  const leave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || open?.mode === 'click') {
      clearTimeout(openTimer.current)
      return
    }
    clear()
    if (open) closeTimer.current = setTimeout(hide, 140)
  }

  const p = open ? partners[open.i] : null

  return (
    <>
      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {partners.map((partner, i) => (
          <li key={partner.name}>
            <article
              ref={(el) => {
                cards.current[i] = el
              }}
              className={`${s.pCard} ${/gold/i.test(partner.tier) ? s.pGold : ''} ${open?.i === i ? s.pActive : ''}`}
              onPointerEnter={enter(i)}
              onPointerLeave={leave}
            >
              <div className={s.pLogo}>
                <Image src={partner.logo.src} alt={`${partner.name} logo`} width={partner.logo.w} height={partner.logo.h} loading="lazy" />
              </div>
              <div className="flex min-w-0 flex-col p-5 sm:p-6">
                <span className={`${s.tier} ${tierClass(partner.tier)} self-start`}>{partner.tier}</span>
                <h3 className="mt-3 text-[1.2rem] font-bold text-white">{partner.name}</h3>
                <div className={s.pPreview}>
                  {partner.about.map((t) => (
                    <p key={t.slice(0, 32)}>{t}</p>
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-3">
                <button
                  type="button"
                  className={s.pMore}
                  onClick={() => {
                    clear()
                    show(i, 'click')
                  }}
                >
                  Read more
                  <Icon name="arrow" size={15} />
                </button>
                {partner.url && (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="text-[0.84rem] font-semibold text-white/75 underline underline-offset-4 hover:text-white"
                  >
                    {new URL(partner.url).hostname.replace(/^www\./, '')}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {mounted &&
        open &&
        p &&
        createPortal(
          <div
            className={`${s.portal} ${s.pOverlay} ${open.mode === 'click' ? s.pOverlayClick : ''} ${closing ? s.pClosing : ''}`}
            onClick={open.mode === 'click' ? hide : undefined}
          >
            <div
              className={s.pPanel}
              role="dialog"
              aria-modal={open.mode === 'click'}
              aria-labelledby="partner-panel-title"
              style={{ '--dx': `${open.dx}px`, '--dy': `${open.dy}px` } as React.CSSProperties}
              onClick={(e) => e.stopPropagation()}
              onPointerEnter={(e) => e.pointerType === 'mouse' && clear()}
              onPointerLeave={leave}
            >
              <button type="button" className={s.pClose} aria-label="Close" onClick={hide}>
                <span aria-hidden>×</span>
              </button>
              <div className={s.pPanelHead}>
                <div className={s.pPanelLogo}>
                  <Image src={p.logo.src} alt={`${p.name} logo`} width={p.logo.w} height={p.logo.h} />
                </div>
                <div>
                  <span className={`${s.tier} ${tierClass(p.tier)}`}>{p.tier}</span>
                  <h3 id="partner-panel-title" className="mt-2 text-[1.5rem] font-bold text-white">
                    {p.name}
                  </h3>
                </div>
              </div>
              <div className={s.pPanelBody}>
                {p.about.map((t) => (
                  <p key={t.slice(0, 32)}>{t}</p>
                ))}
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[0.9rem] font-bold text-[var(--ft-gold)]"
                  >
                    {new URL(p.url).hostname.replace(/^www\./, '')}
                    <Icon name="arrow" size={14} />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
