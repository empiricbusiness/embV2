import { SITE } from '@/data/site'
import { pageMeta } from '@/lib/seo'
import PageHero from '@/components/PageHero'
import ContactForm from '@/components/ContactForm'
import JsonLd from '@/components/JsonLd'

export const metadata = pageMeta({
  title: 'Contact Empiric Business Media — Mumbai',
  description:
    'Get in touch with the Empiric Business Media team about attending, speaking at, sponsoring or commissioning a B2B event in India. Offices in Mira Bhayandar, Mumbai.',
  path: '/contact/',
  keywords: [
    'contact Empiric Business Media',
    'B2B event company Mumbai contact',
    'conference organisers Mumbai contact',
    'event sponsorship enquiry India',
  ],
})

export default function ContactPage() {
  const { address } = SITE

  return (
    <>
      {/* LocalBusiness with a real NAP — the old contact page embedded a Google
          Map of New York, and leaked placeholder numbers like +123456789. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': `${SITE.url}/#localbusiness`,
          name: SITE.name,
          image: `${SITE.url}/images/brand/ebm-logo.png`,
          url: `${SITE.url}/`,
          telephone: SITE.phones[0].value,
          email: SITE.emails.general,
          address: {
            '@type': 'PostalAddress',
            streetAddress: address.street,
            addressLocality: address.locality,
            addressRegion: address.region,
            postalCode: address.postalCode,
            addressCountry: address.country,
          },
          areaServed: { '@type': 'Country', name: 'India' },
          parentOrganization: { '@id': `${SITE.url}/#organization` },
        }}
      />

      <PageHero
        eyebrow="Contact"
        title="Tell us who you need to reach."
        lede="Whether you want to attend, speak, sponsor or commission an event of your own, the fastest route is a short message with your audience and objective."
        trail={[{ name: 'Contact', path: '/contact/' }]}
      />

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <h2 className="h2 text-white">Send us a message</h2>
            <p className="lede mt-4 text-white/65">
              We reply to every genuine enquiry. Fields marked{' '}
              <span className="text-gold">*</span> are required.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="card">
              <h2 className="text-[1.1rem] font-bold text-white">Office</h2>
              <address className="mt-4 not-italic text-[0.95rem] leading-relaxed text-white/70">
                {address.street},<br />
                {address.locality}, {address.region} {address.postalCode},<br />
                {address.countryName}
              </address>
            </div>

            <div className="card">
              <h2 className="text-[1.1rem] font-bold text-white">Phone</h2>
              <ul className="mt-4 space-y-3">
                {SITE.phones.map((p) => (
                  <li key={p.href}>
                    <a
                      href={p.href}
                      className="text-[1rem] font-semibold text-white transition-colors hover:text-gold"
                    >
                      {p.value}
                    </a>
                    <span className="block text-[0.82rem] text-white/65">{p.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h2 className="text-[1.1rem] font-bold text-white">Email</h2>
              <a
                href={`mailto:${SITE.emails.general}`}
                className="mt-4 block text-[1rem] font-semibold text-white transition-colors hover:text-gold"
              >
                {SITE.emails.general}
              </a>
            </div>

            {SITE.social.length > 0 && (
              <div className="card">
                <h2 className="text-[1.1rem] font-bold text-white">Follow</h2>
                <ul className="mt-4 space-y-2">
                  {SITE.social.map((s) => (
                    <li key={s.name}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.95rem] font-medium text-white/80 hover:text-gold"
                      >
                        {s.name}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Map — loaded only on interaction so it costs nothing on first paint.
          TODO(client): confirm the exact pin before launch. */}
      <section className="border-t border-white/10">
        <div className="wrap section-tight">
          <h2 className="h2 text-white">Find us</h2>
          <details className="group mt-6">
            <summary className="btn btn-ghost cursor-pointer list-none marker:hidden">
              Load map (Google Maps)
            </summary>
            <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
              <iframe
                title="Map showing the Empiric Business Media office in Mira Bhayandar, Mumbai"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}, India`,
                )}&output=embed`}
                width="100%"
                height="420"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </details>
          <p className="mt-3 text-[0.82rem] text-white/65">
            The map loads only when you open it, so it costs nothing on page load.
          </p>
        </div>
      </section>
    </>
  )
}
