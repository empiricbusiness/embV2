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
    source:
        'Event brochure "3rd Edition Next-Gen HR Tech Summit & Excellence Awards 2026": a 15-page edition supplied by EBM on 17 Nov 2026, superseded by a 4-page edition dated 25 Nov 2026 (cover, partner write-ups, agenda; outlines only, no text layer) that EBM sent on 26 Nov 2026 with an email asking for the site to follow it and supplying Ramco’s write-up. The 25 Nov edition is the source for the agenda, speakers and partners; the date, theme and award categories are unchanged from the 17 Nov edition. The mission/vision/goal, key focus points and EBM contacts still come from the live /hrtech/ microsite (crawl 2026-09-02). Logo, award badge, speaker photos and partner logos are extracted from the brochure pages; the share image is re-cropped from the 25 Nov cover.',
    conflicts: [
        'RESCHEDULED: postponed on 29 Sep 2026 from 30 Sep; the brochure prints Thursday 26 November 2026. The Mumbai tour leg carries the new date.',
        'The cover prints 08:30 AM - 05:30 PM, but the agenda inside opens at 09:00 AM and closes at 03:45 PM (04:10 PM in the 17 Nov edition). The cover window is published, as on the FinTax page.',
        'RESOLVED by the 25 Nov 2026 edition: the 17 Nov edition printed the welcome address and the opening keynote both at 09:15 AM, and ran Partner Presentation 1, 2, 4 and 5 with no 3. The new edition puts the keynote at 09:30 AM and replaces the partner slots with three named sessions (Ravi Vyas of Aarvi, Gulrez Alam of PeopleSol, Karan Bhatia of Ramco).',
        'Ramco Payce (Gold partner): the 17 Nov edition left its write-up block blank, so copy was written from Ramco’s own published material. REPLACED on 26 Nov 2026 by the write-up EBM sent in its email, published as sent apart from "Fortune500" → "Fortune 500". The 25 Nov brochure prints a different Ramco blurb (a platform paragraph plus bullets: actionable messages on Outlook, role-based hubs, real-time notifications, frictionless experience, chatbots, voice & facial recognition-based workforce management, AI-powered anomaly engine); the email is the explicit instruction, so it wins.',
        'BharatCXO is the Media partner and the brochure gives media partners no write-up block at all. RESOLVED on 17 Nov 2026 the same way as Ramco Payce: EBM supplied the official link and asked for the section to be filled, so the copy was written from bharatcxo.com rather than from the brochure. Every figure in it — 250+ podcast episodes, 50,000+ subscribers, 3M+ organic impressions, 14+ media partner events and the named client enterprises — is a claim BharatCXO publishes about itself. Their own site names the networking club two ways, "CXO Club 100" under services and "Ratan 100 Club" in the series list and footer; the latter is published, being the form used twice. TODO(client): if BharatCXO supplies its own write-up, replace this with theirs.',
        'Award name conflict: the live microsite calls them the "Excellence in HR Awards 2026"; the brochure ceremony line says "HR Excellence & Innovation Awards Ceremony 2026". The brochure name is published. The 44 categories are identical in both.',
        'Tulanahinaa Maity, Gulrez Alam and Jagdeep Chauhan were missing from the 17 Nov speaker page, so EBM supplied their portraits separately and each was framed with the ring copied from an existing image in the set. The 25 Nov speaker page prints all three; the EBM-supplied portraits are kept.',
        'Line-up changes in the 25 Nov 2026 edition: panel 1 is moderated by Arup Gupta (was Dr. Jagmohan Singh Rishi) and panel 2 by Dr. Subhash Mali (was Santosh Iyer). No longer named: Santosh Iyer, Ranjini Pillai, Harminder Bareja, Dr. Jagmohan Singh Rishi, Dr. Ravi Hemnani. New: Arup Gupta, Dr. Subhash Mali, Shweta Thakkar, Sharon Roy Alexander, Dr. Arpita Sen (portraits cropped from the speaker page). Updated: Davis John is at Raymond Realty Ltd., Manohar Nimbhore is Director of Quality, Gulrez Alam is Founder and CEO, Pawan Lalwani’s title adds DGM. Karan Bhatia moves from panel 4 to his own session.',
        'Partners in the 25 Nov 2026 edition: Superset (Gold) and Brainayan (Neuroscience learning partner) are gone and were removed; siliconindia is new as a second Media partner, with no write-up (logo-only card). PeopleSol’s write-up gains a closing sentence and a Core HR paragraph.',
        'Panel discussion 4’s description in the 25 Nov edition is a word-for-word copy of panel 3’s. Session descriptions are not published, so the page is unaffected; tell EBM.',
        'Spellings in the 25 Nov edition: the speaker page prints "Vform Tecnopacks Limited", the agenda "Vform Tenopacks Limited" (speaker-page spelling published); the agenda prints "Enterprise Digital Transformation If HR Admin…" (published as "of"); "Sharon (Sharon Roy) Alexander" and "Dr. Arpita SEN" are published as "Sharon Roy Alexander" and "Dr. Arpita Sen".',
        'Venue: the 17 Nov edition named none and EBM confirmed the Peninsula Grand Hotel, Andheri. The 25 Nov cover prints "Hotel Peninsula Grand, Mumbai, India" — the same hotel, so the published name is unchanged. TODO(client): confirm the exact registered hotel name and the full street address for the Event structured data.',
        'City conflict, still open from the crawl: the hero says Mumbai; the contact page says Hyatt Regency, Chennai. The brochure says Mumbai, India.',
        'The live /hrtech/ page showed the CISO summit headline and counted down to the CISO date at the time of the crawl.',
        'No delegate price has ever been published for this event, so none is shown. Supply the ladder and set pricingPublished.',
      ],
  },
  'fintax-summit-awards-2026': {
    source:
        'Event brochure "5th Edition FinTax Summit & Awards 2026" (CorelDRAW). First version 16 Sep 2026 (9 pages); updated version 25 Sep 2026 (10 pages) supplied by EBM on 29 Sep 2026 — it replaced the 21 invited speakers with 14 confirmed ones, added panel moderators and panellists to the agenda, and added Masters India as Tax Technology Partner. Card and share images are crops of the cover; speaker photos and partner logos come from its pages.',
    conflicts: [
        'Time printed as "08:30 PM - 05:30 PM" (still, in the 25 Sep version). Published as 08:30 AM: the agenda opens at 09:00 AM and the 4th Edition ran 08:30 AM to 05:30 PM.',
        'Agenda prints Partner Presentation 3 and the Networking Break both at 11:20 AM. The break is probably 11:40. Published as printed.',
        'Agenda lists the Awards Ceremony (15:55) above Panel Discussion 4 (15:10). Published in time order.',
        '"Data & Regulatory Reporting Leader of the Year" is printed twice. Published once (18 individual categories).',
        'Viral Vora is printed twice on the speakers page, as "Head of Tax Technology & Transformation, Evonik Group – India Region" and as "Tax Technology and Transformation - Senior Expert, Evonik Group", with two different photos. Published once, with the second title and photo, which match his panel role in the agenda.',
        'No venue is named. The brochure URL tnfsummit.empiricbusinessmedia.com is down since the domain moved, so it is not linked.',
        'Lineage not stated in the brochure: this is very likely the successor of the 4th Edition Smart Future of Tax and Finance Summit & Awards (15 Nov 2024, same logo mark, same tnfsummit subdomain). Confirm before the page says so.',
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
