/**
 * Single source of truth for EBM site content.
 *
 * Every fact here was extracted from the live site crawl (131 pages, 2 Sep 2026).
 * Anything the client still has to confirm is marked `unverified: true` and is
 * either hidden or rendered with a visible placeholder — nothing unverified ships
 * as a factual claim.
 */

export const SITE = {
  name: 'Empiric Business Media',
  legalName: 'Empiric Business Media [EBM] Pvt. Ltd.',
  short: 'EBM',
  // TODO(client): confirm production domain before launch.
  url: 'https://www.empiricbusinessmedia.com',
  tagline: 'We commit to deliver',
  strapline: 'Conferences | Bespokes | Webinars | Summits | Awards',
  pullQuote: 'Connecting businesses, fostering growth',
  description:
    'Empiric Business Media (EBM) is a B2B events and business media company in India, producing industry conferences, summits, awards, bespoke events and webinars for enterprise decision-makers.',
  boilerplate:
    'Empiric Business Media (EBM) creates impactful business experiences that bring together industry leaders, innovators, and decision-makers to exchange ideas, build connections, and drive meaningful growth.',
  // The homepage "07 +" badge and a public search snippet ("established in 2019")
  // agree: 2026 − 7 = 2019. Corroborated, so safe to state.
  founded: 2019,

  address: {
    street: '2nd Floor, Office No. 2, Ashley Tower Space Associates, Near Cinemax Road, Vagad Nagar, Beverly Park',
    locality: 'Mira Bhayandar',
    region: 'Maharashtra',
    postalCode: '401105',
    country: 'IN',
    countryName: 'India',
  },

  // Verified real addresses found across the crawl. The old site also leaked
  // placeholders (+123456789, support@domainname.com) on 8 live pages — dropped.
  phones: [
    { label: 'General', value: '+91 99200 33844', href: 'tel:+919920033844' },
    { label: 'Sponsorship', value: '+91 98200 09937', href: 'tel:+919820009937' },
  ],
  emails: {
    general: 'info@empiricbusinessmedia.com',
    // TODO(client): confirm which mailbox should receive sponsorship + speaker enquiries.
    sponsorship: 'info@empiricbusinessmedia.com',
  },

  social: [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/empiric-business-media/',
      verified: true,
    },
    // The old footer rendered these four as href="#", so they were omitted as
    // unverified. That was wrong: the REAL profile URLs were in the estate all
    // along — every microsite footer carries them, 81 occurrences each, in the
    // 2 Sep 2026 crawl. Verified 7 Sep 2026 by counting them across the
    // crawl archive. No client input was ever needed.
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/empiricbusinessmedia',
      verified: true,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/empiricbusinessmedia',
      verified: true,
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@empiricbusinessmedia',
      verified: true,
    },
    {
      name: 'X',
      href: 'https://x.com/EmpiricMedia',
      verified: true,
    },
    //
    // The estate links two LinkedIn URLs — /empiric-business-media (81
    // occurrences in the crawl, used by all four microsites) and
    // /empiric-business-media-ebm (21, used only by the corporate site).
    // Checked 7 Sep 2026: they resolve to the SAME page — LinkedIn redirects
    // the old vanity slug. So there is no duplicate page and nothing for the
    // client to merge. We link the canonical one. Earlier audit notes called
    // this "two company pages splitting brand authority"; that was wrong.
  ],
} as const

/* ------------------------------------------------------------------ */
/* Headline statistics                                                 */
/* ------------------------------------------------------------------ */
/**
 * The old site animated these counters from data-target attributes:
 *   525 events, 502 partners, 4,589 speakers, 20,118 companies, 31,013 delegates
 * plus a bare "07+" badge with no unit label.
 *
 * Client decision (2 Sep 2026): flag rather than republish. These are held here
 * so they are not lost, but `verified: false` keeps them off the page.
 */
export const STATS = [
  { key: 'events', label: 'Events delivered', claimed: 525, verified: false },
  { key: 'partners', label: 'Partners & sponsors', claimed: 502, verified: false },
  { key: 'speakers', label: 'Industry speakers', claimed: 4589, verified: false },
  { key: 'companies', label: 'Companies participated', claimed: 20118, verified: false },
  { key: 'delegates', label: 'Delegates hosted', claimed: 31013, verified: false },
  { key: 'years', label: 'Years in business', claimed: 7, verified: false },
] as const

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */
export type Service = {
  slug: string
  title: string
  short: string
  blurb: string
  icon: string
  keyword: string
}

