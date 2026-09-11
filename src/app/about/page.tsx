import Image from 'next/image'
import Link from 'next/link'
import { SITE, PROOF, SECTORS, EVENTS } from '@/data/site'
import { pageMeta } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import JsonLd from '@/components/JsonLd'
import assets from '@/data/assets.json'

export const metadata = pageMeta({
  title: 'About EBM — B2B Events Company in Mumbai',
  description:
    'EBM is a B2B events and media company founded in 2019 in Mumbai, producing industry conferences, summits, awards and roundtables across India.',
  path: '/about/',
  keywords: [
    'about Empiric Business Media',
    'B2B media company India',
    'event company Mumbai',
    'conference organisers Mumbai',
    'EBM India',
  ],
})

const VALUES = [
  {
    t: 'Research before agenda',
    d: 'We talk to the audience before we design the day. The agenda answers questions they actually have, not the ones easiest to fill.',
  },
  {
    t: 'Seniority over volume',
    d: 'Invitation-led, vetted delegate acquisition. A smaller room of the right people beats a full room of the wrong ones.',
  },
  {
    t: 'Formats that produce conversation',
    d: 'Roundtables, one-to-ones and hosted networking, not just a stage and a corridor of stands.',
  },
  {
    t: 'Franchises, not one-offs',
    d: 'We build series that return — eight editions of Manufacturing 5.0, three of the HR Tech summit — so the community compounds.',
  },
]

export default function AboutPage() {
  const years = 2026 - SITE.founded

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Empiric Business Media',
          url: `${SITE.url}/about/`,
          mainEntity: { '@id': `${SITE.url}/#organization` },
        }}
      />

      <PageHero
        eyebrow="About EBM"
        title="An events business built around the audience, not the venue."
        lede={SITE.pullQuote}
        trail={[{ name: 'About', path: '/about/' }]}
      />

      <section className="section">
        <div className="wrap grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="lede text-white/70">{SITE.boilerplate}</p>
            <p className="lede mt-4 text-white/70">
              Founded in {SITE.founded} and based in Mumbai, Empiric Business Media has spent{' '}
              {years} years building industry franchises rather than one-off events — returning to
              the same communities edition after edition, in cybersecurity, HR technology,
              manufacturing and BFSI.
            </p>
            <p className="lede mt-4 text-white/70">
              That is a deliberately narrow footprint. We would rather know our sectors properly
              than run a general-purpose events calendar across twenty.
            </p>

            <p className="mt-8 text-[1.05rem] font-semibold text-gold">{SITE.strapline}</p>
          </div>

          <Image
            src={assets.brand['about-1'].src}
            alt="Delegates at an Empiric Business Media industry conference"
            width={assets.brand['about-1'].w}
            height={assets.brand['about-1'].h}
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      {/* Mission / vision / goal */}
      <section className="section on-light">
        <div className="wrap">
          <h2 className="h2">What we are here to do</h2>
          <dl className="section-body grid gap-5 md:grid-cols-3">
            {[
              [
                'Our Mission',
                'To create high-value business experiences through well-researched content, industry expertise, and meaningful opportunities for collaboration.',
              ],
              [
                'Our Vision',
                'To become a trusted platform where businesses, leaders and innovators connect, learn, collaborate and shape the future of their industries.',
              ],
              [
                'Our Goal',
                'To deliver impactful conferences, bespoke programmes, webinars, summits and awards that create measurable value for businesses and their communities.',
              ],
            ].map(([t, d]) => (
              <div key={t} className="card">
                <dt className="text-[1.1rem] font-bold text-ink">{t}</dt>
                <dd className="mt-3 text-[0.93rem] leading-relaxed text-muted">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Proof */}
      <section className="section">
        <div className="wrap">
          <h2 className="h2 text-white">Where we have got to</h2>
          <ul className="section-body grid grid-cols-2 gap-8 md:grid-cols-4">
            {PROOF.map((p) => (
              <li key={p.label} className="reveal">
                <p className="text-[2.6rem] font-extrabold leading-none tracking-tight text-gold">
                  {p.value}
                </p>
                <p className="mt-2 font-semibold text-white">{p.label}</p>
                <p className="mt-1 text-[0.85rem] leading-snug text-white/70">{p.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-[0.85rem] leading-relaxed text-white/65">
            Every figure above is a count of published editions and partner brands on this site, so
            it can be checked. Larger cumulative delegate and speaker figures are held back pending
            client verification.
          </p>
        </div>
      </section>

      {/* How we work */}
      <section className="section border-t border-white/10 bg-navy-900">
        <div className="wrap">
          <h2 className="h2 text-white">How we work</h2>
          <ul className="section-body grid gap-5 sm:grid-cols-2 card-grid">
            {VALUES.map((v) => (
              <li key={v.t}>
                <article className="card h-full">
                  <h3 className="text-[1.1rem] font-bold text-white">{v.t}</h3>
                  <p className="mt-3 text-[0.93rem] leading-relaxed text-white/60">{v.d}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sectors */}
      <section className="section on-light">
        <div className="wrap">
          <h2 className="h2">The sectors we cover</h2>
          <ul className="section-body grid gap-5 sm:grid-cols-2 lg:grid-cols-4 card-grid">
            {SECTORS.map((s) => {
              const n = EVENTS.filter((e) => e.sector === s.slug).length
              return (
                <li key={s.slug}>
                  <article className="card flex h-full flex-col">
                    <h3 className="text-[1.05rem] font-bold text-ink">{s.name}</h3>
                    <p className="mt-2.5 flex-1 text-[0.89rem] leading-relaxed text-muted">
                      {s.blurb}
                    </p>
                    <p className="mt-4 text-[0.85rem] font-semibold text-gold-ink">
                      {n} {n === 1 ? 'edition' : 'editions'}
                    </p>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap max-w-3xl text-center">
          <h2 className="h2 text-white">Work with us</h2>
          <p className="lede mt-5 text-white/65">
            Whether you want to attend, speak, sponsor or commission an event of your own — start
            with a conversation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact/" className="btn btn-gold">
              Contact the team
            </Link>
            <Link href="/sponsorship/" className="btn btn-ghost">
              Sponsorship options
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
