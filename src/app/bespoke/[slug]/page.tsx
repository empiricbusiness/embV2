import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SITE } from '@/data/site'
import { BESPOKE_EVENTS, getBespokeEvent } from '@/data/bespoke-content'
import { breadcrumbLd, pageMeta } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import TrackedLink from '@/components/TrackedLink'
import { withUtm } from '@/lib/utm'
import BespokeRegistrationForm from '@/components/BespokeRegistrationForm'
import BespokeStickyCta from '@/components/BespokeStickyCta'

/**
 * A landing page for a client's event that EBM is helping to fill — the
 * structure specified on 23 Oct 2026 for News18, reusable for the next
 * bespoke event by adding a record to bespoke-content.ts.
 *
 * The client's identity leads; EBM appears only in the credit line the client
 * approved. The page is for sharing directly with prospects, so it is kept out
 * of search (noindex, and absent from the sitemap) at the client's request.
 */

export const dynamicParams = false

export function generateStaticParams() {
  return BESPOKE_EVENTS.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const e = getBespokeEvent(slug)
  if (!e) return {}
  return {
    ...pageMeta({
      title: e.meta.title,
      description: e.meta.description,
      path: `/bespoke/${slug}/`,
      image: e.meta.ogImage,
    }),
    // A showcase page shared by link, not a search landing page: the client
    // asked that it not compete with the main site in Google. Share previews
    // (Open Graph) stay, because the link is sent on WhatsApp and email.
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  }
}

const HERO_ID = 'event-overview'
const FORM_ID = 'register'
const PRIVACY_ID = 'privacy-notice'

