import assert from 'node:assert/strict'
import test from 'node:test'
import { withUtm } from '@/lib/utm'

const utm = { source: 'empiricbusinessmedia', medium: 'referral', campaign: 'rising_bharat_west_2026' }

test('adds the tags to a plain link', () => {
  assert.equal(
    withUtm('https://example.com/summit/', { ...utm, content: 'hero_button' }),
    'https://example.com/summit/?utm_source=empiricbusinessmedia&utm_medium=referral&utm_campaign=rising_bharat_west_2026&utm_content=hero_button',
  )
})

test('keeps a bare tracking code exactly as the client wrote it', () => {
  assert.equal(
    withUtm('https://example.com/summit/?hfhrnf', utm),
    'https://example.com/summit/?hfhrnf&utm_source=empiricbusinessmedia&utm_medium=referral&utm_campaign=rising_bharat_west_2026',
  )
})

test('keeps an existing query and a fragment in their places', () => {
  assert.equal(
    withUtm('https://example.com/a?x=1#speakers', { ...utm, content: 'venue_link' }),
    'https://example.com/a?x=1&utm_source=empiricbusinessmedia&utm_medium=referral&utm_campaign=rising_bharat_west_2026&utm_content=venue_link#speakers',
  )
})

test('leaves out utm_content when none is given', () => {
  assert.ok(!withUtm('https://example.com/', utm).includes('utm_content'))
})
