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
 * 1. RESOLVED, 17 Nov 2026. The HR Tech 3rd Edition entry used to publish the
 *    live page's "Our previous speakers" list, because that page's heading and
 *    its "joining our event" sub-line contradicted each other and publishing
 *    them as confirmed would have repeated the defect where the Manufacturing
 *    8th Edition shipped the 6th Edition's line-up as its own. The brochure EBM
 *    supplied on 17 Nov 2026 settles it: its own page is headed "CONFIRMED
 *    SPEAKERS", so that line-up is published and the previous-speaker list is
 *    gone. The 3rd Edition's other content now comes from that brochure too.
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
  /** A single named presenter: a keynote or a partner session. */
  speaker?: string
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
  /**
   * Short subject tags in THIS edition's own vocabulary, for the hero's
   * floating chips and the About card. Never another edition's: a tax tag on
   * an HR page is the same defect as a tax speaker on one. Five are placed in
   * the hero, the first four on the About card.
   */
  tags: string[]
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
    h1: 'Next-Gen HR Tech Summit & Awards 2026',
    showcase: {
      logo: { src: '/images/events/hrtech-2026/showcase/logo.webp', w: 1200, h: 380 },
      badge: { src: '/images/events/hrtech-2026/showcase/award-badge.webp', w: 180, h: 205 },
      /* Each one is a subject the brochure itself puts on the programme: the
         AI assurance and people analytics panel, the workplace-experience
         panel, the well-being panel, and talent acquisition in who-should-attend. */
      tags: ['AI in HR', 'People analytics', 'Employee experience', 'Wellbeing', 'Talent acquisition'],
    },
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
      title: 'CHROs, HR heads & talent leaders',
      /* Authored one-line scope of each function, for the tiles. General
         descriptions of the role — not claims about the event. */
      details: {
        'Human Resources': 'The HR function end to end, from policy to operations',
        'Talent Management': 'Performance, succession, mobility and capability',
        'HR Strategists': 'Workforce strategy, org design and planning',
        'Employee Engagement': 'Experience, culture, wellbeing and retention',
        'People Officer': 'The people agenda at board and executive level',
        'Talent Acquisition': 'Hiring, campus recruitment and employer brand',
      },
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

    agenda: {
      start: '08:30',
      end: '17:30',
      items: [
        { time: '09:00', title: 'Registration & Breakfast', pause: true },
        { time: '09:15', title: 'Welcome address by Empiric Business Media' },
        {
          time: '09:15',
          kind: 'Opening keynote',
          title: 'The Evolution of HR 2026: Transforming Talent with Tech',
          speaker: 'Tulanahinaa Maity',
        },
        { time: '09:55', title: 'Partner Presentation 1' },
        { time: '10:15', title: 'Partner Presentation 2', speaker: 'Ravi Vyas' },
        {
          time: '10:35',
          kind: 'Panel discussion 1',
          title: 'Balancing Better: HR’s Role in Supporting Well-Being at Work and Beyond',
          moderator: 'Dr. Jagmohan Singh Rishi',
          panelists: ['Namita Patwari', 'Preeti Toshniwal', 'Judith Antao', 'Mousumi Dhar'],
        },
        {
          time: '11:20',
          title: 'Enterprise Digital Transformation of HR Admin and office operations',
          speaker: 'Gulrez Alam',
        },
        { time: '11:40', title: 'Networking break', pause: true },
        {
          time: '12:00',
          kind: 'Panel discussion 2',
          title: 'Workplace by Design: Enhancing Experience, Empowerment, and Engagement',
          moderator: 'Santosh Iyer',
          panelists: [
            'Davis John',
            'Harminder Bareja',
            'Ranjini Pillai',
            'Ameet Kakar Thakur',
            'Dr. Ravi Hemnani',
            'Ravi Vyas',
            'Mousumi Dhar',
          ],
        },
        { time: '12:45', title: 'Partner Presentation 4' },
        { time: '13:05', title: 'Partner Presentation 5' },
        { time: '13:25', title: 'Networking Lunch', pause: true },
        {
          time: '14:25',
          kind: 'Panel discussion 3',
          title: 'HR Influence Without Authority: Driving Change Beyond Hierarchies',
          moderator: 'Sanjeeb Lahiri',
          panelists: [
            'Rajan B Saawant',
            'Pawan Lalwani',
            'Dr. Sarmistha Roychowdhury',
            'Anirudh Gupta',
            'Jagdeep Chauhan',
          ],
        },
        {
          time: '15:15',
          kind: 'Panel discussion 4',
          title: 'AI Assurance & People Analytics: Data-Driven, Human-Centric HR',
          moderator: 'Dr. Kavindra Pant',
          panelists: [
            'Rajendra Lingwal',
            'Nandini Banerjee',
            'Shruti Shrivastava',
            'Karan Bhatia',
            'Dr. Ujjal Sengupta',
            'Dr. Archana Yemeshvary Ashok Upadhyay',
          ],
        },
        {
          time: '15:55',
          kind: 'Awards ceremony',
          title: 'HR Excellence & Innovation Awards Ceremony 2026',
        },
        { time: '16:10', title: 'Closing Note & Networking', pause: true },
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
      heading: 'Confirmed speakers',
      confirmed: true,
      teaser: 'Confirmed: CHROs and HR heads from Citi, Reliance, Raymond, Zee & more',
      people: [
        { name: 'Santosh Iyer', title: 'CHRO', company: 'KLT Automotive & Tubular Products Ltd.', photo: '/images/events/hrtech-2026/speakers/santosh-iyer.webp' },
        { name: 'Dr. Archana Yemeshvary Ashok Upadhyay', title: 'CHRO', company: 'Hindustan Colas Pvt. Ltd. (HPCL JV)', photo: '/images/events/hrtech-2026/speakers/archana-yemeshvary-ashok-upadhyay.webp' },
        { name: 'Dr. Sarmistha Roychowdhury', title: 'CHRO', company: 'Vform Tecnopacks Limited', photo: '/images/events/hrtech-2026/speakers/sarmistha-roychowdhury.webp' },
        { name: 'Sanjeeb Lahiri', title: 'CHRO', company: 'GRP Ltd', photo: '/images/events/hrtech-2026/speakers/sanjeeb-lahiri.webp' },
        { name: 'Namita Patwari', title: 'CHRO & CXO', company: 'Alembic Pharmaceuticals Ltd', photo: '/images/events/hrtech-2026/speakers/namita-patwari.webp' },
        { name: 'Dr. Kavindra Pant', title: 'CHRO', company: 'Shapoorji Pallonji Group', photo: '/images/events/hrtech-2026/speakers/kavindra-pant.webp' },
        { name: 'Anirudh Gupta', title: 'Global Head – Talent and Learning', company: 'Glenmark Pharmaceuticals', photo: '/images/events/hrtech-2026/speakers/anirudh-gupta.webp' },
        { name: 'Davis John', title: 'Head – HR & Business Services', company: 'Raymond Limited', photo: '/images/events/hrtech-2026/speakers/davis-john.webp' },
        { name: 'Ranjini Pillai', title: 'Head HR', company: 'SICK Sensor Intelligence', photo: '/images/events/hrtech-2026/speakers/ranjini-pillai.webp' },
        { name: 'Harminder Bareja', title: 'Head – Human Resources, Water Business', company: 'Dorf Ketal', photo: '/images/events/hrtech-2026/speakers/harminder-bareja.webp' },
        { name: 'Dr. Jagmohan Singh Rishi', title: 'Global Head – L&D and Digital Excellence; President, Bombay Management Association 2025', company: 'Wockhardt Ltd', photo: '/images/events/hrtech-2026/speakers/jagmohan-singh-rishi.webp' },
        { name: 'Preeti Toshniwal', title: 'Senior Vice President – HR', company: 'Zee Entertainment Enterprises Ltd.', photo: '/images/events/hrtech-2026/speakers/preeti-toshniwal.webp' },
        { name: 'Rajendra Lingwal', title: 'Senior Vice President – HR', company: 'Persistent Systems Ltd.', photo: '/images/events/hrtech-2026/speakers/rajendra-lingwal.webp' },
        { name: 'Pawan Lalwani', title: 'Strategic HR Leader – Learning & Capability', company: 'Reliance Industries Ltd.', photo: '/images/events/hrtech-2026/speakers/pawan-lalwani.webp' },
        { name: 'Rajan B Saawant', title: 'Vice President Corporate – Human Resources', company: 'Indoco Remedies Ltd', photo: '/images/events/hrtech-2026/speakers/rajan-b-saawant.webp' },
        { name: 'Nandini Banerjee', title: 'Learning Business Partner, India Business', company: 'Johnson Controls', photo: '/images/events/hrtech-2026/speakers/nandini-banerjee.webp' },
        { name: 'Judith Antao', title: 'Head – HR', company: 'Rohlig India Private Limited', photo: '/images/events/hrtech-2026/speakers/judith-antao.webp' },
        { name: 'Ameet Kakar Thakur', title: 'VP HR', company: 'GSL Group', photo: '/images/events/hrtech-2026/speakers/ameet-kakar-thakur.webp' },
        { name: 'Shruti Shrivastava', title: 'Senior Vice President HR', company: 'Citi', photo: '/images/events/hrtech-2026/speakers/shruti-shrivastava.webp' },
        { name: 'Dr. Ravi Hemnani', title: 'VP – Human Resources', company: 'Nuvoco Vistas Corp', photo: '/images/events/hrtech-2026/speakers/ravi-hemnani.webp' },
        { name: 'Ravi Vyas', title: 'Vice President', company: 'Aarvi Encon Limited', photo: '/images/events/hrtech-2026/speakers/ravi-vyas.webp' },
        { name: 'Manohar Nimbhore', title: 'Director Learning and Development', company: 'Marriott International', photo: '/images/events/hrtech-2026/speakers/manohar-nimbhore.webp' },
        { name: 'Mousumi Dhar', title: 'CHRO', company: 'Indospace Group', photo: '/images/events/hrtech-2026/speakers/mousumi-dhar.webp' },
        { name: 'Dr. Ujjal Sengupta', title: 'Head Business HR', company: 'Jio', photo: '/images/events/hrtech-2026/speakers/ujjal-sengupta.webp' },
        { name: 'Karan Bhatia', title: 'Payroll Bureau Head', company: 'RAMCO', photo: '/images/events/hrtech-2026/speakers/karan-bhatia.webp' },
        /* Named in the agenda, not on the brochure's speaker page, so no photo. */
        { name: 'Tulanahinaa Maity', title: 'CHRO', company: 'Anand Rathi Group' },
        { name: 'Gulrez Alam', title: 'Founder & MD', company: 'PeopleSol' },
        { name: 'Jagdeep Chauhan', title: 'Director Human Resources', company: 'Hinduja Hospital' },
      ],
    },

    awards: {
      name: 'HR Excellence & Innovation Awards 2026',
      note: 'Nomination and operational charges apply.',
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

    partners: [
      {
        tier: 'Gold partner',
        name: 'Ramco Payce',
        logo: { src: '/images/events/hrtech-2026/partners/ramco-payce.webp', w: 209, h: 120 },
        /* The brochure reserves this block and leaves the body blank.
           TODO(client): send the Ramco Payce company write-up. */
        about: [],
      },
      {
        tier: 'Gold partner',
        name: 'Superset',
        logo: { src: '/images/events/hrtech-2026/partners/superset.webp', w: 209, h: 120 },
        url: 'https://joinsuperset.com/employer.html',
        about: [
          'Superset is India’s largest campus hiring platform, built to simplify and scale fresher recruitment for employers across the country. Trusted by over 12,000 employers and 600+ universities, we connect recruiting teams to verified talent across 24,000+ campuses.',
          'We handle the full recruitment workflow: campus outreach, candidate assessments, virtual interview drives, and offer management, with everything tracked in one place. With real-time analytics and personalised candidate recommendations, recruiting teams spend less time on logistics and more time on the right hires.',
          'Superset is where campus hiring happens at scale.',
        ],
      },
      {
        tier: 'Silver partner',
        name: 'Aarvi Encon Limited',
        logo: { src: '/images/events/hrtech-2026/partners/aarvi.webp', w: 320, h: 117 },
        about: [
          'At Aarvi Encon Limited, we help organisations build high-performing teams by connecting them with exceptional talent. Backed by over 39 years of industry experience, an ISO certification, and a CRISIL SME1 rating, we deliver strategic Permanent Placement solutions tailored to evolving business needs. We are proud recipients of the prestigious Jamnalal Bajaj Award and listed on BSE and NSE.',
          'Our core services include Executive Search, Permanent Recruitment, Leadership Hiring, and Professional & Specialist Hiring, with a strong focus on mid-level and senior-level placements. Through a comprehensive recruitment approach encompassing talent mapping, candidate sourcing, screening, and assessment, we identify professionals who align with our clients’ business objectives and organisational culture.',
          'Combining deep industry expertise, an extensive talent network, and a commitment to quality, we help businesses secure the right talent to strengthen their workforce, enhance performance, and drive sustainable growth.',
          'At Aarvi Encon, we don’t just fill positions. We build the talent that drives business forward.',
        ],
      },
      {
        tier: 'HR digital transformation partner',
        name: 'PeopleSol',
        logo: { src: '/images/events/hrtech-2026/partners/peoplesol.webp', w: 320, h: 115 },
        about: [
          'PeopleSol HRMS is a world-class Human Resource Management System designed to simplify, streamline, and elevate every aspect of your organization’s HR operations. Built with powerful web and mobile interfaces, it provides a seamless digital experience that connects employees, managers, and HR teams, IT Teams and Admin teams anytime, anywhere.',
          'From hire to retire, PeopleSol HRMS empowers organizations to manage the complete employee lifecycle with ease — covering recruitment, onboarding, payroll, performance, learning, attendance, ITSM, Office Facility management and more. Its real-time analytics and dashboards offer deep workforce insights, enabling data-driven decisions and smarter people management.',
          'With automation at its core, PeopleSol HRMS eliminates manual processes, reduces administrative workload, and enhances accuracy and compliance. The system is fully configurable to your company’s structure, policies, and approval workflows, ensuring flexibility and scalability as your organization grows.',
          'Whether you’re a small enterprise or a large corporation, PeopleSol HRMS helps you create a connected, efficient, and engaged workplace — boosting productivity, transparency, and employee satisfaction.',
        ],
      },
      {
        tier: 'Neuroscience learning partner',
        name: 'Brainayan',
        logo: { src: '/images/events/hrtech-2026/partners/brainayan.webp', w: 320, h: 115 },
        url: 'https://www.brainayan.com/',
        about: [
          'Brainayan, founded in 2016 by a former L&D leader at Google and Facebook, is a people development company that blends neuroscience-based learning to create meaningful, lasting change. We specialize in customized and personalized high-impact behavioral learning experiences that go far beyond one-size-fits-all training — addressing real business challenges and empowering individuals to lead, grow, and thrive.',
          'With 30,000+ hours of delivery and content development, Brainayan has partnered with 100+ organizations across APAC — from scaling startups to Fortune 100 giants.',
          'Clients include Netflix, Google, Grab, Viacom18, Deloitte, Snapchat, WeWork, Sumo Logic, Uber, TikTok, Zepto, Facebook, AppDynamics, Warner Bros Discovery, Xiaomi, DE Shaw, Piramal Finance, IndiaFirst Life, Trust Mutual Fund, Caratlane, Sanctum Wealth, Ask Group, Kirloskar Group, BHTC, Baskin Robbins and Table Space.',
        ],
      },
      {
        tier: 'Exhibit partner',
        name: 'Osource Global',
        logo: { src: '/images/events/hrtech-2026/partners/osource-global.webp', w: 320, h: 115 },
        about: [
          'Osource Global is a leading business process solutions and services partner that helps global enterprises reinvent their digital core through gen-AI and human ingenuity. For over 22 years, we have acted as a strategic global partner for 1,000+ clients, delivering high-impact outcomes across 40+ countries. We combine deep industry expertise with our proprietary tech ecosystem to bridge the gap between legacy operations and digital agility.',
          'Our capabilities are delivered through four integrated units designed for enterprise-wide transformation. AI-Driven Enterprise Platforms: home to the Onex® suite — modular AI-native assets for P2P, Recon, HRMS, BPM and more. F&A Solutions: end-to-end financial accounting orchestration including Accounts Payable/Receivable, Record-to-Report, and Asset Verification. Human Capital Management: managing the entire employee journey via Global Payroll, Lifecycle Management, and Background Verification — from hire to retire. Strategic Advisory: expert-led consulting in Cybersecurity, Risk & Regulatory Governance, Business Re-engineering, Fractional CXO and GCC Setup Advisory.',
          'At Osource Global, we measure our success by the tangible value we create — leveraging AI, optimizing operations, accelerating growth, and building the future of autonomous enterprise operations.',
        ],
      },
      {
        tier: 'Exhibit partner',
        name: 'Culsight',
        logo: { src: '/images/events/hrtech-2026/partners/culsight.webp', w: 320, h: 113 },
        about: [
          'Culsight works between security teams and leadership to measure human cyber risk, improve governance visibility, and prepare companies for real cyber incidents. Most companies have tools and policies, and we ensure they operate effectively, and leadership can make informed security decisions.',
          'The name Culsight comes from two ideas: Culture and Sight, because we believe security fails when people cannot see the risk clearly or when the culture does not support the right behaviour.',
          'Culsight provides this visibility. We help organisations see how people, processes, security controls, AI systems, and privacy obligations together influence cybersecurity and privacy risk. Our work connects technical security operations with business oversight, enabling risk, compliance, internal audit, and management teams to understand and oversee cybersecurity, privacy, and AI governance meaningfully.',
          'Our services include human cyber risk measurement, governance advisory, privacy implementation, AI governance advisory, crisis simulation exercises, and control effectiveness reviews. We support banks, financial institutions, manufacturing, pharmaceutical, technology and other enterprise and SMB firms.',
          'We do not replace existing security teams, technologies, or compliance programs. We ensure they function cohesively, are understood by leadership, and stand up to both real incidents and audits. Our objective is simple: help organisations move from security activity to security effectiveness.',
        ],
      },
      {
        tier: 'Exhibit partner',
        name: 'Saral (Relyon Softech Limited)',
        logo: { src: '/images/events/hrtech-2026/partners/saral.webp', w: 320, h: 113 },
        url: 'https://saral.pro/',
        about: [
          'Relyon Softech Limited is a software company based in India’s Silicon Valley, Bengaluru. Over the past 25+ years, under our brand Saral, we have been providing both desktop and cloud solutions in the domains of HR & Payroll, Taxation and Accounting to over 60,000 users; from SMEs to private & public-sector banks.',
          'Our mission is to simplify business processes across India. We have been able to meet the unique challenges and ever-changing demands of over 30 sectors in the Indian market by tailoring solutions that cater to their business needs.',
          'We have branches in Chennai, Hyderabad, Mumbai, Pune, Ahmedabad, Jaipur, Kolkata, and Delhi; with a robust network of 300+ partners across 450 districts.',
        ],
      },
      {
        tier: 'Media partner',
        name: 'BharatCXO',
        logo: { src: '/images/events/hrtech-2026/partners/bharatcxo.webp', w: 320, h: 115 },
        /* Media partners are not given a write-up in the brochure. */
        about: [],
      },
    ],

    faq: [
      {
        q: 'When and where is the Next-Gen HR Tech Summit & Awards 2026?',
        a: 'The 3rd Edition Next-Gen HR Tech Summit & Awards 2026 takes place on Thursday, 26 November 2026 at the Peninsula Brand Hotel, Andheri, Mumbai, India, from 08:30 AM to 05:30 PM IST.',
      },
      {
        q: 'Who should attend the Next-Gen HR Tech Summit?',
        a: 'CXOs, VPs and directors of human resources, talent management, employee engagement and talent acquisition, along with HR strategists and chief people officers.',
      },
      {
        q: 'What will the 2026 summit cover?',
        a: 'The theme is “Driving Business Growth Through Next-Gen HR Technology”. An opening keynote on the evolution of HR in 2026 is followed by four panel discussions: wellbeing at work, workplace by design, HR influence without authority, and AI assurance and people analytics.',
      },
      {
        q: 'Who is speaking at the Next-Gen HR Tech Summit 2026?',
        a: '28 HR leaders are named in the brochure, including Santosh Iyer (KLT Automotive), Shruti Shrivastava (Citi), Pawan Lalwani (Reliance Industries), Davis John (Raymond), Preeti Toshniwal (Zee Entertainment Enterprises), Dr. Kavindra Pant (Shapoorji Pallonji Group) and Rajendra Lingwal (Persistent Systems).',
      },
      {
        q: 'What are the HR Excellence & Innovation Awards 2026?',
        a: 'The awards run across 44 categories: 22 for individuals, such as HR Innovator of the Year and Digital HR Leader of the Year, and 22 for organisations, such as Best HR Tech Implementation. Nomination and operational charges apply. The awards ceremony is part of the summit day.',
      },
      {
        q: 'Has EBM run this summit before?',
        a: 'Yes. This is the 3rd edition of the Next-Gen HR Tech Summit & Awards, organised by Empiric Business Media.',
      },
      {
        q: 'How do I register, speak or sponsor?',
        a: 'Use Register interest, Apply to speak or Sponsor this edition on this page, or email info@empiricbusinessmedia.com. The EBM team will get back to you.',
      },
    ],

    seo: {
      description:
        'Next-Gen HR Tech Summit & Awards 2026, 26 Nov, Mumbai: CHROs and HR heads on AI, people analytics, employee experience and HR technology, plus the awards.',
      keywords: [
        'Next-Gen HR Tech Summit 2026',
        'Next-Gen HR Tech Summit & Awards 2026',
        'HR Excellence & Innovation Awards 2026',
        'HR tech summit Mumbai 2026',
        'HR conference India 2026',
        'CHRO summit Mumbai 2026',
        'HR technology conference India',
        'people analytics conference India',
        'employee experience summit India',
        'talent acquisition conference Mumbai',
        'learning and development conference India',
        'AI in HR conference India',
        'HR Innovator of the Year award',
        'Digital HR Leader of the Year award',
        'Next-Gen HR Tech Summit 2026 speakers',
      ],
      image: '/og/next-gen-hr-tech-summit-awards-2026.jpg',
      h1Tagline: 'HR Technology Summit & Awards in Mumbai',
      intro:
        'The Next-Gen HR Tech Summit & Awards 2026 is a one-day HR technology conference in Mumbai for CHROs, HR heads and talent leaders: an opening keynote, four panel discussions on wellbeing, workplace design, HR influence and AI-driven people analytics, and the HR Excellence & Innovation Awards.',
    },

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
      tags: ['GST', 'Audit-ready', 'RegTech', 'Risk & controls', 'TDS & e-invoicing'],
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
