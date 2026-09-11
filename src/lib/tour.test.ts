import assert from 'node:assert/strict'
import test from 'node:test'
import type { EventLeg } from '@/data/site'
import {
  GAP_MAX_PX,
  GAP_MIN_PX,
  daysBetween,
  deriveLegStatus,
  formatLegDate,
  formatLegDateShort,
  formatLegVenue,
  gapForDays,
  isProvisional,
  legsSorted,
  railGaps,
} from '@/lib/tour'

const leg = (over: Partial<EventLeg> = {}): EventLeg => ({
  city: 'Mumbai',
  slug: 'mumbai',
  date: '2027-02-11',
  venue: 'Radisson Mumbai',
  ...over,
})

/* ---------------------------------------------------------------- */
/* deriveLegStatus — the three states                                */
/* ---------------------------------------------------------------- */

test('deriveLegStatus: date and venue both set is confirmed', () => {
  assert.equal(deriveLegStatus(leg()), 'confirmed')
})

test('deriveLegStatus: date without venue is date_only', () => {
  assert.equal(deriveLegStatus(leg({ venue: null })), 'date_only')
})

test('deriveLegStatus: no date is tba', () => {
  assert.equal(deriveLegStatus(leg({ date: null, venue: null })), 'tba')
})

test('deriveLegStatus: no date outranks a known venue', () => {
  // A venue booked before the date is fixed is still an unscheduled leg. The
  // rail must not present it as if it had a place in the sequence.
  assert.equal(deriveLegStatus(leg({ date: null, venue: 'ITC Grand Chola' })), 'tba')
})

test('isProvisional: true for anything not fully fixed, and for a flagged leg', () => {
  assert.equal(isProvisional(leg()), false)
  assert.equal(isProvisional(leg({ venue: null })), true)
  assert.equal(isProvisional(leg({ date: null, venue: null })), true)
  assert.equal(isProvisional(leg({ provisional: true })), true)
})

/* ---------------------------------------------------------------- */
/* formatLegDate — the three display cases                           */
/* ---------------------------------------------------------------- */

test('formatLegDate: a real date renders in full', () => {
  assert.equal(formatLegDate(leg({ date: '2027-02-11' })), '11 February 2027')
})

test('formatLegDate: no date falls back to the authored month label', () => {
  assert.equal(formatLegDate(leg({ date: null, dateLabel: 'November 2027' })), 'November 2027')
})

test('formatLegDate: nothing fixed announces itself, never blank or null', () => {
  const out = formatLegDate(leg({ date: null, dateLabel: undefined }))
  assert.equal(out, 'Date to be announced')
  assert.ok(!out.includes('null'))
})

test('formatLegDate: a real date wins over a stale label, so the two cannot disagree', () => {
  assert.equal(formatLegDate(leg({ date: '2027-02-11', dateLabel: 'March 2027' })), '11 February 2027')
})

test('formatLegDate: the day does not shift with the build machine timezone', () => {
  // Formatted in UTC, so a builder west of Greenwich cannot render an Indian
  // event a day early. 1 January is the case that would roll back a year.
  assert.equal(formatLegDate(leg({ date: '2027-01-01' })), '1 January 2027')
  assert.equal(formatLegDate(leg({ date: '2027-12-31' })), '31 December 2027')
})

test('formatLegDateShort: compact for a rail node', () => {
  assert.equal(formatLegDateShort(leg({ date: '2027-02-11' })), '11 Feb')
  assert.equal(formatLegDateShort(leg({ date: null, dateLabel: 'Nov 2027' })), 'Nov 2027')
  assert.equal(formatLegDateShort(leg({ date: null })), 'Date TBA')
})

test('formatLegVenue: absence is stated, not left empty', () => {
  assert.equal(formatLegVenue(leg()), 'Radisson Mumbai')
  assert.equal(formatLegVenue(leg({ venue: null })), 'Venue to be announced')
})

/* ---------------------------------------------------------------- */
/* daysBetween                                                       */
/* ---------------------------------------------------------------- */

