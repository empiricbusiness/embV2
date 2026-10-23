/**
 * Bespoke client events — landing pages EBM hosts for an event it is helping
 * a client fill, at /bespoke/<slug>/. Each page is built entirely from one
 * record here, so the next bespoke event is a new entry, not new code.
 *
 * These pages showcase a CLIENT's event. The client's identity leads, EBM is
 * credited only with the line the client approved, and nothing on the page
 * may present EBM as organiser. Every fact below is either confirmed by the
 * client in writing or taken from the client's official event page — no
 * placeholder speakers, invented agenda items, attendance figures or benefits.
 *
 * Kept out of site.ts on purpose: that module is imported by client
 * components, so anything in it ships to every page's JavaScript.
 */

export type BespokeSpeaker = {
  name: string
  role: string
  /** 300x300 portrait under /images/bespoke/<slug>/speakers/. */
  photo: string
  /** Shown in a larger row of its own above the rest of the speakers. */
  featured?: boolean
}

export type BespokeEvent = {
  slug: string
  /** The client's event name, exactly as the client writes it. */
  name: string
  edition: string
  theme: string
  client: {
    name: string
    url: string
    logo: { src: string; w: number; h: number }
  }
  /** ISO 8601 with offset, for structured data. */
  startDate: string
  dateLabel: string
  timeLabel: string
  venue: { name: string; city: string; region: string; mapsUrl: string }
  entryNote?: string
  about: string[]
  themes: string[]
  whyAttend: { title: string; body: string }[]
  speakers: BespokeSpeaker[]
  partners: { tier: string; names: string[] }[]
  /** The client's own event website. */
  officialUrl: string
  /**
   * UTM tags on every link to the client's site, so the client's analytics
   * can credit the visitors EBM sends. Each link adds its own utm_content.
   */
  outboundUtm: { source: string; medium: string; campaign: string }
  registration: {
    /** The client's Apps Script web app. */
    endpoint: string
    /** The Sheet tab the script writes to (its `targetSheet` parameter). */
    targetSheet: string
  }
  /** The label EBM's credit is shown under. */
  credit: string
  contact: { name: string; phone: string; tel: string }
  meta: { title: string; description: string; ogImage: string }
}

