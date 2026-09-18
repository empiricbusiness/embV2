import Link from 'next/link'
import { SITE, SERVICES, SECTORS } from '@/data/site'
import { upcomingEvents } from '@/lib/seo'
import Logo from './Logo'
import { CookieSettingsButton } from './ConsentBanner'

const YEAR = 2026

export default function Footer() {
  const upcoming = upcomingEvents()

  return (
    <footer className="border-t border-white/10 bg-navy-900">
      <div className="wrap section-tight">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Logo className="h-10 w-auto" />
            <p className="lede mt-5 max-w-sm text-white/65">{SITE.boilerplate}</p>
            <p className="mt-4 text-sm font-semibold text-gold">{SITE.strapline}</p>

            {SITE.social.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3 lg:flex-nowrap">
                {SITE.social.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm font-medium text-white/85 transition-colors hover:border-gold hover:text-gold"
                  >
                    {s.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          <nav aria-labelledby="f-services">
            <h2 id="f-services" className="text-sm font-bold uppercase tracking-[0.14em] text-white">
              Services
            </h2>
            <ul className="mt-5 space-y-3 max-md:mt-3 max-md:space-y-0">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}/`}
                    className="text-[0.95rem] text-white/65 transition-colors hover:text-gold max-md:inline-flex max-md:min-h-11 max-md:items-center"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sectors */}
          <nav aria-labelledby="f-sectors">
            <h2 id="f-sectors" className="text-sm font-bold uppercase tracking-[0.14em] text-white">
              Sectors
            </h2>
            <ul className="mt-5 space-y-3 max-md:mt-3 max-md:space-y-0">
              {SECTORS.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/events/?sector=${s.slug}`}
                    className="text-[0.95rem] text-white/65 transition-colors hover:text-gold max-md:inline-flex max-md:min-h-11 max-md:items-center"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-white">
              Company
            </h2>
            <ul className="mt-5 space-y-3 max-md:mt-3 max-md:space-y-0">
              <li>
                <Link href="/about/" className="text-[0.95rem] text-white/65 hover:text-gold max-md:inline-flex max-md:min-h-11 max-md:items-center">
                  About EBM
                </Link>
              </li>
              <li>
                <Link href="/sponsorship/" className="text-[0.95rem] text-white/65 hover:text-gold max-md:inline-flex max-md:min-h-11 max-md:items-center">
                  Sponsorship
                </Link>
              </li>
              <li>
                <Link href="/blog/" className="text-[0.95rem] text-white/65 hover:text-gold max-md:inline-flex max-md:min-h-11 max-md:items-center">
                  Insights
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Get in touch</h2>
            <address className="mt-5 not-italic">
              <p className="text-[0.95rem] leading-relaxed text-white/65">
                {SITE.address.street},<br />
                {SITE.address.locality}, {SITE.address.region} {SITE.address.postalCode},{' '}
                {SITE.address.countryName}
              </p>
              <ul className="mt-5 space-y-2.5 max-md:mt-3 max-md:space-y-0">
                {SITE.phones.map((p) => (
                  <li key={p.href}>
                    <a
                      href={p.href}
                      className="text-[0.95rem] font-medium text-white/85 transition-colors hover:text-gold max-md:inline-flex max-md:min-h-11 max-md:items-center"
                    >
                      {p.value}
                    </a>
                    <span className="ml-2 text-xs text-white/65">{p.label}</span>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${SITE.emails.general}`}
                    className="text-[0.95rem] font-medium text-white/85 transition-colors hover:text-gold max-md:inline-flex max-md:min-h-11 max-md:items-center"
                  >
                    {SITE.emails.general}
                  </a>
                </li>
              </ul>
            </address>

            {upcoming.length > 0 && (
              <div className="mt-7">
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Next up</h3>
                <ul className="mt-4 space-y-3">
                  {upcoming.slice(0, 2).map((e) => (
                    <li key={e.slug}>
                      <Link
                        href={`/events/${e.slug}/`}
                        className="block text-[0.9rem] leading-snug text-white/65 transition-colors hover:text-gold"
                      >
                        <span className="font-semibold text-white/90">{e.name}</span>
                        <br />
                        {e.dateLabel} · {e.city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="section-body flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {YEAR} {SITE.legalName} All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2 max-lg:gap-y-0">
            <Link href="/privacy-policy/" className="hover:text-gold max-lg:inline-flex max-lg:min-h-11 max-lg:items-center">
              Privacy Policy
            </Link>
            <Link href="/terms/" className="hover:text-gold max-lg:inline-flex max-lg:min-h-11 max-lg:items-center">
              Terms of Use
            </Link>
            <Link href="/refund-policy/" className="hover:text-gold max-lg:inline-flex max-lg:min-h-11 max-lg:items-center">
              Refund &amp; Cancellation
            </Link>
            <Link href="/contact/" className="hover:text-gold max-lg:inline-flex max-lg:min-h-11 max-lg:items-center">
              Contact
            </Link>
            <CookieSettingsButton className="cursor-pointer hover:text-gold max-lg:inline-flex max-lg:min-h-11 max-lg:items-center" />
          </nav>
        </div>
      </div>
    </footer>
  )
}
