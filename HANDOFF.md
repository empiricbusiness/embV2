# Empiric Business Media — new front end

Rebuilt from scratch, 2 September 2026. Next.js 15 (App Router, static export) + Tailwind CSS 4 + TypeScript.

```bash
npm install
npm run dev          # http://localhost:3100
npm run build        # static export to ./out
npm run preview      # serve ./out on :3200
npm run check:seo    # asserts SEO invariants across every built page
npm run check:weight # per-page weight + render-path report
```

---

## 1. What the old site was — sent separately

The audit of the previous site — how it was built, the defects that were live on it, and the
performance baseline it set — is a separate document, sent to EBM directly. It also records one
defect still live on the Manufacturing Summit registration form, where the pass dropdown submits
a different price from the one it displays.

---

## 2. What was built

29 static pages. `npm run check:seo` asserts, and currently passes, that **every** page has:
exactly one `<h1>`, a unique `<title>` under 65 chars, a unique meta description under 168 chars,
a self-referential canonical, JSON-LD, an `og:image`, and **zero** images missing `alt` or
`width`/`height`.

```
/                                    Home
/about/                              About EBM
/services/                           Services hub
  /conferences-and-awards/           ← full copy, process, FAQs, Service schema
  /bespoke-events/
  /roundtables/
  /webinars/
  /one-to-one-meetings/
  /networking-and-brand-visibility/
/events/                             Hub — upcoming + past, grouped by sector
  /<9 event pages>/                  Each with BusinessEvent schema
/sponsorship/                        NEW — the commercial money page
/gallery/
/blog/ + /blog/<post>/
/contact/                            Real NAP + LocalBusiness schema
/privacy-policy/  /terms/  /refund-policy/    NEW — none existed before
robots.txt  sitemap.xml  404
```

### Why `/sponsorship/` is new and matters

Keyword research found EBM's revenue-side terms are **low competition and unclaimed**:
`sponsor a b2b conference india`, `event sponsorship packages india`, `cxo roundtable india`,
`white label conference india`. Competitor **UBS Forums has "Sponsorship" in its primary nav**;
EBM had no such page at all. It's now in the nav and in the sitemap at priority 0.95.

### Brand

Taken from the logo asset itself, not guessed:

- **Gold `#F5B614`** + white wordmark, tagline *"We commit to deliver"*, strapline
  *Conferences | Bespokes | Webinars | Summits | Awards*.
- **Navy `#0B3A5B`** as the structural colour (it was already in the old CSS `:root`).
- The logo is **white-on-transparent**, so it only works on a dark backing — the design is dark-first
  for exactly that reason, and the logo ships **unmodified**.
- `#F5B614` on white is **1.84:1** and fails WCAG for text, so a text-safe
  `--color-gold-ink: #6f4e00` (7:1 on white) is used on light sections. Gold is an accent on dark only.
- `images/logo.svg` on the old site was an unrelated **purple `#734BDF`** template placeholder. Discarded.

---

## 3. What we need from you

Everything below is marked `TODO(client)` in the code. Nothing unverified was published.

### Blocking — these are factual claims we would not invent

1. **The headline statistics.** The old site animated `525 events, 502 partners, 4,589 speakers,
   20,118 companies, 31,013 delegates`. Meanwhile the partners page claimed *"500+ Industry Partners"*
   and a public search snippet says *"over 300 successful events"*. That's three different stories.
   The site currently shows only **defensible counts**, and those counts are now *derived* from the
   event records rather than typed by hand — 26 editions, 7 verticals, 5 cities, 37 partner brands.
   (The hand-written version claimed 6 cities while naming only 5.) Confirm the real figures and
   we'll restore them.
2. **CISO 2026 city — Bengaluru or Mumbai?** The homepage and CISO home say Bengaluru; the CISO venue
   page says Hilton Mumbai International Airport.
3. **HR Tech 2026 city — Mumbai or Chennai?** Hero says Mumbai; the contact page says Hyatt Regency, Chennai.
4. **Manufacturing 8th Edition** has no calendar date ("November 2026") and no venue. Needed for
   `Event` rich results — Google requires `startDate`.
5. **Early-bird cut-off dates per event.** The ₹9,999 / ₹12,499 / ₹14,999 ladder is carried over,
   but the "After 20th January 2026" deadline was copy-pasted onto five events across the year.
6. **Partner logo permissions.** Apple, Cisco, Dell, Zoom and Mitsubishi are in the wall. Displaying a
   third-party mark implies a commercial relationship. Confirm written permission, or we move the
   unconfirmed ones to a neutral "companies that have attended" treatment.
