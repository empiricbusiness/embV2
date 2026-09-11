import type { CSSProperties } from 'react'
import Link from 'next/link'
import type { EventRecord } from '@/data/site'
import {
  deriveLegStatus,
  formatLegDate,
  formatLegVenue,
  legDateTime,
  legsSorted,
  railGaps,
} from '@/lib/tour'

/**
 * The city-tour rail on an event page.
 *
 * A timeline, not a carousel. Node spacing is proportional to the real gap
 * between dates (see `railGaps`), so a tour that runs two cities a week apart
 * and then pauses for three months looks like that at a glance — which is the
 * only thing this component exists to communicate. A row of evenly spaced
 * numbered badges, which is what every competitor ships, communicates nothing
 * except the count.
 *
 * Server-rendered with no client JavaScript: every date is known at build, so
 * the gaps are arithmetic, not layout measurement.
 *
 * Renders nothing for an event with fewer than two legs. One city is not a
 * tour, and a single-node timeline is just a date the hero already shows.
 */
export default function CityTourRail({ event }: { event: EventRecord }) {
  const legs = legsSorted(event.legs ?? [])
  if (legs.length < 2) return null

  const gaps = railGaps(legs)
  const provisional = legs.filter((l) => l.provisional).length
  const cities = legs.length

  return (
    <section id="tour" className="section border-t border-white/10 bg-navy-900">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">
            <span aria-hidden className="rule-gold" />
            The tour
          </p>
          <h2 className="h2 h2-wide text-white">
            {cities} cities, one {event.edition.toLowerCase()}
          </h2>
          <p className="lede text-white/65">
            The same agenda, speaker roster and awards programme travel to every city on this list.
            Register for whichever leg suits you.
            {provisional > 0 && (
              <>
                {' '}
                Legs marked <em className="not-italic text-gold">provisional</em> are planned but not
                yet contracted — dates and venues can still move.
              </>
            )}
          </p>
        </div>

        {/* The track scrolls inside itself on desktop. Below the breakpoint it
            becomes a vertical stack (see .tour-track in globals.css), because a
            horizontally scrolling strip on a phone is a trap: it competes with
            the page's own vertical scroll and hides nodes off-screen with no
            affordance that they exist. */}
        <div className="section-body">
          <ol className="tour-track">
            {legs.map((leg, i) => {
              const status = deriveLegStatus(leg)
              return (
                <li
                  key={`${leg.slug}-${leg.date ?? 'tba'}`}
                  className="tour-node"
                  data-status={status}
                  data-provisional={leg.provisional ? 'true' : undefined}
                  style={{ '--tour-gap': `${gaps[i]}px` } as CSSProperties}
                >
                  <span aria-hidden className="tour-dot" />

                  <div className="tour-card">
                    <p className="tour-city">{leg.city}</p>

                    <p className="tour-date">
                      {leg.date ? (
                        <time dateTime={legDateTime(leg)}>{formatLegDate(leg)}</time>
                      ) : (
                        formatLegDate(leg)
                      )}
                    </p>

                    <p className="tour-venue">{formatLegVenue(leg)}</p>

                    <div className="tour-meta">
                      {leg.provisional && <span className="tour-tag">Provisional</span>}
                      {status === 'tba' && !leg.provisional && (
                        <span className="tour-tag">Date to come</span>
                      )}
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
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <p className="mt-8 text-sm text-white/55">
          Looking for a particular city?{' '}
          <Link href="/tour/" className="link-quiet">
            Browse every city on tour
          </Link>
        </p>
      </div>
    </section>
  )
}
