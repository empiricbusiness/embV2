'use client'

import { track } from '@/lib/analytics'

/**
 * A plain link that records one GA4 event when followed. For outbound links,
 * where GA's own outbound-click measurement cannot carry our parameters.
 */
export default function TrackedLink({
  event,
  params,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string
  params?: Record<string, string | number>
}) {
  return <a {...props} onClick={() => track(event, params)} />
}