export const SERVICES: Service[] = [
  {
    slug: 'conferences-and-awards',
    title: 'Conferences & Awards',
    short: 'Conferences',
    blurb:
      'Industry-led conferences and recognition platforms that bring together decision-makers, experts and emerging leaders.',
    icon: 'podium',
    keyword: 'B2B conference organisers India',
  },
  {
    slug: 'bespoke-events',
    title: 'Bespoke Events',
    short: 'Bespoke',
    blurb:
      'Tailored events designed around specific business objectives, audiences and industry needs.',
    icon: 'sparkles',
    keyword: 'bespoke corporate events company India',
  },
  {
    slug: 'roundtables',
    title: 'Roundtables',
    short: 'Roundtables',
    blurb:
      'Focused leadership discussions that encourage meaningful conversations, insights and peer-to-peer exchange.',
    icon: 'table',
    keyword: 'executive roundtable organisers India',
  },
  {
    slug: 'webinars',
    title: 'Webinars',
    short: 'Webinars',
    blurb:
      'Engaging digital sessions that connect industry experts with professionals across geographies.',
    icon: 'broadcast',
    keyword: 'B2B webinar services India',
  },
  {
    slug: 'one-to-one-meetings',
    title: 'One-to-One Meetings',
    short: '1:1 Meetings',
    blurb:
      'Curated business meetings that create direct connections between solution providers and key decision-makers.',
    icon: 'handshake',
    keyword: 'curated B2B meetings India',
  },
  {
    slug: 'networking-and-brand-visibility',
    title: 'Networking & Brand Visibility',
    short: 'Brand Visibility',
    blurb:
      'Strategic opportunities to build relationships, strengthen brand presence and connect with the right audience.',
    icon: 'network',
    keyword: 'B2B brand visibility events India',
  },
]

/* ------------------------------------------------------------------ */
/* Sectors                                                             */
/* ------------------------------------------------------------------ */
export type Sector = {
  slug: string
  name: string
  blurb: string
  keyword: string
}

/**
 * Seven verticals, each carrying at least one evidence-backed edition.
 *
 * The original four were the franchises still promoted on the live estate.
 * CX, CFO & Finance and Technology & Digital were recovered from EBM's own
 * event artwork (see EVENTS `source` notes) — the live site never mentions
 * them, but the posters are EBM-branded and carry printed dates and venues.
 * TODO(client): confirm this is the franchise list you want published.
 */
export const SECTORS: Sector[] = [
  {
    slug: 'ciso-cybersecurity',
    name: 'CISO & Cybersecurity',
    blurb:
      'Enabling cybersecurity and technology leaders to exchange insights on cyber resilience, risk and enterprise security.',
    keyword: 'CISO summit India',
  },
  {
    slug: 'hr-technology',
    name: 'HR Tech',
    blurb:
      'Bringing HR leaders and technology innovators together around the future of work, talent and workplace experience.',
    keyword: 'HR tech conference India',
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    blurb:
      'Connecting manufacturing leaders around smart factories, digital transformation, automation and the future of industry.',
    keyword: 'manufacturing summit India',
  },
  {
    slug: 'bfsi',
    name: 'BFSI',
    blurb:
      'Bringing together banking, financial services and insurance leaders to explore transformation, technology and growth.',
    keyword: 'BFSI conference India',
  },
  {
    slug: 'cx',
    name: 'CX',
    blurb:
      'Customer experience, marketing technology and personalisation leaders working on data-driven decision-making.',
    keyword: 'customer experience summit India',
  },
  {
    slug: 'cfo-finance',
    name: 'CFO & Finance',
    blurb:
      'Finance leadership across the CFO agenda — tax, controls, reporting and the technology that runs them.',
    keyword: 'CFO summit India',
  },
  {
    slug: 'technology',
    name: 'Technology & Digital',
    blurb:
      'Enterprise technology leadership — the CIO agenda, engineering and applied innovation across industries.',
    keyword: 'CIO summit India',
  },
]

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */
export type EventFormat = 'conference' | 'bespoke' | 'webinar'

/**
 * Delivery format, using EBM's own vocabulary. The labels are taken from the
 * client's published service names (SERVICES) and the strapline they print on
 * every poster — "Conferences | Bespokes | Webinars | Summits | Awards" — so
 * the filter speaks the same language as the rest of the estate.
 */
export const FORMATS: { slug: EventFormat; name: string }[] = [
  { slug: 'conference', name: 'Conferences & Awards' },
  { slug: 'bespoke', name: 'Bespoke Events' },
  { slug: 'webinar', name: 'Webinars' },
]

/* ------------------------------------------------------------------ */
/* Multi-city tours                                                    */
/* ------------------------------------------------------------------ */
/**
 * One city stop on an event's tour.
 *
 * `status` is deliberately NOT a field. It is derived by `deriveLegStatus`
 * (src/lib/tour.ts) from whether `date` and `venue` are set, because a
 * hand-maintained status drifts the moment someone fills in a venue and
 * forgets to update it — the same failure that once put a "four verticals"
 * claim next to a seven-chip filter (see `sectorsInUse`).
 *
 * The three states exist because EBM announces a tour in stages: the city is
 * committed first, then the date, then the venue.
 */
export type EventLeg = {
  /** Display name — "New Delhi". */
  city: string
  /** URL segment for /tour/<slug>/ — "new-delhi". Kebab-case, stable. */
  slug: string
  /** ISO date, or null while only the month — or nothing — is fixed. */
  date: string | null
  /**
   * Label used when `date` is null but the month is known ("November 2026"),
   * mirroring EventRecord.dateLabel. Ignored when `date` is set: the date is
   * then formatted from the ISO value, so the two cannot disagree.
   */
  dateLabel?: string
  /** null until a venue is contracted. Never guessed. */
  venue: string | null
  /** Outbound maps link. A link, never an embedded iframe. */
  mapUrl?: string
  /**
   * City is planned but not contracted. Renders with a visible "provisional"
   * marker so a placeholder can never be read as a commitment.
   */
  provisional?: boolean
}

