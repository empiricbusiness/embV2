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
export type EventSpeaker = { name: string; title: string; company: string }
export type AwardGroup = { name: string; categories: string[] }
export type EventContact = {
  role: string
  name: string
  title: string
  email: string
  phones: string[]
}

export type EventContent = {
  /** Straplines and prose from the edition's own site. */
  about: string[]
  pillars?: FocusItem[]
  audience?: { heading: string; roles: string[]; note?: string }
  focus?: { heading: string; lede: string; items: FocusItem[] }
  whyAttend?: { heading: string; items: FocusItem[] }
  speakers?: { heading: string; lede: string; people: EventSpeaker[] }
  awards?: { name: string; groups: AwardGroup[] }
  whySponsor?: FocusItem[]
  contacts?: EventContact[]
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
}
