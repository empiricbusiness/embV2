/**
 * Internal research notes, keyed by event slug — SERVER-ONLY BY CONSTRUCTION.
 *
 * `source` records where every published fact about an edition came from.
 * `conflicts` records contradictions found during verification that the client
 * has to resolve. Both are written for the team and for the client's review
 * call; neither is visitor-facing copy.
 *
 * They live here, apart from `site.ts`, for one concrete reason: `site.ts` is
 * imported by Header, which is a client component, so its entire contents are
 * bundled into the JavaScript every page loads. While these notes lived there
 * they shipped to the public in a shared chunk — 26 provenance notes and 19
 * conflict notes naming unresolved data problems. Import this module ONLY from
 * server components. `scripts/verify.mjs` fails the build if any of this text
 * appears in the exported HTML or JS.
 *
 * HOW THE FACTS WERE VERIFIED (2026-09-03)
 * Two sources, and nothing is published on one alone unless that source prints
 * the fact itself: the 131-page crawl of the live estate, and EBM's own event
 * artwork. Most posters print the edition number, full date, time and venue and
 * carry the EBM logo with "Conceptualized & Organised By", which makes the
 * artwork a primary source rather than decoration.
 *
 * A third source — the previous redesign's event list — was checked against the
 * artwork and rejected as a fact source; eight of its records disagree with the
 * poster they were shown under. Its errors are recorded below so they are not
 * silently rediscovered.
 */
export type EventNote = {
  source: string
  conflicts?: string[]
}

