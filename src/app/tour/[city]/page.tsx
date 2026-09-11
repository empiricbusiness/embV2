import Link from 'next/link'
import { notFound } from 'next/navigation'
import { pageMeta } from '@/lib/seo'
import { stopsInCity, tourCities } from '@/lib/tour'
import PageHero from '@/components/PageHero'
import CityToursByVertical from '@/components/CityToursByVertical'
import assets from '@/data/assets.json'

type HeroImg = { src: string; w: number; h: number }

/**
 * City landing page — every event with a leg in this city.
 *
 * The city-first view of the same `legs[]` data the event page renders as a
 * tour rail. There is no second copy of the schedule: both read
 * src/lib/tour.ts, so adding a leg to an event makes it appear here with no
 * further step.
 *
 * Cities are DERIVED from the legs, so this route generates exactly the pages
 * that have content. A city with no legs has no URL rather than an empty page.
 */

const heroImage = () =>
  assets.hero.find((h) => h.name === 'hero-conference') as HeroImg | undefined

export function generateStaticParams() {
  return tourCities().map((c) => ({ city: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const match = tourCities().find((c) => c.slug === city)
  if (!match) return {}

  const stops = stopsInCity(city)
  const verticals = [...new Set(stops.map((s) => s.event.sector))].length

  // Title budget: the `| EBM` template costs 6 of the gate's 65 characters and
  // every ampersand costs 5 in the measured HTML, so this line carries none.
  return pageMeta({
    title: `B2B Conferences and Summits in ${match.city}`,
    description: `${stops.length} EBM ${stops.length === 1 ? 'edition' : 'editions'} across ${verticals} ${
      verticals === 1 ? 'sector' : 'sectors'
    } coming to ${match.city}. Dates, venues and how to register, speak or sponsor.`,
    path: `/tour/${match.slug}/`,
    keywords: [
      `B2B conferences ${match.city}`,
      `business events ${match.city}`,
      `summits in ${match.city}`,
      `corporate conference organisers ${match.city}`,
    ],
  })
}

export default async function CityTourPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const match = tourCities().find((c) => c.slug === city)
  if (!match) notFound()

  const stops = stopsInCity(city)
  const verticals = [...new Set(stops.map((s) => s.event.sector))].length
  const dated = stops.filter((s) => s.leg.date).length

  return (
    <>
      <PageHero
        eyebrow="On tour"
        title={match.city}
        lede={`${stops.length} ${stops.length === 1 ? 'edition' : 'editions'} across ${verticals} ${
          verticals === 1 ? 'sector' : 'sectors'
        }. Each one is a leg of a national tour, so the agenda, speakers and awards are the same wherever you join.`}
        image={heroImage()}
        stage
        trail={[
          { name: 'On tour', path: '/tour/' },
          { name: match.city, path: `/tour/${match.slug}/` },
        ]}
      />

      <section className="section">
        <div className="wrap">
          <CityToursByVertical stops={stops} />

          {/* Counted honestly: an undated leg is not a scheduled one, and the
              difference is exactly what a visitor planning a trip needs. */}
          {dated < stops.length && (
            <p className="section-body max-w-2xl text-[0.9rem] leading-relaxed text-white/55">
              {stops.length - dated} of these {stops.length} legs {stops.length - dated === 1 ? 'is' : 'are'}{' '}
              still being scheduled. The city is committed; the date is not yet fixed.
            </p>
          )}

          <p className="mt-8 text-sm text-white/55">
            <Link href="/tour/" className="link-quiet">
              See every city on tour
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
