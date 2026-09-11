import Image from 'next/image'
import Link from 'next/link'
import { pageMeta } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import assets from '@/data/assets.json'
import eventImages from '@/data/event-images.json'

export const metadata = pageMeta({
  title: 'Event Gallery',
  description:
    'Photography from Empiric Business Media conferences and summits — the exhibition floor, the room and the networking around it, across editions.',
  path: '/gallery/',
  keywords: ['EBM event gallery', 'B2B conference photos India', 'business summit photos India'],
})

type Img = { src: string; w: number; h: number }
const IMAGES = eventImages as Record<string, Img>

/**
 * WHAT IS AND IS NOT SHOWN HERE
 *
 * The nine images this page originally showed (gallery-1..9.jpg) were template
 * STOCK — a concert crowd, fireworks, a live band — published under the
 * claim "Photographs from Empiric Business Media conferences … across Mumbai,
 * Pune, Chennai, Delhi and Bengaluru". That was false, so they were removed,
 * and for a while this page showed a single photograph.
 *
 * A one-image gallery reads as "this company has never run anything", which an
 * external reviewer said damages trust more than having no gallery at all. The
 * photographs below were recovered from EBM's own asset library and verified by
 * eye to be real event photography, not stock: identifiable exhibition stands
 * for real Indian vendors, lanyarded delegates, hotel ballrooms with EBM's
 * table dressing.
 *
 * WHAT WE STILL CANNOT SAY: which edition, city or year each photograph is
 * from. That is not recorded anywhere in the asset library or the crawl. So the
 * captions describe what is visibly in the frame and nothing more — no event
 * name, no city, no date. Guessing would repeat exactly the defect that got the
 * stock photography pulled.
 *
 * TODO(client): supply per-photograph attribution (edition, city, year) and
 * these become properly captioned. Also supply stage, awards and keynote shots
 * — the recovered set is heavy on the exhibition floor and the audience.
 */
const CATEGORIES = [
  {
    key: 'booth',
    heading: 'The exhibition floor',
    blurb:
      'Solution partners on the main circulation route — where sponsors meet delegates between sessions.',
    alt: 'Exhibition stand on the floor of an Empiric Business Media event, with delegates in conversation',
    caption: 'Sponsor stand, exhibition floor',
    prefix: 'booth/',
  },
  {
    key: 'gallery',
    heading: 'In the room',
    blurb: 'Delegates in session, and the networking either side of it.',
    alt: 'Delegates seated in the conference room at an Empiric Business Media event',
    caption: 'Conference floor, delegates in session',
    prefix: 'gallery/',
  },
]

/** Pull every recovered photograph of a given kind, in stable filename order. */
function photosFor(prefix: string) {
  return Object.entries(IMAGES)
    .filter(([k]) => k.startsWith(prefix) && !k.includes('hero-bg'))
    .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
    .map(([, v]) => v)
}

/** The one EBM photograph found in the 131-page crawl; it leads the room set. */
const ABOUT_FRAME = assets.brand['about-1'] as Img

export default function GalleryPage() {
  const groups = CATEGORIES.map((c) => ({
    ...c,
    photos: c.key === 'gallery' ? [ABOUT_FRAME, ...photosFor(c.prefix)] : photosFor(c.prefix),
  }))
  const total = groups.reduce((n, g) => n + g.photos.length, 0)

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Inside the room."
        lede={`${total} photographs from EBM conferences and summits — the exhibition floor, the room, and the networking around it.`}
        trail={[{ name: 'Gallery', path: '/gallery/' }]}
      />

      {groups.map((g, gi) => (
        <section key={g.key} className={gi === 0 ? 'section' : 'section border-t border-white/10 bg-navy-900'}>
          <div className="wrap">
            <h2 className="h2 text-white">{g.heading}</h2>
            <p className="lede mt-4 max-w-2xl text-white/65">{g.blurb}</p>

            <ul className="card-grid section-body grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.photos.map((p, i) => (
                <li key={p.src}>
                  <figure className="overflow-hidden rounded-xl border border-white/10">
                    <Image
                      src={p.src}
                      alt={g.alt}
                      width={p.w}
                      height={p.h}
                      loading={gi === 0 && i < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="aspect-video w-full object-cover"
                    />
                    <figcaption className="bg-navy-950 px-4 py-3 text-[0.85rem] text-white/70">
                      {g.caption}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="section border-t border-white/10">
        <div className="wrap max-w-2xl">
          <h2 className="h2 text-white">Looking for a specific edition?</h2>
          {/* Stated plainly rather than dressed up: we hold the photographs but
              not the per-edition attribution, and pretending otherwise is how
              the stock-photo problem happened in the first place. */}
          <p className="lede mt-5 text-white/70">
            These are published without edition captions because the attribution was not recorded
            with the files. Sponsors and speakers can request the full set for any edition they took
            part in, and we will confirm the event, city and date with it.
          </p>
          <Link href="/contact/?intent=other" className="btn btn-gold mt-8">
            Request event photography
          </Link>
        </div>
      </section>
    </>
  )
}