export const EVENT_NOTES: Record<string, EventNote> = {
  'enterprise-ai-security-cyber-resilience-summit-2026': {
    source: 'Live /ciso/ microsite (crawl 2026-09-02).',
    conflicts: [
        'City conflict: the homepage and CISO home say Bengaluru; the CISO venue page says Hilton Mumbai International Airport.',
      ],
  },
  'next-gen-hr-tech-summit-awards-2026': {
    source: 'Live /hrtech/ microsite (crawl 2026-09-02).',
    conflicts: [
        'City conflict: the hero says Mumbai; the contact page says Hyatt Regency, Chennai.',
        'The live page currently shows the CISO summit headline and counts down to the CISO date (18 Sep), not 30 Sep.',
        'No delegate price has ever been published for this event, so none is shown. Supply the ladder and set pricingPublished.',
      ],
  },
  'manufacturing-metamorphosis-of-business-2026-8th-edition': {
    source:
        'Poster (8th Edition, November 2026, Bangalore, EBM logo) + manufacturingsummit subdomain (crawl).',
    conflicts: [
        'No calendar date published — only "November 2026". No venue named.',
        'Speaker roster is identical to the 6th Edition; likely a placeholder.',
      ],
  },
  'manufacturing-metamorphosis-of-business-2026-7th-edition': {
    source:
        'Poster (7th Edition, Thursday 13th August 2026, Pride Plaza Hotel Aerocity Delhi) + edition7 microsite.',
  },
  'cx-martech-personalization-summit-awards-2026': {
    source: 'Poster (5th Edition, 16th July 2026, Mumbai India, EBM logo).',
    conflicts: [
        'The previous redesign listed this as 17 July 2026. The poster prints 16 July — the poster is used.',
        'No venue printed on the artwork and none published elsewhere.',
      ],
  },
  'monsoon-cyber-sundown-ciso-leadership-evening-2026': {
    source:
        'Poster (Friday 17th July 2026, 03:30–09:00 PM, Mumbai India) — titled "Monsoon Cyber Sundown", themed Secure the Cloud / Strengthen the Code / Build Resilience.',
    conflicts: [
        'The previous redesign attached this poster to a "CISO Leadership Summit & Awards" dated 24 April 2025. The artwork is a different event entirely; that record was dropped and this one created from the poster.',
      ],
  },
  'insurance-excellence-summit-awards-2026': {
    source: 'Poster (2nd Edition, 11th June 2026 Thursday, Mumbai, EBM logo).',
  },
  'smart-future-of-bfsi-nbfc-india-summit-awards-2026': {
    source: 'Poster (2nd Edition, 29th May 2026 Friday, Radisson Mumbai, EBM logo).',
    conflicts: [
        'The previous redesign listed this as the 4th Edition. The poster prints 2nd Edition — the poster is used.',
      ],
  },
  'manufacturing-metamorphosis-of-business-2026-6th-edition': {
    source: 'Poster (6th Edition, Thursday 30th April 2026, Chennai) + edition6 microsite.',
  },
  'next-gen-hr-tech-2026-2nd-edition': {
    source:
        'Poster (Next-Gen HR Tech Summit and Awards 2026, Chennai, Wednesday 29th April 2026, EBM logo — theme printed on artwork) + hrtech microsite.',
  },
  'manufacturing-metamorphosis-of-business-5th-edition': {
    source:
        'Poster (5th Edition, Friday 13th February 2026, Sheraton Grand Pune Bund Garden) + edition5 microsite.',
    conflicts: [
        'Microsite page title says 2025; the published hero date and the poster both say 13 February 2026.',
        'The previous redesign labelled this the 6th Edition. The poster prints 5th Edition — the poster is used.',
      ],
  },
  'world-osc-congress-2025': {
    source:
        'Poster (25–26 September 2025, Bharat Mandapam New Delhi, "Conceptualized & Organised By Empiric Business Media").',
  },
  'cfo-leadership-summit-awards-2025-4th-edition': {
    source:
        'Poster (4th Edition, Friday 25th April 2025, 08:30 AM–05:30 PM, Holiday Inn Mumbai International Airport, EBM logo).',
  },
  'future-tech-5-0-summit-awards-2025': {
    source:
        'Poster (24th April 2025, 08:30 AM–05:30 PM, Holiday Inn Mumbai International Airport, "Conceptualized & Organised By Empiric Business Media").',
    conflicts: [
        'The previous redesign published this date and venue under the name "CISO Leadership Summit & Awards". The artwork names it The Future Tech 5.0 Summit & Awards — the artwork is used.',
      ],
  },
  'manufacturing-metamorphosis-of-business-2025-4th-edition': {
    source:
        'Poster (4th Edition, Thursday 20th Feb 2025, 08:30 AM–05:30 PM, Sheraton Grand Pune Bund Garden Hotel) + edition4 microsite.',
  },
  'bfsi-revolution-summit-awards-2025': {
    source:
        'Poster (BFSI Revolution Summit & Awards 2025, Tuesday 24th January 2025, 08:30 AM–05:30 PM, Mumbai, EBM logo).',
    conflicts: [
        'The previous redesign published this poster as "BFSI Summit & Awards, 13 June 2024, Courtyard Mumbai International Airport". The artwork disagrees on name, date and year — the artwork is used.',
      ],
  },
  'smart-future-of-tax-and-finance-summit-awards-2024': {
    source:
        'Poster (4th Edition, Friday 15th November 2024, 08:30 AM–05:30 PM, Location Mumbai, EBM logo).',
    conflicts: [
        'The previous redesign listed 20 June 2024 at Holiday Inn New Delhi — that date and venue actually belong to the 3rd Edition CFO Leadership Summit. The poster is used.',
      ],
  },
  'future-of-l-and-d-conference-awards-2024': {
    source:
        'Poster (Thursday 17th October 2024, 08:30 AM–05:30 PM, Location Mumbai, EBM logo) + lndsummit subdomain (crawl).',
    conflicts: [
        'The previous redesign listed 15 November 2024. Both the poster and the live microsite say 17 October 2024.',
      ],
  },
  'cfo-leadership-summit-awards-2024-3rd-edition': {
    source:
        "Poster (3rd Edition, Thursday 20th June 2024, 08:30 AM–05:30 PM, Holiday Inn New Delhi Int'l Airport, EBM logo).",
    conflicts: [
        'The previous redesign listed 22 August 2024 at Aloft Aerocity and gave no edition number. The poster disagrees on both — the poster is used.',
      ],
  },
  'manufacturing-metamorphosis-of-business-2024-3rd-edition': {
    source: 'Poster (3rd Edition, Metamorphosis of Business 2024). No date, city or venue printed.',
    conflicts: [
        'TODO(client): supply the date, city and venue. The previous redesign claimed 17 October 2024 at Courtyard by Marriott Mumbai — that is the L&D 2024 slot, so it cannot also be this event.',
      ],
  },
  'cx-innovation-technology-summit-awards-2023-3rd-edition': {
    source: 'Poster (3rd Edition, 2023, theme printed on artwork). No date, city or venue printed.',
    conflicts: [
        'TODO(client): supply the date, city and venue. The previous redesign claimed 24 November 2023 at Hyatt Pune; nothing corroborates it.',
      ],
  },
  'cx-innovation-technology-summit-awards-2023-2nd-edition': {
    source: 'Poster (2nd Edition, 2023, theme printed on artwork). No date, city or venue printed.',
    conflicts: [
        'TODO(client): supply the date, city and venue. The previous redesign claimed 3 November 2023 at Novotel Pune; nothing corroborates it.',
      ],
  },
  'cio-summit-awards-2023': {
    source:
        'Poster (CIO Summit & Awards 2023, "Leadership of the Digital-Age"). No date, city or venue printed.',
    conflicts: [
        'TODO(client): supply the date, city and venue. The previous redesign claimed 4 October 2023 at Holiday Inn Aerocity New Delhi; nothing corroborates it.',
      ],
  },
  'amrut-tech-summit-2023': {
    source:
        'Poster ("Amrut Software Presents Amrut Tech Summit 23", theme printed, "In Association with Atlassian"). Artwork filename records 16 March 2023.',
    conflicts: [
        'TODO(client): confirm the date (the artwork filename says 16 March 2023, but no date is printed on the poster itself) and confirm EBM produced this bespoke event — the artwork carries Amrut Software and Atlassian branding, not the EBM logo.',
      ],
  },
  'cx-innovation-technology-summit-awards-2022': {
    source: 'Poster (CX Innovation and Technology Summit & Awards 2022, theme printed on artwork).',
    conflicts: [
        'TODO(client): supply the date, city and venue. The previous redesign claimed 16 December 2022 at The St. Regis Mumbai; nothing corroborates it.',
      ],
  },
  'cfo-leadership-summit-awards-2022': {
    source: 'Poster (CFO Leadership Summit & Awards 2022).',
    conflicts: [
        'TODO(client): supply the date, city and venue. The previous redesign claimed 24 November 2022 at Courtyard by Marriott Mumbai; nothing corroborates it.',
      ],
  },
}