export type EventRecord = {
  slug: string
  edition: string
  name: string
  fullName: string
  /** Short form used in <title> so the SERP entry does not truncate. */
  seoName?: string
  /**
   * The exact <title> for this event, authored not generated. Four Manufacturing
   * editions share a name and a year, so a generated "name + year + city" both
   * collides and prints "undefined" for the editions with no evidenced city.
   *
   * BUDGET: the gate measures the raw HTML, so every "&" costs 5 characters as
   * `&amp;`, not 1. With the `| EBM` template (6) the real ceiling is
   * 59 - 4 x (number of ampersands). "CIO Summit & Awards 2023 - Leadership of
   * the Digital Age" reads as 56 but measured 66 and was rejected.
   */
  seoTitle: string
  theme?: string
  /** ISO date, or null where only a year or month is evidenced. */
  date: string | null
  dateLabel: string
  /** Always known — every poster prints its year. Used for archive grouping. */
  year: number
  timeLabel?: string
  /** null where no city has been evidenced. Never guessed. */
  city: string | null
  venue: string | null
  sector: Sector['slug']
  format: EventFormat
  status: 'upcoming' | 'past'
  /** Key into src/data/event-images.json. Real EBM artwork only. */
  image?: string
  /** Live URL on the existing estate — used until microsites are migrated. */
  externalUrl?: string
  registerUrl?: string
  speakerCount?: number
  /**
   * Whether THIS event actually published a delegate price on the live estate.
   * The 9,999/12,499/14,999 ladder appears only on the CISO pricing page and
   * the Manufacturing edition pages. Defaults to false so a new event can never
   * inherit someone else's price by accident.
   */
  pricingPublished?: boolean
  /**
   * City legs of this edition's tour, if it runs as one. Optional by design:
   * an event with no `legs` renders exactly as it does today, so adding a
   * tour to one edition cannot change any other. Order is irrelevant — the
   * rail sorts by date and pins undated legs to the end.
   */
  legs?: EventLeg[]
}

/**
 * Provenance and unresolved-data notes live in `event-notes.ts`, NOT here.
 *
 * This module is imported by Header (a client component), so everything in it
 * is bundled into the JavaScript served on every page. `source` and
 * `conflicts` are internal notes for the team and the client, and keeping them
 * in this file published all 26 of them in a shared chunk. The separation is
 * the guarantee; `verify.mjs` asserts it over both HTML and JS.
 */

/**
 * Twenty-six evidence-backed editions. "Today" for status purposes is
 * 3 September 2026.
 *
 * HOW THESE WERE VERIFIED (2026-09-03)
 * Two sources were used, and nothing is published on one alone unless that
 * source prints the fact itself:
 *   1. the 131-page crawl of the live estate (2 Sep 2026);
 *   2. EBM's own event artwork, recovered from the earlier redesign folder.
 *      Most posters print the edition number, full date, time and venue, and
 *      carry the EBM logo with "Conceptualized & Organised By". That makes the
 *      artwork a primary source, not decoration.
 *
 * A third source — the previous redesign's `events-data.js` / `events.json`,
 * which listed 34 events — was checked against the artwork and REJECTED as a
 * fact source. Eight of its records disagree with the poster they were shown
 * under (wrong edition number, wrong date, wrong venue, or a poster belonging
 * to an entirely different event). Where it is the only source for a claim,
 * that claim is not published here. Its errors are recorded per-event in
 * `conflicts` so they are not silently "rediscovered" later.
 *
 * DELIBERATELY NOT INCLUDED — see EXCLUDED_EVENTS below.
 */
