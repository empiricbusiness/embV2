/**
 * Sends a GA4 event through the gtag snippet in the root layout. Consent Mode
 * already governs what GA stores, so this needs no consent check of its own.
 *
 * Never pass personal data here — no names, emails, phone numbers or form
 * values. Event names and fixed identifiers only.
 */
type Gtag = (command: 'event', name: string, params?: Record<string, string | number>) => void

export function track(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  gtag?.('event', name, params)
}
