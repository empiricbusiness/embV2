import Link from 'next/link'
import { POSTS } from '@/data/site'
import { pageMeta, itemListLd } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import JsonLd from '@/components/JsonLd'

export const metadata = pageMeta({
  title: 'Insights on B2B Event Strategy',
  description:
    'Practical notes on planning and running B2B events in India: audience definition, agenda design, sponsorship value and follow-through.',
  path: '/blog/',
  keywords: [
    'B2B event insights India',
    'corporate event planning guide India',
    'event marketing India',
    'B2B events blog',
  ],
})

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Notes from the floor."
        lede="What we have learned building industry franchises — written for the people who plan, sponsor and speak at events."
        trail={[{ name: 'Insights', path: '/blog/' }]}
      />

      <JsonLd
        data={itemListLd(
          'EBM insights',
          POSTS.map((p) => ({ name: p.title, path: `/blog/${p.slug}/` })),
        )}
      />

      <section className="section">
        <div className="wrap">
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 card-grid">
            {POSTS.map((p) => (
              <li key={p.slug}>
                <article className="card card-link relative flex h-full flex-col">
                  <div className="flex items-center gap-3 text-[0.8rem] font-semibold text-gold">
                    <time dateTime={p.date}>
                      {new Date(p.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                    <span aria-hidden className="text-white/20">|</span>
                    <span>{p.readingMinutes} min read</span>
                  </div>
                  <h2 className="mt-3 text-[1.2rem] font-bold leading-snug text-white">
                    <Link href={`/blog/${p.slug}/`} className="after:absolute after:inset-0">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-white/60">
                    {p.excerpt}
                  </p>
                  <p className="mt-6 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-gold">
                    Read article <span aria-hidden>&rarr;</span>
                  </p>
                </article>
              </li>
            ))}
          </ul>

          <p className="section-body max-w-2xl text-[0.9rem] leading-relaxed text-white/65">
            More articles are on the way. To be told when they publish, follow EBM on LinkedIn or{' '}
            <Link href="/contact/" className="text-gold underline underline-offset-4">
              get in touch
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
