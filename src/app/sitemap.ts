import type { MetadataRoute } from 'next'
import { SITE, SERVICES, EVENTS, POSTS } from '@/data/site'
import { tourCities } from '@/lib/tour'

export const dynamic = 'force-static'

const BASE = SITE.url

/**
 * The old site had NO sitemap.xml — the URL returned a 404 HTML page.
 * Priorities weight the commercial-intent pages (sponsorship, events) highest.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date('2026-09-02')

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/events/`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE}/tour/`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/sponsorship/`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE}/services/`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/gallery/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog/`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/privacy-policy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/refund-policy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const services: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${BASE}/services/${s.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const events: MetadataRoute.Sitemap = EVENTS.map((e) => ({
    url: `${BASE}/events/${e.slug}/`,
    lastModified: now,
    changeFrequency: e.status === 'upcoming' ? 'weekly' : 'yearly',
    priority: e.status === 'upcoming' ? 0.9 : 0.5,
  }))

  /* City pages are derived from the tours, so this list cannot name a URL
     that generateStaticParams did not build. */
  const cities: MetadataRoute.Sitemap = tourCities().map((c) => ({
    url: `${BASE}/tour/${c.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const posts: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}/`,
    lastModified: new Date(p.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticPages, ...services, ...events, ...cities, ...posts]
}
