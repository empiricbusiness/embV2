import Image from 'next/image'
import Link from 'next/link'
import { SITE, SERVICES, SECTORS, PROOF, POSTS } from '@/data/site'
import { pageMeta, upcomingEvents, pastEvents, eventLd, itemListLd, faqLd } from '@/lib/seo'
import { sectorsInUse, sectorsActive, listSentence, sectorCountWord } from '@/lib/events'
import EventCard from '@/components/EventCard'
import PartnerWall from '@/components/PartnerWall'
import Countdown from '@/components/Countdown'
import JsonLd from '@/components/JsonLd'
import assets from '@/data/assets.json'

export const metadata = pageMeta({
  title: 'B2B Conferences, Summits & Awards in India',
  description:
    'EBM produces B2B conferences, summits and awards in India for CISOs, CHROs and manufacturing leaders. Sponsor, speak or attend an upcoming edition.',
  path: '/',
  keywords: [
    'B2B events company India',
    'B2B conference organisers India',
    'summit organisers India',
    'corporate conference organisers Mumbai',
    'B2B media company India',
    'CISO summit India',
    'HR tech conference India',
    'manufacturing summit India',
  ],
})

// Sector vocabulary is DERIVED, never typed. These strings are also the
// homepage FAQ structured data, so a hard-coded count here does not just
// mislead a reader — it ships a contradiction to Google. It did exactly that:
// the schema claimed four verticals while the page showed seven.
const SECTOR_LIST = listSentence(sectorsInUse().map((s) => s.name))
const ACTIVE_LIST = listSentence(sectorsActive().map((s) => s.name))
const SECTOR_COUNT = sectorCountWord()

const FAQS = [
  {
    q: 'What does Empiric Business Media do?',
    a: `EBM is a B2B events and business media company based in Mumbai. We produce industry conferences, summits, awards, executive roundtables, bespoke events and webinars for enterprise decision-makers across ${SECTOR_LIST}.`,
  },
  {
    q: 'Which industries does EBM run events for?',
    a: `${SECTOR_COUNT.charAt(0).toUpperCase() + SECTOR_COUNT.slice(1)} verticals across the archive: ${SECTOR_LIST}. Editions are currently open in ${ACTIVE_LIST}; the rest have delivered editions with none scheduled at present. Our flagship franchises are the Enterprise AI Security & Cyber Resilience Summit, the Next-Gen HR Tech Summit & Awards, and Manufacturing 5.0 — Metamorphosis of Business.`,
  },
  {
    q: 'How can my company sponsor an EBM event?',
    a: 'Sponsorship and exhibition packages are available for every edition, including speaking slots, branded roundtables, exhibition space and curated one-to-one meetings with delegates. Contact our team to receive the current sponsorship deck.',
  },
  {
    q: 'Where are EBM events held?',
    a: 'We have hosted editions in Mumbai, Pune, Chennai, New Delhi and Bengaluru, typically at five-star business hotels such as ITC Grand Chola, Sheraton Grand Pune, Hyatt Regency Chennai and Pride Plaza Aerocity.',
  },
]

