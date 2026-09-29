import type { Metadata } from 'next'
import { SITE, EVENTS, SERVICES, PRICING, type EventRecord } from '@/data/site'
import { EVENT_CONTENT } from '@/data/event-content'
import { orderUpcoming } from '@/lib/events'

const BASE = SITE.url

/**
 * Per-page metadata. The old site shipped ONE title and ONE meta description
 * across 17 pages, and canonicalised every interior page to `/` — which is why
 * none of them could rank. Every page here gets its own.
 */
export function pageMeta({
  title,
  description,
  path,
  keywords,
  image = '/og/default.png',
  type = 'website',
}: {
  title: string
  description: string
  path: string
  keywords?: string[]
  image?: string
  type?: 'website' | 'article'
}): Metadata {
  const url = `${BASE}${path}`
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: `${SITE.name} — ${SITE.short}`,
      locale: 'en_IN',
      type,
      images: [{ url: `${BASE}${image}`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE}${image}`],
    },
  }
}

/* ------------------------------------------------------------------ */
/* JSON-LD                                                             */
/* ------------------------------------------------------------------ */

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    alternateName: SITE.short,
    url: `${BASE}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE}/images/brand/ebm-logo.png`,
      width: 560,
      height: 86,
    },
    description: SITE.description,
    slogan: SITE.tagline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    contactPoint: SITE.phones.map((p) => ({
      '@type': 'ContactPoint',
      telephone: p.value,
      contactType: p.label === 'Sponsorship' ? 'sales' : 'customer service',
      email: SITE.emails.general,
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    })),
    email: SITE.emails.general,
    sameAs: SITE.social.map((s) => s.href),
    knowsAbout: SERVICES.map((s) => s.title),
  }
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    name: `${SITE.name} — ${SITE.short}`,
    url: `${BASE}/`,
    publisher: { '@id': `${BASE}/#organization` },
    inLanguage: 'en-IN',
  }
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${BASE}${t.path}`,
    })),
  }
}

/**
 * Facts an edition's own material supplies (event-content.ts): doors-open and
 * close times, a share image and partners. Read here rather than passed in, so
 * the home page, /events/ and the event page all emit the SAME Event record —
 * two differing records for one URL invite a search engine to pick the thinner.
 * Each is emitted only when present, so an event without them is unchanged.
 * This module is imported only by server components, which keeps
 * event-content out of the client bundle.
 */
function eventExtras(slug: string) {
  const c = EVENT_CONTENT[slug]
  return {
    start: c?.agenda?.start,
    end: c?.agenda?.end,
    image: c?.seo?.image,
    sponsors: c?.partners?.map((p) => ({ name: p.name, url: p.url })),
    // Performers are a claim that these people WILL speak, so only a list the
    // edition itself calls confirmed is emitted — never an invited one.
    performers: c?.speakers?.confirmed ? c.speakers.people : undefined,
  }
}

/**
 * schema.org/Event. Only emitted for events with a real calendar date —
 * Google requires startDate, and a malformed Event is worse than none.
 */
export function eventLd(e: EventRecord) {
  if (!e.date) return null
  const extra = eventExtras(e.slug)
  // India has one timezone and no daylight saving, so +05:30 is always right.
  // A time without an offset would be read as UTC by some consumers.
  const at = (t?: string) => (t ? `${e.date}T${t}:00+05:30` : undefined)
  return {
    '@context': 'https://schema.org',
    '@type': 'BusinessEvent',
    name: e.fullName,
    description: e.theme ?? `${e.fullName} — organised by ${SITE.name}.`,
    startDate: at(extra?.start) ?? e.date,
    ...(extra?.end ? { endDate: at(extra.end) } : {}),
    ...(extra?.image ? { image: [`${BASE}${extra.image}`] } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: `${BASE}/events/${e.slug}/`,
    location: {
      '@type': 'Place',
      name: e.venue ?? e.city,
      address: {
        '@type': 'PostalAddress',
        addressLocality: e.city,
        addressCountry: 'IN',
      },
    },
    organizer: { '@type': 'Organization', name: SITE.name, url: `${BASE}/` },
    ...(extra?.sponsors?.length
      ? {
          sponsor: extra.sponsors.map((s) => ({
            '@type': 'Organization',
            name: s.name,
            ...(s.url ? { url: s.url } : {}),
          })),
        }
      : {}),
    ...(extra?.performers?.length
      ? {
          performer: extra.performers.map((p) => ({
            '@type': 'Person',
            name: p.name,
            jobTitle: p.title,
            worksFor: { '@type': 'Organization', name: p.company },
          })),
        }
      : {}),
    // An Offer is a factual claim about price, and structured data is read by
    // machines that will repeat it. It is therefore gated on the SAME flag the
    // visible page uses: only an event that actually published a ladder gets
    // one. Previously every upcoming event emitted price 9999, which invented a
    // price for HR Tech — the exact defect the visible page was built to avoid.
    ...(e.status === 'upcoming' && e.pricingPublished
      ? {
          offers: {
            '@type': 'Offer',
            price: PRICING.tiers[0].amount,
            priceCurrency: PRICING.currency,
            availability: 'https://schema.org/InStock',
            url: e.registerUrl ?? `${BASE}/events/${e.slug}/`,
          },
        }
      : {}),
  }
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  }
}

export function itemListLd(name: string, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: `${BASE}${it.path}`,
    })),
  }
}

export const upcomingEvents = () => orderUpcoming(EVENTS.filter((e) => e.status === 'upcoming'))
export const pastEvents = () => EVENTS.filter((e) => e.status === 'past')
