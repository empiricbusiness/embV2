'use client'

import { useEffect, useState } from 'react'
import { SITE } from '@/data/site'
import { FORM_ENDPOINT } from '@/lib/forms'

/**
 * Static export means there is no server action available, so the form posts to
 * the Google Sheet endpoint in lib/forms, landing in its "Contact" tab. If that
 * URL is ever blanked, the form falls back to opening the user's mail client
 * with the content pre-filled, so no enquiry is silently lost.
 *
 * The old site's forms had no <label> associations at all — every field here is
 * properly labelled and describes its own errors.
 */
const ENDPOINT = FORM_ENDPOINT

const INTENTS = [
  { value: 'attend', label: 'Attend an event' },
  { value: 'sponsor', label: 'Sponsor or exhibit' },
  { value: 'speak', label: 'Speak at an event' },
  { value: 'bespoke', label: 'Commission a bespoke event' },
  { value: 'register', label: 'Register interest' },
  { value: 'other', label: 'Something else' },
]

export default function ContactForm({ defaultIntent = 'attend' }: { defaultIntent?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [intent, setIntent] = useState(defaultIntent)
  // Which edition / package the visitor came from. Carried through so the
  // enquiry that lands in the inbox says WHAT it is about — previously every
  // CTA passed only ?intent=register, so a sponsor who had just clicked
  // "Authority" on a specific summit arrived at a blank generic form and had
  // to retype what they had already told us.
  const [ctx, setCtx] = useState<{ event?: string; package?: string; source?: string }>({})

  // Pages across the site link to
  // /contact/?intent=sponsor&event=<slug>&package=<tier>.
  // Static export cannot read searchParams on the server, and useSearchParams
  // would force this whole route to a Suspense boundary, so read it on mount.
  // Falls back to defaultIntent when absent or unrecognised.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const i = q.get('intent')
    if (i && INTENTS.some((x) => x.value === i)) setIntent(i)
    setCtx({
      event: q.get('event') ?? undefined,
      package: q.get('package') ?? undefined,
      // Referrer is only a hint, and is blank on a direct visit — it is
      // recorded for routing, never shown to the visitor as fact.
      source: typeof document !== 'undefined' && document.referrer ? document.referrer : undefined,
    })
  }, [])

  /**
   * Turn an event slug back into something a human can read.
   *
   * Acronyms are listed explicitly because a length rule cannot tell "ai" (an
   * acronym) from "and" (a word) — capitalising by length alone rendered the
   * CISO summit as "Enterprise ai Security".
   */
  const ACRONYMS = new Set(['ai', 'ciso', 'cio', 'cfo', 'cx', 'hr', 'bfsi', 'nbfc', 'l', 'd', 'osc', 'itsm'])
  const MINOR = new Set(['and', 'of', 'the', 'for', 'in', 'on', 'to', 'a'])
  const pretty = (slug: string) =>
    slug
      .split('-')
      .map((w, i) => {
        if (ACRONYMS.has(w)) return w.toUpperCase()
        if (i > 0 && MINOR.has(w)) return w
        return w.charAt(0).toUpperCase() + w.slice(1)
      })
      .join(' ')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    if (!ENDPOINT) {
      // Mailto fallback — nothing is lost while the endpoint is unconfigured.
      const body = [...data.entries()]
        .filter(([k]) => k !== 'company_website')
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n')
      window.location.href = `mailto:${SITE.emails.general}?subject=${encodeURIComponent(
        `Website enquiry — ${data.get('intent')}`,
      )}&body=${encodeURIComponent(body)}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      // The script answers 200 even when it fails, with { ok: false } in the body.
      const body = await res.json().catch(() => null)
      const ok = res.ok && body?.ok !== false
      setStatus(ok ? 'sent' : 'error')
      if (ok) form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="card text-center">
        <p className="text-[1.15rem] font-bold text-gold">Thank you — message received.</p>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-white/65">
          A member of the EBM team will get back to you. For anything urgent, call{' '}
          <a href={SITE.phones[0].href} className="font-semibold text-white underline">
            {SITE.phones[0].value}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card" noValidate={false}>
      {/* Honeypot — invisible to people, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="company_website">Do not fill this in</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="form" value="Contact" />

      {/* Context carried from the page the visitor came from. Submitted with
          the enquiry so it can be routed and answered without asking them to
          repeat themselves. Hidden rather than editable: it is provenance, not
          user input. */}
      {ctx.event && <input type="hidden" name="event" value={ctx.event} />}
      {ctx.package && <input type="hidden" name="package" value={ctx.package} />}
      {ctx.source && <input type="hidden" name="source" value={ctx.source} />}

      {/* ...but a visitor should still SEE that we know why they are here,
          otherwise the form looks like it lost their click. */}
      {(ctx.event || ctx.package) && (
        <p className="mb-6 rounded-lg border border-gold/30 bg-gold/[0.07] px-4 py-3 text-[0.9rem] leading-relaxed text-white/80">
          About{' '}
          {ctx.event && <strong className="font-semibold text-white">{pretty(ctx.event)}</strong>}
          {ctx.event && ctx.package && ' · '}
          {ctx.package && (
            <>
              <strong className="font-semibold text-white">{pretty(ctx.package)}</strong> package
            </>
          )}
          . We have this with your enquiry — no need to repeat it.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" required autoComplete="name" />
        <Field id="email" label="Work email" type="email" required autoComplete="email" />
        <Field id="company" label="Company" required autoComplete="organization" />
        <Field id="jobTitle" label="Job title" autoComplete="organization-title" />
        <Field id="phone" label="Phone" type="tel" autoComplete="tel" />

        <div>
          <label htmlFor="intent" className="block text-[0.88rem] font-semibold text-white">
            I&apos;d like to
          </label>
          <select
            id="intent"
            name="intent"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-white/20 bg-navy-950 px-3.5 py-2.5 text-[0.95rem] text-white"
          >
            {INTENTS.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="block text-[0.88rem] font-semibold text-white">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-describedby="message-hint"
          className="mt-2 w-full rounded-lg border border-white/20 bg-navy-950 px-3.5 py-2.5 text-[0.95rem] text-white placeholder:text-white/70"
          placeholder="Tell us who you need to reach, or which edition you're interested in."
        />
        <p id="message-hint" className="mt-2 text-[0.8rem] text-white/65">
          The more specific you are about your audience, the more useful our reply.
        </p>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-gold)]"
        />
        <label htmlFor="consent" className="text-[0.85rem] leading-relaxed text-white/60">
          I consent to Empiric Business Media storing these details and contacting me about this
          enquiry, in line with the{' '}
          <a href="/privacy-policy/" className="text-gold underline underline-offset-2">
            privacy policy
          </a>
          .
        </label>
      </div>

      {status === 'error' && (
        <p role="alert" className="mt-5 rounded-lg border border-red-400/40 bg-red-500/10 p-3.5 text-[0.9rem] text-red-200">
          Something went wrong sending that. Please email{' '}
          <a href={`mailto:${SITE.emails.general}`} className="underline">
            {SITE.emails.general}
          </a>{' '}
          instead.
        </p>
      )}

      <button type="submit" disabled={status === 'sending'} className="btn btn-gold mt-7 w-full sm:w-auto">
        {status === 'sending' ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  )
}

function Field({
  id,
  label,
  type = 'text',
  required = false,
  autoComplete,
}: {
  id: string
  label: string
  type?: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.88rem] font-semibold text-white">
        {label}
        {required && (
          <span className="ml-1 text-gold" aria-hidden>
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 min-h-11 w-full rounded-lg border border-white/20 bg-navy-950 px-3.5 py-2.5 text-[0.95rem] text-white"
      />
    </div>
  )
}
