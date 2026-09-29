/**
 * Long-form, per-edition content for event detail pages.
 *
 * SOURCE AND RULES
 * ----------------
 * Every string here was transcribed from EBM's own live event site on
 * 7 September 2026 — for the HR Tech 3rd Edition, that is
 * https://www.empiricbusinessmedia.com/hrtech/ and its sub-pages. Nothing is
 * paraphrased, summarised or invented. If a fact is not on their site it is not
 * here, and the template simply omits that section.
 *
 * The 5th Edition FinTax Summit & Awards 2026 comes from a different source:
 * the event brochure EBM supplied on 23 September 2026 (CorelDRAW export dated
 * 16 Sep 2026). Its copy is transcribed with spelling and punctuation fixed,
 * and the partner blurbs are lightly copy-edited with no claim added. The FAQ
 * is the one authored block: every answer restates a fact printed elsewhere on
 * the same page, so it cannot say anything the brochure does not.
 *
 * Keyed by event slug. An event with no entry renders exactly as it does today,
 * so adding content to one edition cannot change any other.
 *
 * Two deliberate fidelity decisions:
 *
 * 1. `speakers.heading` is "Our previous speakers" because that is the heading
 *    the live page uses. Its own sub-line says "joining our event", which
 *    contradicts it. Publishing them as confirmed for this edition would repeat
 *    the defect where the Manufacturing 8th Edition shipped the 6th Edition's
 *    line-up as its own. TODO(client): confirm which of these are booked for
 *    the 3rd Edition and we will relabel.
 * 2. Award winners are omitted. All 44 categories on the live page read
 *    "Winner: TBA", so there is nothing to publish.
 */

export type FocusItem = { title: string; body: string }
/** A sponsor benefit. Some sources print a sentence with no heading. */
export type SponsorPoint = { title?: string; body: string }
export type EventSpeaker = {
  name: string
  title: string
  company: string
  /** Portrait under /public. Only where the edition's own material prints one. */
  photo?: string
}
export type AwardGroup = { name: string; categories: string[] }
export type EventContact = {
  role: string
  name: string
  title: string
  email: string
  phones: string[]
}
/** One slot in the running order. `time` is 24-hour IST ("13:05"). */
export type AgendaItem = {
  time: string
  title: string
  /** Session type shown above the title ("Opening keynote", "Panel discussion 1"). */
  kind?: string
  /** Registration, breaks and lunch: rendered quieter than sessions. */
  pause?: boolean
  /** Panel roles, by speaker name; details come from `speakers.people`. */
  moderator?: string
  panelists?: string[]
}
export type EventPartner = {
  tier: string
  name: string
  logo: { src: string; w: number; h: number }
  url?: string
  about: string[]
}

type Img = { src: string; w: number; h: number }

/**
 * Identity for the showcase layout (components/EventShowcase). An edition with
 * this block gets that page; one without it keeps the standard template. Only
 * the edition's logo and award shield are used — no brochure illustrations.
 */
export type ShowcaseArt = {
  /** The edition's logo lockup, keyed to transparency. */
  logo: Img
  /** The awards shield. */
  badge: Img
}

export type EventContent = {
  showcase?: ShowcaseArt
  /** Page heading when it should differ from the record's name (e.g. carry the year). */
  h1?: string
  /** Straplines and prose from the edition's own site. */
  about: string[]
  pillars?: FocusItem[]
  /** `details`: optional one-line scope per item, shown on the showcase tiles. */
  audience?: {
    heading: string
    roles: string[]
    note?: string
    details?: Record<string, string>
    /** Who the room is for, in searchable words, e.g. "CFOs, tax heads & compliance leaders". */
    title?: string
  }
  industries?: { heading: string; items: string[]; details?: Record<string, string> }
  /** `start` / `end` are doors-open and close; they feed the Event structured data. */
  agenda?: { start: string; end: string; items: AgendaItem[] }
  focus?: { heading: string; lede: string; items: FocusItem[] }
  whyAttend?: { heading: string; items: FocusItem[] }
  speakers?: {
    heading: string
    lede?: string
    /** Only when the edition's own material says "confirmed". Unlocks the
        Event structured data's `performer` list. */
    confirmed?: boolean
    /** One line for the hero card, e.g. "Confirmed: CFOs and tax heads from …". */
    teaser?: string
    people: EventSpeaker[]
  }
  awards?: { name: string; note?: string; groups: AwardGroup[] }
  partners?: EventPartner[]
  whySponsor?: SponsorPoint[]
  /** Rendered on the page AND emitted as FAQPage data, so the two cannot differ. */
  faq?: { q: string; a: string }[]
  contacts?: EventContact[]
  /** Search snippet, extra keywords and the social-share image for this edition. */
  seo?: {
    description: string
    keywords: string[]
    image: string
    /** Visible text inside the H1, under the logo: the searchable half of the heading. */
    h1Tagline?: string
    /** One or two sentences under the theme: the page's plain-language summary. */
    intro?: string
  }
}

