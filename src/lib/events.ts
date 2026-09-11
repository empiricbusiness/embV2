import { EVENTS, SECTORS, FORMATS, type EventRecord } from '@/data/site'
import images from '@/data/event-images.json'

type Img = { src: string; w: number; h: number }
const IMAGES = images as Record<string, Img>

/**
 * Resolve an event's artwork. Returns null rather than a substitute: an EBM
 * event card must never carry a photograph of a different event, which is the
 * defect that got stock imagery pulled from the gallery earlier in this build.
 */
export function eventImage(e: Pick<EventRecord, 'image'>): Img | null {
  if (!e.image) return null
  return IMAGES[e.image] ?? null
}

/** Sortable key. Undated editions fall to 1 January of their evidenced year. */
export const sortKey = (e: EventRecord) => e.date ?? `${e.year}-01-01`

/** Soonest first. */
export const byDateAsc = (a: EventRecord, b: EventRecord) => sortKey(a).localeCompare(sortKey(b))

/** Most recent first. */
export const byDateDesc = (a: EventRecord, b: EventRecord) => sortKey(b).localeCompare(sortKey(a))

export const upcoming = () => EVENTS.filter((e) => e.status === 'upcoming').sort(byDateAsc)
export const past = () => EVENTS.filter((e) => e.status === 'past').sort(byDateDesc)

/** Past editions grouped into year buckets, newest year first. */
export function pastByYear(): { year: number; events: EventRecord[] }[] {
  const buckets = new Map<number, EventRecord[]>()
  for (const e of past()) {
    const list = buckets.get(e.year) ?? []
    list.push(e)
    buckets.set(e.year, list)
  }
  return [...buckets.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, events]) => ({ year, events }))
}

/**
 * Sector vocabulary for prose, DERIVED so copy cannot drift from the data.
 *
 * This exists because it already drifted: when the catalogue grew from four
 * verticals to seven, two headings were updated and five other places were not,
 * leaving the site saying "four deep verticals" next to a seven-chip filter —
 * and shipping a four-sector answer in the homepage FAQ's structured data. An
 * external reviewer found it. Never hard-code the count again.
 *
 * `active` = has an edition currently open. `delivered` = has run, none open.
 * The distinction is what makes an honest single answer possible: the archive
 * genuinely spans seven, while only some are live right now.
 */
export const sectorsActive = () =>
  sectorsInUse().filter((s) => EVENTS.some((e) => e.sector === s.slug && e.status === 'upcoming'))

export const sectorsDelivered = () =>
  sectorsInUse().filter((s) => !EVENTS.some((e) => e.sector === s.slug && e.status === 'upcoming'))

/** "A, B and C" — an Oxford-comma-free list for running prose. */
export const listSentence = (xs: string[]) =>
  xs.length <= 1 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`

export const SECTOR_WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
] as const

/** Spelled-out count for prose ("seven verticals"), derived from the data. */
export const sectorCountWord = () => SECTOR_WORDS[sectorsInUse().length] ?? String(sectorsInUse().length)

/**
 * Only offer a filter chip that can return something. A "Webinar" chip that
 * always yields zero results is a dead control, and the count beside each chip
 * is itself a factual claim.
 */
export const sectorsInUse = () =>
  SECTORS.map((s) => ({ ...s, count: EVENTS.filter((e) => e.sector === s.slug).length })).filter(
    (s) => s.count > 0,
  )

export const formatsInUse = () =>
  FORMATS.map((f) => ({ ...f, count: EVENTS.filter((e) => e.format === f.slug).length })).filter(
    (f) => f.count > 0,
  )

/**
 * The haystack the client-side search matches against: title, city, venue,
 * sector, edition, theme and year. Built once at render and written to a data
 * attribute so the filter needs no second copy of the catalogue in JS.
 */
export function searchIndex(e: EventRecord): string {
  const sector = SECTORS.find((s) => s.slug === e.sector)?.name ?? ''
  const format = FORMATS.find((f) => f.slug === e.format)?.name ?? ''
  return [e.name, e.fullName, e.edition, e.theme, e.city, e.venue, sector, format, e.year, e.dateLabel]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

/**
 * The ONLY event fields allowed to cross into a client component.
 *
 * Client-component props are serialised into the static HTML, so anything
 * passed here is published. `source` and `conflicts` are internal research
 * notes naming unresolved data problems — they are for the team and the client,
 * never for a visitor. Passing the whole record shipped all 26 source notes and
 * 19 conflict notes into /events/, which is the defect commit 5acb333 fixed on
 * the detail pages. This projection is the guard; `verify.mjs` asserts it.
 */
export type CardEvent = Pick<
  EventRecord,
  | 'slug'
  | 'name'
  | 'fullName'
  | 'edition'
  | 'theme'
  | 'date'
  | 'dateLabel'
  | 'year'
  | 'city'
  | 'venue'
  | 'sector'
  | 'format'
  | 'status'
  | 'image'
>

export function toCardEvent(e: EventRecord): CardEvent {
  return {
    slug: e.slug,
    name: e.name,
    fullName: e.fullName,
    edition: e.edition,
    theme: e.theme,
    date: e.date,
    dateLabel: e.dateLabel,
    year: e.year,
    city: e.city,
    venue: e.venue,
    sector: e.sector,
    format: e.format,
    status: e.status,
    image: e.image,
  }
}
