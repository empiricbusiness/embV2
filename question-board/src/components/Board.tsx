'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getStore, isSharedBackend } from '@/lib/store'
import { rank, type Board as BoardT, type Question } from '@/lib/types'

type Mode = 'attendee' | 'moderator' | 'screen'
type Sort = 'top' | 'new'
type Filter = 'all' | 'open' | 'answered' | 'hidden'

const MAX = 400
const DRAFT_KEY = (code: string) => `ebm-qb-draft-${code}`
const ME_KEY = 'ebm-qb-me'

type Me = { name: string; company: string }

function loadMe(): Me {
  try {
    return { name: '', company: '', ...JSON.parse(localStorage.getItem(ME_KEY) || '{}') }
  } catch {
    return { name: '', company: '' }
  }
}

/** "2 min ago" — relative time is easier to scan than a timestamp mid-session. */
function ago(iso: string, now: number) {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000))
  if (s < 45) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  return h < 24 ? `${h} hr ago` : `${Math.round(h / 24)} d ago`
}

export default function Board({ code, mode }: { code: string; mode: Mode }) {
  const store = useMemo(() => getStore(), [])
  const [board, setBoard] = useState<BoardT | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [me, setMe] = useState<Me>({ name: '', company: '' })
  const [body, setBody] = useState('')
  const [consent, setConsent] = useState(false)
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [sort, setSort] = useState<Sort>('top')
  const [filter, setFilter] = useState<Filter>('all')
  // Rendered relative times need a clock, but reading it during render would
  // differ between server and client and break hydration. Set it on mount.
  const [now, setNow] = useState(0)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const refresh = useCallback(async () => {
    // If this threw, setLoading(false) never ran and the board sat on the
    // loading skeleton forever with nothing in the console — which is exactly
    // how the first Supabase deployment failed. Always land somewhere.
    try {
      const [b, qs] = await Promise.all([store.getBoard(code), store.listQuestions(code)])
      setBoard(b)
      setQuestions(qs)
      setLoadError('')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [store, code])

  useEffect(() => {
    setMe(loadMe())
    setNow(Date.now())
    try {
      setBody(localStorage.getItem(DRAFT_KEY(code)) || '')
    } catch {
      /* storage blocked — drafts simply are not kept */
    }
    void refresh()
    const stop = store.subscribe(code, () => void refresh())
    const tick = setInterval(() => setNow(Date.now()), 30_000)
    return () => {
      stop()
      clearInterval(tick)
    }
  }, [store, code, refresh])

  // Conference wifi drops. A half-typed question must survive a reload.
  useEffect(() => {
    try {
      if (body) localStorage.setItem(DRAFT_KEY(code), body)
      else localStorage.removeItem(DRAFT_KEY(code))
    } catch {
      /* ignore */
    }
  }, [body, code])

  const isMod = mode === 'moderator'
  // Used by the projector idle state as well as the attendee header, so it is
  // declared before the screen branch returns.
  const liveCount = questions.filter((q) => !q.hidden).length

  const visible = useMemo(() => {
    let list = questions.filter((q) => (isMod ? true : !q.hidden))
    if (isMod && filter !== 'all') {
      list = list.filter((q) =>
        filter === 'hidden' ? q.hidden : filter === 'answered' ? q.answered : !q.hidden && !q.answered,
      )
    }
    return [...list].sort(
      sort === 'top' ? rank : (a, b) => b.createdAt.localeCompare(a.createdAt),
    )
  }, [questions, isMod, filter, sort])

  /**
   * Optimistic vote: flip the row immediately, then persist.
   *
   * A tap that waits for a round trip before showing anything feels broken on
   * venue wifi. On failure we reload from the store, so the UI cannot drift.
   */
  async function vote(q: Question) {
    setQuestions((prev) =>
      prev.map((x) =>
        x.id === q.id
          ? { ...x, votedByMe: !x.votedByMe, votes: x.votes + (x.votedByMe ? -1 : 1) }
          : x,
      ),
    )
    try {
      await store.toggleVote(q.id)
    } finally {
      void refresh()
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const trimmed = body.trim()
    if (trimmed.length < 5) return setError('Please write a little more — at least 5 characters.')
    if (!me.name.trim() || !me.company.trim()) return setError('Name and company are required.')
    if (!consent) return setError('Please confirm you are happy for this to be shown publicly.')

    setSending(true)
    try {
      await store.submitQuestion({
        boardCode: code,
        body: trimmed,
        authorName: me.name.trim(),
        authorCompany: me.company.trim(),
      })
      try {
        localStorage.setItem(ME_KEY, JSON.stringify(me))
      } catch {
        /* ignore */
      }
      setBody('')
      setOpen(false)
      setSent(true)
      setTimeout(() => setSent(false), 4000)
      await refresh()
    } catch (err) {
      // Surfaces the rate-limit message from the database verbatim, which is
      // more useful than a generic failure.
      setError(err instanceof Error ? err.message : 'Could not send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  /* ----------------------------------------------------------- loading --- */
  if (loading) {
    return (
      <div className="wrap py-10">
        <div className="skeleton h-8 w-2/3" />
        <div className="skeleton mt-3 h-4 w-1/3" />
        <div className="mt-8 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-24 w-full" />
          ))}
        </div>
        <p className="sr-only" role="status">
          Loading the board
        </p>
      </div>
    )
  }

  // A connection failure is NOT the same as "no such board", and telling a
  // moderator the board does not exist when the database is unreachable sends
  // them hunting for the wrong problem.
  if (loadError) {
    return (
      <div className="wrap py-16">
        <h1 className="text-2xl font-extrabold">Could not reach the board</h1>
        <p className="mt-3 text-white/70">
          The database did not respond. This is usually configuration rather than anything you did.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl border border-white/15 bg-navy-950/70 p-4 text-left text-[0.82rem] text-gold-bright">
          {loadError}
        </pre>
        <button type="button" onClick={() => void refresh()} className="btn btn-gold mt-6">
          Try again
        </button>
      </div>
    )
  }

  if (!board) {
    return (
      <div className="wrap py-16 text-center">
        <p className="text-5xl" aria-hidden>
          🤔
        </p>
        <h1 className="mt-4 text-2xl font-extrabold">Board not found</h1>
        <p className="mx-auto mt-3 max-w-sm text-white/70">
          Nothing exists at the code <strong className="text-white">{code}</strong>. Check the code
          on the slide, or ask the session host.
        </p>
        <a href="/" className="btn btn-ghost mt-7">
          Enter a different code
        </a>
      </div>
    )
  }

  /* -------------------------------------------------- projector screen --- */
  if (mode === 'screen') {
    // SPOTLIGHT. If the moderator has promoted anything, the projector shows
    // ONLY those — during a live Q&A the room should be looking at the question
    // being discussed, not the whole backlog.
    //
    // This was previously "promoted OR not answered", which meant every
    // unanswered question was on screen anyway, so pressing "On screen" looked
    // like it did nothing. The label promised a spotlight; the behaviour was a
    // pin-through-answered. The label was right and the behaviour was wrong.
    //
    // With nothing promoted it falls back to the top unanswered questions, so
    // the screen still works when nobody is driving it.
    // STRICT SPOTLIGHT: the projector shows exactly what the moderator marked
    // On screen, and nothing else. No fallback.
    //
    // It used to fall back to "top unanswered" when nothing was promoted, which
    // sounds helpful and is not: un-marking the last question made it reappear
    // via the fallback, so the button looked broken in the one moment its
    // effect matters most. The host needs to be able to clear the screen, and
    // "show everything" is not clearing it.
    //
    // With nothing promoted the screen holds an idle card carrying the join
    // code — which is what a room between questions should be looking at.
    const onScreen = visible.filter((q) => q.promoted)
    return (
      <div className="flex min-h-dvh flex-col px-[4vw] py-[3.5vh]">
        <header className="flex items-end justify-between gap-6 border-b border-white/12 pb-[2.2vh]">
          <div>
            <p className="text-[clamp(0.7rem,1.1vw,1rem)] font-bold uppercase tracking-[0.2em] text-gold">
              Live questions
            </p>
            <h1 className="mt-1 text-[clamp(1.6rem,3.4vw,3.2rem)] font-extrabold leading-none tracking-tight">
              {board.title}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[clamp(0.85rem,1.5vw,1.5rem)] font-bold text-white">
              Join at <span className="text-gold">/{board.code}</span>
            </p>
            <p className="mt-1 text-[clamp(0.7rem,1.05vw,1rem)] text-white/55">
              {questions.filter((q) => !q.hidden).length} questions from the room
            </p>
          </div>
        </header>

        {/* ONE question gets the hero treatment. A single row in a list layout
            left it stranded in the middle of a 2-metre screen with nothing
            around it, which is what a spotlight must never look like. Centred,
            framed, and set on a readable measure instead of stretched across
            the full width. */}
        {onScreen.length === 1 && (
          <div className="flex flex-1 items-center justify-center py-[2vh]">
            {/* The measure has to sit on the blockquote, not here: a `ch` limit
                on this wrapper is resolved against the ROOT font size, so at
                display size it wrapped a four-word question onto four lines. */}
            <figure className="w-full max-w-[86vw] text-center">
              <span className="inline-flex flex-col items-center rounded-[1vw] bg-gold px-[2vw] py-[1.2vh] text-[#1a1200] tabular-nums">
                <span className="text-[clamp(1.6rem,4vw,4rem)] font-extrabold leading-none">
                  {onScreen[0].votes}
                </span>
                <span className="mt-[0.4vh] text-[clamp(0.55rem,0.85vw,0.95rem)] font-bold uppercase tracking-[0.16em] opacity-80">
                  votes
                </span>
              </span>
              <blockquote className="mx-auto mt-[3vh] max-w-[20ch] text-[clamp(1.6rem,4.4vw,4.4rem)] font-extrabold leading-[1.12] tracking-tight text-balance">
                {onScreen[0].body}
              </blockquote>
              <figcaption className="mt-[2.2vh] text-[clamp(0.9rem,1.6vw,1.6rem)] text-white/60">
                {onScreen[0].authorName} · {onScreen[0].authorCompany}
              </figcaption>
            </figure>
          </div>
        )}

        {/* Two or more: a list, but the type scales UP as the count drops so a
            short list still fills the screen instead of floating in it. */}
        {onScreen.length > 1 && (
          <ol className="mt-[2vh] flex flex-1 flex-col justify-evenly gap-[1.2vh]">
            {onScreen.map((q, i) => {
              const big = onScreen.length <= 3
              return (
                <li key={q.id} className="flex items-start gap-[1.8vw]">
                  <span
                    className={`flex shrink-0 flex-col items-center rounded-[0.6vw] px-[1vw] py-[0.8vh] tabular-nums ${
                      i === 0 ? 'bg-gold text-[#1a1200]' : 'bg-white/10 text-gold'
                    }`}
                  >
                    <span
                      className={`font-extrabold leading-none ${
                        big ? 'text-[clamp(1.4rem,3.2vw,3rem)]' : 'text-[clamp(1.1rem,2.3vw,2.2rem)]'
                      }`}
                    >
                      {q.votes}
                    </span>
                    <span className="mt-[0.3vh] text-[clamp(0.5rem,0.72vw,0.75rem)] font-bold uppercase tracking-[0.12em] opacity-75">
                      votes
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-semibold leading-[1.2] text-balance ${
                        big
                          ? 'text-[clamp(1.3rem,3vw,3rem)]'
                          : 'text-[clamp(1.05rem,2.05vw,1.95rem)]'
                      }`}
                    >
                      {q.body}
                    </p>
                    <p
                      className={`mt-[0.7vh] text-white/55 ${
                        big
                          ? 'text-[clamp(0.85rem,1.4vw,1.4rem)]'
                          : 'text-[clamp(0.75rem,1.15vw,1.1rem)]'
                      }`}
                    >
                      {q.authorName} · {q.authorCompany}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        )}

        {/* Idle. Two different situations, and a room reads them differently:
            nothing has been asked yet, versus the host has cleared the screen
            between questions. Say which. */}
        {onScreen.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-[clamp(1.4rem,3.4vw,3.4rem)] font-extrabold text-white/85">
              {liveCount === 0 ? 'No questions yet' : 'Over to the panel'}
            </p>
            <p className="mt-[2vh] text-[clamp(1rem,2vw,2rem)] text-white/55">
              {liveCount === 0 ? 'Be the first — join at ' : 'Add yours — join at '}
              <span className="font-bold text-gold">/{board.code}</span>
            </p>
            {liveCount > 0 && (
              <p className="mt-[1.5vh] text-[clamp(0.85rem,1.5vw,1.5rem)] text-white/40">
                {liveCount} question{liveCount === 1 ? '' : 's'} from the room so far
              </p>
            )}
          </div>
        )}
      </div>
    )
  }

  /* ------------------------------------------- attendee and moderator --- */

  return (
    <div className="pb-20">
      <header className="appbar">
        <div className="wrap flex items-center justify-between gap-4 py-3.5">
          <div className="min-w-0">
            <p className="truncate text-[0.68rem] font-bold uppercase tracking-[0.16em] text-gold">
              {isMod ? 'Moderator' : 'Empiric Business Media'}
            </p>
            <h1 className="truncate text-[1.05rem] font-bold leading-tight">{board.title}</h1>
          </div>
          <p className="flex shrink-0 items-center gap-2 text-[0.82rem] text-white/70">
            <span className="live-dot" aria-hidden />
            <span className="tabular-nums">{liveCount}</span>
          </p>
        </div>
      </header>

      <div className="wrap pt-6">
        {!isSharedBackend() && (
          <p className="mb-5 rounded-xl border border-gold/35 bg-gold/[0.08] px-4 py-3 text-[0.86rem] leading-relaxed text-white/85">
            <strong className="font-bold text-gold">Demo mode.</strong> No database is connected
            yet, so questions live in this browser only — another phone will not see them. The full
            flow works across tabs on this device.
          </p>
        )}

        {board.eventName && <p className="mb-5 text-[0.92rem] text-white/60">{board.eventName}</p>}

        {!board.open && (
          <p className="mb-5 rounded-xl border border-white/15 px-4 py-3 text-[0.9rem] text-white/75">
            This board is closed. You can still read and upvote, but new questions are off.
          </p>
        )}

        {/* Composer. Collapsed to a single tap target by default: on a phone a
            full form pushes every question below the fold, and most people
            arrive to read before they ask. */}
        {!isMod && board.open && (
          <div className="mb-7">
            {sent && (
              <p className="toast mb-3 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-2.5 text-[0.88rem] font-medium text-green-200">
                Sent — your question is on the board.
              </p>
            )}

            {!open ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(true)
                  setTimeout(() => bodyRef.current?.focus(), 60)
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-white/12 bg-navy-900/60 px-4 py-3.5 text-left text-white/55 transition-colors hover:border-gold/50 hover:text-white/75"
              >
                <span
                  aria-hidden
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-gold text-[1.1rem] font-bold text-[#1a1200]"
                >
                  +
                </span>
                Ask a question…
              </button>
            ) : (
              <form onSubmit={submit} className="card">
                <label className="label" htmlFor="q-body">
                  Your question
                </label>
                <textarea
                  id="q-body"
                  ref={bodyRef}
                  className="field"
                  rows={3}
                  maxLength={MAX}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="What would you like the panel to address?"
                  required
                />
                <p
                  className={`mt-1 text-right text-[0.75rem] tabular-nums ${
                    body.length > MAX - 40 ? 'text-gold' : 'text-white/45'
                  }`}
                >
                  {body.length}/{MAX}
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="q-name">
                      Your name
                    </label>
                    <input
                      id="q-name"
                      className="field"
                      value={me.name}
                      onChange={(e) => setMe({ ...me, name: e.target.value })}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="q-company">
                      Company
                    </label>
                    <input
                      id="q-company"
                      className="field"
                      value={me.company}
                      onChange={(e) => setMe({ ...me, company: e.target.value })}
                      autoComplete="organization"
                      required
                    />
                  </div>
                </div>

                {/* Explicit consent: name + company shown publicly is personal
                    data under the DPDP Act. Unticked by default, and it says
                    exactly where the information appears. */}
                <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[0.85rem] leading-relaxed text-white/72">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-[1.05rem] shrink-0 accent-[#f5b614]"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>
                    Show my question, name and company on the public board and the room screen.
                  </span>
                </label>

                {error && (
                  <p role="alert" className="mt-3 text-[0.88rem] font-medium text-gold-bright">
                    {error}
                  </p>
                )}

                <div className="mt-4 flex gap-2.5">
                  <button
                    type="button"
                    className="btn btn-ghost flex-1"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gold flex-[2]" disabled={sending}>
                    {sending ? 'Sending…' : 'Post question'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[0.95rem] font-bold text-white/85">
            {visible.length} question{visible.length === 1 ? '' : 's'}
          </h2>
          <div className="seg" role="group" aria-label="Sort questions">
            <button type="button" aria-pressed={sort === 'top'} onClick={() => setSort('top')}>
              Top
            </button>
            <button type="button" aria-pressed={sort === 'new'} onClick={() => setSort('new')}>
              Newest
            </button>
          </div>
        </div>

        {/* Say what the projector is doing right now. Without this the
            moderator has to guess whether a press took effect, which is exactly
            how the spotlight behaviour got reported as broken. */}
        {isMod && (
          <p className="mb-3 text-[0.82rem] leading-relaxed text-white/55">
            {questions.some((q) => q.promoted && !q.hidden)
              ? 'Projector is showing only the questions marked On screen.'
              : 'Projector is showing the top unanswered questions. Mark one On screen to show just that one.'}
          </p>
        )}

        {isMod && (
          <div className="seg mb-4 flex-wrap" role="group" aria-label="Filter questions">
            {(['all', 'open', 'answered', 'hidden'] as Filter[]).map((f) => (
              <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'open' ? 'Open' : f === 'answered' ? 'Answered' : 'Hidden'}
              </button>
            ))}
          </div>
        )}

        {/* List */}
        <ul className="space-y-2.5">
          {visible.map((q) => (
            <li key={q.id}>
              <article className="q-row" data-hidden={q.hidden}>
                <button
                  type="button"
                  className="vote"
                  aria-pressed={q.votedByMe}
                  aria-label={`${q.votedByMe ? 'Remove your upvote from' : 'Upvote'}: ${q.body}`}
                  onClick={() => void vote(q)}
                >
                  <span aria-hidden className="vote-caret">
                    ▲
                  </span>
                  <span className="vote-count">{q.votes}</span>
                </button>

                <div className="min-w-0 flex-1">
                  <p className="leading-snug">{q.body}</p>

                  {/* Each separator travels with the value that follows it, so a
                      wrap never strands a "·" at the end of a line. */}
                  <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.8rem] text-white/55">
                    <span className="font-medium text-white/70">{q.authorName}</span>
                    <span className="whitespace-nowrap">
                      <span aria-hidden className="mr-1.5">
                        ·
                      </span>
                      {q.authorCompany}
                    </span>
                    {now > 0 && (
                      <span className="whitespace-nowrap">
                        <span aria-hidden className="mr-1.5">
                          ·
                        </span>
                        <time dateTime={q.createdAt}>{ago(q.createdAt, now)}</time>
                      </span>
                    )}
                  </p>

                  {/* State pills are for the ATTENDEE view only. On the moderator
                      view the toggle buttons below already carry the same state
                      (gold + aria-pressed), so pills would say it twice. */}
                  {!isMod && (q.answered || q.promoted || q.hidden) && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {q.promoted && <span className="pill bg-gold text-[#1a1200]">On screen</span>}
                      {q.answered && <span className="pill bg-white/15 text-white/85">Answered</span>}
                      {q.hidden && <span className="pill bg-white/10 text-white/65">Hidden</span>}
                    </div>
                  )}

                  {isMod && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        className="mod-btn"
                        aria-pressed={q.hidden}
                        onClick={() => void store.setFlags(q.id, { hidden: !q.hidden }).then(refresh)}
                      >
                        {q.hidden ? 'Unhide' : 'Hide'}
                      </button>
                      <button
                        type="button"
                        className="mod-btn"
                        aria-pressed={q.answered}
                        onClick={() => void store.setFlags(q.id, { answered: !q.answered }).then(refresh)}
                      >
                        Answered
                      </button>
                      <button
                        type="button"
                        className="mod-btn"
                        aria-pressed={q.promoted}
                        onClick={() => void store.setFlags(q.id, { promoted: !q.promoted }).then(refresh)}
                      >
                        On screen
                      </button>
                    </div>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>

        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
            <p className="text-[1.05rem] font-semibold text-white/80">
              {isMod && filter !== 'all' ? 'Nothing in this filter' : 'No questions yet'}
            </p>
            <p className="mx-auto mt-2 max-w-xs text-[0.9rem] text-white/55">
              {isMod
                ? 'They will appear here the moment someone posts.'
                : 'Be the first to ask — the room votes on what gets answered.'}
            </p>
          </div>
        )}

        {isMod && (
          <footer className="mt-10 border-t border-white/10 pt-4 text-[0.8rem] leading-relaxed text-white/50">
            Backend: {store.name} · board code{' '}
            <strong className="text-white/75">{board.code}</strong> · screen view at{' '}
            <code className="text-white/75">/ask/{board.code}/screen</code>
          </footer>
        )}
      </div>
    </div>
  )
}
