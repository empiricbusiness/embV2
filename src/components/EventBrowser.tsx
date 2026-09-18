'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import EventCard from '@/components/EventCard'
import type { CardEvent } from '@/lib/events'

/** A card's public fields plus its search string — nothing internal. */
export type BrowserEvent = CardEvent & { haystack: string }

type Chip = { slug: string; name: string; count: number }
type Status = 'all' | 'upcoming' | 'past'

const STATUSES: { slug: Status; name: string }[] = [
  { slug: 'all', name: 'All' },
  { slug: 'upcoming', name: 'Upcoming' },
  { slug: 'past', name: 'Past' },
]

/**
 * Two-axis catalogue filter with live search, driven entirely by the URL.
 *
 * Every card is rendered on the server and present in the static HTML — the
 * filter only narrows what is displayed. That matters twice over: the page is
 * fully indexable with JavaScript off, and a visitor who lands on
 * `/events/?sector=cx&status=past` sees content immediately rather than a
 * loading state.
 *
 * URL state is read in an effect rather than during render, so the first
 * client render matches the server HTML exactly and hydration cannot mismatch.
 */
export default function EventBrowser({
  events,
  sectors,
  formats,
}: {
  events: BrowserEvent[]
  sectors: Chip[]
  formats: Chip[]
}) {
  const [sector, setSector] = useState<string | null>(null)
  const [format, setFormat] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('all')
  const [q, setQ] = useState('')
  const [ready, setReady] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  /* Read the URL once on mount. */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const s = p.get('sector')
    const f = p.get('format')
    const st = p.get('status')
    if (s && sectors.some((x) => x.slug === s)) setSector(s)
    if (f && formats.some((x) => x.slug === f)) setFormat(f)
    if (st === 'upcoming' || st === 'past') setStatus(st)
    setQ(p.get('q') ?? '')
    setReady(true)
  }, [sectors, formats])

  /* Mirror state back into the URL so any view can be linked or bookmarked.
     replaceState, not pushState: typing in the search box must not push a
     history entry per keystroke. */
  useEffect(() => {
    if (!ready) return
    const p = new URLSearchParams()
    if (sector) p.set('sector', sector)
    if (format) p.set('format', format)
    if (status !== 'all') p.set('status', status)
    if (q.trim()) p.set('q', q.trim())
    const qs = p.toString()
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
  }, [sector, format, status, q, ready])

  const needle = q.trim().toLowerCase()
  const matches = useMemo(
    () =>
      events.filter(
        (e) =>
          (!sector || e.sector === sector) &&
          (!format || e.format === format) &&
          (status === 'all' || e.status === status) &&
          (!needle || e.haystack.includes(needle)),
      ),
    [events, sector, format, status, needle],
  )

  const shownUpcoming = matches.filter((e) => e.status === 'upcoming')
  const shownPast = matches.filter((e) => e.status === 'past')
  const years = [...new Set(shownPast.map((e) => e.year))].sort((a, b) => b - a)
  const filtered = Boolean(sector || format || status !== 'all' || needle)

  const clear = () => {
    setSector(null)
    setFormat(null)
    setStatus('all')
    setQ('')
  }

  return (
    <>
      {/* ---------------- filter bar ---------------- */}
      <section className="filter-bar bg-navy-950">
        <div className="wrap">
          {/* Sector and format were two rows of chips — 9 buttons across, and at
              1920px the format row sat 69% empty while the whole bar ran to
              395px. As <select> they collapse into the same row as search and
              status. Native selects, not a custom menu: they get keyboard and
              screen-reader behaviour for free and open the OS picker on a
              phone. Counts move into the option labels so nothing is lost. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
            <div className="relative w-full md:w-auto md:min-w-[17rem] md:flex-1 lg:max-w-sm">
              <label htmlFor="event-search" className="sr-only">
                Search events by name, city or venue
              </label>
              <input
                id="event-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, city or venue"
                className="field-search"
              />
            </div>

            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Filter by status"
            >
              {STATUSES.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setStatus(s.slug)}
                  aria-pressed={status === s.slug}
                  className="chip chip-seg"
                >
                  {s.name}
                </button>
              ))}
            </div>

            <div className="flex min-w-0 max-w-full items-center gap-2">
              <label htmlFor="sector-filter" className="filter-label">
                Sector
              </label>
              <select
                id="sector-filter"
                className="field-select min-w-0"
                value={sector ?? ''}
                data-active={sector ? 'true' : undefined}
                onChange={(e) => setSector(e.target.value || null)}
              >
                <option value="">All sectors</option>
                {sectors.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name} ({s.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex min-w-0 max-w-full items-center gap-2">
              <label htmlFor="format-filter" className="filter-label">
                Format
              </label>
              <select
                id="format-filter"
                className="field-select min-w-0"
                value={format ?? ''}
                data-active={format ? 'true' : undefined}
                onChange={(e) => setFormat(e.target.value || null)}
              >
                <option value="">All formats</option>
                {formats.map((fm) => (
                  <option key={fm.slug} value={fm.slug}>
                    {fm.name} ({fm.count})
                  </option>
                ))}
              </select>
            </div>

            {/* The visible "Showing N of M" line was removed on request. The
                live region STAYS — without it a screen-reader user gets no
                feedback that the grid changed under them — it is just sr-only
                now. Do not delete this <p>; it is the only change announcement. */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:ml-auto">
              <p className="sr-only" aria-live="polite">
                Showing {matches.length} of {events.length} editions
              </p>
              {filtered && (
                <button type="button" onClick={clear} className="link-quiet">
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div ref={resultsRef}>
        {/* ---------------- upcoming ---------------- */}
        {shownUpcoming.length > 0 && (
          <section className="section-attached">
            <div className="wrap">
              <h2 className="h2 text-white">Open for registration</h2>
              <ul className="card-grid section-body grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {shownUpcoming.map((e, i) => (
                  <li key={e.slug}>
                    <EventCard event={e} priority={i < 3} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ---------------- past, grouped by year ---------------- */}
        {shownPast.length > 0 && (
          <section className="section border-t border-white/10 bg-navy-900">
            <div className="wrap">
              <h2 className="h2 text-white">Past editions</h2>
              <p className="lede mt-4 max-w-2xl text-white/65">
                {/* NOT "every edition we have delivered". The archive holds every edition we can
                    evidence from EBM's own artwork and the live site — the Manufacturing series
                    runs to an 8th edition while only the 3rd onwards are documented here. Claiming
                    completeness next to a visible gap is the kind of thing sponsors check. */}
                Every edition we can evidence, back to {Math.min(...events.map((e) => e.year))}.
                Earlier editions of some series ran before our records begin. Past-event pages stay
                live and indexed — they are how sponsors and speakers judge whether the next one is
                worth their time.
              </p>

              {years.map((year) => {
                const list = shownPast.filter((e) => e.year === year)
                return (
                  <div key={year} className="section-body">
                    <div className="year-head">
                      <h3 className="year-head-label">{year}</h3>
                      <span aria-hidden className="year-head-rule" />
                      <span className="year-head-count">
                        {list.length} {list.length === 1 ? 'edition' : 'editions'}
                      </span>
                    </div>
                    <ul className="card-grid mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {list.map((e) => (
                        <li key={e.slug}>
                          <EventCard event={e} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ---------------- empty state ---------------- */}
        {matches.length === 0 && (
          <section className="section-attached">
            <div className="wrap max-w-xl">
              <h2 className="h2 text-white">Nothing matches that yet.</h2>
              <p className="lede mt-5 text-white/65">
                Try a different sector, or clear the filters to see all {events.length} editions.
                {needle && ' Search covers event names, cities, venues and themes.'}
              </p>
              <button type="button" onClick={clear} className="btn btn-gold mt-8">
                Clear filters
              </button>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
