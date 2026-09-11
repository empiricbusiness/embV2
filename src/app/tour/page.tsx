import Link from 'next/link'
import { pageMeta } from '@/lib/seo'
import { formatLegDate, legDateTime, touringEvents, tourCities } from '@/lib/tour'
import PageHero from '@/components/PageHero'
import assets from '@/data/assets.json'

type HeroImg = { src: string; w: number; h: number }

/**
 * Index of every city currently on tour.
 *
 * Entirely derived from `legs[]` — there is no authored city list to keep in
 * step. A city appears the moment a leg naming it is added to any event, and
 * disappears when the last one is removed.
 */

export const metadata = pageMeta({
  title: 'B2B Events by City in India',
  description:
    'Every Indian city on an EBM tour, with the editions coming to each. Find a conference, summit or awards evening near you and register, speak or sponsor.',
  path: '/tour/',
  keywords: [
    'B2B conferences by city India',
    'business events near me India',
    'summits in Mumbai Bengaluru Chennai',
    'conference organisers India',
  ],
})

export default function TourIndexPage() {
  const cities = tourCities()
  const events = touringEvents()

  return (
    <>
      <PageHero
        eyebrow="On tour"
        title="Every city on tour"
        lede={
          cities.length > 0
            ? `${events.length} ${events.length === 1 ? 'edition tours' : 'editions tour'} ${cities.length} cities. The agenda, speaker roster and awards programme travel intact — pick the leg that suits you.`
            : 'No tour dates are published yet. Every EBM edition is listed in the events catalogue.'
        }
        image={assets.hero.find((h) => h.name === 'hero-conference') as HeroImg | undefined}
        stage
        trail={[{ name: 'On tour', path: '/tour/' }]}
      />

      <section className="section">
        <div className="wrap">
          {cities.length === 0 ? (
            /* Dormant state. A tour index with nothing in it must say so and
               hand the visitor somewhere real, never render an empty grid. */
            <div className="max-w-xl">
              <h2 className="h2 text-white">No tour is running right now.</h2>
              <p className="lede mt-5 text-white/65">
                Every edition we have dated is in the events catalogue, including the ones that run
                in a single city.
              </p>
              <Link href="/events/" className="btn btn-gold mt-8">
                See all events
              </Link>
            </div>
          ) : (
            <ul className="card-grid grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cities.map((c) => (
                <li key={c.slug}>
                  <Link href={`/tour/${c.slug}/`} className="card card-link flex h-full flex-col">
                    <h2 className="text-[1.3rem] font-bold text-white">{c.city}</h2>
                    <p className="mt-2 flex-1 text-[0.9rem] text-white/60">
                      {c.count} {c.count === 1 ? 'edition' : 'editions'}
                    </p>
                    <p className="mt-4 text-[0.88rem] font-semibold text-gold">
                      {c.next ? (
                        <>
                          Next:{' '}
                          <time dateTime={legDateTime(c.next)}>{formatLegDate(c.next)}</time>
                        </>
                      ) : (
                        'Dates to be announced'
                      )}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
