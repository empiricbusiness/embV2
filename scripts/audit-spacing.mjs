/**
 * Static audit of spacing consistency across every page/component.
 * Flags anything still using ad-hoc margins where a shared token exists.
 */
import fs from 'fs'
import path from 'path'

function walk(d, o = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f)
    const s = fs.statSync(p)
    if (s.isDirectory()) walk(p, o)
    else if (f.endsWith('.tsx')) o.push(p)
  }
  return o
}

const findings = []
const add = (file, line, kind, detail) => findings.push({ file, line, kind, detail })

for (const f of walk('src')) {
  const rel = f.split(path.sep).join('/').replace('src/', '')
  const lines = fs.readFileSync(f, 'utf8').split('\n')

  lines.forEach((ln, i) => {
    const n = i + 1
    const cls = [...ln.matchAll(/className="([^"]*)"/g)].map((m) => m[1])

    for (const c of cls) {
      const t = c.split(/\s+/).filter(Boolean)

      // 1. Big top margins that should be the shared header→content token
      const bigMt = t.filter((x) => /^mt-(9|10|11|12|14|16|20)$/.test(x))
      if (bigMt.length && !t.includes('section-body')) {
        add(rel, n, 'ad-hoc big margin', `${bigMt.join(',')}  in "${c.slice(0, 60)}"`)
      }

      // 2. Hand-rolled section padding instead of .section / .section-tight.
      //    A pt-* that follows a border-t is a divider gap, not section padding.
      const pyPad = t.filter((x) => /^(py|pt|pb)-(10|12|14|16|20|24|28|32)$/.test(x))
      const isDivider = t.some((x) => /^border-(t|b)$/.test(x))
      if (pyPad.length && !isDivider && !t.includes('section') && !t.includes('section-tight')) {
        add(rel, n, 'ad-hoc section padding', `${pyPad.join(',')}  in "${c.slice(0, 60)}"`)
      }

      // 3. Card padding that should come from .card
      if (/\bcard\b/.test(c) && !/\bcard-lg\b/.test(c)) {
        const pad = t.filter((x) => /^(sm:|md:|lg:)?p-\d/.test(x))
        if (pad.length) add(rel, n, 'card padding override', pad.join(','))
      }

      // 4. Grids of cards missing the equal-height helper
      if (/\bgrid\b/.test(c) && /\bcard-grid\b/.test(c) === false) {
        const ctx = lines.slice(i, i + 12).join(' ')
        if (/className="[^"]*\bcard\b/.test(ctx) || /<EventCard\b/.test(ctx)) {
          if (/^\s*<ul/.test(ln) || /^\s*<ol/.test(ln)) {
            add(rel, n, 'card grid missing card-grid', c.slice(0, 60))
          }
        }
      }

      // 5. max-w on a heading block that isn't the shared one
      if (/\bh2\b/.test(c) && /max-w-/.test(c)) {
        add(rel, n, 'heading with own max-width', c.slice(0, 60))
      }
    }
  })
}

const byKind = {}
for (const f of findings) (byKind[f.kind] = byKind[f.kind] || []).push(f)

if (!findings.length) {
  console.log('No spacing inconsistencies found.')
} else {
  console.log(`${findings.length} spacing inconsistenc${findings.length === 1 ? 'y' : 'ies'}:\n`)
  for (const [kind, list] of Object.entries(byKind)) {
    console.log(`— ${kind} (${list.length})`)
    for (const f of list) console.log(`    ${f.file}:${f.line}  ${f.detail}`)
    console.log()
  }
}
