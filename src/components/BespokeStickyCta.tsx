'use client'

import { useEffect, useState } from 'react'

/**
 * Keeps "Register now" in reach on phones: a bar pinned to the bottom of the
 * screen once the hero's own button has scrolled away, hidden again while the
 * registration form or the site footer is on screen, so it never covers
 * either. Hidden from lg up, where the page is short enough in proportion not
 * to need it.
 */
export default function BespokeStickyCta({
  heroId,
  formId,
  label,
}: {
  heroId: string
  formId: string
  label: string
}) {
  const [heroVisible, setHeroVisible] = useState(true)
  const [formVisible, setFormVisible] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById(heroId)
    const form = document.getElementById(formId)
    const footer = document.querySelector('footer')
    if (!hero || !form || !('IntersectionObserver' in window)) return
    const watch = (el: Element, set: (v: boolean) => void) => {
      const io = new IntersectionObserver(([entry]) => set(entry.isIntersecting), { threshold: 0 })
      io.observe(el)
      return io
    }
    const observers = [watch(hero, setHeroVisible), watch(form, setFormVisible)]
    if (footer) observers.push(watch(footer, setFooterVisible))
    return () => observers.forEach((io) => io.disconnect())
  }, [heroId, formId])

  const show = !heroVisible && !formVisible && !footerVisible

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-950/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 lg:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="min-w-0 truncate text-[0.85rem] font-semibold text-white/85">{label}</p>
        <a href={`#${formId}`} tabIndex={show ? 0 : -1} className="btn btn-gold shrink-0 !px-5 !py-3">
          Register now
        </a>
      </div>
    </div>
  )
}
