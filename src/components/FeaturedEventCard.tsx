import Image from 'next/image'
import Link from 'next/link'
import { SECTORS, type EventRecord } from '@/data/site'
import { EVENT_CONTENT } from '@/data/event-content'
import Countdown from './Countdown'
import Icon from './ShowcaseIcon'
import s from './FeaturedEventCard.module.css'

/**
 * The featured upcoming edition as a full-width card: logo and countdown on
 * the left; theme, facts, numbers, speakers, partners and actions on the right.
 * Server component — every number is derived from the edition's own data, so
 * nothing here can drift from its event page.
 */
export default function FeaturedEventCard({ event }: { event: EventRecord }) {
  const c = EVENT_CONTENT[event.slug]
  const speakers = c?.speakers?.people ?? []
  const panels = c?.agenda?.items.filter((a) => /panel/i.test(a.kind ?? '')).length ?? 0
  const awards = c?.awards?.groups.reduce((n, g) => n + g.categories.length, 0) ?? 0
  const logo = c?.showcase?.logo
  const href = `/events/${event.slug}/`
  const sector = SECTORS.find((x) => x.slug === event.sector)?.name

  const stats = [
    [speakers.length, c?.speakers?.confirmed ? 'Confirmed speakers' : 'Speakers'],
    [panels, 'Panel discussions'],
    [awards, 'Award categories'],
  ].filter(([n]) => Number(n) > 0) as [number, string][]

  return (
    <article className={s.card}>
      <div className={s.visual}>
        <div className={s.pills}>
          <span className={`${s.pill} ${s.pillGold}`}>Featured</span>
          <span className={`${s.pill} ${s.pillLine}`}>
            <span className={s.live} aria-hidden />
            Registrations open
          </span>
        </div>

        {logo ? (
          <Image src={logo.src} alt="" width={logo.w} height={logo.h} className={s.logo} sizes="(min-width: 1024px) 26rem, 80vw" />
        ) : (
          <p className="text-center text-[2rem] font-extrabold text-white">{event.name}</p>
        )}

        {event.date && <Countdown iso={event.date} label="Time until doors open" tone="loud" />}
      </div>

      <div className={s.body}>
        <p className={s.eyebrow}>
          {event.edition}
          {sector ? ` · ${sector}` : ''}
        </p>
        <h3 className={s.title}>
          <Link href={href}>{c?.h1 ?? event.fullName}</Link>
        </h3>
        {event.theme && <p className={s.theme}>{event.theme}</p>}

        <ul className={s.facts}>
          <li>
            <Icon name="calendar" size={18} />
            <time dateTime={event.date ?? undefined}>{event.dateLabel}</time>
          </li>
          {event.timeLabel && (
            <li>
              <Icon name="clock" size={18} />
              {event.timeLabel}
            </li>
          )}
          <li>
            <Icon name="pin" size={18} />
            {event.venue ? `${event.venue}, ` : ''}
            {event.city}
          </li>
        </ul>

        {stats.length > 0 && (
          <dl className={s.stats}>
            {stats.map(([n, label]) => (
              <div key={label} className={s.stat}>
                <dt className={s.statL}>{label}</dt>
                <dd className={s.statN}>{n}</dd>
              </div>
            ))}
          </dl>
        )}

        {speakers.length > 0 && (
          <div className={s.people}>
            <span className={s.stack} aria-hidden>
              {speakers.slice(0, 6).map((p) =>
                p.photo ? <Image key={p.name} src={p.photo} alt="" width={224} height={224} /> : null,
              )}
            </span>
            <span className="text-[0.88rem] font-semibold leading-snug text-white/85">
              {c?.speakers?.teaser ?? `${speakers.length} speakers`}
            </span>
          </div>
        )}

        {c?.partners && (
          <ul className={s.partners} aria-label="Partners">
            {c.partners.map((p) => (
              <li key={p.name} className={s.partnerChip}>
                <Image src={p.logo.src} alt={p.name} width={p.logo.w} height={p.logo.h} />
              </li>
            ))}
          </ul>
        )}

        <div className={s.actions}>
          <Link href={href} className="btn btn-gold">
            View event
            <Icon name="arrow" size={17} />
          </Link>
          <Link href={`/contact/?intent=register&event=${event.slug}`} className="btn btn-ghost">
            Register interest
          </Link>
        </div>
      </div>
    </article>
  )
}
