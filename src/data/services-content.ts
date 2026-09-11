/**
 * Long-form content per service line.
 *
 * The old site had NO service content at all: conference.html, bespoke.html and
 * webinar.html were three clones of the template's schedule page, and
 * bespoke.html / webinar.html were byte-identical to each other. This copy is
 * written from EBM's own homepage service descriptions plus what the crawl shows
 * they actually deliver — it makes no claim the estate does not support.
 */

export type ServiceContent = {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  hero: string
  intro: string[]
  includes: { title: string; body: string }[]
  process: { step: string; title: string; body: string }[]
  audience: string
  faqs: { q: string; a: string }[]
}

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  'conferences-and-awards': {
    metaTitle: 'B2B Conference & Awards Organisers in India',
    metaDescription:
      'Industry-led B2B conferences and awards in India: researched agendas, senior delegates and recognition programmes across every sector we cover.',
    keywords: [
      'B2B conference organisers India',
      'conference organizers in India',
      'business awards India',
      'industry conference organisers Mumbai',
      'summit organisers India',
    ],
    hero: 'Industry conferences and awards that senior people actually clear their diary for.',
    intro: [
      'A conference only works if the right people are in the room. Every EBM conference starts with the audience — who needs to be there, what they are trying to solve this year, and what would make a day out of office worth it.',
      'We build the agenda from that research, not from whoever is available to speak. The result is a room of heads of function and their direct reports, and conversations that carry on after the closing keynote.',
    ],
    includes: [
      {
        title: 'Researched agenda',
        body: 'Sessions built from conversations with the audience we are inviting, not from a template running order.',
      },
      {
        title: 'Curated delegate list',
        body: 'Invitation-led acquisition against an agreed seniority and company-size profile.',
      },
      {
        title: 'Speaker sourcing',
        body: 'Practitioners from the sector, briefed to present real work rather than a product pitch.',
      },
      {
        title: 'Awards programme',
        body: 'Categories, nomination process and a recognition ceremony built into the day.',
      },
      {
        title: 'Sponsor integration',
        body: 'Speaking slots, roundtables, exhibition space and one-to-one meetings mapped to sponsor targets.',
      },
      {
        title: 'Full production',
        body: 'Venue, staging, AV, registration, delegate communications and on-the-day management.',
      },
    ],
    process: [
      { step: '01', title: 'Define the room', body: 'Agree the audience profile, the sector question worth convening around, and the commercial shape of the edition.' },
      { step: '02', title: 'Build the agenda', body: 'Research-led session design, then speaker sourcing and briefing against it.' },
      { step: '03', title: 'Fill the room', body: 'Invitation-led delegate acquisition, with vetting against the agreed profile.' },
      { step: '04', title: 'Deliver the day', body: 'Full production and on-site management, including sponsor deliverables and awards.' },
      { step: '05', title: 'Follow through', body: 'Post-event reporting, lead handover, and content that keeps the conversation alive.' },
    ],
    audience:
      'CISOs, CHROs, plant and operations heads, BFSI technology leaders, and the solution partners who sell to them.',
    faqs: [
      { q: 'How large is a typical EBM conference?', a: 'Our editions are built for depth rather than volume — a focused single-day format with a senior, vetted delegate list rather than a large open-registration expo.' },
      { q: 'Can we run an awards programme alongside a conference?', a: 'Yes. Several EBM franchises pair a summit with an awards ceremony on the same day, including the Next-Gen HR Tech Summit & Awards and The Future of L&D Conference & Awards.' },
      { q: 'Which cities do you run conferences in?', a: 'We have delivered editions in Mumbai, Pune, Chennai, New Delhi and Bengaluru, typically at five-star business hotels.' },
    ],
  },

  'bespoke-events': {
    metaTitle: 'Bespoke B2B & White-Label Events in India',
    metaDescription:
      'Custom B2B events built around one brand’s objective: white-label conferences, private summits and customer events, produced end to end.',
    keywords: [
      'bespoke B2B events India',
      'custom corporate events company India',
      'white label conference India',
      'private summit organisers India',
      'customer event agency India',
    ],
    hero: 'Your event, your brand, your audience — built and run end to end.',
    intro: [
      'Sometimes you do not want a slot at someone else’s conference. You want your own room, your own agenda, and your own audience — with your brand on the whole thing.',
      'Bespoke events are exactly that: we design and produce the event around a single client objective, whether that is entering a new segment, launching a product to a named account list, or bringing existing customers together.',
    ],
    includes: [
      { title: 'Objective-first design', body: 'The format follows the business goal — a summit, a private dinner, a customer day or a multi-city roadshow.' },
      { title: 'Audience acquisition', body: 'We build and invite against your target account and seniority list, not a generic database.' },
      { title: 'Full white-labelling', body: 'Your branding throughout. EBM operates behind the scenes if that is what the brief calls for.' },
      { title: 'Content development', body: 'Agenda, speaker sourcing and session design that gives your audience a reason to attend.' },
      { title: 'End-to-end production', body: 'Venue, AV, staging, registration, hospitality and on-site management.' },
      { title: 'Outcome reporting', body: 'Attendance against target list, engagement and follow-up handover.' },
    ],
    process: [
      { step: '01', title: 'The brief', body: 'What is the commercial objective, and who has to be in the room for it to be met?' },
      { step: '02', title: 'Format and concept', body: 'We propose the format, agenda shape and audience strategy that fits the objective.' },
      { step: '03', title: 'Build', body: 'Content development, speaker sourcing, venue and production planning in parallel with invitations.' },
      { step: '04', title: 'Deliver', body: 'On-site production and management, fully white-labelled where required.' },
      { step: '05', title: 'Report', body: 'Who came, what happened, and what to do with it next.' },
    ],
    audience:
      'Enterprise marketing, demand generation and category teams who need a room of their own rather than a sponsorship slot.',
    faqs: [
      { q: 'What is a white-label event?', a: 'An event carrying entirely your branding, where EBM produces and runs it behind the scenes. Your audience experiences it as your event.' },
      { q: 'Can you run bespoke events in multiple cities?', a: 'Yes — multi-city roadshows using a repeatable format are a common bespoke brief.' },
      { q: 'How is this different from sponsoring an EBM conference?', a: 'Sponsorship puts your brand in front of an audience we have convened. A bespoke event convenes an audience specifically for you, around your agenda.' },
    ],
  },

  roundtables: {
    metaTitle: 'Executive & CXO Roundtables in India',
    metaDescription:
      'Invite-only CXO roundtables in India: 12 to 20 senior leaders, chaired, non-attributable, and designed for candid peer exchange.',
    keywords: [
      'CXO roundtable India',
      'invite-only executive roundtable',
      'executive roundtable organisers India',
      'CISO roundtable India',
      'CHRO roundtable India',
    ],
    hero: 'Twelve people around a table beats four hundred in an auditorium.',
    intro: [
      'Roundtables are the format senior people actually say yes to. No stage, no slides, no audience — just a small group of peers with the same problem, and a chair who keeps the conversation honest.',
      'For sponsors, it is the highest-quality conversation available: an hour and a half in a small room with exactly the people you are trying to reach.',
    ],
    includes: [
      { title: 'Tight audience', body: 'Typically 12–20 senior leaders, vetted against an agreed profile and matched to the topic.' },
      { title: 'Chaired discussion', body: 'An experienced chair and a discussion framework, so the session goes somewhere.' },
      { title: 'Chatham House convention', body: 'Non-attributable by default, which is what makes the discussion candid.' },
      { title: 'Sponsor participation', body: 'A seat at the table and a role in framing the question — not a pitch slot.' },
      { title: 'Hospitality', body: 'Breakfast, lunch or dinner format at a venue that suits the audience.' },
      { title: 'Write-up', body: 'A synthesis of what was discussed, usable as content afterwards.' },
    ],
    process: [
      { step: '01', title: 'Frame the question', body: 'Agree the topic that will make this specific group give up an evening.' },
      { step: '02', title: 'Build the table', body: 'Named-invitation acquisition against the seniority and sector profile.' },
      { step: '03', title: 'Brief the chair', body: 'Discussion framework and participant briefing pack.' },
      { step: '04', title: 'Host', body: 'Run the session with hospitality and full on-site management.' },
      { step: '05', title: 'Synthesise', body: 'Post-session write-up and introductions where participants want them.' },
    ],
    audience:
      'CIOs, CISOs, CHROs, CFOs and operations leaders, plus the solution partners who want a genuine conversation with them.',
    faqs: [
      { q: 'How many people attend a roundtable?', a: 'Typically 12 to 20. Beyond that it stops being a discussion and becomes a panel.' },
      { q: 'Can a sponsor present at a roundtable?', a: 'Sponsors take part as peers and help frame the question. A sales pitch empties the table and defeats the format.' },
      { q: 'Are roundtables run as standalone events?', a: 'Both — as standalone sessions and as a track within a larger EBM summit.' },
    ],
  },

  webinars: {
    metaTitle: 'B2B Webinars & Digital Events in India',
    metaDescription:
      'Sponsored B2B webinars in India: audience acquisition, speaker sourcing, production and qualified lead handover, run end to end.',
    keywords: [
      'B2B webinar services India',
      'sponsored webinar India',
      'B2B webinar lead generation',
      'demand generation webinars India',
      'corporate webinars India',
    ],
    hero: 'Digital sessions that reach the people a venue never could.',
    intro: [
      'Not every conversation justifies a flight and a hotel. Webinars let you reach a national audience of practitioners in ninety minutes, and they work particularly well for topics that need explaining rather than debating.',
      'We handle the whole thing: the topic, the speakers, the audience, the production and the follow-up. What you get back is a recording, an audience, and a list of people who actually turned up.',
    ],
    includes: [
      { title: 'Topic and format design', body: 'Built around a question your target audience is already searching for.' },
      { title: 'Speaker sourcing', body: 'Practitioners and analysts who bring credibility rather than a product deck.' },
      { title: 'Audience acquisition', body: 'Promoted to our sector audience and vetted against your target profile.' },
      { title: 'Production', body: 'Rehearsal, run-of-show, moderation and live technical management.' },
      { title: 'Lead handover', body: 'Registration and attendance data, with engagement detail, handed over after the session.' },
      { title: 'Content afterlife', body: 'Recording, edited highlights and a written summary you can keep using.' },
    ],
    process: [
      { step: '01', title: 'Agree the question', body: 'Pick a topic with genuine demand and a clear audience.' },
      { step: '02', title: 'Assemble the panel', body: 'Source and brief speakers who will hold an audience.' },
      { step: '03', title: 'Promote', body: 'Multi-channel promotion to our sector audience, with registration vetting.' },
      { step: '04', title: 'Broadcast', body: 'Rehearsed, moderated and technically managed live delivery.' },
      { step: '05', title: 'Hand over', body: 'Attendance data, engagement reporting and the content assets.' },
    ],
    audience:
      'Marketing and demand-generation teams who need national reach and qualified attendance rather than a room.',
    faqs: [
      { q: 'How long is a typical webinar?', a: 'Between 45 and 90 minutes, including live Q&A. Shorter formats work better for single-speaker sessions.' },
      { q: 'Do we get the attendee data?', a: 'Yes — registration and attendance data with engagement detail is handed over after the session, subject to attendee consent.' },
      { q: 'Can a webinar run alongside a physical event?', a: 'Yes. Webinars are often used to warm an audience before an edition and to extend its content afterwards.' },
    ],
  },

  'one-to-one-meetings': {
    metaTitle: 'Curated One-to-One Business Meetings in India',
    metaDescription:
      'Pre-qualified one-to-one meetings between solution providers and enterprise decision-makers at EBM events in India — matched, scheduled and managed on the day.',
    keywords: [
      'curated B2B meetings India',
      'one to one business meetings events',
      'pre-qualified buyer meetings India',
      'B2B matchmaking events India',
    ],
    hero: 'Twenty minutes with the right person is worth a month of cold outreach.',
    intro: [
      'The most valuable part of most events is not on the agenda. It is the conversation with the one person you came to meet.',
      'We make that deliberate: matched, scheduled meetings between solution providers and delegates who have a live requirement, run to a timetable on the day.',
    ],
    includes: [
      { title: 'Requirement capture', body: 'Delegates tell us what they are evaluating and on what timeline.' },
      { title: 'Matching', body: 'Meetings proposed on genuine fit between requirement and capability.' },
      { title: 'Scheduling', body: 'A managed timetable so neither side spends the day chasing the other.' },
      { title: 'Dedicated space', body: 'Meeting areas away from the main floor, so the conversation can be real.' },
      { title: 'Briefing', body: 'Both sides briefed beforehand on who they are meeting and why.' },
      { title: 'Follow-up reporting', body: 'Outcome capture and handover after the event.' },
    ],
    process: [
      { step: '01', title: 'Profile', body: 'Capture provider capability and delegate requirement in advance.' },
      { step: '02', title: 'Match', body: 'Propose meetings on genuine relevance, and confirm both sides.' },
      { step: '03', title: 'Schedule', body: 'Build the day’s timetable around the agenda so nothing clashes.' },
      { step: '04', title: 'Host', body: 'Run the meetings in managed space with timekeeping.' },
      { step: '05', title: 'Report', body: 'Capture outcomes and hand over next steps.' },
    ],
    audience:
      'Solution providers with a defined ICP, and delegates with a live evaluation underway.',
    faqs: [
      { q: 'How are meetings matched?', a: 'On stated requirement against stated capability. We do not match on volume targets — an irrelevant meeting wastes both people’s time.' },
      { q: 'How many meetings can a sponsor expect?', a: 'That depends on the edition and the fit of your profile to the delegate list. We agree a realistic number as part of the package.' },
      { q: 'Are meetings guaranteed?', a: 'Meeting counts are agreed per package. Where a match genuinely does not exist we say so rather than filling the slot.' },
    ],
  },

  'networking-and-brand-visibility': {
    metaTitle: 'B2B Brand Visibility & Networking Opportunities',
    metaDescription:
      'Put your brand in front of enterprise decision-makers at EBM events: branding, exhibition presence, hosted networking and category association.',
    keywords: [
      'B2B brand visibility events India',
      'event branding opportunities India',
      'exhibition opportunities B2B India',
      'corporate networking events India',
    ],
    hero: 'Be present where your category is being discussed.',
    intro: [
      'Visibility at the right event does something advertising cannot: it associates your brand with the conversation your buyers are already having, in front of the people having it.',
      'That runs from exhibition presence and branding through to hosting the networking itself — the coffee break, the lunch, the evening reception where the actual relationships get built.',
    ],
    includes: [
      { title: 'Exhibition presence', body: 'Space on the main floor where delegates naturally circulate.' },
      { title: 'Event branding', body: 'Stage, registration, lanyard, delegate materials and digital branding.' },
      { title: 'Hosted networking', body: 'Sponsor the break, the lunch or the reception and host it in your name.' },
      { title: 'Category association', body: 'Positioning as the partner for a specific theme or track across the edition.' },
      { title: 'Digital reach', body: 'Pre- and post-event promotion to our sector audience.' },
      { title: 'Content capture', body: 'Photography and video from the day, usable in your own marketing.' },
    ],
    process: [
      { step: '01', title: 'Define the objective', body: 'Awareness, category association, or pipeline — each implies a different package.' },
      { step: '02', title: 'Select the edition', body: 'Match your target audience to the right franchise and city.' },
      { step: '03', title: 'Build the package', body: 'Assemble branding, presence and networking elements around the objective.' },
      { step: '04', title: 'Activate', body: 'Deliver on the day with full on-site support.' },
      { step: '05', title: 'Measure', body: 'Report on reach, engagement and captured contacts.' },
    ],
    audience:
      'Brands building category presence with enterprise buyers in cybersecurity, HR technology, manufacturing and BFSI.',
    faqs: [
      { q: 'What branding is included?', a: 'It varies by package — typically stage, registration, delegate materials and digital promotion. We build the mix around your objective.' },
      { q: 'Can we host a networking session?', a: 'Yes. Breaks, lunches and evening receptions can be hosted in a sponsor’s name.' },
      { q: 'Do you provide photography from the event?', a: 'Yes — content capture from the day is available as part of visibility packages.' },
    ],
  },
}