export const EVENTS: EventRecord[] = [
  /* ---------------- upcoming ---------------- */
  {
    slug: 'enterprise-ai-security-cyber-resilience-summit-2026',
    edition: '2nd Edition',
    name: 'Enterprise AI Security & Cyber Resilience Summit',
    seoName: 'Enterprise AI Security Summit',
    seoTitle: 'Enterprise AI Security Summit 2026 — Bengaluru',
    fullName: '2nd Edition Enterprise AI Security & Cyber Resilience Summit 2026',
    theme: 'Securing the Intelligent Enterprise in the Age of Autonomous AI',
    date: '2026-09-18',
    dateLabel: 'Friday, 18 September 2026',
    year: 2026,
    timeLabel: '03:30 PM – 09:00 PM',
    city: 'Bengaluru',
    venue: null,
    sector: 'ciso-cybersecurity',
    format: 'conference',
    status: 'upcoming',
    image: 'hero/ciso',
    externalUrl: 'https://www.empiricbusinessmedia.com/ciso/',
    pricingPublished: true,
    registerUrl: 'https://www.empiricbusinessmedia.com/ciso/register.html',
  },
  {
    slug: 'next-gen-hr-tech-summit-awards-2026',
    edition: '3rd Edition',
    name: 'Next-Gen HR Tech Summit & Awards',
    seoName: 'Next-Gen HR Tech Summit',
    seoTitle: 'Next-Gen HR Tech Summit & Awards 2026 — Mumbai',
    fullName: '3rd Edition Next-Gen HR Tech Summit & Awards 2026',
    date: '2026-09-30',
    dateLabel: 'Wednesday, 30 September 2026',
    year: 2026,
    city: 'Mumbai',
    venue: null,
    sector: 'hr-technology',
    format: 'conference',
    status: 'upcoming',
    image: 'hero/hrtech',
    externalUrl: 'https://www.empiricbusinessmedia.com/hrtech/',
    registerUrl: 'https://www.empiricbusinessmedia.com/hrtech/register.html',
    /**
     * The 3rd Edition runs as a multi-city tour.
     *
     * EVIDENCE: only the Mumbai leg is evidenced — it is this edition's own
     * date and city, from EBM's live HR Tech site. The other six carry
     * `provisional: true` and render behind a visible "provisional" marker,
     * because the 2027 schedule is not fixed and EXCLUDED_EVENTS (below)
     * already records four invented 2027 events that verification rejected.
     * No leg here may lose its `provisional` flag without a date from the
     * client.
     *
     * The spread is deliberate: an 8-day hop, then 14, then 28, then two
     * ~12-week pauses, then an undated city. That exercises all three leg
     * states and makes the rail's proportional spacing visible.
     *
     * TODO(client): confirm the 2027 city list, dates and venues.
     */
    legs: [
      { city: 'Mumbai', slug: 'mumbai', date: '2026-09-30', venue: null },
      {
        city: 'Bengaluru',
        slug: 'bengaluru',
        date: '2026-10-08',
        venue: 'Sheraton Grand Bengaluru',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sheraton+Grand+Bengaluru',
        provisional: true,
      },
      { city: 'Chennai', slug: 'chennai', date: '2026-10-22', venue: null, provisional: true },
      {
        city: 'Hyderabad',
        slug: 'hyderabad',
        date: '2026-11-19',
        venue: 'HICC Novotel, Hyderabad',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=HICC+Novotel+Hyderabad',
        provisional: true,
      },
      { city: 'Pune', slug: 'pune', date: '2027-02-11', venue: null, provisional: true },
      {
        city: 'New Delhi',
        slug: 'new-delhi',
        date: '2027-05-06',
        venue: 'Pride Plaza Hotel, Aerocity',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Pride+Plaza+Hotel+Aerocity+New+Delhi',
        provisional: true,
      },
      { city: 'Kolkata', slug: 'kolkata', date: null, venue: null, provisional: true },
    ],
  },
  {
    slug: 'manufacturing-metamorphosis-of-business-2026-8th-edition',
    edition: '8th Edition',
    name: 'Manufacturing 5.0 — Metamorphosis of Business',
    seoName: 'Manufacturing 5.0 Summit',
    seoTitle: 'Manufacturing 5.0 Summit — 8th Edition, Bengaluru',
    fullName: '8th Edition Manufacturing Metamorphosis of Business 2026',
    date: null,
    dateLabel: 'November 2026',
    year: 2026,
    timeLabel: '08:30 AM – 05:30 PM',
    city: 'Bengaluru',
    venue: null,
    sector: 'manufacturing',
    format: 'conference',
    status: 'upcoming',
    image: 'poster/7.jpg',
    externalUrl: 'https://manufacturingsummit.empiricbusinessmedia.com/',
    pricingPublished: true,
    speakerCount: 34,
  },

  /* ---------------- past — 2026 ---------------- */
  {
    slug: 'manufacturing-metamorphosis-of-business-2026-7th-edition',
    edition: '7th Edition',
    name: 'Manufacturing 5.0 — Metamorphosis of Business',
    seoName: 'Manufacturing 5.0 Summit',
    seoTitle: 'Manufacturing 5.0 Summit — 7th Edition, New Delhi',
    fullName: '7th Edition Manufacturing Metamorphosis of Business 2026',
    date: '2026-08-13',
    dateLabel: 'Thursday, 13 August 2026',
    year: 2026,
    timeLabel: '08:30 AM – 05:30 PM',
    city: 'New Delhi',
    venue: 'Pride Plaza Hotel, Aerocity',
    sector: 'manufacturing',
    format: 'conference',
    status: 'past',
    image: 'poster/manuf-7thEdition.jpg',
    externalUrl: 'https://manufacturingsummit.empiricbusinessmedia.com/edition7/',
    speakerCount: 38,
  },
  {
    slug: 'cx-martech-personalization-summit-awards-2026',
    edition: '5th Edition',
    name: 'CX MarTech & Personalization Summit & Awards',
    seoName: 'CX MarTech Summit',
    seoTitle: 'CX MarTech & Personalization Summit 2026 — Mumbai',
    fullName: '5th Edition CX MarTech & Personalization Summit & Awards 2026',
    date: '2026-07-16',
    dateLabel: 'Thursday, 16 July 2026',
    year: 2026,
    city: 'Mumbai',
    venue: null,
    sector: 'cx',
    format: 'conference',
    status: 'past',
    image: 'poster/cxo-5thedition.jpg',
  },
  {
    slug: 'monsoon-cyber-sundown-ciso-leadership-evening-2026',
    edition: 'CISO Leadership Evening',
    name: 'Monsoon Cyber Sundown',
    seoName: 'Monsoon Cyber Sundown',
    seoTitle: 'Monsoon Cyber Sundown — CISO Evening 2026, Mumbai',
    fullName: 'Monsoon Cyber Sundown: A CISO Leadership Evening on Cloud, Code & Cyber Resilience',
    theme:
      'From red teams to real risks — where cybersecurity leaders engage in high-trust conversations.',
    date: '2026-07-17',
    dateLabel: 'Friday, 17 July 2026',
    year: 2026,
    timeLabel: '03:30 PM – 09:00 PM',
    city: 'Mumbai',
    venue: null,
    sector: 'ciso-cybersecurity',
    format: 'bespoke',
    status: 'past',
    image: 'poster/ciso-bannner.jpg',
  },
  {
    slug: 'insurance-excellence-summit-awards-2026',
    edition: '2nd Edition',
    name: 'Insurance Excellence Summit & Awards',
    seoName: 'Insurance Excellence Summit',
    seoTitle: 'Insurance Excellence Summit & Awards 2026 — Mumbai',
    fullName: '2nd Edition Insurance Excellence Summit and Awards 2026',
    theme: 'Where Industry Leaders Define The Future Of Insurance',
    date: '2026-06-11',
    dateLabel: 'Thursday, 11 June 2026',
    year: 2026,
    city: 'Mumbai',
    venue: null,
    sector: 'bfsi',
    format: 'conference',
    status: 'past',
    image: 'poster/11-june-26.jpg',
  },
  {
    slug: 'smart-future-of-bfsi-nbfc-india-summit-awards-2026',
    edition: '2nd Edition',
    name: 'Smart Future of BFSI & NBFC India Summit & Awards',
    seoName: 'BFSI & NBFC India Summit',
    seoTitle: 'Smart Future of BFSI & NBFC Summit 2026 — Mumbai',
    fullName: '2nd Edition Smart Future of BFSI & NBFC India Summit & Awards 2026',
    date: '2026-05-29',
    dateLabel: 'Friday, 29 May 2026',
    year: 2026,
    city: 'Mumbai',
    venue: 'Radisson Mumbai',
    sector: 'bfsi',
    format: 'conference',
    status: 'past',
    image: 'poster/29thmay26-bfsi.jpg',
  },
  {
    slug: 'manufacturing-metamorphosis-of-business-2026-6th-edition',
    edition: '6th Edition',
    name: 'Manufacturing 5.0 — Metamorphosis of Business',
    seoName: 'Manufacturing 5.0 Summit',
    seoTitle: 'Manufacturing 5.0 Summit — 6th Edition, Chennai',
    fullName: '6th Edition Manufacturing Metamorphosis of Business 2026',
    date: '2026-04-30',
    dateLabel: 'Thursday, 30 April 2026',
    year: 2026,
    timeLabel: '08:30 AM – 05:30 PM',
    city: 'Chennai',
    venue: 'ITC Grand Chola, Guindy',
    sector: 'manufacturing',
    format: 'conference',
    status: 'past',
    image: 'poster/30April26-Manufacturing-6thEdition.jpg',
    externalUrl: 'https://manufacturingsummit.empiricbusinessmedia.com/edition6/',
    speakerCount: 34,
  },
  {
    slug: 'next-gen-hr-tech-2026-2nd-edition',
    edition: '2nd Edition',
    name: 'Next-Gen HR Tech Summit & Awards',
    seoName: 'Next-Gen HR Tech Summit',
    seoTitle: 'Next-Gen HR Tech Summit — 2nd Edition, Chennai',
    fullName: '2nd Edition Next-Gen HR Tech Summit & Awards 2026',
    theme: 'Driving Business Growth Through Next-Gen HR Technology',
    date: '2026-04-29',
    dateLabel: 'Wednesday, 29 April 2026',
    year: 2026,
    city: 'Chennai',
    venue: 'Hyatt Regency, Chennai',
    sector: 'hr-technology',
    format: 'conference',
    status: 'past',
    image: 'poster/gen-hr-29thApril26.jpg',
    externalUrl: 'https://www.empiricbusinessmedia.com/hrtech/hrtech-2ndEdition/',
  },
  {
    slug: 'manufacturing-metamorphosis-of-business-5th-edition',
    edition: '5th Edition',
    name: 'Manufacturing 5.0 — Metamorphosis of Business',
    seoName: 'Manufacturing 5.0 Summit',
    seoTitle: 'Manufacturing 5.0 Summit — 5th Edition, Pune',
    fullName: '5th Edition Manufacturing Metamorphosis of Business 2026',
    date: '2026-02-13',
    dateLabel: 'Friday, 13 February 2026',
    year: 2026,
    city: 'Pune',
    venue: 'Sheraton Grand Pune Bund Garden',
    sector: 'manufacturing',
    format: 'conference',
    status: 'past',
    image: 'poster/13feb2026.jpg',
    externalUrl: 'https://manufacturingsummit.empiricbusinessmedia.com/edition5/',
    speakerCount: 35,
  },

  /* ---------------- past — 2025 ---------------- */
  {
    slug: 'world-osc-congress-2025',
    edition: 'Congress 2025',
    name: 'World OSC Congress',
    seoName: 'World OSC Congress',
    seoTitle: 'World OSC Congress 2025 — New Delhi',
    fullName: 'World OSC Congress 2025',
    theme: 'Ocean Engineering · Subsea Engineering · Cyber-Physical Systems',
    date: '2025-09-25',
    dateLabel: '25–26 September 2025',
    year: 2025,
    city: 'New Delhi',
    venue: 'Bharat Mandapam',
    sector: 'technology',
    format: 'conference',
    status: 'past',
    image: 'poster/World-OSC-2025.jpg',
  },
  {
    slug: 'cfo-leadership-summit-awards-2025-4th-edition',
    edition: '4th Edition',
    name: 'CFO Leadership Summit & Awards',
    seoName: 'CFO Leadership Summit',
    seoTitle: 'CFO Leadership Summit & Awards — 4th Edition, 2025',
    fullName: '4th Edition CFO Leadership Summit & Awards 2025',
    date: '2025-04-25',
    dateLabel: 'Friday, 25 April 2025',
    year: 2025,
    timeLabel: '08:30 AM – 05:30 PM',
    city: 'Mumbai',
    venue: 'Holiday Inn, Mumbai International Airport',
    sector: 'cfo-finance',
    format: 'conference',
    status: 'past',
    image: 'poster/4th-edition-CFO.jpg',
  },
  {
    slug: 'future-tech-5-0-summit-awards-2025',
    edition: 'Summit & Awards 2025',
    name: 'The Future Tech 5.0 Summit & Awards',
    seoName: 'Future Tech 5.0 Summit',
    seoTitle: 'The Future Tech 5.0 Summit & Awards 2025 — Mumbai',
    fullName: 'The Future Tech 5.0 Summit & Awards 2025',
    date: '2025-04-24',
    dateLabel: 'Thursday, 24 April 2025',
    year: 2025,
    timeLabel: '08:30 AM – 05:30 PM',
    city: 'Mumbai',
    venue: 'Holiday Inn, Mumbai International Airport',
    sector: 'technology',
    format: 'conference',
    status: 'past',
    image: 'poster/future-tech-5.0.jpg',
  },
  {
    slug: 'manufacturing-metamorphosis-of-business-2025-4th-edition',
    edition: '4th Edition',
    name: 'Manufacturing 5.0 — Metamorphosis of Business',
    seoName: 'Manufacturing 5.0 Summit',
    seoTitle: 'Manufacturing 5.0 Summit — 4th Edition, Pune 2025',
    fullName: '4th Edition Manufacturing Metamorphosis of Business 2025',
    date: '2025-02-20',
    dateLabel: 'Thursday, 20 February 2025',
    year: 2025,
    timeLabel: '08:30 AM – 05:30 PM',
    city: 'Pune',
    venue: 'Sheraton Grand Pune Bund Garden Hotel',
    sector: 'manufacturing',
    format: 'conference',
    status: 'past',
    image: 'poster/Manufacturing-4.jpg',
    externalUrl: 'https://manufacturingsummit.empiricbusinessmedia.com/edition4/',
    speakerCount: 36,
  },
  {
    slug: 'bfsi-revolution-summit-awards-2025',
    edition: 'Summit & Awards 2025',
    name: 'BFSI Revolution Summit & Awards',
    seoName: 'BFSI Revolution Summit',
    seoTitle: 'BFSI Revolution Summit & Awards 2025 — Mumbai',
    fullName: 'BFSI Revolution Summit & Awards 2025',
    date: '2025-01-24',
    dateLabel: 'Tuesday, 24 January 2025',
    year: 2025,
    timeLabel: '08:30 AM – 05:30 PM',
    city: 'Mumbai',
    venue: null,
    sector: 'bfsi',
    format: 'conference',
    status: 'past',
    image: 'poster/BFSI-banner.jpg',
  },

  /* ---------------- past — 2024 ---------------- */
  {
    slug: 'smart-future-of-tax-and-finance-summit-awards-2024',
    edition: '4th Edition',
    name: 'Smart Future of Tax and Finance Summit & Awards',
    seoName: 'Tax and Finance Summit',
    seoTitle: 'Tax and Finance Summit & Awards — 4th Edition, 2024',
    fullName: '4th Edition Smart Future of Tax and Finance Summit & Awards 2024',
    date: '2024-11-15',
    dateLabel: 'Friday, 15 November 2024',
    year: 2024,
    timeLabel: '08:30 AM – 05:30 PM',
    city: 'Mumbai',
    venue: null,
    sector: 'cfo-finance',
    format: 'conference',
    status: 'past',
    image: 'poster/tax-finance-2024.jpeg',
  },
  {
    slug: 'future-of-l-and-d-conference-awards-2024',
    edition: '1st Edition',
    name: 'The Future of L&D Conference & Awards',
    seoName: 'Future of L&D Conference',
    seoTitle: 'The Future of L&D Conference & Awards 2024 — Mumbai',
    fullName: 'The Future of L&D Conference & Award 2024',
    date: '2024-10-17',
    dateLabel: 'Thursday, 17 October 2024',
    year: 2024,
    timeLabel: '08:30 AM – 05:30 PM',
    city: 'Mumbai',
    venue: 'Courtyard by Marriott, Mumbai International Airport',
    sector: 'hr-technology',
    format: 'conference',
    status: 'past',
    image: 'poster/lnd-banner.jpg',
    externalUrl: 'https://lndsummit.empiricbusinessmedia.com/',
  },
  {
    slug: 'cfo-leadership-summit-awards-2024-3rd-edition',
    edition: '3rd Edition',
    name: 'CFO Leadership Summit & Awards',
    seoName: 'CFO Leadership Summit',
    seoTitle: 'CFO Leadership Summit & Awards — 3rd Edition, 2024',
    fullName: '3rd Edition CFO Leadership Summit & Awards 2024',
    date: '2024-06-20',
    dateLabel: 'Thursday, 20 June 2024',
    year: 2024,
    timeLabel: '08:30 AM – 05:30 PM',
    city: 'New Delhi',
    venue: "Holiday Inn New Delhi Int'l Airport",
    sector: 'cfo-finance',
    format: 'conference',
    status: 'past',
    image: 'poster/cfo-2024.jpeg',
  },
  {
    slug: 'manufacturing-metamorphosis-of-business-2024-3rd-edition',
    edition: '3rd Edition',
    name: 'Manufacturing 5.0 — Metamorphosis of Business',
    seoName: 'Manufacturing 5.0 Summit',
    seoTitle: 'Manufacturing 5.0 Summit — 3rd Edition, 2024',
    fullName: '3rd Edition Manufacturing Metamorphosis of Business 2024',
    date: null,
    dateLabel: '2024',
    year: 2024,
    city: null,
    venue: null,
    sector: 'manufacturing',
    format: 'conference',
    status: 'past',
    image: 'poster/manufacturing-3rd-edition.jpeg',
  },

  /* ---------------- past — 2023 ---------------- */
  {
    slug: 'cx-innovation-technology-summit-awards-2023-3rd-edition',
    edition: '3rd Edition',
    name: 'CX Innovation & Technology Summit & Awards',
    seoName: 'CX Innovation Summit',
    seoTitle: 'CX Innovation & Technology Summit — 3rd Edition 2023',
    fullName: '3rd Edition CX Innovation and Technology Summit & Awards 2023',
    theme: 'Data Driven Decision making for superior Customer Experience',
    date: null,
    dateLabel: '2023',
    year: 2023,
    city: null,
    venue: null,
    sector: 'cx',
    format: 'conference',
    status: 'past',
    image: 'poster/cx-edition3-2023.jpg',
  },
  {
    slug: 'cx-innovation-technology-summit-awards-2023-2nd-edition',
    edition: '2nd Edition',
    name: 'CX Innovation & Technology Summit & Awards',
    seoName: 'CX Innovation Summit',
    seoTitle: 'CX Innovation & Technology Summit — 2nd Edition 2023',
    fullName: '2nd Edition CX Innovation and Technology Summit & Awards 2023',
    theme: 'Data Driven Decision making for superior Customer Experience',
    date: null,
    dateLabel: '2023',
    year: 2023,
    city: null,
    venue: null,
    sector: 'cx',
    format: 'conference',
    status: 'past',
    image: 'poster/cx-edition2-2023.jpg',
  },
  {
    slug: 'cio-summit-awards-2023',
    edition: 'Summit & Awards 2023',
    name: 'CIO Summit & Awards — Leadership of the Digital Age',
    seoName: 'CIO Summit & Awards',
    seoTitle: 'CIO Summit & Awards 2023 — Digital Age Leadership',
    fullName: 'CIO Summit & Awards 2023 — Leadership of the Digital-Age',
    date: null,
    dateLabel: '2023',
    year: 2023,
    city: null,
    venue: null,
    sector: 'technology',
    format: 'conference',
    status: 'past',
    image: 'poster/CIO-2023.jpg',
  },
  {
    slug: 'amrut-tech-summit-2023',
    edition: 'Tech Summit 2023',
    name: 'Amrut Tech Summit',
    seoName: 'Amrut Tech Summit',
    seoTitle: 'Amrut Tech Summit 2023 — Modern Service Management',
    fullName: 'Amrut Tech Summit 2023',
    theme: 'Modern Service Management versus Traditional ITSM',
    date: null,
    dateLabel: '2023',
    year: 2023,
    city: null,
    venue: null,
    sector: 'technology',
    format: 'bespoke',
    status: 'past',
    image: 'poster/amrut-tech-summit-16th-march-2023.jpg',
  },

  /* ---------------- past — 2022 ---------------- */
  {
    slug: 'cx-innovation-technology-summit-awards-2022',
    edition: 'Summit & Awards 2022',
    name: 'CX Innovation and Technology Summit & Awards',
    seoName: 'CX Innovation Summit',
    seoTitle: 'CX Innovation & Technology Summit & Awards 2022',
    fullName: 'CX Innovation and Technology Summit & Awards 2022',
    theme: 'Data Driven Decision making for superior Customer Experience',
    date: null,
    dateLabel: '2022',
    year: 2022,
    city: null,
    venue: null,
    sector: 'cx',
    format: 'conference',
    status: 'past',
    image: 'poster/cx-2022.jpg',
  },
  {
    slug: 'cfo-leadership-summit-awards-2022',
    edition: 'Summit & Awards 2022',
    name: 'CFO Leadership Summit & Awards',
    seoName: 'CFO Leadership Summit',
    seoTitle: 'CFO Leadership Summit & Awards 2022',
    fullName: 'CFO Leadership Summit & Awards 2022',
    date: null,
    dateLabel: '2022',
    year: 2022,
    city: null,
    venue: null,
    sector: 'cfo-finance',
    format: 'conference',
    status: 'past',
    image: 'poster/CFO-2022.jpg',
  },
]

