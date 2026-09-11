import { SITE } from '@/data/site'
import PageHero from './PageHero'

export type LegalSection = { h: string; p: string[] }

/**
 * Shared shell for the three policy pages.
 *
 * The old estate had NO privacy policy, NO terms and NO refund policy — none of
 * the URLs existed. For a company selling paid delegate passes online in India
 * that is both a trust gap and a compliance one (DPDP Act 2023, and payment
 * gateways require a published refund policy).
 *
 * These are working drafts written from what the site actually does. They are
 * marked for legal review, not passed off as reviewed.
 */
export default function LegalPage({
  eyebrow,
  title,
  path,
  updated,
  intro,
  sections,
}: {
  eyebrow: string
  title: string
  path: string
  updated: string
  intro: string
  sections: LegalSection[]
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} trail={[{ name: eyebrow, path }]} />

      <section className="section">
        <div className="wrap max-w-[72ch]">
          <div className="rounded-xl border border-gold/30 bg-gold/[0.07] p-5">
            <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-gold">
              Draft — pending legal review
            </p>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-white/70">
              This policy was drafted from how the site and business actually operate. It must be
              reviewed and approved by {SITE.short}&apos;s legal advisor before launch.
            </p>
          </div>

          {/* Flat .prose list — no wrapper divs, so the rhythm rules apply
              between every sibling rather than resetting per section. */}
          <div className="prose section-body">
            <p className="text-[0.88rem] text-white/65">Last updated: {updated}</p>
            <p className="lede text-white/75">{intro}</p>

            {sections.flatMap((s) => [
              <h2 key={s.h} className="text-[1.3rem] font-bold text-white">
                {s.h}
              </h2>,
              // A `TODO(client)` line is an instruction to the client, not policy
              // text, and it is never rendered — not in production and not in
              // `next dev`. It stays in the source as the record of what is
              // still outstanding, and verify.mjs still fails the build if one
              // ever reaches the exported HTML.
              ...s.p
                .filter((para) => !para.startsWith('TODO(client)'))
                .map((para) => (
                  <p key={para} className="text-[1rem] leading-[1.75] text-white/70">
                    {para}
                  </p>
                )),
            ])}

            <h2 className="text-[1.3rem] font-bold text-white">Contact</h2>
            <p className="text-[1rem] leading-[1.75] text-white/70">
              Questions about this policy can be sent to{' '}
              <a
                href={`mailto:${SITE.emails.general}`}
                className="text-gold underline underline-offset-4"
              >
                {SITE.emails.general}
              </a>{' '}
              or posted to {SITE.legalName}, {SITE.address.street}, {SITE.address.locality},{' '}
              {SITE.address.region} {SITE.address.postalCode}, {SITE.address.countryName}.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
