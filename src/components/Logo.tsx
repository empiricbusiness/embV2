import Image from 'next/image'
import { SITE } from '@/data/site'

/**
 * The EBM logo, unmodified. It is white-on-transparent with gold accents, so it
 * must only ever sit on a dark surface — every placement in this build does.
 * Explicit width/height prevent the layout shift the old site had on all 57 images.
 */
export default function Logo({
  className = 'h-10 w-auto',
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      src="/images/brand/ebm-logo.png"
      alt={`${SITE.name} — ${SITE.tagline}`}
      width={560}
      height={86}
      className={className}
      priority={priority}
      // The logo is the LCP-adjacent element in the header; never lazy it.
      loading={priority ? undefined : 'lazy'}
    />
  )
}
