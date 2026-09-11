import Image from 'next/image'
import Link from 'next/link'
import JsonLd from './JsonLd'
import { breadcrumbLd } from '@/lib/seo'

export default function PageHero({
  eyebrow,
  title,
  lede,
  trail,
  image,
  stage,
  children,
}: {
  eyebrow: string
  title: string
  lede?: string
  /** Breadcrumb trail, excluding Home — added automatically. */
  trail: { name: string; path: string }[]
  /** Optional backdrop. Event pages use it to carry their own identity. */
  image?: { src: string; w: number; h: number }
  /**
   * Renders the CSS stage backdrop — gold beams, floor glow, dot lattice —
   * built from EBM's own event banner. Layers over `image` when both are set.
   */
  stage?: boolean
  /** Extra content below the lede — e.g. an event's CTAs. */
  children?: React.ReactNode
}) {
  const full = [{ name: 'Home', path: '/' }, ...trail]

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-navy-900">
      {/* Layering uses POSITIVE z-indices only. A negative z-index inside an
          `isolate` stacking context paints behind the section's own background,
          which silently hid the hero photo entirely. Order: photo (z-0) →
          wash (z-0, later sibling) → content (z-10). */}
      {image && (
        <Image
          src={image.src}
          alt=""
          width={image.w}
          height={image.h}
          priority
          sizes="100vw"
          className={`absolute inset-0 z-0 h-full w-full object-cover ${
            stage ? 'opacity-40' : ''
          }`}
        />
      )}
      {/* Brand-blue wash with a gold bloom: pure gradients, no filters, so it
          is free at paint time. Over a photo it also guarantees the contrast
          ratios hold — text sits on ≤ navy-800 either way, keeping gold
          eyebrows at ≥ 5.2:1 and white copy at ≥ 9.5:1. */}
      {stage && <div aria-hidden className="hero-stage absolute inset-0 z-0" />}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: stage
            ? /* A tight ellipse under the copy, not a veil over the whole
                 section — the flat version washed the backdrop out entirely.
                 Still ≥ 9.5:1 for white body text and ≥ 5.2:1 for gold. */
              'radial-gradient(46rem 20rem at 50% 46%, rgba(4,16,29,0.9), rgba(4,16,29,0.62) 62%, transparent 88%)'
            : image
              ? 'radial-gradient(70rem 30rem at 8% -20%, rgba(245,182,20,0.18), transparent 60%), linear-gradient(100deg, #071d33 0%, rgba(7,29,51,0.94) 38%, rgba(7,29,51,0.62) 70%, rgba(7,29,51,0.45) 100%)'
              : 'radial-gradient(70rem 30rem at 10% -15%, rgba(245,182,20,0.20), transparent 62%), radial-gradient(60rem 30rem at 90% 5%, rgba(25,104,188,0.55), transparent 62%), linear-gradient(180deg, #0b2d4d 0%, #071d33 100%)',
        }}
      />
      <JsonLd data={breadcrumbLd(full)} />

      <div className="wrap section-tight relative z-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.82rem] text-white/70">
            {full.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                {i < full.length - 1 ? (
                  <>
                    <Link href={c.path} className="hover:text-gold">
                      {c.name}
                    </Link>
                    <span aria-hidden className="text-white/25">
                      /
                    </span>
                  </>
                ) : (
                  <span aria-current="page" className="text-white/80">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div
          className={
            stage
              ? 'section-head mx-auto mt-10 flex max-w-4xl flex-col items-center text-center'
              : 'section-head mt-8 max-w-4xl'
          }
        >
          <p className="eyebrow">
            {/* The rule reads as a left anchor; centred, it just clutters. */}
            {!stage && <span className="rule-gold" aria-hidden />}
            {eyebrow}
          </p>
          <h1 className="display text-white">{title}</h1>
          {lede && (
            <p className={`lede max-w-2xl text-white/65 ${stage ? 'mx-auto' : ''}`}>{lede}</p>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
