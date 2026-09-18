import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POSTS, SITE } from '@/data/site'
import { POST_BODIES } from '@/data/posts-content'
import { pageMeta } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import JsonLd from '@/components/JsonLd'

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) return {}
  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}/`,
    keywords: [post.keyword, 'corporate event planning India', 'B2B events India'],
    type: 'article',
  })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS.find((p) => p.slug === slug)
  const body = POST_BODIES[slug]
  if (!post || !body) notFound()

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          dateModified: post.date,
          author: { '@type': 'Organization', name: SITE.name, url: `${SITE.url}/` },
          publisher: { '@id': `${SITE.url}/#organization` },
          mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/blog/${post.slug}/` },
          keywords: body.tags.join(', '),
        }}
      />

      <PageHero
        eyebrow="Insights"
        title={post.title}
        trail={[
          { name: 'Insights', path: '/blog/' },
          { name: post.title, path: `/blog/${post.slug}/` },
        ]}
      />

      <article className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_260px] lg:gap-16">
          <div className="max-w-[68ch]">
            <div className="flex flex-wrap items-center gap-3 text-[0.85rem] font-semibold text-gold">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              <span aria-hidden className="text-white/20">
                |
              </span>
              <span>{post.readingMinutes} min read</span>
              <span aria-hidden className="text-white/20 max-sm:hidden">
                |
              </span>
              <span className="text-white/70 max-sm:basis-full">{post.author}</span>
            </div>

            {/* .prose owns the heading/paragraph/list rhythm for the article
                body, so individual blocks carry no margins of their own. */}
            <div className="prose section-body">
              <p className="lede text-[1.12rem] font-medium text-white/85">{body.intro}</p>

              {body.blocks.map((b, i) => {
                if (b.type === 'h2')
                  return (
                    <h2 key={i} className="text-[1.4rem] font-bold leading-snug text-white">
                      {b.text}
                    </h2>
                  )
                if (b.type === 'ul')
                  return (
                    <ul key={i} className="space-y-2.5">
                      {b.items.map((it) => (
                        <li key={it} className="flex gap-3 text-[1rem] leading-relaxed text-white/70">
                          <span
                            aria-hidden
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                          />
                          {it}
                        </li>
                      ))}
                    </ul>
                  )
                return (
                  <p key={i} className="text-[1rem] leading-[1.75] text-white/70">
                    {b.text}
                  </p>
                )
              })}
            </div>

            <ul className="section-body flex flex-wrap gap-2">
              {body.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-white/15 px-3.5 py-1.5 text-[0.8rem] text-white/70"
                >
                  {t}
                </li>
              ))}
            </ul>

            <div className="card-lg section-body rounded-2xl border border-gold/25 bg-white/[0.04]">
              <h2 className="text-[1.2rem] font-bold text-white">
                Planning your next corporate event?
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-white/65">
                EBM designs and runs conferences, summits and bespoke events that bring industry
                leaders and decision-makers into the same room. Tell us who you need to reach.
              </p>
              <Link href="/contact/?intent=bespoke" className="btn btn-gold mt-6">
                Talk to the team
              </Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav aria-labelledby="toc" className="card">
              <h2 id="toc" className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-white/65">
                On this page
              </h2>
              <ol className="mt-4 space-y-2.5">
                {body.blocks
                  .filter((b): b is { type: 'h2'; text: string } => b.type === 'h2')
                  .map((b) => (
                    <li key={b.text} className="text-[0.86rem] leading-snug text-white/60">
                      {b.text}
                    </li>
                  ))}
              </ol>
            </nav>
          </aside>
        </div>
      </article>
    </>
  )
}
