'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStore } from '@/lib/store'

/**
 * Two jobs, both urgent when they happen: let an attendee type a code because
 * the QR failed, and let a host spin up a board minutes before a session.
 * Joining is the common case, so it leads and creating is tucked behind a
 * disclosure.
 */
export default function Home() {
  const router = useRouter()
  const [join, setJoin] = useState('')
  const [code, setCode] = useState('')
  const [title, setTitle] = useState('')
  const [eventName, setEventName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [origin, setOrigin] = useState('')

  useEffect(() => setOrigin(window.location.origin), [])

  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 24)

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const c = clean(code)
    // Mirrors the CHECK constraint in schema.sql — fail here with a readable
    // message rather than letting the database reject it.
    if (c.length < 3) return setError('Code needs at least 3 characters (letters, numbers, hyphens).')
    if (!title.trim()) return setError('Give the board a title — attendees see it at the top.')

    setBusy(true)
    try {
      const store = getStore()
      if (await store.getBoard(c)) {
        setBusy(false)
        return setError(`The code "${c}" is already in use.`)
      }
      await store.createBoard({ code: c, title: title.trim(), eventName: eventName.trim() })
      router.push(`/ask/${c}/moderator`)
    } catch (err) {
      setBusy(false)
      // "Please try again" told nobody anything and hid the actual cause for
      // an entire debugging session. Show what the database said.
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <main className="wrap flex min-h-dvh flex-col justify-center py-12">
      <div className="mb-9">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-gold">
          Empiric Business Media
        </p>
        <h1 className="mt-2 text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-[2.4rem]">
          Live Question Board
        </h1>
        <p className="mt-3 max-w-md text-white/65">
          Ask during the session, upvote what you want answered, and the host sees what the room
          actually wants to discuss.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const c = clean(join)
          if (c) router.push(`/ask/${c}`)
        }}
        className="card"
      >
        <label className="label" htmlFor="join">
          Enter the code from the screen
        </label>
        <div className="flex gap-2.5">
          <input
            id="join"
            className="field font-semibold tracking-wide"
            value={join}
            onChange={(e) => setJoin(e.target.value)}
            placeholder="e.g. mfg8"
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
          <button className="btn btn-gold shrink-0" type="submit" disabled={!clean(join)}>
            Join
          </button>
        </div>
      </form>

      <details className="group mt-8">
        <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-[0.92rem] font-semibold text-white/70 transition-colors hover:text-gold">
          <span
            aria-hidden
            className="transition-transform duration-200 group-open:rotate-90"
          >
            ›
          </span>
          Running a session? Create a board
        </summary>

        <form onSubmit={create} className="card mt-4">
          <label className="label" htmlFor="code">
            Board code
          </label>
          <input
            id="code"
            className="field"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="mfg8"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
          {/* The code goes on a slide and gets typed by hand when the QR fails,
              so short and unambiguous beats descriptive. */}
          <p className="mt-1.5 text-[0.78rem] text-white/50">
            Short and easy to read aloud. Letters, numbers and hyphens.
          </p>

          <label className="label mt-4" htmlFor="title">
            Board title
          </label>
          <input
            id="title"
            className="field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ask the panel"
          />

          <label className="label mt-4" htmlFor="event">
            Event or session <span className="font-normal text-white/45">(optional)</span>
          </label>
          <input
            id="event"
            className="field"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Manufacturing 5.0 — 8th Edition"
          />

          {error && (
            <p role="alert" className="mt-3 text-[0.88rem] font-medium text-gold-bright">
              {error}
            </p>
          )}

          <button className="btn btn-gold mt-5 w-full" type="submit" disabled={busy}>
            {busy ? 'Creating…' : 'Create board'}
          </button>

          {origin && clean(code).length >= 3 && (
            <div className="mt-4 rounded-xl border border-white/12 bg-navy-950/50 px-3.5 py-3 text-[0.8rem] leading-relaxed text-white/60">
              <p>
                Attendees:{' '}
                <strong className="text-white/85">
                  {origin}/ask/{clean(code)}
                </strong>
              </p>
              <p className="mt-1">
                Room screen:{' '}
                <strong className="text-white/85">
                  {origin}/ask/{clean(code)}/screen
                </strong>
              </p>
            </div>
          )}
        </form>
      </details>
    </main>
  )
}
