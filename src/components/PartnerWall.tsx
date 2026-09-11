import Image from 'next/image'
import assets from '@/data/assets.json'

type Partner = { name: string; src: string; w: number; h: number }
const PARTNERS = assets.partners as Partner[]

const pretty = (n: string) => n.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

/**
 * Sponsor / partner logo wall.
 *
 * The source logos are a mix of transparent PNG/SVG and opaque JPEG. Flattening
 * them to a single colour turns the opaque ones into solid rectangles, so each
 * mark sits on its own light chip instead — real brand colours, one consistent
 * shape, and it works on both the dark and light sections.
 *
 * NOTE FOR THE CLIENT: these 37 marks were carried over from the old site's
 * `/images/EBM-sponsor/` directory. Several are very large global brands
 * (Apple, Cisco, Dell, Zoom, Mitsubishi). Displaying a third-party mark implies
 * a commercial relationship — confirm written permission for each, or move the
 * unconfirmed ones to a neutral "companies that have attended" treatment.
 */
export default function PartnerWall({
  marquee = true,
  limit,
}: {
  marquee?: boolean
  /** Cap the marquee to the first N marks. The homepage strip uses 18: every
      logo is rendered twice for the infinite scroll AND serialised again in
      the RSC payload, so 37 marks cost ~50KB of a 149KB HTML document on a
      page whose LCP is already on the critical path. The full wall of 37
      stays on /sponsorship/, where it is the content. */
  limit?: number
}) {
  const list = limit ? PARTNERS.slice(0, limit) : PARTNERS
  if (marquee) {
    const doubled = [...list, ...list]
    return (
      <div className="marquee-wrap" aria-label="Partner and sponsor brands">
        <div className="marquee py-2">
          {doubled.map((p, i) => (
            <span key={`${p.name}-${i}`} className="logo-chip">
              <Image
                src={p.src}
                alt={i < list.length ? pretty(p.name) : ''}
                aria-hidden={i >= list.length}
                width={p.w}
                height={p.h}
                loading="lazy"
                decoding="async"
                className="logo-mark"
              />
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {PARTNERS.map((p) => (
        <li key={p.name} className="flex">
          <span className="logo-chip w-full">
            <Image
              src={p.src}
              alt={pretty(p.name)}
              width={p.w}
              height={p.h}
              loading="lazy"
              decoding="async"
              className="logo-mark"
            />
          </span>
        </li>
      ))}
    </ul>
  )
}
