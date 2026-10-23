/**
 * UTM tags on links that leave the site, so the destination's own analytics
 * can see that a visitor came from EBM — and from which button.
 */

export type Utm = { source: string; medium: string; campaign: string }

/**
 * Appends UTM tags to a URL. Any query the URL already carries is kept exactly
 * as written — a client may hand over a link with its own tracking code (a
 * bare `?hfhrnf`, say), and re-serialising it through URLSearchParams would
 * turn that into `hfhrnf=` and could break whatever reads it. A #fragment
 * stays at the end, where it belongs.
 */
export function withUtm(url: string, utm: Utm & { content?: string }): string {
  const hashAt = url.indexOf('#')
  const base = hashAt === -1 ? url : url.slice(0, hashAt)
  const hash = hashAt === -1 ? '' : url.slice(hashAt)
  const params = new URLSearchParams({
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign,
  })
  if (utm.content) params.set('utm_content', utm.content)
  const joiner = !base.includes('?') ? '?' : /[?&]$/.test(base) ? '' : '&'
  return `${base}${joiner}${params.toString()}${hash}`
}