7. **Testimonials.** Not republished — the old ones had no real names. Send real name + title +
   company per quote and they go straight back in.
8. **Legal review** of the three new policy pages. They're working drafts marked as such on the page.
   The refund ladder in particular has deliberate gaps we would not invent.

### Blocking — the event catalogue (new, 3 Sep 2026)

We rebuilt the events index and, in the process, verified every edition we could find against EBM's
own event artwork. The posters turned out to be a **primary source**: most print the edition number,
full date, time and venue, and carry the EBM logo with *"Conceptualized & Organised By"*.

That took the catalogue from 9 editions to **26**. It also caught a set of errors we would otherwise
have published.

9. **Confirm the 26-edition list is what you want public.** Eight franchises appear nowhere on your
   current live site: CFO Leadership, CIO, CX Innovation, CX MarTech, Tax & Finance, BFSI Revolution,
   Insurance Excellence, World OSC Congress and Amrut Tech. We have artwork for all of them, but you
   may have reasons for keeping some off the site.

10. **Seven editions have artwork but no date, city or venue printed on it**, so we publish the year
    only: Manufacturing 3rd (2024), CX 3rd and 2nd (2023), CIO Summit (2023), Amrut Tech (2023),
    CX (2022), CFO (2022). Send us date + city + venue for each and they become full records.

11. **Two events we could not attribute with confidence:**
    - *Amrut Tech Summit '23* — the artwork carries Amrut Software and Atlassian branding, **not**
      the EBM logo. Did EBM produce it as a bespoke event? If not we drop it.
    - *Monsoon Cyber Sundown* (17 July 2026, Mumbai) — a CISO leadership evening. It is on EBM-branded
      artwork but appears nowhere on the live site. Confirm it ran.

12. **Edition-numbering conflicts to settle.** In each case we published what the poster prints:
    - BFSI & NBFC India, 29 May 2026 — poster says **2nd Edition**; the earlier redesign said 4th.
    - Manufacturing, 13 Feb 2026 Pune — poster says **5th Edition**; the earlier redesign said 6th.
    - CFO Leadership, 20 June 2024 — poster says **3rd Edition**; the earlier redesign gave none.
    - Tax and Finance, 15 Nov 2024 — poster says **4th Edition**.

13. **Eleven events we deliberately did NOT publish.** Four were flagged as invented in the earlier
    redesign's own data (all dated 2027). Seven more have generic names, generic venues, no artwork
    and no mention anywhere in the 131-page crawl: *Leadership Roundtable*, *CIO Leadership Conclave
    2024*, *South India Leadership Forum*, *Enterprise Technology Summit*, *Technology Leadership
    Conclave*, *Business Leaders Meet*, *Digital Transformation Webinar Series*. They are listed in
    `EXCLUDED_EVENTS` in `src/data/site.ts`. **Tell us if any of them are real** — with a date, city
    and venue they can be published.

### Non-blocking

14. **Form endpoint.** Set `NEXT_PUBLIC_FORM_ENDPOINT` (Formspree / Web3Forms / your CRM webhook).
    Until then the contact form falls back to opening the user's mail client pre-filled, so no
    enquiry is lost.
15. **Social profiles.** Only LinkedIn is live. Send Facebook / Instagram / X / YouTube URLs, or we
    stay LinkedIn-only.
16. ~~Consolidate the two LinkedIn company pages~~ — **resolved, nothing to do.** Checked 7 Sep 2026:
    `…-ebm` and `…-media` reach the same company page.
17. **Gallery captions** — which event, edition and city per photo. Currently generic alt text.
18. **Agendas.** The word "agenda" appears exactly once across all 131 crawled pages. No session
    schedule exists anywhere for any real event. This is the single biggest content gap for both
    delegate conversion and `Event` schema.
19. **Speaker rosters.** The subdomains hold real speakers (34–38 per manufacturing edition); they
    are not yet migrated into this site.

---

## 4. Deployment

```bash
npm run build      # → ./out
```

`vercel.json` is configured for static output with immutable caching on hashed assets.

**Do not set `cleanUrls`** — the build uses `trailingSlash: true` and the two conflict.