export const EVENT_CONTENT: Record<string, EventContent> = {
  'next-gen-hr-tech-summit-awards-2026': {
    about: [
      'HR leaders today are operating in an environment defined by constant disruption—AI acceleration, shifting workforce expectations, hybrid work models, rising compliance demands, and an intense focus on productivity and retention. The role of HR has evolved from operational support to a strategic driver of business resilience and growth.',
      'Beyond talent acquisition and retention, HR leaders are now tasked with navigating large-scale digital transformation, embedding data-driven decision-making, and building future-ready organizations that prioritize skills, agility, inclusion, and continuous learning. Legacy systems and fragmented processes often limit speed, visibility, and employee experience—making technology modernization a business imperative rather than a choice.',
      'To meet these challenges, HR functions must adopt intuitive, scalable technologies that streamline core operations while enabling smarter workforce planning and personalized employee experiences. AI and automation are increasingly reshaping recruitment, performance management, workforce analytics, and employee engagement—helping HR teams reduce manual effort, improve accuracy, and deliver measurable business impact.',
      'The Next-Gen HR Tech brings together HR leaders, technology providers, and industry experts to exchange practical insights and real-world use cases that address today’s most pressing workforce challenges. The forum focuses on how technology, when aligned with HR strategy, can simplify complexity, enhance employee experience, and enable organizations to build agile, future-ready workforces.',
    ],

    pillars: [
      {
        title: 'Our Mission',
        body: 'Our mission is to empower HR leaders and organizations with next-generation technologies, actionable insights, and collaborative platforms that drive measurable business impact. We aim to streamline HR operations, enhance employee experiences, and enable data-driven decision-making through innovation, automation, and knowledge exchange that prepares enterprises for the evolving future of work.',
      },
      {
        title: 'Our Vision',
        body: 'Our vision is to become the leading catalyst for HR transformation by shaping future-ready workplaces where technology and human potential work in harmony. We envision agile organizations built on inclusivity, continuous learning, and intelligent systems that elevate productivity, resilience, and sustainable growth across industries worldwide.',
      },
      {
        title: 'Our Goal',
        body: 'Our goal is to create a high-impact ecosystem that connects HR leaders, technology providers, and industry experts to share real-world strategies, inspire innovation, and accelerate digital transformation. We strive to equip businesses with scalable solutions, foster meaningful partnerships, and deliver measurable outcomes that strengthen workforce effectiveness and organizational success.',
      },
    ],

    audience: {
      heading: 'CXO / VP / Director of',
      roles: [
        'Human Resources',
        'Talent Management',
        'HR Strategists',
        'Employee Engagement',
        'People Officer',
        'Talent Acquisition',
      ],
      note: 'Join us in shaping the future through innovation, excellence, and meaningful collaboration across industries.',
    },

    focus: {
      heading: 'Key focus points that redefine HR excellence.',
      lede: 'Key Focus Area',
      items: [
        {
          title: 'Redefining HR Roles for a Dynamic Workforce',
          body: 'Modern HR is evolving beyond administration into a strategic function that drives innovation, adaptability, and long-term organizational growth in fast-changing business landscapes.',
        },
        {
          title: 'Leveraging Analytics & AI for Smarter HR Decisions',
          body: 'Data-driven tools and AI enable accurate hiring, workforce forecasting, and performance insights—reducing manual effort while improving precision and efficiency.',
        },
        {
          title: 'HR Leadership in a Rapidly Changing Business Environment',
          body: 'Effective leadership empowers HR teams to navigate hybrid workplaces, compliance shifts, and digital transformation with confidence and clarity.',
        },
        {
          title: 'Building a Diverse, Equitable, and Skilled Workforce',
          body: 'Inclusive hiring practices and continuous skill development help organizations create balanced teams that reflect diversity and promote equal growth opportunities.',
        },
        {
          title: 'Well-Being as a Cornerstone of Employee Experience',
          body: 'Prioritizing mental health, engagement, and work-life balance builds motivated employees, stronger loyalty, and sustainable productivity across teams.',
        },
        {
          title: 'Redefining Performance Management for a Dynamic Organization',
          body: 'Continuous feedback systems replace annual reviews, encouraging transparency, accountability, and measurable performance improvement throughout the year.',
        },
      ],
    },

    whyAttend: {
      heading: 'Why Attendees Love This Experience',
      items: [
        {
          title: 'Interact With Senior HR Leaders',
          body: 'Gain valuable insights into emerging industry trends and proven best practices.',
        },
        {
          title: 'Acquire Future-Ready Skills & Strategies',
          body: 'Learn innovative approaches you can immediately apply within your organization.',
        },
        {
          title: 'Expand Your Professional Network',
          body: 'Connect with experts and peers to build collaborations and share knowledge.',
        },
      ],
    },

    speakers: {
      heading: 'Our previous speakers',
      lede: 'Introducing the expert speakers joining our event',
      people: [
        { name: 'C K (CKK) Kumaravel', title: 'Chairman and Managing Director & Co-Founder', company: 'Naturals Salon & Spa' },
        { name: 'Ganapathi Subramanian', title: 'Chief Human Resources Officer', company: 'Sundaram Home Finance Official' },
        { name: 'Lakshmi S', title: 'Chief Human Resources Officer', company: 'Apollo Sindoori Hotels Limited' },
        { name: 'Dr. Mahendran Chandrasekaran', title: 'Chief Human Resources Officer', company: 'Fuso Glass India' },
        { name: 'Anil Karthikeyan', title: 'Chief Human Resources Officer', company: 'Loyal Textile Mills Ltd.' },
        { name: 'Priya Venkataraman', title: 'Group Chief Human Resources Officer', company: 'Bahwan CyberTek' },
        { name: 'Prakash Ranganathan', title: 'Chief Human Resources Officer', company: 'Novac Technology Solutions (A Shriram Group Company)' },
        { name: 'Merlin Imtha Louis', title: 'Group COO & Vice President HR', company: 'NatWest Group' },
        { name: 'Archana Grover', title: 'Global Head – Capabilities, Transformation & Culture', company: 'Standard Chartered' },
        { name: 'Sethumadhavan Raman', title: 'Director – People & Culture', company: 'Accor' },
        { name: 'Laisa Jinan', title: 'Head HR – India Region', company: 'Danfoss' },
        { name: 'Capt. Partha Samai', title: 'Head Human Resources & Vice President', company: 'Jio' },
        { name: 'Fabian Figredo', title: 'Head of Human Resources', company: 'Shell' },
        { name: 'Charu Sharma', title: 'Head of Talent Acquisition – India', company: 'Tecnicas Reunidas' },
        { name: 'Ganesh Balasubramanian', title: 'Head – HR', company: 'Apollo Tyres' },
        { name: 'Vivek Vijayan', title: 'HR Director', company: 'Cognizant' },
        { name: 'Huma Tariq', title: 'Director – People & Culture', company: 'CohnReznick Professional' },
      ],
    },

    awards: {
      name: 'Excellence in HR Awards 2026',
      groups: [
        {
          name: 'Individual Categories',
          categories: [
            'HR Innovator of the Year',
            'Digital HR Leader of the Year',
            'Talent Engagement Champion',
            'Learning & Development Trailblazer',
            'People Analytics Leader',
            'Future Workforce Strategist',
            'HR Tech Evangelist',
            'Employee Experience Champion',
            'Diversity & Inclusion Leader',
            'Recruitment Technology Expert',
            'HR Data & Insights Leader',
            'Leadership Development Champion',
            'Employee Wellbeing Advocate',
            'HR Transformation Leader',
            'AI & Automation in HR Leader',
            'Performance Management Innovator',
            'Talent Retention Strategist',
            'HR Start-up Star (Young Professional)',
            'Workforce Planning Innovator',
            'HR Compliance & Risk Leader',
            'HR Thought Leader of the Year',
            'Next-Gen HR Communicator',
          ],
        },
        {
          name: 'Corporate / Organizational Categories',
          categories: [
            'Best HR Tech Implementation',
            'Best Digital Workplace Experience',
            'Excellence in Talent Acquisition',
            'Best Learning & Development Transformation',
            'Best Employee Engagement Program',
            'Best People Analytics Initiative',
            'Future-Ready Organization',
            'Best Diversity & Inclusion Program',
            'Best Employee Wellbeing Program',
            'Best AI / Automation Adoption in HR',
            'Best Performance Management Strategy',
            'Best Recruitment Technology Usage',
            'Best Onboarding Experience',
            'Best Leadership Development Program',
            'Best HR Digital Transformation Initiative',
            'Best Talent Retention Strategy',
            'Best Employee Recognition Program',
            'Best Use of HR Startups / Innovative Tools',
            'Best HR Data-Driven Decision Making',
            'Best Workforce Planning & Strategy',
            'Best Change Management in HR',
            'Best Employee Communication Platform',
          ],
        },
      ],
    },

    whySponsor: [
      {
        title: 'Targeted Brand Visibility',
        body: 'Showcase your brand directly to HR leaders, decision-makers, and business professionals who are actively looking for innovative HR solutions and services.',
      },
      {
        title: 'Access to Industry Leaders',
        body: 'Connect with top HR executives, influencers, and organizations who are shaping the future of workforce management and digital HR transformation.',
      },
      {
        title: 'Product & Solution Promotion',
        body: 'Demonstrate your tools, technologies, and services to a highly relevant audience, increasing qualified leads and long-term business opportunities.',
      },
      {
        title: 'Strategic Networking & Partnerships',
        body: 'Collaborate, brainstorm, and build relationships with leading brands and professionals to unlock new partnerships and growth channels.',
      },
    ],

    contacts: [
      {
        role: 'Speaking opportunity / general enquiries',
        name: 'Naziya Shaikh',
        title: 'Senior Conference Producer',
        email: 'naziya@empiricbusinessmedia.com',
        phones: ['+91 8850841922', '+91 7304069577'],
      },
      {
        role: 'Sponsorship bookings',
        name: 'Ashfaq Sayyed',
        title: 'Head – Corporate Sponsorship Alliance',
        email: 'ashfaq@empiricbusinessmedia.com',
        phones: ['+91 8383893146'],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* 5th Edition FinTax Summit & Awards 2026 — from the event brochure.  */
  /* ---------------------------------------------------------------- */
  'fintax-summit-awards-2026': {
    h1: 'FinTax Summit & Awards 2026',
    showcase: {
      logo: { src: '/images/events/fintax-2026/showcase/logo.webp', w: 1200, h: 328 },
      badge: { src: '/images/events/fintax-2026/showcase/award-badge.webp', w: 180, h: 204 },
    },
    about: [
      'As businesses navigate an increasingly complex regulatory landscape, finance leaders are under growing pressure to balance compliance, operational efficiency, and business agility. The 5th Edition FinTax Summit & Awards brings together senior leaders from tax, finance, risk, audit, compliance, legal, and governance to explore strategies that strengthen financial resilience while keeping pace with evolving regulations.',
      'Centered around the theme, “Driving the Future of Tax, Risk & Compliance: Building Faster, Smarter & Audit-Ready Finance,” the summit will examine how organizations are modernizing financial operations through AI, automation, RegTech, and data-driven decision-making. Discussions will focus on transforming compliance from a reactive obligation into a strategic business enabler.',
      'The conference will showcase practical approaches to streamlining tax functions, improving enterprise-wide risk visibility, strengthening financial controls, and building governance frameworks that are agile, transparent, and audit-ready. Industry experts will share real-world case studies, emerging trends, and best practices that help organizations reduce complexity while improving performance.',
      'Through insightful keynotes, panel discussions, and peer networking, attendees will gain actionable strategies to future-proof their tax, risk, and finance functions, embrace intelligent technologies, and build resilient organizations capable of thriving in an increasingly dynamic regulatory environment.',
    ],

    audience: {
      heading: 'CXO / VP / Director of',
      roles: [
        'Taxation & Direct/Indirect Tax',
        'Finance & Accounts',
        'Risk Management',
        'Compliance & Regulatory Affairs',
        'Internal Audit & Controls',
        'Governance, Risk & Compliance (GRC)',
        'Treasury & Financial Planning',
        'Legal & Corporate Affairs',
        'Technology / IT / Digital Transformation',
        'Data, Analytics & Reporting',
      ],
      title: 'CFOs, tax heads & compliance leaders',
      /* Authored one-line scope of each function, for the tiles. General
         descriptions of the role — not claims about the event. */
      details: {
        'Taxation & Direct/Indirect Tax': 'GST, TDS, corporate and international tax',
        'Finance & Accounts': 'Books, close, reporting and financial operations',
        'Risk Management': 'Enterprise, operational and financial risk',
        'Compliance & Regulatory Affairs': 'Regulatory change, filings and obligations',
        'Internal Audit & Controls': 'Assurance, controls testing and audit readiness',
        'Governance, Risk & Compliance (GRC)': 'Frameworks, policies and board oversight',
        'Treasury & Financial Planning': 'Liquidity, cash flow and planning',
        'Legal & Corporate Affairs': 'Corporate law, contracts and disputes',
        'Technology / IT / Digital Transformation': 'ERP, automation and RegTech adoption',
        'Data, Analytics & Reporting': 'Finance data, dashboards and regulatory reporting',
      },
    },

    industries: {
      heading: 'Industries',
      items: [
        'Banking, Financial Services & Insurance (BFSI)',
        'NBFCs & Fintech Companies',
        'Manufacturing & Industrial Enterprises',
        'Pharmaceuticals & Life Sciences',
        'FMCG & Retail',
        'E-commerce & Digital Platforms',
        'IT & ITES Organizations',
        'Telecom & Media',
        'Infrastructure & Real Estate',
        'Energy, Oil & Gas',
      ],
      details: {
        'Banking, Financial Services & Insurance (BFSI)': 'Banks, insurers and financial institutions',
        'NBFCs & Fintech Companies': 'Lenders and digital finance platforms',
        'Manufacturing & Industrial Enterprises': 'Plants, supply chains and industrial groups',
        'Pharmaceuticals & Life Sciences': 'Pharma, healthcare and life-science companies',
        'FMCG & Retail': 'Consumer brands and retail chains',
        'E-commerce & Digital Platforms': 'Marketplaces and online businesses',
        'IT & ITES Organizations': 'Technology and IT-enabled services firms',
        'Telecom & Media': 'Operators, broadcasters and media houses',
        'Infrastructure & Real Estate': 'Developers, construction and infrastructure',
        'Energy, Oil & Gas': 'Power, oil, gas and renewables',
      },
    },

    /* The brochure prints two slots at 11:20 and lists the awards (15:55)
       above Panel 4 (15:10). Times are kept as printed and the list runs in
       time order; the open question is recorded in event-notes. Moderators
       and panellists are from the updated brochure of 25 Sep 2026. */
    agenda: {
      start: '08:30',
      end: '17:30',
      items: [
        { time: '09:00', title: 'Registrations & Networking', pause: true },
        { time: '09:15', title: 'Welcome Note – Empiric Business Media (EBM)' },
        {
          time: '09:30',
          kind: 'Opening keynote',
          title: 'Breaking the Compliance Bottleneck: Keeping Tax, Risk & Finance Fast, Accurate & Audit-Ready',
        },
        { time: '09:55', title: 'Partner Presentation 1' },
        { time: '10:15', title: 'Partner Presentation 2' },
        {
          time: '10:35',
          kind: 'Panel discussion 1',
          title: 'Compliance at the Speed of Business: Can Governance Keep Up Without Slowing Growth?',
          moderator: 'Rajeev Newar',
          panelists: ['Mansi Agrawal', 'Archana Naik', 'Rahul Barve', 'Divyang Thakker'],
        },
        { time: '11:20', title: 'Partner Presentation 3' },
        { time: '11:20', title: 'Networking Break', pause: true },
        {
          time: '12:00',
          kind: 'Panel discussion 2',
          title: 'The Visibility Problem: Why Most Organizations Still Struggle to See Risk Before It Escalates',
          moderator: 'Sabyasachee Dash',
          panelists: ['Ankit Shah', 'Viral Vora'],
        },
        { time: '12:45', title: 'Partner Presentation 4' },
        { time: '13:05', title: 'Partner Presentation 5' },
        { time: '13:25', title: 'Networking Lunch', pause: true },
        {
          time: '14:25',
          kind: 'Panel discussion 3',
          title: 'Beyond Automation: Are AI & RegTech Actually Simplifying Compliance or Just Adding More Complexity?',
          moderator: 'Ankita Parekh',
          panelists: ['Binit Shroff', 'Abdulla P'],
        },
        {
          time: '15:10',
          kind: 'Panel discussion 4',
          title: 'From Reactive to Resilient: Building Financial Control Frameworks Ready for Constant Regulatory Change',
          moderator: 'Aneel Gambhir',
          panelists: ['Purushottam Walawalkar', 'Rahul Kejriwal'],
        },
        { time: '15:55', kind: 'Awards ceremony', title: '5th Edition FinTax Summit & Awards 2026' },
        { time: '16:10', title: 'Networking, onwards', pause: true },
      ],
    },

    whyAttend: {
      heading: 'Why you should attend',
      items: [
        {
          title: 'Stay ahead of regulatory change',
          body: 'Understand evolving tax, risk, and compliance requirements and their business impact.',
        },
        {
          title: 'Eliminate bottlenecks',
          body: 'Learn how to streamline tax processes and reduce delays across finance operations.',
        },
        {
          title: 'Strengthen controls & visibility',
          body: 'Build more transparent, audit-ready risk and financial frameworks.',
        },
        {
          title: 'Leverage RegTech & automation',
          body: 'Use technology to improve accuracy, efficiency, and real-time decision-making.',
        },
        {
          title: 'Learn from industry leaders',
          body: 'Gain practical insights and real-world strategies from top experts and peers.',
        },
      ],
    },

    /* "Confirmed speakers", as the updated brochure (25 Sep 2026) heads them;
       it replaced the earlier list of 21 invited speakers. It prints Viral
       Vora twice, with two titles and two photos; he is listed once, with the
       title and photo that match his panel role in the agenda. Photos are
       matched to names by their position on the brochure page. */
    speakers: {
      heading: 'Confirmed speakers',
      confirmed: true,
      teaser: 'Confirmed: CFOs and tax heads from BNP Paribas, GSK, Zee & more',
      people: [
        { name: 'Binit Shroff', title: 'Finance Controller', company: 'PSIPL [Property Solutions (India) Pvt. Ltd.]', photo: '/images/events/fintax-2026/speakers/binit-shroff.webp' },
        { name: 'Purushottam Walawalkar', title: 'Head – Finance (CFO)', company: 'BNP Paribas', photo: '/images/events/fintax-2026/speakers/purushottam-walawalkar.webp' },
        { name: 'Mansi Agrawal', title: 'CFO – MFG Vertical', company: 'PDS Limited', photo: '/images/events/fintax-2026/speakers/mansi-agrawal.webp' },
        { name: 'Abdulla P', title: 'Head of Tax', company: 'HDFC ERGO General Insurance', photo: '/images/events/fintax-2026/speakers/abdulla-p.webp' },
        { name: 'Sabyasachee Dash', title: 'Tax Head – Corporate & Indirect Tax Compliance', company: 'GSK Pharmaceuticals India', photo: '/images/events/fintax-2026/speakers/sabyasachee-dash.webp' },
        { name: 'Archana Naik', title: 'Tax Head', company: 'BKT Tires', photo: '/images/events/fintax-2026/speakers/archana-naik.webp' },
        { name: 'Ankit Shah', title: 'Head of Finance Asia', company: 'Lindström', photo: '/images/events/fintax-2026/speakers/ankit-shah.webp' },
        { name: 'Ankita Parekh', title: 'Head – Taxation', company: 'Pidilite Industries Limited', photo: '/images/events/fintax-2026/speakers/ankita-parekh.webp' },
        { name: 'Rahul Barve', title: 'Executive VP Taxation', company: 'Zee Entertainment Enterprises Ltd', photo: '/images/events/fintax-2026/speakers/rahul-barve.webp' },
        { name: 'Rajeev Newar', title: 'Group CFO', company: 'R K SWAMY Limited', photo: '/images/events/fintax-2026/speakers/rajeev-newar.webp' },
        { name: 'Divyang Thakker', title: 'Global Head – Direct and Indirect Taxation', company: 'PI Industries Ltd', photo: '/images/events/fintax-2026/speakers/divyang-thakker.webp' },
        { name: 'Viral Vora', title: 'Tax Technology and Transformation – Senior Expert', company: 'Evonik Group', photo: '/images/events/fintax-2026/speakers/viral-vora.webp' },
        { name: 'Aneel Gambhir', title: 'Chief Financial Officer', company: 'DTDC Express Limited', photo: '/images/events/fintax-2026/speakers/aneel-gambhir.webp' },
        { name: 'Rahul Kejriwal', title: 'Head of Finance', company: 'Electrolux', photo: '/images/events/fintax-2026/speakers/rahul-kejriwal.webp' },
      ],
    },

    awards: {
      name: 'FinTax Excellence Awards 2026',
      note: 'Nomination and event administrative charges apply.',
      groups: [
        {
          name: 'Individual Categories',
          /* The brochure prints "Data & Regulatory Reporting Leader of the
             Year" twice; it is listed once. */
          categories: [
            'Chief Financial Officer (CFO) of the Year',
            'Tax Leader of the Year',
            'Risk Management Leader of the Year',
            'Compliance Leader of the Year',
            'Internal Audit Leader of the Year',
            'Financial Controller of the Year',
            'Governance & Ethics Leader of the Year',
            'RegTech Innovation Leader of the Year',
            'Finance Transformation Leader of the Year',
            'Digital Compliance Leader of the Year',
            'Enterprise Risk Strategist of the Year',
            'Financial Governance Excellence Leader of the Year',
            'Tax Technology Leader of the Year',
            'Operational Risk Leader of the Year',
            'Data & Regulatory Reporting Leader of the Year',
            'Treasury & Financial Planning Leader of the Year',
            'Legal & Regulatory Affairs Leader of the Year',
            'AI & Automation Leader in Compliance of the Year',
          ],
        },
        {
          name: 'Corporate / Organizational Categories',
          categories: [
            'Excellence in Tax Transformation',
            'Best Risk Management Framework',
            'Excellence in Regulatory Compliance',
            'Best Financial Governance Initiative',
            'Excellence in Internal Audit & Controls',
            'Best Use of RegTech in Financial Operations',
            'Excellence in AI-Driven Compliance & Automation',
            'Best Enterprise Risk & Resilience Strategy',
            'Excellence in Financial Transparency & Reporting',
            'Best Compliance-Driven Digital Transformation Initiative',
            'Excellence in Governance, Risk & Compliance (GRC)',
            'Best Fraud Prevention & Risk Monitoring Initiative',
            'Excellence in Tax Technology Implementation',
            'Best Data-Driven Risk Intelligence Initiative',
            'Excellence in Audit Readiness & Financial Controls',
            'Best Integrated Finance & Compliance Strategy',
            'Excellence in Regulatory Change Management',
            'Best Shared Services / Finance Operations Transformation',
            'Most Future-Ready Finance Organization',
            'Organization of the Year in Tax, Risk & Compliance',
          ],
        },
      ],
    },

    partners: [
      {
        tier: 'Gold partner',
        name: 'KDK Software',
        logo: { src: '/images/events/fintax-2026/partners/kdk-software.webp', w: 311, h: 120 },
        about: [
          'KDK Software is one of the fastest-growing software companies in India in the taxation domain. KDK has created a landmark journey in the tax compliance industry by offering specialised tax software solutions and after-sales support to customers. Headquartered in Jaipur, India, KDK provides reliable and cost-effective software solutions to corporates, tax professionals and CA firms. KDK Software has been recognised by ICAI (the governing body of CAs) since 2011.',
          'KDK provides a comprehensive range of services such as ITR filing, GST filing, TDS filing, 2A/2B reconciliation, ITC management, notice management, vendor payment management, 206AA compliance checks, unlimited PAN verifications and many more, with Express GST, Express TDS and Spectrum. With more than 1½ decades of substantial market presence, KDK Software has evolved to become one of the fastest-growing and most respected brands in the Indian taxation industry, serving 25K satisfied customers and around 50 lakh+ IT returns every year.',
          'KDK believes that as the world goes mobile, CAs and corporates should be able to work on the go, and businesses should be able to transact while staying compliant and keeping up with the changing requirements of the technology era.',
        ],
      },
      {
        tier: 'Silver partner',
        name: 'Sovos',
        logo: { src: '/images/events/fintax-2026/partners/sovos.webp', w: 320, h: 66 },
        about: [
          'Sovos APAC — the always-on global tax compliance company. With deep expertise in Indian GST compliance and e-invoicing, the team brings decades of product innovation and local regulatory insight into Sovos’ global tax compliance platform. The acquisition strengthens Sovos’ presence in Asia Pacific and extends its leadership in Continuous Transaction Controls (CTC), enabling multinational businesses to manage global VAT and GST obligations through a single, integrated solution.',
        ],
      },
      {
        tier: 'Tax technology partner',
        name: 'Masters India',
        logo: { src: '/images/events/fintax-2026/partners/masters-india.webp', w: 278, h: 67 },
        about: [
          'Masters India is a GST Suvidha Provider (GSP) appointed by the Goods and Services Tax Network (GSTN), a Government of India enterprise, focused on simplifying tax and financial compliance for modern businesses. Established in 2017 as part of a diversified business group with decades of operations in manufacturing, healthcare, hospitality and IT, Masters India combines deep operational expertise with cutting-edge technology.',
          'The company builds intuitive solutions that automate GST, TDS, e-invoice and e-way bill processes, integrating seamlessly with leading ERPs so that finance and tax teams can move away from spreadsheets and manual portal work. Its flagship compliance and financial automation products help enterprises gain real-time visibility into tax liabilities, improve input tax credit accuracy, and reduce operational risk in high-volume transaction environments.',
          'Today, Masters India serves CFOs and finance leaders across industries, enabling them to manage compliance at scale, strengthen governance, and free up team capacity for strategic work. With a growing presence out of Noida, Mumbai and Bangalore and a 100+ member team, Masters India continues to invest in AI, APIs, and automation to deliver enterprise-grade reliability, security, and support for India’s evolving tax landscape.',
        ],
      },
      {
        tier: 'Exhibit partner',
        name: 'Taxmann',
        logo: { src: '/images/events/fintax-2026/partners/taxmann.webp', w: 320, h: 97 },
        url: 'https://www.taxmann.com/',
        about: [
          'At Taxmann, our mission is to deliver the most authentic and timely information. We proudly stand as the #1 source for comprehensive coverage of Indian laws. With over 60 years of domain expertise, we have earned the trust of more than 500,000 legal professionals across the country.',
          'Taxmann Alliance is unique in India as the only publishing and product development company with complete backward and forward integration. From owning a paper printing unit to having an in-house research and editorial team, we ensure our content reaches readers nationwide through our own distribution network. We are ISO certified and have been the webmaster for the Income Tax Department, Ministry of Finance, Government of India for more than a decade. Our robust technology team guarantees delivery in various digital formats.',
        ],
      },
    ],

    whySponsor: [
      {
        body: 'Position your brand as an industry leader in Risk, Compliance, RegTech, Tax & Financial Governance.',
      },
      {
        body: 'Connect directly with key decision-makers including CXOs, Finance Heads, Risk Leaders, Tax Professionals, and Compliance Experts.',
      },
      {
        body: 'Showcase your solutions and innovations to organizations actively looking to modernize financial controls and compliance operations.',
      },
      {
        body: 'Generate high-value business opportunities through targeted networking, meetings, and strategic collaborations.',
      },
      {
        body: 'Increase brand visibility and market presence through speaking opportunities, branding, digital promotions, and on-ground engagement.',
      },
    ],

    faq: [
      {
        q: 'When and where is the FinTax Summit & Awards 2026?',
        a: 'The 5th Edition FinTax Summit & Awards 2026 takes place on Thursday, 22 October 2026 in Mumbai, India, from 08:30 AM to 05:30 PM IST. The venue is yet to be announced.',
      },
      {
        q: 'Who should attend the FinTax Summit?',
        a: 'CXOs, VPs and directors of taxation, finance and accounts, risk management, compliance, internal audit, GRC, treasury and financial planning, legal, technology, and data and reporting — from BFSI, NBFCs and fintech, manufacturing, pharmaceuticals, FMCG and retail, e-commerce, IT and ITES, telecom and media, infrastructure and real estate, and energy, oil and gas.',
      },
      {
        q: 'What will the 2026 summit cover?',
        a: 'The theme is “Driving the Future of Tax, Risk & Compliance: Building Faster, Smarter & Audit-Ready Finance”. An opening keynote and four panel discussions cover compliance at the speed of business, seeing risk before it escalates, whether AI and RegTech really simplify compliance, and financial control frameworks built for constant regulatory change.',
      },
      {
        q: 'Who is speaking at the FinTax Summit 2026?',
        a: '14 confirmed finance and tax leaders across four panel discussions, including Purushottam Walawalkar (BNP Paribas), Sabyasachee Dash (GSK Pharmaceuticals India), Rahul Barve (Zee Entertainment Enterprises), Ankita Parekh (Pidilite Industries), Rajeev Newar (R K SWAMY) and Aneel Gambhir (DTDC Express).',
      },
      {
        q: 'What are the FinTax Excellence Awards 2026?',
        a: 'The awards run across 38 categories: 18 for individuals, such as CFO of the Year and Tax Leader of the Year, and 20 for organisations, such as Excellence in Tax Transformation. Nomination and event administrative charges apply. The awards ceremony is part of the summit day.',
      },
      {
        q: 'Has EBM run this summit before?',
        a: 'Yes. This is the 5th edition of the FinTax Summit & Awards, organised by Empiric Business Media.',
      },
      {
        q: 'How do I register, speak or sponsor?',
        a: 'Use Register interest, Apply to speak or Sponsor this edition on this page, or email info@empiricbusinessmedia.com. The EBM team will get back to you.',
      },
    ],

    seo: {
      description:
        'FinTax Summit & Awards 2026, 22 Oct, Mumbai: CFOs and heads of direct and indirect tax (GST), risk and compliance on RegTech, AI and audit-ready finance.',
      keywords: [
        'FinTax Summit 2026',
        'FinTax Summit & Awards 2026',
        'FinTax Excellence Awards 2026',
        'tax summit Mumbai 2026',
        'tax conference India 2026',
        'finance summit Mumbai',
        'CFO summit Mumbai 2026',
        'risk and compliance summit India',
        'direct and indirect tax (GST) conference',
        'RegTech conference India',
        'GRC conference India',
        'internal audit conference Mumbai',
        'tax technology summit India',
        'CFO of the Year award India',
        'Tax Leader of the Year award',
        'FinTax Summit 2026 speakers',
      ],
      image: '/og/fintax-summit-awards-2026.jpg',
      h1Tagline: 'Tax, Risk & Compliance Summit in Mumbai',
      // Every clause restates the brochure: the audience, the keynote, the four
      // panels' subjects and the awards.
      intro:
        'The FinTax Summit & Awards 2026 is a one-day tax and compliance conference in Mumbai for CFOs, tax heads and finance leaders: an opening keynote, four panel discussions on compliance, risk, RegTech, AI and audit-ready finance, and the FinTax Excellence Awards.',
    },
  },
}