/**
 * Rejected during verification — recorded so nobody "rediscovers" them and
 * publishes them by mistake. None of these may ship without new evidence.
 *
 * Category A — flagged `illustrative` in the previous redesign's own data:
 * four 2027 events. Invented for a mock-up.
 *
 * Category B — no evidence of any kind. Seven records whose titles appear
 * nowhere in the 131-page crawl, which have no poster, and which were
 * illustrated with a generic booth or gallery photograph rather than event
 * artwork. Generic names, generic venues ("Mumbai", "Chennai", "Online").
 *
 * TODO(client): confirm whether any of Category B are real. If they are, they
 * need a date, city and venue before they can be published.
 */
export const EXCLUDED_EVENTS = [
  { title: 'CISO Leadership Summit & Awards — 2nd Edition', claimed: 'Q2 2027', reason: 'illustrative' },
  { title: 'CX Innovation & Technology Summit & Awards — 4th Edition', claimed: 'Q2 2027', reason: 'illustrative' },
  { title: 'Supply Chain Resilience Roundtables', claimed: 'Ongoing 2027', reason: 'illustrative' },
  { title: 'CFO Leadership Summit & Awards — 5th Edition', claimed: 'Q1 2027', reason: 'illustrative' },
  { title: 'Leadership Roundtable', claimed: '24 January 2025, Mumbai', reason: 'no evidence' },
  { title: 'CIO Leadership Conclave 2024', claimed: '23 May 2024, Bengaluru', reason: 'no evidence' },
  { title: 'South India Leadership Forum', claimed: '1 February 2024, Chennai', reason: 'no evidence' },
  { title: 'Enterprise Technology Summit', claimed: '4 August 2023, New Delhi', reason: 'no evidence' },
  { title: 'Technology Leadership Conclave', claimed: '24 May 2023, Bengaluru', reason: 'no evidence' },
  { title: 'Business Leaders Meet', claimed: '11 May 2023, Mumbai', reason: 'no evidence' },
  { title: 'Digital Transformation Webinar Series', claimed: '15 July 2022, Online', reason: 'no evidence' },
] as const

