import Link from 'next/link'
import { upcomingEvents } from '@/lib/seo'

export const metadata = { title: 'Page not found', robots: { index: false, follow: true } }

export default function NotFound() {
  const upcoming = upcomingEvents()

  return (
    <section className="section">
      <div className="wrap section max-w-2xl text-center">
        <p className="eyebrow justify-center">Error 404</p>
        <h1 className="display mt-4 text-white">We can&apos;t find that page.</h1>
        <p className="lede mt-5 text-white/65">
          The link may be out of date. Here is where most people are heading.
        </p>

        <div className="section-body flex flex-wrap justify-center gap-3">
          <Link href="/events/" className="btn btn-gold">
            Browse events
          </Link>
          <Link href="/" className="btn btn-ghost">
            Back to home
          </Link>
        </div>

        {upcoming.length > 0 && (
          <ul className="section-body space-y-3 text-left">
            {upcoming.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/events/${e.slug}/`}
                  className="card card-link block text-[0.95rem] text-white/75"
                >
                  <span className="font-semibold text-white">
                    {e.edition} {e.name}
                  </span>
                  <br />
                  {e.dateLabel} · {e.city}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
