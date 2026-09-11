import Link from 'next/link'
import { EVENTS } from '@/data/site'
import { pageMeta, eventLd, itemListLd } from '@/lib/seo'
import { sectorsInUse, formatsInUse, searchIndex, toCardEvent, upcoming, past } from '@/lib/events'
import PageHero from '@/components/PageHero'
import EventBrowser, { type BrowserEvent } from '@/components/EventBrowser'
import JsonLd from '@/components/JsonLd'

export const metadata = pageMeta({
  title: 'B2B Events & Conferences in India',
  description:
    'Every EBM conference, summit and awards edition, upcoming and past — cybersecurity, HR tech, manufacturing, BFSI, CX and CFO events across India.',
  path: '/events/',
  keywords: [
    'B2B events India',
    'upcoming conferences India 2026',
    'business summits India',
    'CISO summit India',
    'HR tech conference India',
    'manufacturing summit India',
    'BFSI conference India',
    'CFO summit India',
    'industry conferences Mumbai',
  ],
})

export default function EventsPage() {
  const sectors = sectorsInUse()
  const formats = formatsInUse()
  const next = upcoming()[0]

  // The search haystack is built on the server so the client component ships
  // no second copy of the catalogue and no search-index builder.
  //
  // toCardEvent is not cosmetic: client-component props are serialised into the
  // HTML, so spreading the whole record published every internal `source` and
  // `conflicts` note to visitors. Only the projection crosses the boundary.
  const events: BrowserEvent[] = EVENTS.map((e) => ({
    ...toCardEvent(e),
    haystack: searchIndex(e),
  }))

  const cities = [...new Set(EVENTS.map((e) => e.city).filter(Boolean))]
  const earliest = Math.min(...EVENTS.map((e) => e.year))

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Every EBM edition, in one place."
        lede={`${EVENTS.length} editions across ${sectors.length} industry verticals and ${cities.length} host cities, from ${earliest} to today. ${upcoming().length} are open for registration; the ${past().length} that have run stay published.`}
        trail={[{ name: 'Events', path: '/events/' }]}
      />

      {/* Event schema for dated editions only — Google requires startDate, and
          a malformed Event is worse than none. Seven editions are evidenced by
          artwork that prints no calendar date, so they are omitted here. */}
      {EVENTS.filter((e) => e.date).map((e) => (
        <JsonLd key={e.slug} data={eventLd(e)} />
      ))}
      <JsonLd
        data={itemListLd(
          'EBM event catalogue',
          EVENTS.map((e) => ({ name: e.fullName, path: `/events/${e.slug}/` })),
        )}
      />

      <EventBrowser events={events} sectors={sectors} formats={formats} />

      <section className="section on-light">
        <div className="wrap max-w-3xl text-center">
          <h2 className="h2 h2-wide mx-auto">Want your brand in front of this audience?</h2>
          <p className="lede mt-5">
            Sponsors get speaking slots, branded roundtables, exhibition space and curated
            one-to-one meetings with delegates who match their target profile.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/sponsorship/" className="btn btn-dark">
              See sponsorship options
            </Link>
            {next && (
              <Link href={`/events/${next.slug}/`} className="btn btn-ghost">
                Next up: {next.seoName ?? next.name}
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