/* ------------------------------------------------------------------ */
/* Verifiable proof — DERIVED, never typed by hand                     */
/* ------------------------------------------------------------------ */
/**
 * Every number here is a `length` over real records, so it cannot drift out of
 * step with EVENTS the way the hand-written version did (it claimed 6 host
 * cities while naming only 5, and 4 verticals while 7 have run).
 *
 * Partner brands stays a literal: it counts logo files in assets.json, not
 * events. The old animated counters (525 events, 31,013 delegates) remain in
 * STATS with `verified: false` and are still not published anywhere.
 */
const eventCities = [...new Set(EVENTS.map((e) => e.city).filter((c): c is string => Boolean(c)))]
const eventSectors = SECTORS.filter((s) => EVENTS.some((e) => e.sector === s.slug))
const earliestYear = Math.min(...EVENTS.map((e) => e.year))

export const PROOF = [
  {
    value: String(EVENTS.length),
    label: 'Editions delivered',
    note: `Across ${eventSectors.length} industry verticals since ${earliestYear}`,
  },
  {
    value: String(eventSectors.length),
    label: 'Industry verticals',
    note: eventSectors.map((s) => s.name).join(', '),
  },
  {
    value: String(eventCities.length),
    label: 'Host cities',
    note: eventCities.join(', '),
  },
  { value: '37', label: 'Partner brands', note: 'Sponsors and exhibitors to date' },
] as const

