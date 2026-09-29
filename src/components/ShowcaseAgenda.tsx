'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { AgendaItem, EventSpeaker } from '@/data/event-content'
import Icon from './ShowcaseIcon'
import s from './EventShowcase.module.css'

type Cat = 'keynote' | 'panel' | 'awards' | 'partner' | 'break' | 'session'
type Filter = 'all' | 'keynote' | 'panel' | 'awards' | 'partner' | 'break'

const catOf = (a: AgendaItem): Cat => {
  const k = a.kind ?? ''
  if (/keynote/i.test(k)) return 'keynote'
  if (/panel/i.test(k)) return 'panel'
  if (/award/i.test(k)) return 'awards'
  if (/partner/i.test(a.title)) return 'partner'
  if (a.pause) return 'break'
  return 'session'
}

/** "13:05" -> "01:05 PM". Times are stored as 24-hour IST. */
function clock(t: string) {
  const [h, m] = t.split(':').map(Number)
  return `${String(((h + 11) % 12) + 1).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}
const mins = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Full day' },
  { id: 'keynote', label: 'Keynote' },
  { id: 'panel', label: 'Panels' },
  { id: 'awards', label: 'Awards' },
  { id: 'partner', label: 'Partner sessions' },
  { id: 'break', label: 'Networking' },
]

/**
 * The running order as a filterable timeline. Hovering a session fills the
 * spine in gold up to it; clicking pins that highlight. Every session is in the
 * static HTML; filtering only hides rows, and a panel's line-up is collapsed
 * with CSS (never removed), so search engines and no-JS readers get it all.
 */
export default function ShowcaseAgenda({
  date,
  items,
  people,
}: {
  date: string
  items: AgendaItem[]
  people: Record<string, EventSpeaker>
}) {
  const [filter, setFilter] = useState<Filter>('all')
  const [open, setOpen] = useState<Record<number, boolean>>({})
  const [hover, setHover] = useState<number | null>(null)
  const [pinned, setPinned] = useState<number | null>(null)
  const current = hover ?? pinned

  const counts = items.reduce<Record<string, number>>((m, a) => {
    const c = catOf(a)
    m[c] = (m[c] ?? 0) + 1
    return m
  }, {})
  const shows = (a: AgendaItem) => filter === 'all' || catOf(a) === filter

  // Length of each slot, from the next slot's start. Two slots printed at the
  // same time (the brochure has two at 11:20) show no length rather than zero.
  const length = (i: number) => {
    if (items[i + 1] && items[i + 1].time === items[i].time) return ''
    const next = items.slice(i + 1).find((b) => mins(b.time) > mins(items[i].time))
    if (!next) return i === items.length - 1 ? 'onwards' : ''
    const d = mins(next.time) - mins(items[i].time)
    return d >= 60 ? `${Math.floor(d / 60)} hr${d % 60 ? ` ${d % 60} min` : ''}` : `${d} min`
  }

  // Morning / afternoon split at lunch, as a delegate plans the day. `seq`
  // orders every row, dividers included, so the gold fill can run past them.
  const lunch = items.findIndex((a) => /lunch/i.test(a.title))
  const groups =
    lunch >= 0
      ? [
          { label: 'Morning', from: 0, to: lunch + 1 },
          { label: 'Afternoon', from: lunch + 1, to: items.length },
        ]
      : [{ label: 'The day', from: 0, to: items.length }]
  let seq = 0
  const rows = groups.flatMap((g) => [
    { type: 'divider' as const, label: g.label, seq: seq++, visible: items.slice(g.from, g.to).some(shows) },
    ...items.slice(g.from, g.to).map((a, k) => ({ type: 'item' as const, a, i: g.from + k, seq: seq++ })),
  ])
  const lastSeq = seq - 1

  return (
    <div>
      <div className={s.filters} role="toolbar" aria-label="Filter the agenda">
        {FILTERS.filter((f) => f.id === 'all' || counts[f.id]).map((f) => (
          <button
            key={f.id}
            type="button"
            className={s.fchip}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            <span className={s.count}>{f.id === 'all' ? items.length : counts[f.id]}</span>
          </button>
        ))}
      </div>

      <ol className={`${s.timeline} mt-8`} onMouseLeave={() => setHover(null)}>
        {rows.map((r) => {
          const passed = current !== null && r.seq < current && r.seq < lastSeq
          if (r.type === 'divider') {
            return (
              <li key={`d-${r.label}`} className={`${s.tDivider} ${passed ? s.passed : ''}`} hidden={!r.visible} aria-hidden>
                {r.label}
              </li>
            )
          }
          const { a, i } = r
          const cat = catOf(a)
          const lineup = [
            ...(a.moderator ? [{ name: a.moderator, role: 'Moderator' }] : []),
            ...(a.panelists ?? []).map((name) => ({ name, role: 'Panellist' })),
          ]
          const isOpen = !!open[i]
          const isCurrent = current === r.seq
          const panelId = `agenda-lineup-${i}`
          const len = length(i)
          return (
            <li
              key={a.time + a.title}
              className={`${s.tItem} ${s[`t_${cat}`] ?? ''} ${passed ? s.passed : ''} ${isCurrent ? s.current : ''}`}
              hidden={!shows(a)}
              id={cat === 'panel' ? `session-${a.time.replace(':', '')}` : undefined}
              onMouseEnter={() => setHover(r.seq)}
              onClick={() => setPinned((p) => (p === r.seq ? null : r.seq))}
            >
              <div className={s.tWhen}>
                <time className={s.tTime} dateTime={`${date}T${a.time}+05:30`}>
                  {clock(a.time)}
                </time>
                {len && <span className={s.tLen}>{len}</span>}
              </div>
              <button
                type="button"
                className={s.tDot}
                aria-pressed={pinned === r.seq}
                aria-label={`Highlight ${clock(a.time)}: ${a.title}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setPinned((p) => (p === r.seq ? null : r.seq))
                }}
              />
              <div className={s.tCard}>
                {a.kind && <span className={s.tKind}>{a.kind}</span>}
                <h3 className={s.tTitle}>{a.title}</h3>

                {lineup.length > 0 && (
                  <>
                    <button
                      type="button"
                      className={s.tToggle}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpen((o) => ({ ...o, [i]: !o[i] }))
                      }}
                    >
                      <span className={s.stack} aria-hidden>
                        {lineup.map((p) =>
                          people[p.name]?.photo ? (
                            <Image key={p.name} src={people[p.name].photo!} alt="" width={224} height={224} />
                          ) : null,
                        )}
                      </span>
                      <span className={s.tToggleText}>
                        {isOpen ? 'Hide the panel' : `Meet the panel · ${lineup.length}`}
                      </span>
                      <Icon name="chevron" size={18} />
                    </button>
                    <div id={panelId} className={s.tPanel} data-open={isOpen}>
                      <div className={s.tPanelInner}>
                        <ul className={s.people}>
                          {lineup.map((p) => {
                            const d = people[p.name]
                            return (
                              <li key={p.name} className={s.person}>
                                {d?.photo && <Image src={d.photo} alt="" width={224} height={224} />}
                                <span className="min-w-0">
                                  <span className={s.personRole}>{p.role}</span>
                                  <span className="block text-[0.92rem] font-bold leading-snug text-white">{p.name}</span>
                                  {d && (
                                    <span className="block text-[0.78rem] leading-snug text-white/65">
                                      {d.title}, {d.company}
                                    </span>
                                  )}
                                </span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