export const BESPOKE_EVENTS: BespokeEvent[] = [
  {
    slug: 'news18',
    name: 'News18 Rising Bharat Summit',
    edition: 'West Regional Edition',
    theme: 'The Next Phase of Indian Enterprise',
    client: {
      name: 'News18',
      url: 'https://www.news18.com/',
      logo: { src: '/images/bespoke/news18/news18-logo.png', w: 331, h: 126 },
    },
    // Confirmed by EBM in writing, 23 Oct 2026. The official page's title
    // says 2027; 2026 is correct.
    startDate: '2026-10-28T10:00:00+05:30',
    dateLabel: 'Wednesday, 28 October 2026',
    timeLabel: '10:00 AM onwards',
    venue: {
      name: 'Taj Lands End',
      city: 'Mumbai',
      region: 'Maharashtra',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Taj+Lands+End+Mumbai',
    },
    entryNote: 'Entry is on a first-come, first-served basis.',
    about: [
      'The News18 Rising Bharat Summit brings its West Regional Edition to Mumbai on 28 October 2026, under the theme The Next Phase of Indian Enterprise.',
      'The West is one of the country’s busiest business corridors: Mumbai’s finance, fintech and media, Pune’s engineering and innovation base, Gujarat’s manufacturing and global trade, and Rajasthan’s energy, minerals and industry.',
      'Across the day, policymakers and business leaders take on where the next opportunities are emerging, how technology is changing the way enterprises are built and funded, and what Indian companies will need to compete over the coming decade.',
    ],
    themes: [
      'Funding the next big idea',
      'Building businesses at scale',
      'Where the next opportunities are',
      'Technology and the enterprise',
      'Competing in the next decade',
    ],
    whyAttend: [
      {
        title: 'Hear policy from the people who make it',
        body: 'Maharashtra’s Chief Minister and Deputy Chief Minister, Gujarat’s Deputy Chief Minister and Mumbai’s Municipal Commissioner are on the speaker list.',
      },
      {
        title: 'Learn from leaders building at scale',
        body: 'Speakers lead or helped build Wockhardt, Morgan Stanley India, HDFC Bank’s mortgage business, PhonePe Lending, Spinny, Dhan and upGrad, among others.',
      },
      {
        title: 'See where the next decade is heading',
        body: 'The sessions look at funding new ideas, scaling businesses and how technology is changing the way Indian enterprise competes.',
      },
      {
        title: 'Be in the room in Mumbai',
        body: 'A day at Taj Lands End with the policymakers, founders and market leaders shaping the West’s growth.',
      },
    ],
    // From the official event page (West edition), 23 Oct 2026, in its order.
    // The first three lead the section in a row of their own.
    speakers: [
      { name: 'Shri Devendra Fadnavis', role: 'Chief Minister, Maharashtra', photo: 'devendra-fadnavis', featured: true },
      { name: 'Shri Eknath Shinde', role: 'Deputy Chief Minister, Maharashtra', photo: 'eknath-shinde', featured: true },
      { name: 'Shri Harsh Sanghavi', role: 'Deputy Chief Minister, Gujarat', photo: 'harsh-sanghavi', featured: true },
      { name: 'Dr. Shrikant Eknath Shinde', role: 'MP, Lok Sabha', photo: 'shrikant-shinde' },
      {
        name: 'Ashwini Bhide',
        role: 'Municipal Commissioner, Mumbai Municipal Corporation & MD, Mumbai Metro Corporation',
        photo: 'ashwini-bhide',
      },
      { name: 'Dr. Habil Khorakiwala', role: 'Chairman, Wockhardt Group', photo: 'habil-khorakiwala' },
      { name: 'Kushagra Bajaj', role: 'MD, Bajaj Hindusthan', photo: 'kushagra-bajaj' },
      {
        name: 'Abhinandan Lodha',
        role: 'Founder, Chairman & MD, The House of Abhinandan Lodha',
        photo: 'abhinandan-lodha',
      },
      { name: 'Ridham Desai', role: 'MD, Morgan Stanley India', photo: 'ridham-desai' },
      { name: 'Sumant Rampal', role: 'Group Head, Mortgage Business, HDFC Bank', photo: 'sumant-rampal' },
      { name: 'Niraj Singh', role: 'Founder & CEO, Spinny', photo: 'niraj-singh' },
      { name: 'Pravin Jadhav', role: 'Founder & CEO, Dhan', photo: 'pravin-jadhav' },
      { name: 'Hemant Gala', role: 'CEO, PhonePe Lending', photo: 'hemant-gala' },
      { name: 'Maneesh Dangi', role: 'Founder & CEO, Mosaic Asset Management', photo: 'maneesh-dangi' },
      { name: 'Mayank Kumar', role: 'Co-Founder, upGrad & Borderplus', photo: 'mayank-kumar' },
      { name: 'Naiyya Saggi', role: 'Founder & CEO, EDT', photo: 'naiyya-saggi' },
      { name: 'Dhvanil Sheth', role: 'Founder & CEO, Skillmatics', photo: 'dhvanil-sheth' },
      { name: 'Shivam Aggarwal', role: 'VP – Strategy, Sattva', photo: 'shivam-aggarwal' },
    ].map((s) => ({ ...s, photo: `/images/bespoke/news18/speakers/${s.photo}.webp` })),
    // Names in text only — the client asked for no partner logos.
    partners: [
      { tier: 'Presenting Partner', names: ['HDFC'] },
      { tier: 'Co-presenting Partners', names: ['Bajaj Group', 'Sattva'] },
      { tier: 'Bharat Growth Partner', names: ['ITC'] },
      { tier: 'Associate Partners', names: ['PhonePe', 'Spinny', 'Joy', 'Datar Cancer Genetics', 'Reliance'] },
      { tier: 'Partners', names: ['MIDC', 'MSRDC', 'SRA Brihanmumbai'] },
    ],
    // The link first shared for this event ended in "?hfhrnf", which may be a
    // tracking code. Left off until that is confirmed; if it is one, add it
    // here — withUtm() keeps it exactly as written.
    officialUrl: 'https://www.news18features.com/risingbharatsummit/',
    outboundUtm: { source: 'empiricbusinessmedia', medium: 'referral', campaign: 'rising_bharat_west_2026' },
    registration: {
      endpoint:
        'https://script.google.com/macros/s/AKfycbzoV6e-N1gf5VEmTV3H1K33iDNiKsaZNfEOX6ODSLutNg6ZFbaFuxtBC5nXWJf78oyv/exec',
      targetSheet: 'News18',
    },
    // Worded as approved in writing on 23 Oct 2026. A partner-tier label (such
    // as "Association Partner") would claim an official role in News18's
    // event, so it needs that approval first.
    credit: 'Bringing Guests Onboard',
    contact: { name: 'Jasmine', phone: '+91 93268 14059', tel: 'tel:+919326814059' },
    meta: {
      title: 'News18 Rising Bharat Summit West Edition, Mumbai',
      description:
        'Register for the News18 Rising Bharat Summit – West Regional Edition, 28 October 2026 at Taj Lands End, Mumbai. Theme: The Next Phase of Indian Enterprise.',
      ogImage: '/og/bespoke-news18.png',
    },
  },
]

export function getBespokeEvent(slug: string) {
  return BESPOKE_EVENTS.find((e) => e.slug === slug)
}
