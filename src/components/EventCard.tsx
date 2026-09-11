import Image from 'next/image'
import Link from 'next/link'
import { SECTORS } from '@/data/site'
import { eventImage, type CardEvent } from '@/lib/events'

const sectorName = (slug: string) => SECTORS.find((s) => s.slug === slug)?.name ?? slug

export default function EventCard({
  event,
  light = false,
  /** Above-the-fold cards opt in to eager loading; the rest stay lazy. */
  priority = false,
}: {
  event: CardEvent
  light?: boolean
  priority?: boolean
}) {
  const isUpcoming = event.status === 'upcoming'
  const img = eventImage(event)

  // Where the event has a real place, say it. Never print "null, India" or
  // invent a city — seven editions are evidenced only by a poster that prints
  // no location, and for those the row is simply dropped.
  const place = event.venue && event.city ? `${event.venue}, ${event.city}` : (event.city ?? event.venue)

  return (
    // No `.reveal` here on purpose: event cards are the primary content of the
    // events pages, and content that is invisible until a scroll-driven
    // animation runs is a bad default. Reveal is kept for decorative blocks only.
    <article className="card-event card-link group relative flex h-full flex-col">
      {/* 16:9 media rail. Fixed aspect on every card is what keeps a row of
          cards the same height regardless of how long the title runs. */}
      <div className="card-event-media">
        {img ? (
          <Image
            src={img.src}
            alt={`${event.fullName} — event artwork`}
            width={img.w}
            height={img.h}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            loading={priority ? 'eager' : 'lazy'}
            priority={priority}
            className="h-full w-full object-cover"
          />
        ) : (
          // No artwork exists for this edition. A neutral panel is honest;
          // a stock photograph captioned as an EBM event is not.
          <div className="card-event-fallback">
            <span aria-hidden>{event.year}</span>
          </div>
        )}

        <span
          className={`card-event-pill ${
            isUpcoming ? 'bg-gold text-[#1a1200]' : 'bg-navy-950/85 text-white/85'
          }`}
        >
          {isUpcoming ? 'Upcoming' : 'Past edition'}
        </span>
      </div>

      <div className="card-event-body flex flex-1 flex-col">
        <p className={`text-[0.78rem] font-semibold ${light ? 'text-gold-ink' : 'text-gold'}`}>
          {event.edition} · {sectorName(event.sector)}
        </p>

        <h3 className="mt-2 text-[1.12rem] font-bold leading-snug tracking-[-0.01em]">
          <Link href={`/events/${event.slug}/`} className="after:absolute after:inset-0">
            {event.name}
          </Link>
        </h3>

        <dl className={`mt-3.5 space-y-1.5 text-[0.88rem] ${light ? 'text-muted' : 'text-white/65'}`}>
          <div className="flex gap-2.5">
            <dt className="sr-only">Date</dt>
            <span aria-hidden className={light ? 'text-gold-ink' : 'text-gold'}>
              ▪
            </span>
            <dd>
              <time dateTime={event.date ?? String(event.year)}>{event.dateLabel}</time>
            </dd>
          </div>
          {place && (
            <div className="flex gap-2.5">
              <dt className="sr-only">Location</dt>
              <span aria-hidden className={light ? 'text-gold-ink' : 'text-gold'}>
                ▪
              </span>
              <dd>{place}</dd>
            </div>
          )}
        </dl>

        {/* mt-auto pins the CTA to the bottom edge, so every card in a row ends
            on the same line even when one has no location row. */}
        <p
          className={`mt-auto pt-5 inline-flex items-center gap-2 text-[0.88rem] font-semibold ${
            light ? 'text-gold-ink' : isUpcoming ? 'text-gold' : 'text-white/80'
          }`}
        >
          {isUpcoming ? 'Register' : 'View edition'}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </p>
      </div>
    </article>
  )
}
