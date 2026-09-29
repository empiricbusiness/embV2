'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { EventSpeaker } from '@/data/event-content'
import Icon from './ShowcaseIcon'
import s from './EventShowcase.module.css'

export type SpeakerRole = {
  role: 'Moderator' | 'Panellist'
  /** "Panel 3" */
  panel: string
  session: string
  /** 24-hour IST, "14:25" */
  time: string
  /** Anchor of the session in the agenda. */
  anchor: string
}

function clock(t: string) {
  const [h, m] = t.split(':').map(Number)
  return `${String(((h + 11) % 12) + 1).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

/**
 * Speaker cards. On hover (or the corner button, for touch and keyboard) a
 * panel slides up over the card with the speaker's session. It is a 2D slide,
 * not a 3D flip: a 3D-transformed layer is rasterised at lower quality and
 * visibly softened the portraits. Both layers are in the static HTML.
 */
export default function ShowcaseSpeakers({
  people,
  roles,
  day,
  eventName,
}: {
  people: EventSpeaker[]
  roles: Record<string, SpeakerRole>
  /** Short date for the session panel, e.g. "22 Oct". */
  day: string
  /** For the portraits' alt text, e.g. "FinTax Summit 2026". */
  eventName: string
}) {
  const [filter, setFilter] = useState('all')
  const [openCard, setOpenCard] = useState<string | null>(null)

  const panels = [...new Set(Object.values(roles).map((r) => r.panel))].sort()
  const filters = [
    { id: 'all', label: 'All speakers', n: people.length },
    { id: 'Moderator', label: 'Moderators', n: people.filter((p) => roles[p.name]?.role === 'Moderator').length },
    ...panels.map((p) => ({ id: p, label: p, n: people.filter((x) => roles[x.name]?.panel === p).length })),
  ].filter((f) => f.n > 0)

  const shows = (p: EventSpeaker) => {
    const r = roles[p.name]
    if (filter === 'all') return true
    if (filter === 'Moderator') return r?.role === 'Moderator'
    return r?.panel === filter
  }

  return (
    <div>
      <div className={`${s.filters} justify-center`} role="toolbar" aria-label="Filter speakers">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={s.fchip}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            <span className={s.count}>{f.n}</span>
          </button>
        ))}
      </div>

      <ul className={`${s.spGrid} mt-10`}>
        {people.map((p) => {
          const r = roles[p.name]
          const isOpen = openCard === p.name
          return (
            <li key={p.name} className={s.spCard} data-open={isOpen} hidden={!shows(p)}>
              <span className={s.spPhoto}>
                {p.photo && (
                  <Image
                    src={p.photo}
                    alt={`${p.name}, ${p.title}, ${p.company} — speaker at ${eventName}`}
                    width={224}
                    height={224}
                    loading="lazy"
                  />
                )}
              </span>
              <h3 className="mt-3.5 text-[1.02rem] font-bold leading-snug text-white">{p.name}</h3>
              <p className="mt-1 text-[0.8rem] font-semibold leading-snug text-[var(--ft-cream)]">{p.title}</p>
              <p className="mt-1 text-[0.78rem] leading-snug text-white/65">{p.company}</p>
              {r && (
                <span className={s.spRole}>
                  {r.role} · {r.panel}
                </span>
              )}

              {r && (
                <>
                  <button
                    type="button"
                    className={s.spFlip}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? `Hide ${p.name}'s session` : `Show ${p.name}'s session`}
                    onClick={() => setOpenCard(isOpen ? null : p.name)}
                  >
                    <Icon name={isOpen ? 'chevron' : 'info'} size={16} />
                  </button>
                  <div className={s.spReveal}>
                    <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[var(--ft-gold)]">
                      {r.role} · {r.panel}
                    </span>
                    <p className="text-[0.9rem] font-bold leading-snug text-white">{r.session}</p>
                    <p className="inline-flex items-center gap-2 text-[0.8rem] font-semibold text-white/80">
                      <Icon name="clock" size={14} />
                      {clock(r.time)} IST · {day}
                    </p>
                    <a href={`#${r.anchor}`} className={s.spLink}>
                      See in agenda
                      <Icon name="arrow" size={14} />
                    </a>
                  </div>
                </>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
