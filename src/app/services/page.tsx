import Link from 'next/link'
import { SERVICES } from '@/data/site'
import { SERVICE_CONTENT } from '@/data/services-content'
import { pageMeta, itemListLd } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import JsonLd from '@/components/JsonLd'

export const metadata = pageMeta({
  title: 'B2B Event Services in India',
  description:
    'Six formats for reaching enterprise decision-makers in India: conferences, bespoke events, roundtables, webinars, 1:1 meetings and branding.',
  path: '/services/',
  keywords: [
    'B2B event services India',
    'conference organisers India',
    'bespoke events India',
    'executive roundtables India',
    'B2B webinar services India',
  ],
})

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Six formats. One purpose."
        lede="Putting the right people in front of each other — at whatever scale the objective calls for, from a table of twelve to a full summit."
        trail={[{ name: 'Services', path: '/services/' }]}
      />

      <JsonLd
        data={itemListLd(
          'EBM services',
          SERVICES.map((s) => ({ name: s.title, path: `/services/${s.slug}/` })),
        )}
      />

      <section className="section">
        <div className="wrap">
          <ul className="grid gap-5 md:grid-cols-2 card-grid">
            {SERVICES.map((s) => {
              const c = SERVICE_CONTENT[s.slug]
              return (
                <li key={s.slug}>
                  <article className="card card-link relative flex h-full flex-col">
                    <h2 className="text-[1.3rem] font-bold text-white">
                      <Link href={`/services/${s.slug}/`} className="after:absolute after:inset-0">
                        {s.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-[1rem] font-medium leading-snug text-gold">{c.hero}</p>
                    <p className="mt-4 flex-1 text-[0.93rem] leading-relaxed text-white/60">
                      {s.blurb}
                    </p>
                    <p className="mt-6 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-gold">
                      Explore {s.short} <span aria-hidden>→</span>
                    </p>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="section on-light">
        <div className="wrap max-w-3xl text-center">
          <h2 className="h2">Not sure which format fits?</h2>
          <p className="lede mt-5">
            Tell us who you need to reach and what you need to happen. We will tell you honestly
            whether that is a summit, a roundtable, a webinar or none of the above.
          </p>
          <Link href="/contact/" className="btn btn-dark mt-8">
            Talk to the team
          </Link>
        </div>
      </section>
    </>
  )
}
