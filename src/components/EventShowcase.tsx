import Image from 'next/image'
import Link from 'next/link'
import { Bebas_Neue } from 'next/font/google'
import type { EventRecord } from '@/data/site'
import type { EventContent, EventSpeaker, ShowcaseArt } from '@/data/event-content'
import { breadcrumbLd } from '@/lib/seo'
import Countdown from './Countdown'
import EventCard from './EventCard'
import JsonLd from './JsonLd'
import Icon from './ShowcaseIcon'
import ShowcaseAgenda from './ShowcaseAgenda'
import ShowcaseAudience from './ShowcaseAudience'
import ShowcasePartners from './ShowcasePartners'
import ShowcaseSpeakers, { type SpeakerRole } from './ShowcaseSpeakers'
import s from './EventShowcase.module.css'

/**
 * The event page for editions that ship their own identity (`EventContent.showcase`).
 *
 * Look: the event's own logo, cream accent and Bebas display type, on a page-wide
 * "audit paper" backdrop in the site's navy and gold. The hero stages the topic —
 * a moving ledger grid, a rising bar chart and a growth line, with tax and
 * compliance tags floating over it. No brochure illustrations are used.
 *
 * Every fact comes from event-content.ts; this file only decides how it looks.
 * Agenda, speakers and the audience tabs are small client components; all of
 * their content is still rendered into the static HTML.
 */
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-bebas' })

type Props = {
  event: EventRecord
  content: EventContent & { showcase: ShowcaseArt }
  sectorName: string
  related: EventRecord[]
  relatedLabel: string
}

/** Brochure-style section head: the pill is the h2. */
function Pill({
  icon,
  children,
  id,
  as: Tag = 'h2',
}: {
  icon: string
  children: React.ReactNode
  id?: string
  /** 'p' when the section's large display line carries the h2 instead. */
  as?: 'h2' | 'p'
}) {
  return (
    <div className={s.pill}>
      <span className={s.pillIcon}>
        <Icon name={icon} size={20} />
      </span>
      <Tag id={id} className={s.pillText}>
        {children}
      </Tag>
    </div>
  )
}

/* The hero's stage: glows, a moving ledger floor, a rising chart with a growth
   line, and topic tags. Decorative only, so the whole thing is aria-hidden. */
const BARS = [0.34, 0.46, 0.4, 0.58, 0.66, 0.8, 1]
// Placed above and below the glance card, clear of the headline and CTAs.
const TAGS = [
  { label: 'GST', style: { top: '6%', right: '30%' } },
  { label: 'Audit-ready', style: { top: '3%', right: '4%' } },
  { label: 'RegTech', style: { bottom: '7%', right: '37%' } },
  { label: 'Risk & controls', style: { bottom: '2.5%', right: '20%' } },
  { label: 'TDS & e-invoicing', style: { bottom: '8%', right: '3%' } },
]

function HeroScene() {
  const W = 50
  const pts = BARS.map((b, i) => {
    const h = 240 * b
    return { x: 24 + i * 76, y: 280 - h, h }
  })
  const trend = pts.map((p) => `${p.x + W / 2},${p.y - 16}`).join(' ')
  const last = pts[pts.length - 1]
  return (
    <div aria-hidden className={s.scene}>
      <div className={s.sceneGlowBlue} />
      <div className={s.sceneGlowGold} />
      <div className={s.floor}>
        <div className={s.floorGrid} />
      </div>
      <div className={s.horizon} />
      <svg className={s.bars} viewBox="0 0 560 290" fill="none">
        <defs>
          <linearGradient id="ftBarFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a7fd6" stopOpacity="0.55" />
            <stop offset="1" stopColor="#2a7fd6" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="ftBarEdge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3f6d0" stopOpacity="0.7" />
            <stop offset="1" stopColor="#f3f6d0" stopOpacity="0" />
          </linearGradient>
          <filter id="ftGlow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {pts.map((p, i) => (
          <g key={p.x} className={s.bar} style={{ animationDelay: `${0.12 * i}s` }}>
            <rect x={p.x} y={p.y} width={W} height={p.h} rx="10" fill="url(#ftBarFill)" stroke="url(#ftBarEdge)" strokeWidth="1.2" />
            <rect x={p.x + 6} y={p.y + 6} width={W - 12} height="4" rx="2" fill="#f5b614" opacity="0.9" />
          </g>
        ))}
        <polyline className={s.trend} points={trend} stroke="#f5b614" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#ftGlow)" />
        {pts.map((p) => (
          <circle key={`d${p.x}`} cx={p.x + W / 2} cy={p.y - 16} r="4" fill="#f3f6d0" />
        ))}
        <circle className={s.pulse} cx={last.x + W / 2} cy={last.y - 16} r="7" stroke="#f5b614" strokeWidth="2" />
      </svg>
      <ul className={s.heroChips}>
        {TAGS.map((t, i) => (
          <li
            key={t.label}
            className={s.heroChip}
            data-label={t.label}
            style={{ ...t.style, animationDelay: `${i * 0.9}s` }}
          >
            <span>
              <Icon name="check" size={13} />
            </span>
          </li>
        ))}
      </ul>
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className={s.spark}
          style={{ left: `${6 + i * 8}%`, animationDelay: `${(i * 0.83) % 9}s`, animationDuration: `${7 + (i % 4) * 1.5}s` }}
        />
      ))}
    </div>
  )
}

