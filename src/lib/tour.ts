import { EVENTS, SECTORS, type EventLeg, type EventRecord, type Sector } from '@/data/site'

/**
 * Multi-city tour helpers.
 *
 * An event that tours carries a `legs[]` array (src/data/site.ts). Everything
 * a leg *displays* is computed here rather than stored, so the data file holds
 * only facts someone can check — city, date, venue — and never a status string
 * that has to be kept in step with them by hand.
 *
 * Both the event page (`/events/<slug>/`) and the city pages (`/tour/<city>/`)
 * read `legs[]` through this module. There is no second copy of leg data
 * anywhere: adding a leg to an event's array is the only step needed to make
 * it appear in both views.
 */

/**
 * A leg's announcement stage.
 *   tba       — city committed, no date yet
 *   date_only — date fixed, venue still being contracted
 *   confirmed — date and venue both fixed
 */
export type LegStatus = 'confirmed' | 'date_only' | 'tba'

/**
 * The single source of truth for the three states.
 *
 * DERIVED, never read from the data. A stored `status` field goes stale the
 * moment a venue is filled in and the status is not, and the page would then
 * print "Venue to be announced" directly above the venue name.
 */
export function deriveLegStatus(leg: EventLeg): LegStatus {
  if (!leg.date) return 'tba'
  if (!leg.venue) return 'date_only'
  return 'confirmed'
}

/** True for anything not yet fully fixed. */
export const isProvisional = (leg: EventLeg) =>
  Boolean(leg.provisional) || deriveLegStatus(leg) !== 'confirmed'

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

/**
 * ISO date to UTC midnight. Formatting a date in the runtime's local zone
 * shifts the day backwards anywhere west of Greenwich, so a build machine on
 * US time would render every Indian event a day early. Every formatter below
 * pins `timeZone: 'UTC'`.
 */
const utc = (iso: string) => new Date(`${iso}T00:00:00Z`)

const LONG = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const SHORT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

/**
 * The three display cases, in the order they are reached:
 *   1. a real date          -> "11 February 2027"
 *   2. no date, month known -> the authored label, "November 2026"
 *   3. nothing fixed        -> "Date to be announced"
 *
 * Never "null", never an invented day, never a blank.
 */
export function formatLegDate(leg: EventLeg): string {
  if (leg.date) return LONG.format(utc(leg.date))
  if (leg.dateLabel) return leg.dateLabel
  return 'Date to be announced'
}

/** Compact form for a rail node, where the city is the headline. */
export function formatLegDateShort(leg: EventLeg): string {
  if (leg.date) return SHORT.format(utc(leg.date))
  if (leg.dateLabel) return leg.dateLabel
  return 'Date TBA'
}

/** Venue, or the honest absence of one. */
export const formatLegVenue = (leg: EventLeg): string => leg.venue ?? 'Venue to be announced'

/** `datetime` attribute value, only when there is a real date to put in it. */
export const legDateTime = (leg: EventLeg): string | undefined => leg.date ?? undefined

/** Whole days from `a` to `b`. null when either end has no fixed date. */
export function daysBetween(a: EventLeg, b: EventLeg): number | null {
  if (!a.date || !b.date) return null
  return Math.round((utc(b.date).getTime() - utc(a.date).getTime()) / 86_400_000)
}

/* ------------------------------------------------------------------ */
/* Ordering                                                            */
/* ------------------------------------------------------------------ */

/**
 * Chronological, with undated legs pinned to the end in their authored order.
 *
 * Undated legs are not interleaved: a city with no date is not "later than" a
 * dated one, it is simply unscheduled, and sorting it into an invented
 * position would imply a sequence EBM has not announced.
 */
export function legsSorted(legs: readonly EventLeg[]): EventLeg[] {
  const dated = legs.filter((l) => l.date).sort((a, b) => (a.date as string).localeCompare(b.date as string))
  const undated = legs.filter((l) => !l.date)
  return [...dated, ...undated]
}

/* ------------------------------------------------------------------ */
/* Proportional rail spacing                                           */
/* ------------------------------------------------------------------ */

