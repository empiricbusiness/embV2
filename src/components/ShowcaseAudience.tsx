'use client'

import { useState } from 'react'
import Icon, { iconFor } from './ShowcaseIcon'
import s from './EventShowcase.module.css'

type Group = { id: string; label: string; lede?: string; items: string[]; details?: Record<string, string> }

/** A gold spotlight that follows the pointer across a tile. */
function track(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

/**
 * Who should attend, as two tabs of tiles. Both lists stay in the static HTML
 * (the inactive one carries `hidden`), so nothing is lost to search engines or
 * to readers without JavaScript.
 */
export default function ShowcaseAudience({ groups }: { groups: Group[] }) {
  const [tab, setTab] = useState(groups[0]?.id)

  return (
    <div>
      <div className={s.tablist} role="tablist" aria-label="Who should attend">
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            id={`aud-tab-${g.id}`}
            aria-selected={tab === g.id}
            aria-controls={`aud-panel-${g.id}`}
            className={s.tabBtn}
            onClick={() => setTab(g.id)}
          >
            {g.label}
            <span className={s.count}>{g.items.length}</span>
          </button>
        ))}
      </div>

      {groups.map((g) => (
        <div
          key={g.id}
          role="tabpanel"
          id={`aud-panel-${g.id}`}
          aria-labelledby={`aud-tab-${g.id}`}
          hidden={tab !== g.id}
          className={`${s.tabPanel} mt-8`}
        >
          {g.lede && <p className="mb-5 text-[0.95rem] font-semibold text-white/75">{g.lede}</p>}
          <ul className={s.tileGrid}>
            {g.items.map((item, i) => (
              <li key={item}>
                <div className={s.tile} onPointerMove={track}>
                  <span className={s.tileIcon}>
                    <Icon name={iconFor(item)} size={22} />
                  </span>
                  <span aria-hidden className={s.tileNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.98rem] font-bold leading-snug text-white">{item}</span>
                    {g.details?.[item] && <span className={s.tileText}>{g.details[item]}</span>}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
