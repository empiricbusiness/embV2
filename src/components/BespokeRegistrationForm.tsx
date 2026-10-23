'use client'

import { useEffect, useRef, useState } from 'react'
import { track } from '@/lib/analytics'
import {
  REGISTRATION_FIELDS,
  buildRegistrationBody,
  isRecorded,
  validateRegistration,
  type RegistrationField,
  type RegistrationValues,
} from '@/lib/registration'

/**
 * Delegate registration for a bespoke client event, posting straight from the
 * browser into the CLIENT's Google Sheet through their Apps Script (the site is
 * a static export, so there is no server of ours in between).
 *
 * Success is shown only when the script confirms it wrote the row — it answers
 * HTTP 200 even on failure — and only then is the registration counted in GA.
 * Nothing the visitor types is logged, put in a URL or sent to analytics.
 */

/** Bots fill forms in milliseconds; a person cannot in under this. */
const MIN_FILL_MS = 2500
const TIMEOUT_MS = 20000

const LABELS: Record<RegistrationField, { label: string; autoComplete: string; type?: string; inputMode?: 'email' | 'tel' }> = {
  firstName: { label: 'First name', autoComplete: 'given-name' },
  lastName: { label: 'Last name', autoComplete: 'family-name' },
  company: { label: 'Company', autoComplete: 'organization' },
  designation: { label: 'Designation', autoComplete: 'organization-title' },
  email: { label: 'Email address', autoComplete: 'email', type: 'email', inputMode: 'email' },
  number: { label: 'Phone number', autoComplete: 'tel', type: 'tel', inputMode: 'tel' },
  city: { label: 'City', autoComplete: 'address-level2' },
  country: { label: 'Country', autoComplete: 'country-name' },
}

const ORDER: RegistrationField[] = ['firstName', 'lastName', 'company', 'designation', 'email', 'number', 'city', 'country']

export default function BespokeRegistrationForm({
  slug,
  eventName,
  endpoint,
  targetSheet,
  contact,
  privacyNoticeId,
}: {
  slug: string
  eventName: string
  endpoint: string
  targetSheet: string
  contact: { name: string; phone: string; tel: string }
  privacyNoticeId: string
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<Record<RegistrationField, string>>>({})
  const [consentError, setConsentError] = useState(false)
  const [firstName, setFirstName] = useState('')
  const loadedAt = useRef(0)
  const started = useRef(false)
  const inFlight = useRef(false)
  const doneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadedAt.current = Date.now()
  }, [])

  useEffect(() => {
    if (status === 'sent') doneRef.current?.focus()
  }, [status])

  function onFirstFocus() {
    if (started.current) return
    started.current = true
    track('bespoke_form_start', { bespoke_event: slug })
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // One request at a time: repeated clicks or Enter presses cannot send twice.
    if (inFlight.current) return
    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot or impossibly fast: a bot. Show it the same "done" a person
    // sees, and send nothing.
    if (data.get('company_website') || Date.now() - loadedAt.current < MIN_FILL_MS) {
      setStatus('sent')
      return
    }

    const values = Object.fromEntries(
      REGISTRATION_FIELDS.map((f) => [f, String(data.get(f) ?? '')]),
    ) as RegistrationValues
    const nextErrors = validateRegistration(values)
    const consented = data.get('consent') === 'yes'
    setErrors(nextErrors)
    setConsentError(!consented)
    const firstBad = ORDER.find((f) => nextErrors[f])
    if (firstBad) {
      form.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus()
      return
    }
    if (!consented) {
      form.querySelector<HTMLElement>('[name="consent"]')?.focus()
      return
    }

    inFlight.current = true
    setStatus('sending')
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: buildRegistrationBody(values, targetSheet),
        signal: controller.signal,
      })
      const answer = await res.json().catch(() => null)
      if (res.ok && isRecorded(answer)) {
        setFirstName(values.firstName.trim())
        setStatus('sent')
        track('bespoke_registration', { bespoke_event: slug })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      clearTimeout(timer)
      inFlight.current = false
    }
  }

  if (status === 'sent') {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="card card-lg text-center outline-none">
        <p className="text-[1.25rem] font-bold text-gold">
          {firstName ? `Thank you, ${firstName}.` : 'Thank you.'} Your registration is in.
        </p>
        <p className="mx-auto mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-white/75">
          We have your details for {eventName} and will contact you about your registration. For event
          enquiries, call {contact.name} on{' '}
          <a href={contact.tel} className="font-semibold text-white underline underline-offset-2">
            {contact.phone}
          </a>
          .
        </p>
      </div>
    )
  }

  const sending = status === 'sending'

  return (
    <form onSubmit={onSubmit} onFocus={onFirstFocus} noValidate className="card card-lg relative" aria-busy={sending}>
      {/* Honeypot — off-screen for people, tempting to bots. Never sent. */}
      <div aria-hidden className="absolute left-[-9999px] top-0">
        <label htmlFor="company_website">Leave this empty</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="text-[0.85rem] text-white/65">All fields are required.</p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {ORDER.map((field) => {
          const f = LABELS[field]
          const error = errors[field]
          return (
            <div key={field}>
              <label htmlFor={`reg-${field}`} className="block text-[0.88rem] font-semibold text-white">
                {f.label}
              </label>
              <input
                id={`reg-${field}`}
                name={field}
                type={f.type ?? 'text'}
                inputMode={f.inputMode}
                autoComplete={f.autoComplete}
                defaultValue={field === 'country' ? 'India' : undefined}
                maxLength={field === 'email' ? 120 : 100}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `reg-${field}-error` : undefined}
                disabled={sending}
                className={`mt-2 min-h-11 w-full rounded-lg border bg-navy-950 px-3.5 py-2.5 text-[0.95rem] text-white placeholder:text-white/55 disabled:opacity-60 ${
                  error ? 'border-red-400/70' : 'border-white/20'
                }`}
              />
              {error && (
                <p id={`reg-${field}-error`} className="mt-2 text-[0.82rem] text-red-200">
                  {error}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-start gap-3">
        <input
          id="reg-consent"
          name="consent"
          type="checkbox"
          value="yes"
          disabled={sending}
          aria-invalid={consentError ? true : undefined}
          aria-describedby={consentError ? 'reg-consent-error' : undefined}
          className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-gold)]"
        />
        <div>
          <label htmlFor="reg-consent" className="text-[0.88rem] leading-relaxed text-white/75">
            I agree that Empiric Business Media may use these details to register me for {eventName} and
            contact me about this event, as described in the{' '}
            <a href={`#${privacyNoticeId}`} className="text-gold underline underline-offset-2">
              privacy notice
            </a>
            .
          </label>
          {consentError && (
            <p id="reg-consent-error" className="mt-2 text-[0.82rem] text-red-200">
              Please tick the box to agree before registering.
            </p>
          )}
        </div>
      </div>

      {status === 'error' && (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-red-400/40 bg-red-500/10 p-3.5 text-[0.9rem] leading-relaxed text-red-100"
        >
          Your registration did not go through. Please try again in a moment, or call {contact.name} on{' '}
          <a href={contact.tel} className="font-semibold underline">
            {contact.phone}
          </a>
          .
        </p>
      )}

      <button type="submit" disabled={sending} className="btn btn-gold mt-7 w-full disabled:opacity-70 sm:w-auto">
        {sending ? 'Registering…' : 'Register now'}
      </button>
    </form>
  )
}
