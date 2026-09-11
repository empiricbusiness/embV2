import Link from 'next/link'
import { SITE, SECTORS } from '@/data/site'
import { pageMeta, faqLd, upcomingEvents } from '@/lib/seo'
import { sectorsInUse, sectorsActive, listSentence, sectorCountWord } from '@/lib/events'
import PageHero from '@/components/PageHero'
import PartnerWall from '@/components/PartnerWall'
import JsonLd from '@/components/JsonLd'

export const metadata = pageMeta({
  title: 'Sponsor a B2B Conference in India',
  description:
    'Sponsorship and exhibition packages at EBM conferences in India — speaking slots, roundtables, exhibition space and 1:1 meetings with CXOs.',
  path: '/sponsorship/',
  keywords: [
    'sponsor a B2B conference India',
    'event sponsorship packages India',
    'conference sponsorship opportunities India',
    'B2B lead generation events India',
    'demand generation events India',
    'exhibition opportunities B2B India',
    'reach CISOs CHROs India',
  ],
})

const SECTOR_LIST = listSentence(sectorsInUse().map((s) => s.name))
const ACTIVE_LIST = listSentence(sectorsActive().map((s) => s.name))
const SECTOR_COUNT = sectorCountWord()

const FAQS = [
  {
    q: 'What do EBM sponsorship packages include?',
    a: 'Packages are built around your objective and typically combine some of: a speaking slot or panel seat, a hosted roundtable, exhibition space, event and digital branding, delegate list access subject to consent, and a number of curated one-to-one meetings with delegates matched to your target profile.',
  },
  {
    q: 'How much does it cost to sponsor an EBM event?',
    a: 'Sponsorship is priced per edition and per package, because the audience, city and format differ across our franchises. Contact the team with your target audience and objective and we will send the current deck with pricing for the editions that fit.',
  },
  {
    q: 'Who attends EBM events?',
    a: `Senior decision-makers across ${SECTOR_COUNT} verticals — ${SECTOR_LIST} — with editions currently open in ${ACTIVE_LIST}. Delegate acquisition is invitation-led and vetted against an agreed seniority profile.`,
  },
  {
    q: 'Can we sponsor a whole series rather than one edition?',
    a: 'Yes. Series sponsorship across multiple editions of a franchise is available and is usually better value than sponsoring editions individually.',
  },
  {
    q: 'Do you offer lead generation without a physical event?',
    a: 'Yes — sponsored webinars and digital sessions deliver national reach with registration and attendance data handed over afterwards, subject to attendee consent.',
  },
]

/**
 * Transcribed verbatim from EBM's own sponsorship page on 7 Sep 2026 — tier
 * names, scope labels, inclusions, exclusions and the emphasised line in each
 * tier.
 *
 * The previous set (Presence / Authority / Pipeline) was written here and
 * appears nowhere in EBM's estate; the site audit flagged it for exactly
 * that reason. `included: false` renders a cross, not a tick — an exclusion is
 * as much a part of the offer as an inclusion, and dropping it would overstate
 * the lower tier.
 */
type PackageItem = { text: string; included?: boolean }
type Package = {
  name: string
  price: string
  scope: string
  featured?: boolean
  items: PackageItem[]
}

const PACKAGES: Package[] = [
  {
    name: 'Associate',
    price: 'On request',
    scope: 'Single edition',
    items: [
      { text: 'Logo on all event branding' },
      { text: '2 delegate passes' },
      { text: 'Shared exhibition space' },
      { text: 'Post-event delegate report' },
      { text: 'Speaking slot', included: false },
      { text: 'Pre-arranged meetings', included: false },
    ],
  },
  {
    name: 'Strategic',
    price: 'On request',
    scope: 'Single edition',
    featured: true,
    items: [
      { text: 'Premium logo placement' },
      { text: '6 delegate passes' },
      { text: 'Dedicated exhibition kiosk' },
      { text: 'Panel or keynote slot' },
      { text: '8 pre-arranged meetings' },
      { text: 'Full outcomes report' },
    ],
  },
  {
    name: 'Principal',
    price: 'On request',
    scope: 'Title partner',
    items: [
      { text: 'Title billing on the edition' },
      { text: '12 delegate passes' },
      { text: 'Prime exhibition position' },
      { text: 'Opening keynote' },
      { text: 'Private roundtable you host' },
      { text: 'Named-account confirmation' },
    ],
  },
]

