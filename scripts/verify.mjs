import fs from 'fs'
import path from 'path'

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    const s = fs.statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (f.endsWith('.html')) out.push(p)
  }
  return out
}

const files = walk('out').sort()
const rows = []
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8')
  const rel = path.relative('out', f).split(path.sep).join('/')
  const url = '/' + rel.replace(/index\.html$/, '')
  const title = (h.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || ''
  const desc = (h.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || ''
  const canon = (h.match(/<link rel="canonical" href="([^"]*)"/i) || [])[1] || ''
  const og = (h.match(/<meta property="og:image" content="([^"]*)"/i) || [])[1] || ''
  const h1 = [...h.matchAll(/<h1[^>]*>/gi)].length
  const ld = [...h.matchAll(/application\/ld\+json/gi)].length
  const imgs = [...h.matchAll(/<img[^>]*>/gi)]
  const noAlt = imgs.filter((m) => !/\salt=/i.test(m[0])).length
  // next/image `fill` images are sized by their container, not width/height
  // attributes, and cause no layout shift — skip them.
  const noDim = imgs.filter(
    (m) => !/data-nimg="fill"/.test(m[0]) && (!/\swidth=/i.test(m[0]) || !/\sheight=/i.test(m[0])),
  ).length
  rows.push({ url, title, desc, canon, og, h1, ld, imgs: imgs.length, noAlt, noDim })
}

const dup = (key) => {
  const m = {}
  rows
    .filter((r) => !r.url.startsWith('/404'))
    .forEach((r) => {
      const v = r[key]
      if (v) (m[v] = m[v] || []).push(r.url)
    })
  return Object.entries(m).filter(([, v]) => v.length > 1)
}

console.log(`PAGES: ${rows.length}\n`)
console.log('URL'.padEnd(56) + ' H1 LD IMG nAlt nDim  TLEN DLEN CANON')
rows.forEach((r) =>
  console.log(
    r.url.padEnd(56),
    String(r.h1).padStart(2),
    String(r.ld).padStart(2),
    String(r.imgs).padStart(3),
    String(r.noAlt).padStart(4),
    String(r.noDim).padStart(4),
    String(r.title.length).padStart(5),
    String(r.desc.length).padStart(4),
    r.canon ? 'yes' : 'NO',
  ),
)

const problems = []
for (const [k, label] of [
  ['title', 'titles'],
  ['desc', 'descriptions'],
  ['canon', 'canonicals'],
]) {
  for (const [val, urls] of dup(k)) {
    problems.push(`Duplicate ${label} across ${urls.join(', ')} -> "${String(val).slice(0, 60)}"`)
  }
}
rows.forEach((r) => {
  if (r.url.startsWith('/404')) return
  if (!r.title) problems.push(`${r.url}: missing title`)
  if (!r.desc) problems.push(`${r.url}: missing meta description`)
  if (!r.canon) problems.push(`${r.url}: missing canonical`)
  if (r.h1 !== 1) problems.push(`${r.url}: ${r.h1} h1 tags (want exactly 1)`)
  if (!r.ld) problems.push(`${r.url}: no JSON-LD`)
  if (r.noAlt) problems.push(`${r.url}: ${r.noAlt} images missing alt`)
  if (r.noDim) problems.push(`${r.url}: ${r.noDim} images missing width/height`)
  if (r.title.length > 65) problems.push(`${r.url}: title ${r.title.length} chars (>65 truncates)`)
  if (r.desc.length > 168) problems.push(`${r.url}: description ${r.desc.length} chars (>168 truncates)`)
  if (!r.og) problems.push(`${r.url}: no og:image`)
})

console.log('\n' + '='.repeat(72))
/* ------------------------------------------------------------------------
   Internal notes must never reach a visitor.

   The data layer carries research notes — `source` provenance and
   `conflicts` describing unresolved data problems — written for the team and
   the client, not the public. They leak two ways, and BOTH have happened:
     1. rendering them in a page (fixed in 5acb333 by gating on NODE_ENV);
     2. passing a whole EventRecord as a prop to a CLIENT component, which
        serialises every field of it into the static HTML.
   (2) put 26 source notes and 19 conflict notes into /events/. Neither route
   can come back without failing here.
   ------------------------------------------------------------------------ */
const LEAK_MARKERS = [
  ['a TODO(client) note', 'TODO(client)'],
  ['an internal provenance note', '\\"source\\":'],
  ['an internal conflicts note', '\\"conflicts\\":'],
  ['a previous-redesign research note', 'previous redesign'],
  ['the dev-only internal banner', 'Internal · dev build only'],
]
// HTML *and* JavaScript. Scanning HTML alone missed the real leak: `site.ts`
// is imported by Header, a client component, so the whole module — every
// internal note included — was emitted into a shared chunk that all 45 pages
// load. The notes now live in `event-notes.ts`, imported only by server
// components; this asserts they stay out of both outputs.
function walkAssets(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) walkAssets(p, out)
    else if (/\.(html|js|txt)$/.test(f)) out.push(p)
  }
  return out
}
for (const f of walkAssets('out')) {
  const h = fs.readFileSync(f, 'utf8')
  const rel = path.relative('out', f).split(path.sep).join('/')
  for (const [label, marker] of LEAK_MARKERS) {
    if (h.includes(marker)) problems.push(`${rel}: leaks ${label} to visitors`)
  }
}

if (problems.length === 0) console.log('NO SEO PROBLEMS FOUND')
else {
  console.log(`${problems.length} PROBLEM(S):`)
  problems.forEach((p) => console.log('  -', p))
}