test('daysBetween: counts whole days across a month boundary', () => {
  assert.equal(daysBetween(leg({ date: '2027-02-11' }), leg({ date: '2027-02-18' })), 7)
  assert.equal(daysBetween(leg({ date: '2027-01-25' }), leg({ date: '2027-03-01' })), 35)
})

test('daysBetween: null when either end is unscheduled', () => {
  assert.equal(daysBetween(leg({ date: null }), leg()), null)
  assert.equal(daysBetween(leg(), leg({ date: null })), null)
})

/* ---------------------------------------------------------------- */
/* legsSorted                                                        */
/* ---------------------------------------------------------------- */

test('legsSorted: chronological, with undated legs pinned to the end', () => {
  const a = leg({ city: 'Pune', slug: 'pune', date: '2027-05-06' })
  const b = leg({ city: 'Chennai', slug: 'chennai', date: '2027-02-11' })
  const c = leg({ city: 'Kolkata', slug: 'kolkata', date: null })
  const d = leg({ city: 'Hyderabad', slug: 'hyderabad', date: '2027-03-18' })

  assert.deepEqual(
    legsSorted([a, b, c, d]).map((l) => l.slug),
    ['chennai', 'hyderabad', 'pune', 'kolkata'],
  )
})

test('legsSorted: undated legs keep their authored order rather than being invented one', () => {
  const x = leg({ slug: 'kochi', date: null })
  const y = leg({ slug: 'jaipur', date: null })
  assert.deepEqual(
    legsSorted([x, y]).map((l) => l.slug),
    ['kochi', 'jaipur'],
  )
})

test('legsSorted: does not mutate its input', () => {
  const input = [leg({ slug: 'b', date: '2027-05-06' }), leg({ slug: 'a', date: '2027-02-11' })]
  legsSorted(input)
  assert.deepEqual(
    input.map((l) => l.slug),
    ['b', 'a'],
  )
})

/* ---------------------------------------------------------------- */
/* Proportional spacing — the point of the rail                      */
/* ---------------------------------------------------------------- */

test('gapForDays: clamped at both ends', () => {
  assert.equal(gapForDays(0), GAP_MIN_PX)
  assert.equal(gapForDays(7), GAP_MIN_PX)
  assert.equal(gapForDays(180), GAP_MAX_PX)
  assert.equal(gapForDays(365), GAP_MAX_PX)
})

test('gapForDays: an unscheduled neighbour takes the base gap, never a guessed one', () => {
  assert.equal(gapForDays(null), GAP_MIN_PX)
})

test('gapForDays: a one-week gap reads tighter than a one-month gap', () => {
  // This is the acceptance criterion from the brief, asserted directly.
  assert.ok(gapForDays(7) < gapForDays(30))
  assert.ok(gapForDays(30) < gapForDays(90))
})

test('gapForDays: monotonic across the whole range', () => {
  let prev = -1
  for (let d = 0; d <= 200; d++) {
    const g = gapForDays(d)
    assert.ok(g >= prev, `gap fell at ${d} days: ${g} < ${prev}`)
    assert.ok(g >= GAP_MIN_PX && g <= GAP_MAX_PX, `gap out of bounds at ${d} days: ${g}`)
    prev = g
  }
})

test('railGaps: first node has no gap, and indices line up with legsSorted', () => {
  const legs = [
    leg({ slug: 'chennai', date: '2027-02-11' }),
    leg({ slug: 'hyderabad', date: '2027-02-18' }), // +7d  -> minimum
    leg({ slug: 'pune', date: '2027-08-18' }), // +181d -> maximum
  ]
  const sorted = legsSorted(legs)
  const gaps = railGaps(sorted)

  assert.equal(gaps.length, sorted.length)
  assert.equal(gaps[0], 0)
  assert.equal(gaps[1], GAP_MIN_PX)
  assert.equal(gaps[2], GAP_MAX_PX)
})

test('railGaps: a single-leg tour produces one zero gap', () => {
  assert.deepEqual(railGaps(legsSorted([leg()])), [0])
})

test('railGaps: an empty tour produces no gaps', () => {
  assert.deepEqual(railGaps(legsSorted([])), [])
})