export default function HomePage() {
  const upcoming = upcomingEvents()
  const past = pastEvents()
  const hero = upcoming[0]
  const heroImg = assets.hero.find((h) => h.name === 'hero-conference')!
  const heroSrcSet = 'srcset' in heroImg ? heroImg.srcset : undefined

  // Deliberately NO react-dom preload() for the hero. Measured: Lighthouse's
  // discovery check already found the <img fetchpriority="high"> in the
  // initial HTML at ~22ms, so the preload gained nothing here — and Next
  // carried the hint in the route's prefetch payload, which made every page
  // with a link to "/" download this 49KB image it never displays.

  return (
    <>
      {upcoming.map((e) => (
        <JsonLd key={e.slug} data={eventLd(e)} />
      ))}
      <JsonLd data={faqLd(FAQS)} />
      <JsonLd
        data={itemListLd(
          'Upcoming EBM events',
          upcoming.map((e) => ({ name: e.fullName, path: `/events/${e.slug}/` })),
        )}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Hero — a real EBM conference floor, not a stock tech graphic      */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-navy-950">
        {/* A plain <img> with a real srcset, not next/image: with `unoptimized`
            (required for static export) next/image emits no srcset, so every
            phone was downloading the 1920px file. This is the LCP element, so
            the 960px variant on mobile is the difference between a 3.4s and a
            sub-2s LCP on throttled 4G. */}
        {/* Art direction: below 768px the photo is a faint texture under the
            vertical wash, yet as the largest element it was the LCP and held
            home-mobile at 96 while text-LCP pages scored 100. Phones now get a
            ~50-byte 1x1 (the photo's average colour), so the headline is the
            LCP there; tablets and desktops get the real image via srcset.
            <picture> is display:contents so it adds no box of its own. */}
        <picture className="contents">
          <source media="(max-width: 767px)" srcSet="/images/hero/hero-conference-1.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImg.src}
            srcSet={heroSrcSet}
            sizes="100vw"
            alt=""
            width={heroImg.w}
            height={heroImg.h}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 z-0 h-full w-full object-cover object-center opacity-55"
          />
        </picture>
        {/* The wash runs left-to-right on wide screens, where the copy sits in
            the left column. On narrow screens the copy spans the full width, so
            a horizontal wash would black out the whole photo — it runs
            top-to-bottom there instead and keeps the room visible. */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 bg-gradient-to-b from-navy-950/95 via-navy-950/85 to-navy-950/70 md:hidden"
        />
        <div
          aria-hidden
          className="absolute inset-0 z-0 hidden bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/45 md:block"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-b from-transparent to-navy-950"
        />
        {/* Gold bloom top-right and a brand-blue bloom bottom-left. Radial
            gradients rather than blur filters: same look, zero paint cost. */}
        <div
          aria-hidden
          className="absolute -right-40 -top-40 z-0 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(245,182,20,0.28),transparent)]"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-24 z-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(25,104,188,0.45),transparent)]"
        />

        <div className="wrap section relative z-10">
          <div className="section-head max-w-3xl">
            <p className="eyebrow">
              <span className="rule-gold" aria-hidden />
              {SITE.pullQuote}
            </p>
            <h1 className="display text-white">
              B2B conferences, summits and awards that put you in the room with{' '}
              <span className="text-gold">decision-makers</span>.
            </h1>
            <p className="lede max-w-2xl text-white/75">
              Empiric Business Media produces industry-led events across cybersecurity, HR
              technology, manufacturing and BFSI — built on researched agendas, senior audiences and
              conversations that turn into business.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/events/" className="btn btn-gold">
                Explore upcoming events
              </Link>
              <Link href="/sponsorship/" className="btn btn-ghost">
                Sponsor an event
              </Link>
            </div>
          </div>

          {/* Next event panel */}
          {hero && (
            <div className="section-body max-w-2xl rounded-2xl border border-white/15 bg-navy-950/70 p-6 backdrop-blur-sm md:p-7">
              <p className="eyebrow">Next event</p>
              <h2 className="mt-3 text-[1.35rem] font-bold leading-snug text-white md:text-[1.55rem]">
                <Link href={`/events/${hero.slug}/`} className="hover:text-gold">
                  {hero.edition} {hero.name}
                </Link>
              </h2>
              {hero.theme && <p className="mt-2.5 text-[0.95rem] text-white/65">{hero.theme}</p>}
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.95rem] font-medium text-white/85">
                <time dateTime={hero.date ?? undefined}>{hero.dateLabel}</time>
                <span aria-hidden className="text-white/25">
                  |
                </span>
                <span>{hero.city}, India</span>
              </p>

              {hero.date && (
                <div className="mt-6">
                  <Countdown iso={hero.date} label="Registration closes when seats fill" />
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/events/${hero.slug}/`} className="btn btn-gold">
                  Event details
                </Link>
                <Link href="/contact/?intent=register" className="btn btn-ghost">
                  Register interest
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Proof strip — verifiable counts only                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="section-tight border-y border-white/10 bg-navy-900">
        <div className="wrap">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {PROOF.map((p) => (
              <li key={p.label} className="reveal flex flex-col">
                <p className="text-[2.5rem] font-extrabold leading-none tracking-tight text-gold">
                  {p.value}
                </p>
                <p className="mt-2.5 text-[0.95rem] font-semibold text-white">{p.label}</p>
                <p className="mt-1 text-[0.82rem] leading-snug text-white/70">{p.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="section-body border-t border-white/10 pt-10">
          <p className="wrap mb-7 text-center text-balance text-[0.76rem] font-bold uppercase tracking-[0.18em] text-white/65">
            Brands that have partnered with EBM
          </p>
          <PartnerWall limit={18} />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* About                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="section on-light">
        {/* items-stretch (the default) rather than items-center: with a tall
            portrait photo, centring the text column left a large empty band
            above the eyebrow that read as a spacing bug. The image now fills
            exactly the text column's height instead. */}
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <div className="section-head">
              <p className="eyebrow">
                <span className="rule-gold" aria-hidden />
                About EBM
              </p>
              <h2 className="h2">An events business built around the audience, not the venue.</h2>
              <p className="lede">{SITE.boilerplate}</p>
              <p className="lede">
                Every EBM edition starts with research: who needs to be in the room, what they are
                actually trying to solve this year, and which conversations are worth their day out
                of office. That is why our delegates are senior and why our sponsors come back.
              </p>
            </div>

            <dl className="section-body grid gap-7 sm:grid-cols-3">
              {[
                ['Our Mission', 'High-value business experiences built on well-researched content and industry expertise.'],
                ['Our Vision', 'A trusted platform where leaders connect, learn and shape their industries.'],
                ['Our Goal', 'Conferences, bespoke programmes, webinars and awards that create measurable value.'],
              ].map(([t, d]) => (
                <div key={t}>
                  <dt className="text-[0.95rem] font-bold text-ink">{t}</dt>
                  <dd className="mt-2 text-[0.88rem] leading-relaxed text-muted">{d}</dd>
                </div>
              ))}
            </dl>

            <Link href="/about/" className="btn btn-dark section-body">
              More about EBM
            </Link>
          </div>

          <div className="reveal relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-[28rem]">
            <Image
              src={assets.brand['about-1'].src}
              alt="Delegates seated at an Empiric Business Media conference in a hotel ballroom"
              fill
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Services                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">
              <span className="rule-gold" aria-hidden />
              What we do
            </p>
            <h2 className="h2 text-white">Connect. Engage. Grow.</h2>
            <p className="lede text-white/65">
              Six formats, one purpose — putting the right people in front of each other.
            </p>
          </div>

          <ul className="section-body grid gap-5 sm:grid-cols-2 lg:grid-cols-3 card-grid">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <article className="card card-link relative flex h-full flex-col">
                  <h3 className="text-[1.15rem] font-bold text-white">
                    <Link href={`/services/${s.slug}/`} className="after:absolute after:inset-0">
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-[0.93rem] leading-relaxed text-white/60">
                    {s.blurb}
                  </p>
                  <p className="mt-6 inline-flex items-center gap-2 text-[0.88rem] font-semibold text-gold">
                    Explore <span aria-hidden>→</span>
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Upcoming events                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="section border-t border-white/10 bg-navy-900">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
            <div className="section-head">
              <p className="eyebrow">
                <span className="rule-gold" aria-hidden />
                Upcoming events
              </p>
              <h2 className="h2 text-white">Be part of our next industry event</h2>
              <p className="lede text-white/65">
                {upcoming.length} confirmed {upcoming.length === 1 ? 'edition' : 'editions'} across
                cybersecurity, HR technology and manufacturing.
              </p>
            </div>
            <Link href="/events/" className="btn btn-ghost">
              All events
            </Link>
          </div>

          <ul className="section-body grid gap-5 md:grid-cols-2 lg:grid-cols-3 card-grid">
            {upcoming.map((e) => (
              <li key={e.slug}>
                <EventCard event={e} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Sectors                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="section on-light">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">
              <span className="rule-gold" aria-hidden />
              Sectors we serve
            </p>
            <h2 className="h2">{SECTOR_COUNT.charAt(0).toUpperCase() + SECTOR_COUNT.slice(1)} verticals, built deep rather than wide.</h2>
          </div>

          <ul className="section-body grid gap-5 sm:grid-cols-2 lg:grid-cols-4 card-grid">
            {SECTORS.map((s) => (
              <li key={s.slug}>
                <article className="card flex h-full flex-col">
                  <h3 className="text-[1.1rem] font-bold text-ink">{s.name}</h3>
                  <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-muted">{s.blurb}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Sponsorship CTA — the highest commercial-intent path              */}
      {/* ---------------------------------------------------------------- */}
      <section className="section">
        <div className="wrap">
          {/* Gradient stays ≤ navy-800 under the copy (gold eyebrow ≥ 5.2:1,
              white ≥ 9.5:1); the gold bloom sits top-right, away from text. */}
          <div className="card-lg relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-navy-850 via-navy-800 to-navy-900">
            <div
              aria-hidden
              className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(245,182,20,0.28),transparent)]"
            />
            <div className="section-head relative">
              <p className="eyebrow">
                <span className="rule-gold" aria-hidden />
                For sponsors &amp; exhibitors
              </p>
              <h2 className="h2 text-white">
                Reach the CISOs, CHROs and plant heads you cannot cold-email.
              </h2>
              <p className="lede text-white/70">
                Speaking slots, branded roundtables, exhibition space and curated one-to-one meetings
                with pre-qualified delegates. Tell us who you need to reach and we will show you
                which edition fits.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/sponsorship/" className="btn btn-gold">
                  Sponsorship options
                </Link>
                <a href={`mailto:${SITE.emails.sponsorship}`} className="btn btn-ghost">
                  Request the deck
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Past editions                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="section border-t border-white/10 bg-navy-900">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
            <div className="section-head">
              <p className="eyebrow">
                <span className="rule-gold" aria-hidden />
                Track record
              </p>
              <h2 className="h2 text-white">Recent editions</h2>
            </div>
            <Link href="/gallery/" className="btn btn-ghost">
              View gallery
            </Link>
          </div>

          <ul className="section-body grid gap-5 md:grid-cols-2 lg:grid-cols-3 card-grid">
            {past.slice(0, 3).map((e) => (
              <li key={e.slug}>
                <EventCard event={e} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Insights                                                         */}
      {/* ---------------------------------------------------------------- */}
      {POSTS.length > 0 && (
        <section className="section on-light">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">
                <span className="rule-gold" aria-hidden />
                Insights
              </p>
              <h2 className="h2">Notes from the floor</h2>
            </div>
            <ul className="section-body grid gap-5 md:grid-cols-2 lg:grid-cols-3 card-grid">
              {POSTS.map((p) => (
                <li key={p.slug}>
                  <article className="card card-link relative flex h-full flex-col">
                    <time dateTime={p.date} className="text-[0.8rem] font-semibold text-gold-ink">
                      {new Date(p.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                    <h3 className="mt-3 text-[1.1rem] font-bold leading-snug text-ink">
                      <Link href={`/blog/${p.slug}/`} className="after:absolute after:inset-0">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-muted">
                      {p.excerpt}
                    </p>
                    <p className="mt-6 text-[0.88rem] font-semibold text-gold-ink">
                      Read article <span aria-hidden>→</span>
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* FAQ                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="section-head">
            <p className="eyebrow">
              <span className="rule-gold" aria-hidden />
              FAQ
            </p>
            <h2 className="h2 text-white">Common questions</h2>
            <p className="lede text-white/65">
              Something not covered here?{' '}
              <Link href="/contact/" className="font-semibold text-gold underline underline-offset-4">
                Talk to the team
              </Link>
              .
            </p>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="-my-5 flex cursor-pointer list-none items-start justify-between gap-4 text-[1.02rem] font-semibold text-white marker:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 text-gold transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-white/65">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