**Do not set `outputDirectory` either.** The site is `output: 'export'`, and Vercel's Next.js
preset handles that on its own. Setting `outputDirectory: "out"` next to `framework: "nextjs"`
makes Vercel look for `routes-manifest.json` inside `out/`, which a static export never writes —
so the build passes and the *deploy* then fails. It was set until 3 Sep 2026 and had never been
deployed, so nobody had found out. If a deploy fails this way, also clear **Output Directory** in
the Vercel project settings; Vercel copies the value into the project when it is first created,
and `vercel.json` alone does not override it.

Validate before deploying — this runs the full Vercel build locally and uploads nothing:

```bash
npx vercel build          # then: npx vercel deploy --prebuilt
```

### Deploying from GitHub

Import the repository into Vercel and accept the detected **Next.js** preset. Leave **Root
Directory** at the repository root and **Output Directory** empty (see above). The Live Question
Board is a second Vercel project from the same repository, with Root Directory `question-board` —
see `question-board/README.md`.

Two Vercel behaviours worth knowing:

- **A project's first deployment becomes Production**, with or without `--prod`. On Vercel
  "Production" only means that project's main `<project>.vercel.app` alias — it is not the live
  site until a custom domain is attached.
- **Deployment Protection is on by default**, so preview URLs redirect anyone without a Vercel
  login to an SSO page. Turn it off per project under *Settings → Deployment Protection →
  Vercel Authentication*. It is project-scoped and does not affect other projects.

Preview deployments carry `X-Robots-Tag: noindex` automatically. **Production deployments do
not**, and `robots.txt` here is `Allow: /` — so a Production deployment is crawlable on its
`.vercel.app` address even before the domain is attached. Every page canonicalises to
`https://www.empiricbusinessmedia.com`, which limits the damage.

### Before pointing the domain at a new host — launch blocker

DNS as checked on 11 Sep 2026: `empiricbusinessmedia.com` has an A record for the current server
(`86.38.243.94`), and `www`, `manufacturingsummit` and `lndsummit` are all **CNAMEs to the bare
domain**. The zone is on Google's nameservers (`ns-cloud-b1…b4.googledomains.com`), not
Hostinger's, and email runs on Google Workspace (`aspmx.l.google.com`).

Moving the domain to a new host moves **every path on it**, not only the pages rebuilt here. Two
things break unless they are handled first:

1. **The two summit subdomains move with it.** They are CNAMEs to the bare domain, so repointing
   its A record takes `manufacturingsummit.` and `lndsummit.` along and both microsites go dark.
   Change those two records to an A record for `86.38.243.94` *before* touching the bare domain.
2. **Three folders on the main domain are live sites this repository does not contain** —
   `/ciso/` and `/hrtech/` (including their `register.html` pages, which the new event pages link
   to, and the past editions under `/hrtech/`), and `/manufacturingsummit/`. On a new host they
   would 404, while both summits are taking registrations. Their registration forms post to a
   Google Apps Script rather than to the server, so the forms themselves do not depend on the old
   host.

The least disruptive fix for 2 is to keep the current server behind those folders: give it a
second hostname (for example `legacy.empiricbusinessmedia.com`, an A record for `86.38.243.94`
attached to the same website at Hostinger), then add Vercel rewrites so `/ciso/`, `/hrtech/` and
`/manufacturingsummit/` are fetched from it. The URLs stay the same, and those sites keep being
edited where they are today. The alternatives are copying the folders into `public/`, or moving
them to subdomains and updating the links in `src/data/site.ts`.

The crawl also found 52 subdomain pages referencing the EBM logo under `/img/logo/` on the main
domain. Checked 11 Sep 2026: those files already return 404, and the subdomain homepages load their
logos from their own hosts, so the move does not change them.

Change records in the existing zone. Do not switch nameservers as part of the move, and leave the
MX records alone — both would take company email down.

### Redirects to configure at the host

The old URLs must not 404. These are configured in `vercel.json` under `redirects`:

| Old | New |
|---|---|
| `/index.html` | `/` |
| `/about.html` | `/about/` |
| `/contact.html` | `/contact/` |
| `/conference.html` | `/services/conferences-and-awards/` |
| `/bespoke.html` | `/services/bespoke-events/` |
| `/webinar.html` | `/services/webinars/` |
| `/partners.html` | `/sponsorship/` |
| `/blog.html`, `/blog-1.html`, `/blog-2.html` | `/blog/` |
| `/image-gallery.html` | `/gallery/` |
| `/schedule.html`, `/speaker.html`, `/testimonials.html` | `/events/` |

The `/ciso/`, `/hrtech/` and the two summit subdomains are **untouched and still live** — the new
event pages link out to them until they're migrated.