export default function SponsorshipPage() {
  const upcoming = upcomingEvents()

  return (
    <>
      <JsonLd data={faqLd(FAQS)} />

      <PageHero
        eyebrow="For sponsors & exhibitors"
        title="Reach the people who never answer a cold email."
        lede="EBM convenes CISOs, CHROs, plant heads and BFSI technology leaders in rooms built around what they are trying to solve. Sponsorship puts you in that room with a reason to be there."
        trail={[{ name: 'Sponsorship', path: '/sponsorship/' }]}
      />

      {/* Why */}
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="h2 text-white">Why sponsor an EBM edition</h2>
            <p className="lede mt-5 text-white/70">
              Buying a logo slot is easy. Getting a genuine conversation with a senior buyer is not.
              Our editions are built for the second thing: invitation-led delegate acquisition
              against an agreed profile, an agenda researched with that audience, and formats —
              roundtables, one-to-ones — designed to produce conversation rather than footfall.
            </p>
            <p className="lede mt-4 text-white/70">
              Tell us the profile you are trying to reach. If we do not have an edition that fits, we
              will say so rather than sell you the wrong room.
            </p>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 card-grid">
            {[
              ['Senior by design', 'Delegate acquisition is invitation-led and vetted, not open registration.'],
              [
                `${SECTOR_COUNT.charAt(0).toUpperCase() + SECTOR_COUNT.slice(1)} deep verticals`,
                `${SECTOR_LIST} — built deep rather than wide.`,
              ],
              ['Conversation formats', 'Roundtables and one-to-ones, not just a stand in a corridor.'],
              ['Repeat franchises', 'Eight editions of Manufacturing 5.0 and three of the HR Tech summit to date.'],
            ].map(([t, d]) => (
              <li key={t}>
                <article className="card h-full">
                  <h3 className="text-[1.02rem] font-bold text-white">{t}</h3>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-white/60">{d}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Packages */}
      <section className="section on-light">
        <div className="wrap">
          {/* Centred: the three cards below are a symmetrical set, so a header
              pinned to the left edge sat off-axis from everything it introduces.
              mx-auto on the h2 as well because .h2 carries its own 22ch measure
              and would otherwise stay left inside the centred column. */}
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="h2 mx-auto">Partnership tiers</h2>
            <p className="lede mt-4">
              Indicative structures for a single edition. Multi-event and bespoke formats are quoted
              separately.
            </p>
          </div>

          <ul className="section-body grid gap-5 lg:grid-cols-3">
            {PACKAGES.map((p) => (
              <li key={p.name}>
                <article
                  className={`card card-tier flex h-full flex-col p-7 ${
                    p.featured ? 'bg-white' : ''
                  }`}
                >
                  {p.featured && (
                    <span className="mb-3 inline-flex w-fit rounded-full bg-gold-ink px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-white">
                      Most chosen
                    </span>
                  )}
                  <h3 className="text-[1.35rem] font-bold text-ink">{p.name}</h3>
                  <p className="mt-2 text-[1.6rem] font-extrabold leading-none text-ink">
                    {p.price}
                  </p>
                  <p className="mt-2 text-[0.85rem] font-medium text-muted">{p.scope}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {/* Every line carries the same weight and colour. Only the
                        mark separates an inclusion from an exclusion — dimming
                        the text as well read as three different type styles
                        across the three cards. */}
                    {p.items.map((i) => {
                      const included = i.included !== false
                      return (
                        <li
                          key={i.text}
                          className="flex gap-2.5 text-[0.92rem] leading-relaxed text-muted"
                        >
                          <span
                            aria-hidden
                            className={`mt-0.5 shrink-0 font-bold ${
                              included ? 'text-gold-ink' : 'text-muted'
                            }`}
                          >
                            {included ? '✓' : '✕'}
                          </span>
                          {/* Spoken, not drawn: a screen reader gets the word,
                              a sighted reader gets the mark. */}
                          <span className="sr-only">
                            {included ? 'Included: ' : 'Not included: '}
                          </span>
                          {i.text}
                        </li>
                      )
                    })}
                  </ul>
                  {/* Carry the package (and the edition, if the visitor
                      arrived from one) into the enquiry, so the form can say
                      what it is about instead of asking again. */}
                  <Link
                    href={`/contact/?intent=sponsor&package=${p.name.toLowerCase()}`}
                    className="btn btn-dark mt-7 w-full"
                  >
                    Enquire
                  </Link>
                </article>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-center text-[0.88rem] text-muted">
            Pricing is per edition and per package.{' '}
            <a
              href={`mailto:${SITE.emails.sponsorship}?subject=Sponsorship%20deck%20request`}
              className="font-semibold text-gold-ink underline underline-offset-4"
            >
              Request the current deck
            </a>{' '}
            for the editions that fit your audience.
          </p>
        </div>
      </section>

      {/* Which edition */}
      <section className="section">
        <div className="wrap">
          <h2 className="h2 text-white">Which edition fits your audience?</h2>
          <ul className="section-body grid gap-5 sm:grid-cols-2 lg:grid-cols-4 card-grid">
            {SECTORS.map((s) => (
              <li key={s.slug}>
                <article className="card h-full">
                  <h3 className="text-[1.05rem] font-bold text-gold">{s.name}</h3>
                  <p className="mt-2.5 text-[0.88rem] leading-relaxed text-white/60">{s.blurb}</p>
                  <Link
                    href={`/events/?sector=${s.slug}`}
                    className="mt-4 inline-flex text-[0.88rem] font-semibold text-white/80 hover:text-gold"
                  >
                    See editions <span aria-hidden className="ml-1.5">→</span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>

          {upcoming.length > 0 && (
            <div className="card-lg section-body rounded-2xl border border-gold/25 bg-white/[0.04] md:p-9">
              <h3 className="text-[1.1rem] font-bold text-white">Open for sponsorship now</h3>
              <ul className="mt-5 grid gap-4 md:grid-cols-3">
                {upcoming.map((e) => (
                  <li key={e.slug}>
                    <Link href={`/events/${e.slug}/`} className="block hover:text-gold">
                      <span className="text-[0.78rem] font-bold uppercase tracking-wider text-gold">
                        {e.edition}
                      </span>
                      <span className="mt-1 block font-semibold text-white">{e.name}</span>
                      <span className="mt-1 block text-[0.88rem] text-white/70">
                        {e.dateLabel} · {e.city}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Partners */}
      <section className="section border-t border-white/10 bg-navy-900">
        <div className="wrap">
          <h2 className="h2 text-white">Brands that have partnered with EBM</h2>
          <div className="section-body">
            <PartnerWall marquee={false} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="h2 text-white">Sponsor FAQ</h2>
            <p className="lede mt-4 text-white/65">
              Still deciding?{' '}
              <a
                href={`mailto:${SITE.emails.sponsorship}`}
                className="font-semibold text-gold underline underline-offset-4"
              >
                Email the team
              </a>{' '}
              or call{' '}
              <a
                href={SITE.phones[1].href}
                className="font-semibold text-gold underline underline-offset-4"
              >
                {SITE.phones[1].value}
              </a>
              .
            </p>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[1.02rem] font-semibold text-white marker:hidden">
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