/**
 * Node spacing is proportional to the real gap between legs, so a tour that
 * runs two cities a week apart and then pauses for four months *looks* like
 * that. Evenly spaced nodes would read as a generic carousel and would hide
 * the one thing the rail exists to show.
 *
 * The mapping is logarithmic, not linear. Linear would make a 9-month gap 39x
 * the width of a 7-day one and push the tour off any screen; log keeps the
 * ordering legible while bounding the extremes.
 */
/**
 * TUNING: the distance between two dots is the card width (--tour-card-w,
 * 11rem) PLUS this gap, so the card sets a floor the gap has to overcome
 * before the spacing reads as proportional at all. At 56–200px the whole tour
 * looked evenly spaced on screen — measured 250px vs 354px between the
 * tightest and widest pairs, a difference the eye does not register. 40–340px
 * puts the same pairs at 240px and 458px, which reads.
 */
export const GAP_MIN_PX = 40
export const GAP_MAX_PX = 340
const DAYS_AT_MIN = 7
const DAYS_AT_MAX = 180

export function gapForDays(days: number | null): number {
  // An unscheduled leg has no measurable distance from its neighbour, so it
  // takes the base gap rather than a guessed one.
  if (days === null) return GAP_MIN_PX
  if (days <= DAYS_AT_MIN) return GAP_MIN_PX
  if (days >= DAYS_AT_MAX) return GAP_MAX_PX
  const t = Math.log(days / DAYS_AT_MIN) / Math.log(DAYS_AT_MAX / DAYS_AT_MIN)
  return Math.round(GAP_MIN_PX + t * (GAP_MAX_PX - GAP_MIN_PX))
}

/**
 * Pixels to render *before* each leg. The first is always 0 — nothing precedes
 * it — so `railGaps(x)[i]` lines up index-for-index with `legsSorted(x)[i]`.
 */
export function railGaps(sorted: readonly EventLeg[]): number[] {
  return sorted.map((leg, i) => (i === 0 ? 0 : gapForDays(daysBetween(sorted[i - 1], leg))))
}

/* ------------------------------------------------------------------ */
/* City-first views                                                    */
/* ------------------------------------------------------------------ */

/** One city stop: the leg, plus the event it belongs to. */
export type TourStop = { event: EventRecord; leg: EventLeg }

/** Every event that actually tours. */
export const touringEvents = (): EventRecord[] => EVENTS.filter((e) => (e.legs?.length ?? 0) > 0)

/** Every (event, leg) pair across the whole catalogue. */
export function allStops(): TourStop[] {
  return touringEvents().flatMap((event) => (event.legs ?? []).map((leg) => ({ event, leg })))
}

/** Every stop in one city, soonest first, undated last. */
export function stopsInCity(citySlug: string): TourStop[] {
  return allStops()
    .filter((s) => s.leg.slug === citySlug)
    .sort((a, b) => {
      if (a.leg.date && b.leg.date) return a.leg.date.localeCompare(b.leg.date)
      if (a.leg.date) return -1
      if (b.leg.date) return 1
      return 0
    })
}

/**
 * The cities a page can be built for — derived, so a city appears the moment a
 * leg naming it is added and disappears when the last one is removed. There is
 * no separate list of cities to keep in step.
 */
export function tourCities(): { slug: string; city: string; count: number; next: EventLeg | null }[] {
  const byCity = new Map<string, TourStop[]>()
  for (const stop of allStops()) {
    const list = byCity.get(stop.leg.slug) ?? []
    list.push(stop)
    byCity.set(stop.leg.slug, list)
  }
  return [...byCity.entries()]
    .map(([slug, stops]) => {
      const dated = legsSorted(stops.map((s) => s.leg)).filter((l) => l.date)
      return { slug, city: stops[0].leg.city, count: stops.length, next: dated[0] ?? null }
    })
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
}

/**
 * Stops grouped by vertical, in the site's authored SECTORS order so the
 * groups appear in the same sequence as every other sector list on the site.
 * Empty sectors are dropped — a heading with nothing under it is a dead end.
 */
export function stopsByVertical(
  stops: readonly TourStop[],
): { sector: Sector; stops: TourStop[] }[] {
  return SECTORS.map((sector) => ({
    sector,
    stops: stops.filter((s) => s.event.sector === sector.slug),
  })).filter((g) => g.stops.length > 0)
}