export default async function BespokeEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const e = getBespokeEvent(slug)
  if (!e) notFound()

  const fullName = `${e.name} – ${e.edition}`
  const featuredSpeakers = e.speakers.filter((s) => s.featured)
  const otherSpeakers = e.speakers.filter((s) => !s.featured)
  const pageUrl = `${SITE.url}/bespoke/${slug}/`
  // Every link to the client's site carries UTM tags naming the button, so the
  // client's analytics credit EBM; our own GA event names the button too.
  const official = (position: 'hero' | 'venue' | 'programme', content: string) => ({
    href: withUtm(e.officialUrl, { ...e.outboundUtm, content }),
    event: 'bespoke_official_click',
    params: { bespoke_event: slug, link_position: position },
  })

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: fullName,
          description: e.meta.description,
          startDate: e.startDate,
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: e.venue.name,
            address: {
              '@type': 'PostalAddress',
              addressLocality: e.venue.city,
              addressRegion: e.venue.region,
              addressCountry: 'IN',
            },
          },
          organizer: { '@type': 'Organization', name: e.client.name, url: e.client.url },
          performer: e.speakers.map((s) => ({ '@type': 'Person', name: s.name, jobTitle: s.role })),
          image: [`${SITE.url}${e.meta.ogImage}`],
          url: pageUrl,
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: 'Bespoke Events', path: '/services/bespoke-events/' },
          { name: e.name, path: `/bespoke/${slug}/` },
        ])}
      />

      {/* ------------------------------------------------------------ Hero */}
      <section id={HERO_ID} className="relative overflow-hidden border-b border-white/10 bg-navy-900">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(70rem 30rem at 10% -15%, rgba(245,182,20,0.18), transparent 62%), radial-gradient(60rem 30rem at 92% 0%, rgba(25,104,188,0.55), transparent 62%), linear-gradient(180deg, #0b2d4d 0%, #071d33 100%)',
          }}
        />
        <div className="wrap relative grid gap-10 py-[clamp(3rem,2rem+4vw,5.5rem)] lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16">
          <div>
            <div className="logo-chip">
              <Image
                src={e.client.logo.src}
                width={e.client.logo.w}
                height={e.client.logo.h}
                alt={e.client.name}
                priority
                className="h-full w-auto object-contain"
              />
            </div>
            <p className="eyebrow mt-8">
              <span className="rule-gold" aria-hidden />
              {e.edition}
            </p>
            <h1 className="display mt-4 text-white">{e.name}</h1>
            <p className="mt-4 text-[clamp(1.15rem,1rem+0.7vw,1.6rem)] font-semibold leading-snug text-white/90">
              {e.theme}
            </p>
            <p className="lede mt-4 max-w-[58ch] text-white/70">
              Policymakers and business leaders from across Western India meet in {e.venue.city} to discuss
              where Indian enterprise goes next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`#${FORM_ID}`} className="btn btn-gold">
                Register now
              </a>
              <TrackedLink
                {...official('hero', 'hero_button')}
                target="_blank"
                rel="noopener"
                className="btn btn-ghost"
              >
                Official event site
                <span aria-hidden>↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </TrackedLink>
            </div>
          </div>

          <aside className="card card-lg" aria-labelledby="at-a-glance">
            <h2 id="at-a-glance" className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white/60">
              At a glance
            </h2>
            <dl className="mt-5 grid gap-5">
              <Fact label="Date" value={e.dateLabel} />
              <Fact label="Time" value={e.timeLabel} />
              <Fact
                label="Venue"
                value={`${e.venue.name}, ${e.venue.city}`}
                extra={
                  <a
                    href={e.venue.mapsUrl}
                    target="_blank"
                    rel="noopener"
                    className="mt-1.5 inline-block text-[0.88rem] font-semibold text-gold underline underline-offset-2"
                  >
                    Get directions<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                }
              />
            </dl>
            {e.entryNote && <p className="mt-6 border-t border-white/10 pt-5 text-[0.9rem] text-white/70">{e.entryNote}</p>}
          </aside>
        </div>
      </section>

      {/* ----------------------------------------------------------- About */}
      <section className="section on-light" aria-labelledby="about-h">
        <div className="wrap grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow">About the summit</p>
            <h2 id="about-h" className="h2 mt-4">
              {e.theme}
            </h2>
            <div className="mt-6 grid gap-4">
              {e.about.map((p) => (
                <p key={p} className="lede">
                  {p}
                </p>
              ))}
            </div>
          </div>
          <aside className="card h-fit" aria-labelledby="themes-h">
            <h3 id="themes-h" className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-muted">
              Discussion themes
            </h3>
            <ul className="mt-4 grid gap-3">
              {e.themes.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[0.98rem] font-semibold text-ink">
                  <span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-ink" />
                  {t}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* ------------------------------------------------------ Why attend */}
      <section className="section" aria-labelledby="why-h">
        <div className="wrap">
          <p className="eyebrow">Why attend</p>
          <h2 id="why-h" className="h2 h2-wide mt-4 text-white">
            A day with the people shaping the West’s growth
          </h2>
          <ul className="section-body card-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {e.whyAttend.map((w) => (
              <li key={w.title}>
                <article className="card h-full">
                  <h3 className="text-[1.05rem] font-bold leading-snug text-white">{w.title}</h3>
                  <p className="mt-2.5 text-[0.92rem] leading-relaxed text-white/70">{w.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------------- Speakers */}
      <section className="section on-light" aria-labelledby="speakers-h">
        <div className="wrap">
          <p className="eyebrow">Event highlights</p>
          <h2 id="speakers-h" className="h2 mt-4">
            Speakers
          </h2>
          <p className="lede mt-4 max-w-[60ch]">As announced by {e.client.name} for the {e.edition}.</p>
          {featuredSpeakers.length > 0 && (
            <ul className="section-body grid gap-5 sm:grid-cols-3">
              {featuredSpeakers.map((s) => (
                <li key={s.name} className="card flex items-center gap-5 sm:flex-col sm:gap-0 sm:text-center">
                  <Image
                    src={s.photo}
                    width={300}
                    height={300}
                    alt={s.name}
                    className="aspect-square w-24 shrink-0 rounded-xl bg-white object-cover sm:w-full sm:max-w-[260px]"
                  />
                  <div className="min-w-0 sm:mt-5">
                    <p className="text-[1.08rem] font-bold leading-snug text-ink sm:text-[1.25rem]">{s.name}</p>
                    <p className="mt-1 text-[0.9rem] leading-snug text-muted">{s.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {/* Every speaker sits on a card, with the same gap all round. Five
              columns on desktop give the cards room and set 15 speakers in
              three full rows. */}
          <ul
            className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 ${
              featuredSpeakers.length > 0 ? 'mt-4 sm:mt-5' : 'section-body'
            }`}
          >
            {otherSpeakers.map((s) => (
              <li key={s.name} className="card flex flex-col p-3.5 sm:p-4">
                <Image
                  src={s.photo}
                  width={300}
                  height={300}
                  alt={s.name}
                  loading="lazy"
                  className="aspect-square w-full rounded-lg bg-white object-cover"
                />
                <p className="mt-3 text-[0.98rem] font-bold leading-snug text-ink">{s.name}</p>
                <p className="mt-1 text-[0.84rem] leading-snug text-muted">{s.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------------- Partners */}
      <section className="section" aria-labelledby="partners-h">
        <div className="wrap">
          <p className="eyebrow">Event partners</p>
          <h2 id="partners-h" className="h2 mt-4 text-white">
            Partners
          </h2>
          <dl className="section-body grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-5">
            {e.partners.map((p) => (
              <div key={p.tier} className="border-t border-white/15 pt-4">
                <dt className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-gold">{p.tier}</dt>
                <dd className="mt-2.5 text-[1rem] font-semibold leading-relaxed text-white">{p.names.join(', ')}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-[var(--space-block)] flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={`#${FORM_ID}`} className="btn btn-gold">
              Register now
            </a>
            <p className="text-[0.9rem] text-white/65">
              {e.dateLabel} · {e.venue.name}, {e.venue.city}
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------- Schedule and venue */}
      <section className="section on-light" aria-labelledby="venue-h">
        <div className="wrap">
          <p className="eyebrow">Schedule &amp; venue</p>
          <h2 id="venue-h" className="h2 mt-4">
            When and where
          </h2>
          <ul className="section-body card-grid grid gap-5 sm:grid-cols-3">
            <li>
              <article className="card h-full">
                <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-muted">Date</h3>
                <p className="mt-2 text-[1.1rem] font-bold text-ink">{e.dateLabel}</p>
              </article>
            </li>
            <li>
              <article className="card h-full">
                <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-muted">Time</h3>
                <p className="mt-2 text-[1.1rem] font-bold text-ink">{e.timeLabel}</p>
              </article>
            </li>
            <li>
              <article className="card h-full">
                <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-muted">Venue</h3>
                <p className="mt-2 text-[1.1rem] font-bold text-ink">
                  {e.venue.name}, {e.venue.city}
                </p>
                <a
                  href={e.venue.mapsUrl}
                  target="_blank"
                  rel="noopener"
                  className="mt-1.5 inline-block text-[0.88rem] font-semibold text-ink underline underline-offset-2"
                >
                  Get directions<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </article>
            </li>
          </ul>
          <p className="mt-6 text-[0.95rem] text-muted">
            {e.entryNote} The detailed programme is published on the{' '}
            <TrackedLink
              {...official('venue', 'venue_link')}
              target="_blank"
              rel="noopener"
              className="font-semibold text-ink underline underline-offset-2"
            >
              official event site
              <span className="sr-only"> (opens in a new tab)</span>
            </TrackedLink>
            .
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------- Registration */}
      <section id={FORM_ID} className="section scroll-mt-24" aria-labelledby="register-h">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.45fr] lg:gap-16">
          {/* Stays beside the form while it scrolls, instead of leaving an
              empty column under a short intro. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Delegate registration</p>
            <h2 id="register-h" className="h2 mt-4 text-white">
              Register for the summit
            </h2>
            <p className="lede mt-5 text-white/75">
              Share your details to register as a delegate for the {e.edition} on {e.dateLabel.replace(/^\w+, /, '')}{' '}
              at {e.venue.name}, {e.venue.city}.
            </p>
            {e.entryNote && <p className="mt-4 text-[0.95rem] text-white/65">{e.entryNote}</p>}
            <p className="mt-8 text-[0.9rem] text-white/65">
              Questions about the event? Call {e.contact.name} on{' '}
              <a href={e.contact.tel} className="font-semibold text-white underline underline-offset-2">
                {e.contact.phone}
              </a>
              .
            </p>
          </div>

          <div>
            <BespokeRegistrationForm
              slug={slug}
              eventName={fullName}
              endpoint={e.registration.endpoint}
              targetSheet={e.registration.targetSheet}
              contact={e.contact}
              privacyNoticeId={PRIVACY_ID}
            />
            <p className="mt-5 text-[0.88rem] text-white/65">
              <span className="font-semibold text-gold">{e.credit}:</span>{' '}
              <Link href="/services/bespoke-events/" className="font-semibold text-white underline underline-offset-2">
                Empiric Business Media
              </Link>
            </p>

            <div id={PRIVACY_ID} className="mt-8 scroll-mt-24 rounded-[14px] border border-white/10 p-5 sm:p-6">
              <h3 className="text-[0.95rem] font-bold text-white">Privacy notice for this registration</h3>
              <div className="mt-3 grid gap-2.5 text-[0.86rem] leading-relaxed text-white/70">
                <p>
                  The details you give here — your name, company, designation, city, country, email address and
                  phone number — are collected by Empiric Business Media, which handles delegate outreach and
                  registration for this event.
                </p>
                <p>
                  They are used only to process your registration and to contact you about {fullName}, for
                  example to confirm your place or share event updates. They are not used for any unrelated
                  purpose.
                </p>
                <p>
                  To correct or remove your details, write to{' '}
                  <a href={`mailto:${SITE.emails.general}`} className="text-white underline underline-offset-2">
                    {SITE.emails.general}
                  </a>
                  . See also our{' '}
                  <Link href="/privacy-policy/" className="text-white underline underline-offset-2">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- Official reference */}
      <section className="section-tight on-light" aria-labelledby="official-h">
        <div className="wrap flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="official-h" className="text-[clamp(1.3rem,1.1rem+0.8vw,1.75rem)] font-bold text-ink">
              Programme and updates
            </h2>
            <p className="mt-2 max-w-[60ch] text-[0.98rem] text-muted">
              The official {e.name} website carries the full programme and the latest announcements.
            </p>
          </div>
          <TrackedLink
            {...official('programme', 'programme_button')}
            target="_blank"
            rel="noopener"
            className="btn btn-dark shrink-0"
          >
            Visit the official site
            <span aria-hidden>↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </TrackedLink>
        </div>
      </section>

      {/* ------------------------------------- Acknowledgement and contact */}
      <section className="border-b border-white/10 py-8" aria-label="Event acknowledgement and contact">
        <div className="wrap flex flex-col gap-3 text-[0.88rem] text-white/65 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8">
          <p>
            <span className="font-semibold text-gold">{e.credit}:</span>{' '}
            <Link href="/services/bespoke-events/" className="font-semibold text-white underline underline-offset-2">
              Empiric Business Media
            </Link>
          </p>
          <p>
            Event enquiries: {e.contact.name},{' '}
            <a href={e.contact.tel} className="font-semibold text-white underline underline-offset-2">
              {e.contact.phone}
            </a>
          </p>
          <p>
            <a href={`#${PRIVACY_ID}`} className="text-white underline underline-offset-2">
              Privacy notice
            </a>
          </p>
        </div>
      </section>

      <BespokeStickyCta heroId={HERO_ID} formId={FORM_ID} label={`${e.dateLabel.replace(/^\w+, /, '')} · ${e.venue.city}`} />
    </>
  )
}

function Fact({ label, value, extra }: { label: string; value: string; extra?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white/60">{label}</dt>
      <dd className="mt-1 text-[1.08rem] font-semibold leading-snug text-white">
        {value}
        {extra && <div>{extra}</div>}
      </dd>
    </div>
  )
}