### Search Console

`public/google69285137b574d2c5.html` verifies `https://www.empiricbusinessmedia.com/` in Google
Search Console. Google re-checks it from time to time, so do not delete or rename it.

---

## 5. Next phase — the microsites

The corporate site is done. The event estate still runs four unrelated designs, none carrying the
EBM logo. The design system here (`src/app/globals.css` + `src/components/`) is built to absorb them:
add records to `EVENTS` in `src/data/site.ts` and the hub, detail pages, sitemap and schema all
follow automatically.

Recommended order: **CISO 2026** and **HR Tech 2026** first (both are upcoming and taking
registrations), then the Manufacturing franchise, then archive the past editions under
`/events/<slug>/` and redirect the subdomains.

---

## 6. Theme and Lighthouse (added 2 Sep 2026, evening)

### Colour system

The first pass used a near-black canvas that read as generic dark mode. The brand's real identity
is the **corporate blue + gold** the logo was designed for (the old site's royal-blue header; the old
CSS `:root` declared `#0B3A5B` "Deep Corporate Blue" and `#1968BC` "Primary Blue"). Every surface is
now unmistakably blue, with gold `#F5B614` as the accent, a 3px gold rule along the top of the header,
and gold/blue radial blooms on the hero and page headers (pure gradients — no blur filters, so zero
paint cost). Light sections use blue headings (`#0B3A5B`, 11.9:1 on white) and the old brand shell
`#F3F7FA`.

Contrast is designed in, not checked after. Per surface (white text / gold text):
`navy-950 #071d33` 16.8 / 8.8 · `navy-900 #0b2d4d` 13.5 / 7.3 · `navy-850 #0b3a5b` 11.9 / 6.5 ·
`navy-800 #0f4a75` 9.5 / 5.2 — **the lightest surface allowed under gold text** · `navy-700/600`
white text only · `navy-500` decorative only. Muted white text has a floor of `/60` (the near-black
canvas tolerated `/45`; blue does not). Tokens live in `src/app/globals.css`.

### Lighthouse 13, default mobile profile (slow 4G, CPU 4×), static `out/` served locally

| | Perf | A11y | Best Pr. | SEO |
|---|---|---|---|---|
| Home — desktop | **100** | **100** | **100** | **100** |
| Contact — mobile | **100** | **100** | **100** | **100** |
| Events hub — mobile | 99 | **100** | **100** | **100** |
| Event page — mobile | 98–99 | **100** | **100** | **100** |
| Sponsorship — mobile | 98–99 | **100** | **100** | **100** |
| Home — mobile | 97–98 | **100** | **100** | **100** |

Ranges are two consecutive quiet runs. Accessibility, Best Practices and SEO are 100 everywhere.
The remaining mobile-performance points are all LCP on the throttled profile; on the homepage the
LCP is the headline text at ~2.3s versus 1.8s on the contact page, the difference being the
homepage's larger HTML plus React hydrating before first paint on a local server.

**These numbers are from `localhost`.** The live verdict is PageSpeed Insights on the deployed URL
(real TTFB, brotli, HTTP/2) — run it on a Vercel preview before promising a figure.

### What was tuned to get there (all deliberate, all reversible)

- Fonts are **not** preloaded (`preload: false` + `display: swap`); five top-priority font requests
  were starving the hero image on mobile. Size-adjusted fallback keeps CLS ≈ 0.
- The hero is a plain `<img srcset>` (800/960/1440/1920) — `next/image` under `unoptimized`
  emits no srcset, so phones were downloading the 1920px file.
- **Phones get no hero photo** (`<picture>` serves a 54-byte pixel below 768px). Under the
  vertical wash the photo was a faint texture anyway, and as the largest element it pinned the LCP.
  Tablet and desktop get the real photo. One `<source>` line to revert.
- Homepage logo strip shows the **first 18 of 37 partners** (`<PartnerWall limit={18}/>`); each
  logo is rendered twice for the loop and again in the RSC payload. The full 37 remain on
  `/sponsorship/`.
- Tried and **rejected** after measurement: `experimental.inlineCss` (HTML 147→271KB, slower on
  slow-4G) and `react-dom` `preload()` for the hero (Next carried it in the prefetch payload, so
  every page downloaded the homepage hero).

Repeat the measurement with:
`npm run build`, then serve `out/` and run `npx lighthouse http://localhost:3200/ --output=json`.
Build with the dev server **stopped** — they share `.next`.
