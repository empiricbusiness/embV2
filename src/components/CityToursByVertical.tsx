import Link from 'next/link'
import {
  deriveLegStatus,
  formatLegDate,
  formatLegVenue,
  legDateTime,
  stopsByVertical,
  type TourStop,
} from '@/lib/tour'

/**
 * The city page's body: every event with a leg in this city, grouped by
 * vertical.
 *
 * Grouping is by vertical rather than by date because the question a visitor
 * brings to a city page is "is there anything here for me", and "me" is a job
 * function. A flat chronological list makes them read every row to find out.
 *
 * The pill row is `.chip` — the same control the events catalogue uses — and
 * the cards are `.card`. Nothing new is invented here: a second tag style
 * would make the same object look like two different things on two pages.
 *
 * The pills are anchor links, not client-side filters. A city holds a handful
 * of events, so a filter that hides two of four rows costs a round of
 * JavaScript to save a glance — and the anchors work with JS off, which the
 * static export means is a real case.
 */
export default function CityToursByVertical({ stops }: { stops: TourStop[] }) {
  const groups = stopsByVertical(stops)
  if (groups.length === 0) return null

  return (
    <>
      {groups.length > 1 && (
        <nav aria-label="Jump to a vertical" className="flex flex-wrap gap-2">
          {groups.map((g) => (
            <a key={g.sector.slug} href={`#${g.sector.slug}`} className="chip">
              {g.sector.name}
              <span className="chip-count">{g.stops.length}</span>
            </a>
          ))}
        </nav>
      )}

      <div className={groups.length > 1 ? 'section-body' : ''}>
        {groups.map((group, gi) => (
          /* section-body rather than an ad-hoc mt-*: group-to-group spacing is
             the same header-to-content rhythm as the rest of the site, and
             audit-spacing.mjs rejects hand-rolled margins at this size. */
          <section
            key={group.sector.slug}
            id={group.sector.slug}
            className={gi > 0 ? 'section-body scroll-mt-28' : 'scroll-mt-28'}
          >
            <div className="year-head">
              <h2 className="year-head-label text-[1.25rem]">{group.sector.name}</h2>
              <span aria-hidden className="year-head-rule" />
              <span className="year-head-count">
                {group.stops.length} {group.stops.length === 1 ? 'edition' : 'editions'}
              </span>
            </div>

            <p className="lede mt-4 max-w-2xl text-[0.95rem] text-white/60">{group.sector.blurb}</p>

            <ul className="card-grid mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {group.stops.map(({ event, leg }) => {
                const status = deriveLegStatus(leg)
                return (
                  <li key={`${event.slug}-${leg.slug}-${leg.date ?? 'tba'}`}>
                    <article className="card card-link flex h-full flex-col">
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/50">
                        {event.edition}
                      </p>

                      <h3 className="mt-2 text-[1.05rem] font-bold leading-snug text-white">
                        {/* The anchor lands on the tour rail, so the visitor
                            arrives at the other cities rather than at the top
                            of a page they have to scroll to understand. */}
                        <Link href={`/events/${event.slug}/#tour`} className="hover:text-gold">
                          {event.name}
                        </Link>
                      </h3>

                      <p className="mt-3 text-[0.9rem] font-semibold text-gold">
                        {leg.date ? (
                          <time dateTime={legDateTime(leg)}>{formatLegDate(leg)}</time>
                        ) : (
                          formatLegDate(leg)
                        )}
                      </p>

                      <p
                        className={`mt-1 flex-1 text-[0.85rem] text-white/60 ${
                          status === 'date_only' ? 'italic' : ''
                        }`}
                      >
                        {formatLegVenue(leg)}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 empty:hidden">
                        {leg.provisional && <span className="tour-tag">Provisional</span>}
                        {leg.mapUrl && (
                          <a
                            href={leg.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tour-map"
                          >
                            View in map
                            <span className="sr-only"> — {leg.venue}, opens in a new tab</span>
                          </a>
                        )}
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
