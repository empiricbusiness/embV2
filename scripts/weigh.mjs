import fs from 'fs'
import path from 'path'

const BASE = 'http://localhost:3200'

async function weigh(pagePath) {
  const res = await fetch(BASE + pagePath)
  const html = await res.text()
  const urls = new Set()
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]+\.(?:css|js|png|jpe?g|webp|svg|woff2?))"/gi)) {
    urls.add(m[1])
  }
  let total = html.length
  const byType = { html: html.length }
  let blockingCss = 0
  for (const u of urls) {
    try {
      const r = await fetch(BASE + u)
      const b = await r.arrayBuffer()
      total += b.byteLength
      const ext = (u.split('?')[0].match(/\.([a-z0-9]+)$/i) || [, 'other'])[1].toLowerCase()
      byType[ext] = (byType[ext] || 0) + b.byteLength
      if (ext === 'css') blockingCss += b.byteLength
    } catch {}
  }
  return { pagePath, requests: urls.size + 1, total, byType, blockingCss, html: html.length }
}

const pages = ['/', '/events/', '/sponsorship/', '/about/', '/services/conferences-and-awards/', '/contact/']
console.log('PAGE'.padEnd(38), 'REQ', 'HTML'.padStart(8), 'CSS'.padStart(8), 'TOTAL'.padStart(9))
let worst = 0
for (const p of pages) {
  const r = await weigh(p)
  worst = Math.max(worst, r.total)
  console.log(
    p.padEnd(38),
    String(r.requests).padStart(3),
    ((r.html / 1024).toFixed(0) + 'K').padStart(8),
    ((r.blockingCss / 1024).toFixed(0) + 'K').padStart(8),
    ((r.total / 1024).toFixed(0) + 'K').padStart(9),
  )
}

// Render-blocking analysis of the homepage
const home = await (await fetch(BASE + '/')).text()
const blockingStyles = [...home.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/gi)]
const syncScripts = [...home.matchAll(/<script(?![^>]*(?:async|defer|type="application\/ld\+json))[^>]*src=[^>]*>/gi)]
const preloads = [...home.matchAll(/<link[^>]+rel="preload"[^>]*>/gi)]
const fonts = [...home.matchAll(/\.woff2/gi)]
const thirdParty = [...home.matchAll(/(?:src|href)="https?:\/\/(?!localhost)([^/"]+)/gi)].map((m) => m[1])

console.log('\n--- HOMEPAGE RENDER PATH ---')
console.log('Render-blocking stylesheets :', blockingStyles.length)
console.log('Synchronous scripts         :', syncScripts.length)
console.log('Preloads                    :', preloads.length)
console.log('Self-hosted font files      :', new Set(fonts.map((f) => f[0])).size)
console.log('Third-party origins         :', [...new Set(thirdParty)].join(', ') || 'NONE')
console.log('\nPeak page weight            :', (worst / 1024).toFixed(0) + ' KB')

// Total shipped site
function dirSize(d) {
  let t = 0
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f)
    const s = fs.statSync(p)
    t += s.isDirectory() ? dirSize(p) : s.size
  }
  return t
}
console.log('Whole static site on disk   :', (dirSize('out') / 1048576).toFixed(2) + ' MB')
