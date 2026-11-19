'use client'

import { useEffect, useMemo, useState } from 'react'
import { getStore } from '@/lib/store'
import { canModerate, MODERATOR_DOMAIN, type Moderator } from '@/lib/types'

/**
 * Shows its children only to a signed-in moderator.
 *
 * The database is what actually enforces this (is_moderator() in
 * supabase/schema.sql): a signed-out or outside account is refused there too.
 * This gate makes the rule visible and gives the host a way to sign in.
 *
 * Accounts are created by an admin in the Supabase dashboard; there is no
 * sign-up here. In demo mode (no database) it lets everything through.
 */
export default function ModeratorGate({
  children,
  purpose,
  page = false,
}: {
  children: React.ReactNode
  /** Finishes "Sign in to …", e.g. "moderate this board". */
  purpose: string
  /** Full-page layout (the moderator route) rather than an inline card. */
  page?: boolean
}) {
  const store = useMemo(() => getStore(), [])
  const [me, setMe] = useState<Moderator | null>(null)
  const [checking, setChecking] = useState(store.needsSignIn)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!store.needsSignIn) return
    let live = true
    store
      .getModerator()
      .then((m) => live && setMe(m))
      .finally(() => live && setChecking(false))
    const off = store.onModeratorChange((m) => live && setMe(m))
    return () => {
      live = false
      off()
    }
  }, [store])

  if (!store.needsSignIn) return <>{children}</>

  const shell = (inner: React.ReactNode) =>
    page ? (
      <main className="wrap flex min-h-dvh flex-col justify-center py-12">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-gold">
          EBM Live Question Board
        </p>
        <div className="mt-4">{inner}</div>
      </main>
    ) : (
      inner
    )

  if (checking) {
    return shell(<p className="text-[0.9rem] text-white/60">Checking sign-in…</p>)
  }

  if (me && canModerate(me)) {
    return (
      <>
        <div
          className={`flex flex-wrap items-center justify-between gap-2 text-[0.78rem] text-white/60 ${
            page ? 'wrap pt-3' : 'mb-3'
          }`}
        >
          <span>
            Signed in as <strong className="font-semibold text-white/85">{me.email}</strong>
          </span>
          <button
            type="button"
            className="font-semibold text-gold underline-offset-4 hover:underline"
            onClick={() => void store.signOut()}
          >
            Sign out
          </button>
        </div>
        {children}
      </>
    )
  }

  if (me) {
    return shell(
      <div className="card">
        <p className="font-semibold text-white">This account cannot moderate.</p>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-white/65">
          Signed in as {me.email}. Only {MODERATOR_DOMAIN} accounts can {purpose}.
        </p>
        <button type="button" className="btn btn-gold mt-4" onClick={() => void store.signOut()}>
          Sign out
        </button>
      </div>,
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) return setError('Enter your email and password.')
    setBusy(true)
    try {
      const m = await store.signIn(email, password)
      setMe(m)
      setPassword('')
    } catch (err) {
      // Supabase says "Invalid login credentials" for a wrong email or
      // password alike, which is the right thing to show.
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return shell(
    <form onSubmit={submit} className="card" aria-labelledby="mod-signin-title">
      <h2 id="mod-signin-title" className="text-[1.15rem] font-bold text-white">
        Moderator sign-in
      </h2>
      <p className="mt-1.5 text-[0.85rem] text-white/60">Sign in to {purpose}.</p>

      <label className="label mt-4" htmlFor="mod-email">
        Email
      </label>
      <input
        id="mod-email"
        className="field"
        type="email"
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={`name${MODERATOR_DOMAIN}`}
      />

      <label className="label mt-4" htmlFor="mod-password">
        Password
      </label>
      <input
        id="mod-password"
        className="field"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p role="alert" className="mt-3 text-[0.88rem] font-medium text-gold-bright">
          {error}
        </p>
      )}

      <button className="btn btn-gold mt-5 w-full" type="submit" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="mt-3 text-[0.75rem] leading-relaxed text-white/45">
        Moderator accounts are created by the EBM admin. Ask them if you need one.
      </p>
    </form>,
  )
}
