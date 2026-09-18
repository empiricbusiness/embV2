import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SERVICES } from '@/data/site'
import { SERVICE_CONTENT } from '@/data/services-content'
import { pageMeta, faqLd } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import JsonLd from '@/components/JsonLd'

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = SERVICE_CONTENT[slug]
  if (!c) return {}
  return pageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
    path: `/services/${slug}/`,
    keywords: c.keywords,
  })
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = SERVICES.find((s) => s.slug === slug)
  const c = SERVICE_CONTENT[slug]
  if (!service || !c) notFound()

  const others = SERVICES.filter((s) => s.slug !== slug)

  return (
    <>
      <JsonLd data={faqLd(c.faqs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: c.metaDescription,
          serviceType: service.title,
          provider: { '@type': 'Organization', name: 'Empiric Business Media' },
          areaServed: { '@type': 'Country', name: 'India' },
          audience: { '@type': 'BusinessAudience', audienceType: c.audience },
        }}
      />

      <PageHero
        eyebrow={service.title}
        title={c.hero}
        trail={[
          { name: 'Services', path: '/services/' },
          { name: service.title, path: `/services/${slug}/` },
        ]}
      />

      {/* Intro */}
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            {c.intro.map((p) => (
              <p key={p} className="lede mt-5 text-white/70 first:mt-0">
                {p}
              </p>
            ))}
          </div>
          <aside className="card h-fit">
            <h2 className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-white/65">
              Who it&apos;s for
            </h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-white/75">{c.audience}</p>
            <Link href="/contact/" className="btn btn-gold mt-6 w-full">
              Start a conversation
            </Link>
          </aside>
        </div>
      </section>

      {/* What's included */}
      <section className="section on-light">
        <div className="wrap">
          <h2 className="h2">What&apos;s included</h2>
          <ul className="section-body grid gap-5 sm:grid-cols-2 lg:grid-cols-3 card-grid">
            {c.includes.map((i) => (
              <li key={i.title}>
                <article className="card flex h-full flex-col">
                  <h3 className="text-[1.05rem] font-bold text-ink">{i.title}</h3>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted">{i.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="wrap">
          <h2 className="h2 text-white">How it runs</h2>
          <ol className="section-body grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {c.process.map((p) => (
              <li key={p.step} className="reveal border-t-2 border-gold/40 pt-5">
                <span className="text-[0.8rem] font-extrabold tracking-wider text-gold">
                  {p.step}
                </span>
                <h3 className="mt-2 text-[1.02rem] font-bold text-white">{p.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-white/60">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="section border-t border-white/10 bg-navy-900">
        <div className="wrap grid gap-(--space-block) lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <h2 className="h2 text-white">Questions</h2>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {c.faqs.map((f) => (
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

      {/* Other services */}
      <section className="section">
        <div className="wrap">
          <h2 className="h2 text-white">Other formats</h2>
          <ul className="section-body flex flex-wrap gap-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}/`}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 text-[0.92rem] font-medium text-white/80 transition-colors hover:border-gold hover:text-gold"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
