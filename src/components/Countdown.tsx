'use client'

import { useEffect, useState } from 'react'

type Parts = { days: number; hours: number; minutes: number; seconds: number }

function diff(target: number): Parts {
  const ms = Math.max(0, target - Date.now())
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Live countdown. Renders nothing until mounted, so the static HTML never ships
 * the frozen "00 00 00 00" the old site showed to every crawler and to anyone
 * whose JS hadn't run yet.
 */
export default function Countdown({
  iso,
  label,
  tone = 'quiet',
}: {
  iso: string
  label: string
  /** 'loud' is the gold treatment used where the countdown is the focal point. */
  tone?: 'quiet' | 'loud'
}) {
  const target = new Date(`${iso}T09:00:00+05:30`).getTime()
  const [parts, setParts] = useState<Parts | null>(null)

  useEffect(() => {
    setParts(diff(target))
    const id = setInterval(() => setParts(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!parts) {
    // Reserve the exact final height so hydration causes zero layout shift.
    return <div aria-hidden className="min-h-[6.5rem]" />
  }

  const loud = tone === 'loud'
  const done = parts.days + parts.hours + parts.minutes + parts.seconds === 0
  if (done) return null

  const cells: [number, string][] = [
    [parts.days, 'Days'],
    [parts.hours, 'Hours'],
    [parts.minutes, 'Minutes'],
    [parts.seconds, 'Seconds'],
  ]

  return (
    // role="timer" lives on the wrapper, not the <ul>: a role on the list
    // strips its list semantics and axe then reports orphaned <li> items.
    <div className="min-h-[6.5rem]" role="timer" aria-live="off" aria-label={label}>
      <p
        className={
          loud
            ? 'text-[0.72rem] font-bold uppercase tracking-[0.16em] text-gold'
            : 'text-sm font-semibold text-white/70'
        }
      >
        {label}
      </p>
      <ul className={loud ? 'mt-4 flex justify-center gap-3' : 'mt-3 flex gap-2.5'}>
        {cells.map(([v, l]) => (
          <li
            key={l}
            className={
              loud
                ? 'min-w-[78px] rounded-xl border border-gold/45 bg-gold/[0.12] px-3 py-2.5 text-center'
                : 'min-w-[64px] rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-center backdrop-blur-sm'
            }
          >
            <span
              className={
                loud
                  ? 'block text-[1.75rem] font-extrabold leading-none tabular-nums text-gold'
                  : 'block text-xl font-extrabold tabular-nums text-white'
              }
            >
              {pad(v)}
            </span>
            <span
              className={
                loud
                  ? 'mt-1.5 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/70'
                  : 'block text-[0.68rem] uppercase tracking-wider text-white/70'
              }
            >
              {l}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
