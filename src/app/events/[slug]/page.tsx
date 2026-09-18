import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EVENTS, SECTORS, SITE, PRICING } from '@/data/site'
import { EVENT_CONTENT } from '@/data/event-content'
import { pageMeta, eventLd } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import EventCard from '@/components/EventCard'
import Countdown from '@/components/Countdown'
import CityTourRail from '@/components/CityTourRail'
import JsonLd from '@/components/JsonLd'
import assets from '@/data/assets.json'

type HeroImg = { src: string; w: number; h: number }

/**
 * Backdrop per sector. CISO and HR Tech have their own artwork from the live
 * microsites; everything else falls back to the real EBM conference photograph,
 * which is always truthful for an EBM event page.
 */
function eventHero(sectorSlug: string): HeroImg {
  const byName = (n: string) => assets.hero.find((h) => h.name === n) as HeroImg | undefined
  const map: Record<string, string> = {
    'ciso-cybersecurity': 'hero-ciso',
    'hr-technology': 'hero-hrtech',
  }
  return byName(map[sectorSlug] ?? '') ?? (byName('hero-conference') as HeroImg)
}

/** What every EBM edition includes, regardless of vertical. */
const FORMAT = [
  ['Keynotes & panels', 'Practitioners presenting real work, not product decks.'],
  ['Roundtables', 'Small-format, chaired discussion under Chatham House convention.'],
  ['One-to-one meetings', 'Matched on stated requirement, scheduled on the day.'],
  ['Awards & recognition', 'Category awards judged on submitted evidence.'],
  ['Hosted networking', 'Breaks, lunch and the evening reception, hosted by sponsors.'],
  ['Exhibition floor', 'Solution partners on the main circulation route.'],
]

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const e = EVENTS.find((x) => x.slug === slug)
  if (!e) return {}
  const sector = SECTORS.find((s) => s.slug === e.sector)

  // Titles are AUTHORED per event, not generated. Four Manufacturing editions
  // share a name and a year, and seven editions have no evidenced city, so a
  // generated "<name> <year> — <city>" produced both duplicates and the string
  // "undefined". The gate rejects duplicate titles, which is how this surfaced.
  const title = e.seoTitle

  const where = e.city ? ` in ${e.city}` : ''
  const desc =
    e.status === 'upcoming'
      ? `${e.name} — ${e.edition}. ${e.dateLabel}${where}. Register, apply to speak, or sponsor this edition.`
      : `${e.name} — ${e.edition} — took place ${e.dateLabel}${where}. See the edition and what EBM delivers next.`

  return pageMeta({
    title,
    description: desc,
    path: `/events/${e.slug}/`,
    keywords: [
      e.fullName,
      `${sector?.name} conference India`,
      `${sector?.keyword ?? ''}`,
      ...(e.city ? [`business events ${e.city}`, `conference ${e.city} ${e.year}`] : []),
    ].filter(Boolean),
  })
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = EVENTS.find((e) => e.slug === slug)
  if (!event) notFound()

  const sector = SECTORS.find((s) => s.slug === event.sector)
  // Same-sector editions first; if a franchise has none yet, fall back to other
  // upcoming events so the page never dead-ends.
  const sameSector = EVENTS.filter((e) => e.sector === event.sector && e.slug !== event.slug)
  const related = (
    sameSector.length ? sameSector : EVENTS.filter((e) => e.status === 'upcoming' && e.slug !== event.slug)
  ).slice(0, 3)
  const relatedLabel = sameSector.length ? `Other ${sector?.name} editions` : 'Other upcoming events'
  const isUpcoming = event.status === 'upcoming'
  const heroImg = eventHero(event.sector)

  // Facts strip — the four things someone scans for before reading anything.
  // Location is omitted rather than guessed. Seven editions are evidenced only
  // by artwork that prints no place; "null, India" is worse than no row.
  const place =
    event.venue && event.city
      ? `${event.venue}, ${event.city}`
      : event.venue ?? (event.city ? `${event.city}, India` : null)

  /* Long-form content transcribed from this edition's own live site. Only
     some editions have it; every section below is omitted when it does not. */
  const content = EVENT_CONTENT[event.slug]


  return (
    <>
      <JsonLd data={eventLd(event)} />

      <PageHero
        eyebrow={`${event.edition} · ${sector?.name ?? ''}`}
        title={event.name}
        lede={event.theme}
        image={heroImg}
        stage
        trail={[
          { name: 'Events', path: '/events/' },
          { name: event.fullName, path: `/events/${event.slug}/` },
        ]}
      >
        {/* Date, place and the countdown sit in the hero rather than in a
            strip underneath it. They were the whole content of that strip, so
            it has been removed — an upcoming event's first question is "when
            and where", and it should not need a scroll. */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[1.05rem] font-medium text-white/90">
          <span className="inline-flex items-center gap-2.5">
            <span aria-hidden className="text-gold">
              ▪
            </span>
            <time dateTime={event.date ?? undefined}>{event.dateLabel}</time>
          </span>
          {place && (
            <span className="inline-flex items-center gap-2.5">
              <span aria-hidden className="text-gold">
                ▪
              </span>
              {place}
            </span>
          )}
          {event.timeLabel && (
            <span className="inline-flex items-center gap-2.5">
              <span aria-hidden className="text-gold">
                ▪
              </span>
              {event.timeLabel}
            </span>
          )}
        </div>

        {isUpcoming && event.date && (
          <Countdown iso={event.date} label="Time until doors open" tone="loud" />
        )}

        {/* No "Open for registration" pill beside a Register button — two gold
            pills side by side, one of which is not clickable, and the button
            already says it. Past editions still need the label. */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          {!isUpcoming && (
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-white/80">
              Past edition
            </span>
          )}
          {isUpcoming && (
            <>
              {/* The badge and the button have to agree. Where a real
                  registration page exists we link it and say "Register";
                  where it does not, the honest label is an enquiry, and the
                  badge above softens to match. */}
              {event.registerUrl ? (
                <a
                  href={event.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                >
                  Register
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <Link
                  href={`/contact/?intent=register&event=${event.slug}`}
                  className="btn btn-gold"
                >
                  Register interest
                </Link>
              )}
              <Link href={`/sponsorship/?event=${event.slug}`} className="btn btn-ghost">
                Sponsor this edition
              </Link>
            </>
          )}
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* Main */}
          <div>

            <div className="prose section-body">
              <h2 className="h2 text-white">About this edition</h2>
              {content ? (
                /* The edition's own copy, verbatim. Generated prose is a
                   fallback for editions that have published none. */
                content.about.map((p) => (
                  <p key={p.slice(0, 40)} className="text-[1rem] leading-[1.75] text-white/70">
                    {p}
                  </p>
                ))
              ) : (
                <>
                  <p className="lede text-white/70">
                    {event.fullName} is part of Empiric Business Media&apos;s {sector?.name}{' '}
                    programme.{' '}
                    {event.theme
                      ? `The ${event.edition.toLowerCase()} runs under the theme “${event.theme}”.`
                      : `The ${event.edition.toLowerCase()} brings senior leaders together for a single focused day.`}
                  </p>
                  <p className="lede text-white/70">{sector?.blurb}</p>
                </>
              )}

              <h2 className="h2 text-white">Who attends</h2>
              {/* Sector names are not lower-cased here: "CISO & Cybersecurity"
                  would become "ciso & cybersecurity". */}
              {content?.audience ? (
                <>
                  <p className="text-[1rem] leading-[1.75] text-white/70">
                    {content.audience.heading}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {content.audience.roles.map((r) => (
                      <li
                        key={r}
                        className="rounded-full border border-white/15 px-3.5 py-1.5 text-[0.88rem] text-white/80"
                      >
                        {r}
                      </li>
                    ))}
                  </ul>
                  {content.audience.note && (
                    <p className="text-[0.95rem] leading-relaxed text-white/60">
                      {content.audience.note}
                    </p>
                  )}
                </>
              ) : (
                <p className="lede text-white/70">
                  Senior decision-makers from across the {sector?.name} ecosystem — heads of
                  function, their direct reports, and the solution partners they evaluate.
                </p>
              )}

              <h2 className="h2 text-white">Agenda</h2>
              <p className="lede text-white/70">
                {content?.focus
                  ? 'The themes below are published for this edition; the session-by-session running order follows once speakers are confirmed.'
                  : isUpcoming
                    ? 'The full session-by-session agenda for this edition is being finalised. Register your interest and we will send it as soon as speakers are confirmed.'
                    : 'A detailed agenda was not published online for this edition.'}
              </p>
              {/* TODO(client): supply the agenda (time slots, session titles, formats, speakers).
                  No agenda exists anywhere on the current estate — the word "agenda" appears
                  exactly once across all 131 crawled pages. */}
            </div>

            {content?.pillars && (
              /* Three ~90-word statements. Side by side they made a 640px wall
                 of text nobody reads. The edition's own site presents them as
                 tabs; we use native <details> instead of a tab widget so the
                 copy still ships in the static HTML, still opens with
                 JavaScript off, and matches the FAQ accordion used elsewhere
                 on the site. */
              <div className="section-body divide-y divide-white/10 border-y border-white/10">
                {content.pillars.map((p) => (
                  <details key={p.title} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[1.02rem] font-semibold text-white marker:hidden">
                      {p.title}
                      <span
                        aria-hidden
                        className="mt-0.5 shrink-0 text-gold transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-white/65">
                      {p.body}
                    </p>
                  </details>
                ))}
              </div>
            )}

            {/* Until the real agenda exists, describe the format honestly —
                these are the elements every EBM edition actually runs. */}
            <div className="section-body">
              <h2 className="h2 text-white">What the day includes</h2>
              <ul className="card-grid section-body grid gap-4 sm:grid-cols-2">
                {FORMAT.map(([t, d]) => (
                  <li key={t}>
                    <article className="card h-full">
                      <h3 className="text-[1rem] font-bold text-white">{t}</h3>
                      <p className="mt-2 text-[0.89rem] leading-relaxed text-white/65">{d}</p>
                    </article>
                  </li>
                ))}
              </ul>
            </div>

            {isUpcoming && (
              <div className="section-body flex flex-wrap gap-3">
                <Link
                  href={`/contact/?intent=register&event=${event.slug}`}
                  className="btn btn-gold"
                >
                  Register interest
                </Link>
                <Link
                  href={`/contact/?intent=speak&event=${event.slug}`}
                  className="btn btn-ghost"
                >
                  Apply to speak
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card">
              <h2 className="text-[1.1rem] font-bold text-white">Event details</h2>

              <dl className="mt-5 space-y-4 text-[0.93rem]">
                <div>
                  <dt className="text-[0.78rem] font-bold uppercase tracking-wider text-white/65">
                    Date
                  </dt>
                  <dd className="mt-1 font-medium text-white">
                    <time dateTime={event.date ?? undefined}>{event.dateLabel}</time>
                  </dd>
                </div>
                {event.timeLabel && (
                  <div>
                    <dt className="text-[0.78rem] font-bold uppercase tracking-wider text-white/65">
                      Time
                    </dt>
                    <dd className="mt-1 font-medium text-white">{event.timeLabel}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-[0.78rem] font-bold uppercase tracking-wider text-white/65">
                    Location
                  </dt>
                  <dd className="mt-1 font-medium text-white">
                    {event.venue ? (
                      <>
                        {event.venue}
                        <br />
                      </>
                    ) : null}
                    {event.city ? `${event.city}, India` : 'To be confirmed'}
                    {/* An edition that has already run cannot have a venue
                        "to be announced" — it had one, we just have no record
                        of it. Saying otherwise reads as an unfinished page,
                        which is exactly how a QA reviewer read it. */}
                    {!event.venue && (
                      <span className="mt-1 block text-[0.82rem] font-normal text-white/65">
                        {isUpcoming
                          ? 'Venue to be announced'
                          : 'Venue not recorded for this edition.'}
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.78rem] font-bold uppercase tracking-wider text-white/65">
                    Sector
                  </dt>
                  <dd className="mt-1 font-medium text-white">{sector?.name}</dd>
                </div>
                {event.speakerCount && (
                  <div>
                    <dt className="text-[0.78rem] font-bold uppercase tracking-wider text-white/65">
                      Speakers
                    </dt>
                    <dd className="mt-1 font-medium text-white">{event.speakerCount} on the roster</dd>
                  </div>
                )}
              </dl>

              {/* Pricing shows ONLY where this specific event published a price.
                  The ₹9,999 ladder exists on the CISO and Manufacturing pages;
                  HR Tech never published one, and inheriting it would have
                  invented a price for a live event. */}
              {isUpcoming && event.pricingPublished && (
                <>
                  <div className="mt-7 border-t border-white/10 pt-6">
                    <h3 className="text-[0.78rem] font-bold uppercase tracking-wider text-white/65">
                      Delegate passes
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {PRICING.tiers.map((t) => (
                        <li key={t.name} className="flex items-baseline justify-between gap-4">
                          <span className="text-[0.9rem] text-white/70">{t.name}</span>
                          <span className="font-bold text-gold">
                            ₹{t.amount.toLocaleString('en-IN')}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-[0.78rem] leading-relaxed text-white/65">
                      {PRICING.taxNote}
                      {!PRICING.deadlinesVerified && (
                        <>
                          {' '}
                          Early-bird cut-off dates for this edition to be confirmed.
                        </>
                      )}
                    </p>
                  </div>
                </>
              )}

              {/* No invented price: say passes are on request instead. */}
              {isUpcoming && !event.pricingPublished && (
                <div className="mt-7 border-t border-white/10 pt-6">
                  <h3 className="text-[0.78rem] font-bold uppercase tracking-wider text-white/65">
                    Delegate passes
                  </h3>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-white/70">
                    Pass rates for this edition are available on request.
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-col gap-2.5">
                {isUpcoming ? (
                  <Link
                    href={`/contact/?intent=register&event=${event.slug}`}
                    className="btn btn-gold w-full"
                  >
                    Register interest
                  </Link>
                ) : null}
                <Link href={`/sponsorship/?event=${event.slug}`} className="btn btn-ghost w-full">
                  Sponsor this series
                </Link>
                {event.externalUrl && (
                  <a
                    href={event.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-center text-[0.85rem] text-white/70 underline underline-offset-4 hover:text-gold"
                  >
                    View the current event microsite
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </div>

            <p className="mt-5 text-[0.85rem] leading-relaxed text-white/65">
              Questions about this edition?{' '}
              <a
                href={`mailto:${SITE.emails.general}`}
                className="text-gold underline underline-offset-4"
              >
                {SITE.emails.general}
              </a>
            </p>
          </aside>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Everything below is this edition's own published content. Each block */}
      {/* renders only if that edition has it, so no other page is affected.   */}
      {/* ---------------------------------------------------------------- */}

      {content?.focus && (
        <section className="section on-light">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">
                <span className="rule-gold" aria-hidden />
                {content.focus.lede}
              </p>
              <h2 className="h2 h2-wide">{content.focus.heading}</h2>
            </div>
            <ul className="card-grid section-body grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {content.focus.items.map((i) => (
                <li key={i.title}>
                  <article className="card flex h-full flex-col">
                    <h3 className="text-[1.02rem] font-bold text-ink">{i.title}</h3>
                    <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted">{i.body}</p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {content?.whyAttend && (
        <section className="section">
          <div className="wrap">
            <h2 className="h2 text-white">{content.whyAttend.heading}</h2>
            <ul className="card-grid section-body grid gap-5 sm:grid-cols-3">
              {content.whyAttend.items.map((i) => (
                <li key={i.title}>
                  <article className="card h-full">
                    <h3 className="text-[1.02rem] font-bold text-white">{i.title}</h3>
                    <p className="mt-2.5 text-[0.9rem] leading-relaxed text-white/65">{i.body}</p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {content?.speakers && (
        <section className="section border-t border-white/10 bg-navy-900">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">
                <span className="rule-gold" aria-hidden />
                {content.speakers.people.length} speakers
              </p>
              <h2 className="h2 text-white">{content.speakers.heading}</h2>
              {/* The live page heads this list "Our previous speakers" while its
                  sub-line says "joining our event". We publish the heading it
                  actually uses rather than upgrade the claim. */}
              <p className="lede text-white/60">{content.speakers.lede}</p>
            </div>
            <ul className="card-grid section-body grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.speakers.people.map((p) => (
                <li key={p.name + p.company}>
                  <article className="card h-full">
                    {/* No portraits: the estate publishes none for this edition,
                        and a placeholder face would be an invention. */}
                    <p
                      aria-hidden
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-[0.95rem] font-bold text-gold"
                    >
                      {p.name
                        .replace(/\(.*?\)/g, '')
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join('')}
                    </p>
                    <h3 className="mt-4 text-[1rem] font-bold leading-snug text-white">{p.name}</h3>
                    <p className="mt-1.5 text-[0.85rem] leading-snug text-gold">{p.title}</p>
                    <p className="mt-1 text-[0.85rem] leading-snug text-white/60">{p.company}</p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {content?.awards && (
        <section className="section on-light">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">
                <span className="rule-gold" aria-hidden />
                {content.awards.groups.reduce((n, g) => n + g.categories.length, 0)} categories
              </p>
              <h2 className="h2">{content.awards.name}</h2>
              {/* Winners are not rendered: every category on the live page reads
                  "Winner: TBA", so there is nothing to publish. */}
            </div>
            <div className="section-body grid gap-10 lg:grid-cols-2 lg:gap-14">
              {content.awards.groups.map((g) => (
                <div key={g.name}>
                  <h3 className="text-[1.05rem] font-bold text-ink">{g.name}</h3>
                  <ul className="mt-5 space-y-2.5">
                    {g.categories.map((c) => (
                      <li key={c} className="flex gap-3 text-[0.92rem] leading-relaxed text-muted">
                        <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-ink" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {content?.whySponsor && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">
                <span className="rule-gold" aria-hidden />
                Why sponsor us?
              </p>
              <h2 className="h2 text-white">Put your brand in front of this room.</h2>
            </div>
            <ul className="card-grid section-body grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {content.whySponsor.map((i) => (
                <li key={i.title}>
                  <article className="card h-full">
                    <h3 className="text-[1.02rem] font-bold text-white">{i.title}</h3>
                    <p className="mt-2.5 text-[0.9rem] leading-relaxed text-white/65">{i.body}</p>
                  </article>
                </li>
              ))}
            </ul>
            <div className="section-body flex flex-wrap gap-3">
              <Link href={`/sponsorship/?event=${event.slug}`} className="btn btn-gold">
                Sponsorship packages
              </Link>
            </div>
          </div>
        </section>
      )}

      {content?.contacts && (
        <section className="section border-t border-white/10 bg-navy-900">
          <div className="wrap">
            <h2 className="h2 text-white">Talk to the team running this edition</h2>
            <ul className="card-grid section-body grid gap-5 sm:grid-cols-2">
              {content.contacts.map((c) => (
                <li key={c.email}>
                  <article className="card h-full">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-gold">
                      {c.role}
                    </p>
                    <h3 className="mt-3 text-[1.15rem] font-bold text-white">{c.name}</h3>
                    <p className="mt-1 text-[0.9rem] text-white/60">{c.title}</p>
                    <a
                      href={`mailto:${c.email}`}
                      className="mt-4 block text-[0.95rem] font-semibold text-white wrap-anywhere hover:text-gold"
                    >
                      {c.email}
                    </a>
                    <ul className="mt-2 space-y-1">
                      {c.phones.map((p) => (
                        <li key={p}>
                          <a
                            href={`tel:${p.replace(/\s+/g, '')}`}
                            className="text-[0.95rem] font-semibold text-white hover:text-gold"
                          >
                            {p}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* The city tour. Renders only for an event whose `legs[]` names two or
          more cities, so every existing single-city edition is untouched. */}
      <CityTourRail event={event} />

      {related.length > 0 && (
        <section className="section border-t border-white/10 bg-navy-900">
          <div className="wrap">
            <h2 className="h2 text-white">{relatedLabel}</h2>
            <ul className="section-body grid gap-5 md:grid-cols-2 lg:grid-cols-3 card-grid">
              {related.map((e) => (
                <li key={e.slug}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
