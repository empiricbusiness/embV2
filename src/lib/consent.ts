/**
 * Shared by the gtag snippet in the root layout (a server component) and the
 * consent banner (a client component). Kept in a plain module because string
 * constants exported from a 'use client' file reach server components as
 * client references, not as strings.
 */
export const CONSENT_KEY = 'ebm-consent'
export const CONSENT_OPEN_EVENT = 'ebm:consent-open'