export default function EventShowcase({ event, content, sectorName, related, relatedLabel }: Props) {
  const art = content.showcase
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events/' },
    { name: event.fullName, path: `/events/${event.slug}/` },
  ]

  // "Driving the Future of Tax, Risk & Compliance: Building Faster, …" —
  // the brochure sets the first clause white and the rest cream.
  const [themeHead, themeTail] = (event.theme ?? '').split(/:\s*/)
  const comma = themeHead.indexOf(',')
  const themeWhite = comma > 0 ? themeHead.slice(0, comma + 1) : themeHead
  const themeCream = comma > 0 ? themeHead.slice(comma + 1).trim() : ''

  const speakers = content.speakers?.people ?? []
  // "FinTax Summit 2026": the short name people search for, used in headings.
  const brand = `${event.seoName ?? event.name} ${event.year}`
  const agenda = content.agenda?.items ?? []
  const awardCount = content.awards?.groups.reduce((n, g) => n + g.categories.length, 0) ?? 0
  const panels = agenda.filter((a) => /panel/i.test(a.kind ?? '')).length

  // Speaker lookups for the agenda and the cards' back faces.
  const people: Record<string, EventSpeaker> = Object.fromEntries(speakers.map((p) => [p.name, p]))
  const roles: Record<string, SpeakerRole> = {}
  for (const a of agenda) {
    const panel = (a.kind ?? 'Panel').replace(/\s*discussion\s*/i, ' ').trim()
    const base = { panel, session: a.title, time: a.time, anchor: `session-${a.time.replace(':', '')}` }
    if (a.moderator) roles[a.moderator] = { role: 'Moderator', ...base }
    for (const n of a.panelists ?? []) roles[n] = { role: 'Panellist', ...base }
  }
  const day = event.date
    ? new Date(`${event.date}T00:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })
    : event.dateLabel

  const register = `/contact/?intent=register&event=${event.slug}`
  const speak = `/contact/?intent=speak&event=${event.slug}`
  const sponsor = `/sponsorship/?event=${event.slug}`

  // About: four paragraphs, each with a short design label.
  const [aboutLead, ...aboutRest] = content.about
  const ABOUT_CARDS = [
    { label: 'The focus', icon: 'layers', tags: ['AI', 'Automation', 'RegTech', 'Data-driven decisions'] },
    { label: 'On stage', icon: 'mic' },
    { label: 'Your takeaway', icon: 'rocket' },
  ]

  return (
    <div className={`${bebas.variable} ${s.root}`}>
      <JsonLd data={breadcrumbLd(trail)} />

      {/* ============================================================ hero */}
      <section className={s.hero}>
        <HeroScene />

        <div className="wrap relative pb-20 pt-6 lg:pb-28">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.82rem] text-white/65">
              {trail.map((c, i) => (
                <li key={c.path} className="flex items-center gap-2">
                  {i < trail.length - 1 ? (
                    <>
                      <Link href={c.path} className="hover:text-[var(--ft-cream)]">
                        {c.name}
                      </Link>
                      <span aria-hidden className="text-white/25">
                        /
                      </span>
                    </>
                  ) : (
                    <span aria-current="page" className="text-white/85">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:gap-16">
            <div>
              <p className={s.kicker}>
                {event.edition} · {sectorName} · {event.city}
              </p>

              <h1 className="mt-7">
                <Image
                  src={art.logo.src}
                  alt={content.h1 ? `${event.edition} ${content.h1}` : event.fullName}
                  width={art.logo.w}
                  height={art.logo.h}
                  priority
                  className="h-auto w-full max-w-[36rem]"
                />
                {content.seo?.h1Tagline && <span className={s.h1Tag}>{content.seo.h1Tagline}</span>}
              </h1>

              {event.theme && (
                <div className="mt-9 max-w-[40rem]">
                  <p className={`${s.display} text-[clamp(2rem,1.3rem+2.6vw,3.4rem)] leading-[0.98]`}>
                    <span className="text-white">{themeWhite}</span>{' '}
                    {themeCream && <span className={s.cream}>{themeCream}</span>}
                  </p>
                  {themeTail && (
                    <p className="mt-3 text-[1.05rem] font-medium text-white/75 sm:text-[1.15rem]">{themeTail}</p>
                  )}
                </div>
              )}

              {content.seo?.intro && (
                <p className="mt-5 max-w-[40rem] text-[1rem] leading-relaxed text-white/75">{content.seo.intro}</p>
              )}

              <ul className="mt-9 grid gap-4 sm:grid-cols-3 sm:gap-5">
                <li className={s.fact}>
                  <span className={s.factIcon}>
                    <Icon name="calendar" />
                  </span>
                  <span className="text-[0.95rem] font-semibold leading-snug">
                    <time dateTime={event.date ?? undefined}>{event.dateLabel}</time>
                  </span>
                </li>
                {event.timeLabel && (
                  <li className={s.fact}>
                    <span className={s.factIcon}>
                      <Icon name="clock" />
                    </span>
                    <span className="text-[0.95rem] font-semibold leading-snug">{event.timeLabel}</span>
                  </li>
                )}
                <li className={s.fact}>
                  <span className={s.factIcon}>
                    <Icon name="pin" />
                  </span>
                  <span className="text-[0.95rem] font-semibold leading-snug">
                    {event.venue ? `${event.venue}, ` : ''}
                    {event.city}, India
                    {!event.venue && (
                      <span className="block text-[0.8rem] font-normal text-white/60">Venue to be announced</span>
                    )}
                  </span>
                </li>
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href={register} className={s.btnCream}>
                  Register interest
                  <Icon name="arrow" size={18} />
                </Link>
                <Link href={speak} className={s.btnLine}>
                  Apply to speak
                </Link>
                <Link
                  href={sponsor}
                  className="px-2 text-[0.95rem] font-semibold text-white/80 underline-offset-4 hover:text-[var(--ft-cream)] hover:underline"
                >
                  Sponsor this edition
                </Link>
              </div>
            </div>

            <aside className={`${s.glance} p-6 sm:p-8`} aria-label="At a glance">
              {event.date && <Countdown iso={event.date} label="Time until doors open" />}

              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5">
                {[
                  [content.speakers?.confirmed ? 'Confirmed speakers' : 'Speakers', speakers.length],
                  ['Award categories', awardCount],
                  ['Panel discussions', panels],
                  ['Partners', content.partners?.length ?? 0],
                ]
                  .filter(([, n]) => Number(n) > 0)
                  .map(([label, n]) => (
                    <div key={String(label)} className={s.stat}>
                      <dt className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/60">{label}</dt>
                      <dd className={`${s.display} ${s.cream} mt-1 text-[2.6rem] leading-none`}>{n}</dd>
                    </div>
                  ))}
              </dl>

              {speakers.length > 0 && (
                <a
                  href="#speakers"
                  className="mt-7 flex items-center gap-4 rounded-2xl border border-white/10 p-3 transition-colors hover:border-white/30"
                >
                  <span className={`${s.avatars} flex-none`} aria-hidden>
                    {speakers.slice(0, 5).map((p) =>
                      p.photo ? (
                        <Image key={p.name} src={p.photo} alt="" width={224} height={224} className={`${s.avatar} h-10 w-10 flex-none`} />
                      ) : null,
                    )}
                  </span>
                  <span className="text-[0.88rem] font-semibold leading-snug text-white/85">
                    {content.speakers?.teaser ?? content.speakers?.heading}
                  </span>
                </a>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ==================================================== partner strip */}
      {content.partners && (
        <section className={s.band} aria-label="Partners">
          <div className="wrap flex flex-wrap items-end justify-center gap-x-8 gap-y-6 py-7 lg:justify-between">
            {content.partners.map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-2 lg:items-start">
                <span className={s.bandLabel}>{p.tier}</span>
                <span className={s.bandLogo}>
                  <Image src={p.logo.src} alt={p.name} width={p.logo.w} height={p.logo.h} />
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2 lg:items-start">
              <span className={s.bandLabel}>Conceptualised &amp; organised by</span>
              {/* The EBM logo is white and gold on transparent, so it sits on a
                  dark tile the same size as the partner logos' white tiles. */}
              <span className={`${s.bandLogo} ${s.bandLogoDark}`}>
                <Image src="/images/brand/ebm-logo.png" alt="Empiric Business Media (EBM)" width={560} height={86} />
              </span>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================== about */}
      <section className={s.section}>
        <div className="wrap">
          <div className="max-w-3xl">
            <Pill icon="info" as="p">
              About the summit
            </Pill>
            <h2 className={`${s.display} ${s.headline}`}>
              {event.edition} <span className={s.cream}>{content.h1 ?? event.name}</span>
            </h2>
          </div>

          <div className={`${s.bento} mt-12`}>
            <article className={`${s.glass} ${s.bCard} ${s.bLead}`}>
              <span className={s.bLabel}>
                <span className={s.bIcon}>
                  <Icon name="target" />
                </span>
                The challenge
              </span>
              <p className="mt-5 text-[1.1rem] leading-[1.75] text-white/90 lg:text-[1.22rem]">{aboutLead}</p>
            </article>

            {event.theme && (
              <article className={`${s.glass} ${s.bCard} ${s.bTheme}`}>
                <span className={s.bLabel}>
                  <span className={s.bIcon}>
                    <Icon name="quote" />
                  </span>
                  The theme
                </span>
                <p className={`${s.display} relative mt-6 text-[clamp(2rem,1.4rem+1.6vw,2.9rem)] leading-[1]`}>
                  <span className="text-white">{themeHead}</span>
                  {themeTail && <span className={`${s.cream} mt-3 block`}>{themeTail}</span>}
                </p>
                <p className="relative mt-6 text-[0.88rem] font-semibold text-white/70">
                  {event.dateLabel} · {event.city}
                </p>
              </article>
            )}

            {aboutRest.map((para, i) => {
              const c = ABOUT_CARDS[i] ?? ABOUT_CARDS[ABOUT_CARDS.length - 1]
              return (
                <article key={para.slice(0, 32)} className={`${s.glass} ${s.bCard} ${s.bFact}`}>
                  <span className={s.bLabel}>
                    <span className={s.bIcon}>
                      <Icon name={c.icon} />
                    </span>
                    {c.label}
                  </span>
                  <p className="mt-4 text-[0.95rem] leading-[1.7] text-white/75">{para}</p>
                  {'tags' in c && c.tags && (
                    <div className={`${s.tags} mt-auto pt-5`}>
                      {c.tags.map((t) => (
                        <span key={t} className={s.tag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              )
            })}

            {/* The numbers, each a way into its section. Sub-lines come from the
                data, so they cannot drift from it. */}
            <div className={`${s.glass} ${s.bCard} ${s.bStats}`}>
              {[
                {
                  n: speakers.length,
                  label: content.speakers?.confirmed ? 'Confirmed speakers' : 'Speakers',
                  sub: 'CFOs, tax heads and finance leaders',
                  icon: 'mic',
                  href: '#speakers',
                },
                {
                  n: panels,
                  label: 'Panel discussions',
                  sub: 'Plus an opening keynote and partner sessions',
                  icon: 'users',
                  href: '#agenda',
                },
                {
                  n: awardCount,
                  label: 'Award categories',
                  sub: content.awards?.groups
                    .map((g) => `${g.categories.length} ${/individual/i.test(g.name) ? 'individual' : 'organisational'}`)
                    .join(' · '),
                  icon: 'trophy',
                  href: '#awards',
                },
                {
                  n: content.partners?.length ?? 0,
                  label: 'Partners',
                  sub: content.partners?.map((p) => p.tier.replace(/\s*partner$/i, '')).join(' · '),
                  icon: 'briefcase',
                  href: '#partners',
                },
              ]
                .filter((x) => x.n > 0)
                .map((x) => (
                  <a key={x.label} href={x.href} className={s.bStat}>
                    <span className={s.bStatIcon}>
                      <Icon name={x.icon} size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className={`${s.display} ${s.gold} block text-[2.6rem] leading-none`}>{x.n}</span>
                      <span className="mt-1 block text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white">
                        {x.label}
                      </span>
                      {x.sub && <span className="mt-1 block text-[0.8rem] leading-snug text-white/70">{x.sub}</span>}
                    </span>
                    <span className={s.bStatGo} aria-hidden>
                      <Icon name="arrow" size={16} />
                    </span>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================ who should attend */}
      {(content.audience || content.industries) && (
        <section className={s.section}>
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Pill icon="users" as={content.audience ? 'p' : 'h2'}>
                  Who should attend
                </Pill>
                {content.audience && (
                  <h2 className={`${s.display} ${s.headline}`}>
                    For{' '}
                    <span className={s.cream}>
                      {content.audience.title ??
                        /* "CXO / VP / Director of" -> "CXOs, VPs & Directors" */
                        content.audience.heading
                          .replace(/\s*of$/i, '')
                          .split('/')
                          .map((x) => `${x.trim()}s`)
                          .join(', ')
                          .replace(/, ([^,]+)$/, ' & $1')}
                    </span>
                  </h2>
                )}
              </div>
            </div>
            <div className="mt-10">
              <ShowcaseAudience
                groups={[
                  ...(content.audience
                    ? [{ id: 'dept', label: 'Departments', lede: content.audience.heading, items: content.audience.roles, details: content.audience.details }]
                    : []),
                  ...(content.industries
                    ? [{ id: 'ind', label: content.industries.heading, lede: 'From these sectors', items: content.industries.items, details: content.industries.details }]
                    : []),
                ]}
              />
            </div>
          </div>
        </section>
      )}

      {/* ====================================================== why attend */}
      {content.whyAttend && (
        <section className={s.section}>
          <div className="wrap">
            <Pill icon="spark">Why attend the {brand}</Pill>
            <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {content.whyAttend.items.map((w, i) => (
                <li key={w.title} className={s.why}>
                  <span aria-hidden className={s.whyNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-[1.05rem] font-bold leading-snug text-white">{w.title}</h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-white/70">{w.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ========================================================== agenda */}
      {agenda.length > 0 && event.date && (
        <section id="agenda" className={`${s.section} scroll-mt-24`} aria-labelledby="agenda-title">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Pill icon="list" id="agenda-title">
                  {brand} agenda
                </Pill>
                <p className={`${s.display} ${s.headline}`}>{event.dateLabel}</p>
              </div>
              <p className="max-w-sm text-[0.95rem] leading-relaxed text-white/70">
                One opening keynote, {panels} panel discussions, partner presentations and the awards ceremony. Tap a
                panel to meet its speakers. All times IST.
              </p>
            </div>

            <div className="mt-10 max-w-5xl">
              <ShowcaseAgenda date={event.date} items={agenda} people={people} />
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              <Link href={register} className={s.btnCream}>
                Register interest
                <Icon name="arrow" size={18} />
              </Link>
              <Link href={speak} className={s.btnLine}>
                Apply to speak
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== speakers */}
      {content.speakers && (
        <section id="speakers" className={`${s.section} scroll-mt-24`}>
          <div className="wrap">
            <div className="flex flex-col items-center text-center">
              <Pill icon="mic">{brand} speakers</Pill>
              <p className={`${s.display} ${s.headline}`}>
                {speakers.length}{' '}
                <span className={s.cream}>
                  {content.speakers.confirmed ? 'confirmed ' : ''}finance &amp; tax leaders
                </span>
              </p>
              <p className="mt-3 text-[0.95rem] text-white/70">Hover or tap a card to see their session.</p>
            </div>
            <div className="mt-10">
              <ShowcaseSpeakers people={speakers} roles={roles} day={day} eventName={brand} />
            </div>
          </div>
        </section>
      )}

      {/* ========================================================== awards */}
      {content.awards && (
        <section id="awards" className={`${s.section} ${s.awards} scroll-mt-24`}>
          <div className="wrap">
            <div className="flex flex-col items-center text-center">
              <Image src={art.badge.src} alt="" aria-hidden width={art.badge.w} height={art.badge.h} className="h-28 w-auto sm:h-32" loading="lazy" />
              <div className="mt-6">
                <Pill icon="trophy">{content.awards.name}</Pill>
              </div>
              <p className={`${s.display} ${s.headline}`}>
                {awardCount} <span className={s.cream}>categories</span>
              </p>
              {content.awards.note && <p className="mt-3 text-[0.95rem] text-white/70">{content.awards.note}</p>}
            </div>

            <div className="mt-12 space-y-12">
              {content.awards.groups.map((g) => (
                <div key={g.name}>
                  <h3 className={s.groupHead}>
                    {g.name} · {g.categories.length}
                  </h3>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {g.categories.map((c) => (
                      <li key={c}>
                        <div className={s.awardTile}>
                          <Image src={art.badge.src} alt="" aria-hidden width={art.badge.w} height={art.badge.h} className="h-10 w-auto flex-none" loading="lazy" />
                          <span className="text-[0.9rem] font-medium leading-snug text-white/90">{c}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== partners */}
      {content.partners && (
        <section id="partners" className={`${s.section} scroll-mt-24`}>
          <div className="wrap">
            <Pill icon="briefcase">{brand} partners</Pill>
            <ShowcasePartners partners={content.partners} />
          </div>
        </section>
      )}

      {/* ===================================================== why sponsor */}
      {content.whySponsor && (
        <section className={s.section}>
          <div className="wrap grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <Pill icon="megaphone">Sponsor the {brand}</Pill>
              <p className={`${s.display} ${s.headline}`}>
                Put your brand <span className={s.cream}>in front of this room</span>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={sponsor} className={s.btnCream}>
                  Sponsorship packages
                  <Icon name="arrow" size={18} />
                </Link>
                <Link href={`/contact/?intent=sponsor&event=${event.slug}`} className={s.btnLine}>
                  Talk to the team
                </Link>
              </div>
            </div>
            <ol>
              {content.whySponsor.map((w, i) => (
                <li key={w.title ?? w.body} className={s.point}>
                  <span aria-hidden className={s.pointNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[1rem] leading-relaxed text-white/85">
                    {w.title && <strong className="text-white">{w.title}. </strong>}
                    {w.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ============================================================= faq */}
      {content.faq && (
        <section className={s.section}>
          <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <Pill icon="help">
                {event.seoName ?? event.name} {event.year} FAQ
              </Pill>
              <p className={`${s.display} ${s.headline}`}>
                Common <span className={s.cream}>questions</span>
              </p>
            </div>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {content.faq.map((f) => (
                <details key={f.q} className={`group py-5 ${s.faqItem}`}>
                  <summary className="-my-5 flex cursor-pointer items-start justify-between gap-4 py-5 text-[1.02rem] font-semibold text-white">
                    {f.q}
                    <span aria-hidden className="mt-0.5 shrink-0 text-[var(--ft-gold)] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-white/75">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================= cta */}
      <section className="pb-[var(--space-section)] pt-4">
        <div className="wrap">
          <div className={`${s.cta} px-6 py-14 text-center sm:px-12 sm:py-20`}>
            <div aria-hidden className={s.floor}>
              <div className={s.floorGrid} />
            </div>
            <div className="relative">
              <p className={`${s.display} text-[clamp(2.4rem,1.6rem+3.4vw,4.6rem)] leading-[0.95]`}>
                {content.h1 ?? event.name}
              </p>
              <p className="mx-auto mt-4 max-w-xl text-[1.05rem] text-white/80">
                {event.dateLabel} · {event.city}
                {event.timeLabel ? ` · ${event.timeLabel}` : ''}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link href={register} className={s.btnCream}>
                  Register interest
                  <Icon name="arrow" size={18} />
                </Link>
                <Link href={speak} className={s.btnLine}>
                  Apply to speak
                </Link>
                <Link href={sponsor} className={s.btnLine}>
                  Sponsor this edition
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= related */}
      {related.length > 0 && (
        <section className={`${s.section}`}>
          <div className="wrap">
            <h2 className="h2 text-white">{relatedLabel}</h2>
            <ul className="section-body card-grid grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((e) => (
                <li key={e.slug}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