/* ------------------------------------------------------------------ */
/* Delegate pricing                                                    */
/* ------------------------------------------------------------------ */
/**
 * The old estate published this identical ladder — with the identical
 * "After 20th January 2026" deadline — on five events dated Feb, Apr, Aug,
 * Sep and Nov 2026. The amounts are real; the deadlines are not per-event.
 * TODO(client): supply per-event early-bird cut-off dates.
 */
export const PRICING = {
  currency: 'INR',
  tiers: [
    { name: 'Early Bird 1', amount: 9999, note: 'Limited seats' },
    { name: 'Early Bird 2', amount: 12499, note: 'Subject to availability' },
    { name: 'Standard', amount: 14999, note: 'Regular delegate pass' },
  ],
  taxNote: 'All prices exclusive of applicable taxes.',
  deadlinesVerified: false,
  /**
   * WARNING for the client: on the live Manufacturing register form the option
   * VALUES and their LABELS disagree — value="7,999" is labelled "₹9,999 + Taxes",
   * 12,999 is labelled ₹12,499, and 19,999 is labelled ₹14,999. The amount
   * submitted is not the amount advertised. Resolve before any form goes live.
   * Source: crawl2/ms__register.html and the edition5/6/7 equivalents.
   */
  amountsMatchLabels: false,
} as const

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */
/**
 * Only ONE real article exists on the old site. blog-2.html republished the
 * same body under a different headline; a third headline linked to a 404.
 */
export const POSTS = [
  {
    slug: 'how-to-plan-a-high-impact-corporate-event-in-india',
    title: 'How to Plan a High-Impact Corporate Event in India',
    excerpt:
      'What separates a corporate event that delivers pipeline from one that just fills a room: audience, agenda, venue and follow-through.',
    date: '2026-08-20',
    author: 'Empiric Business Media',
    readingMinutes: 4,
    keyword: 'how to plan a corporate event in India',
  },
] as const

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */
/**
 * The old site ran four quotes attributed to "Industry Professional",
 * "Senior Business Leader", "Industry Decision-Maker" and "Corporate Leader" —
 * no real people. Client decision: do not republish unattributed quotes.
 * TODO(client): supply real name, title and company for each quote to enable.
 */
export const TESTIMONIALS: {
  quote: string
  name: string
  title: string
  company: string
}[] = []

export const NAV = [
  { label: 'About', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Events', href: '/events/' },
  { label: 'On tour', href: '/tour/' },
  { label: 'Sponsorship', href: '/sponsorship/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Blog', href: '/blog/' },
] as const
