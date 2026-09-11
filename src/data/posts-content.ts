/**
 * Article bodies.
 *
 * Only one genuine article existed on the old site. `blog-2.html` republished
 * this same body under a different headline, and a third headline linked to a
 * 404. Copy has been lightly corrected — notably "every dollar" became
 * "every rupee" in a guide that is explicitly about planning events in India.
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }

export const POST_BODIES: Record<string, { intro: string; blocks: Block[]; tags: string[] }> = {
  'how-to-plan-a-high-impact-corporate-event-in-india': {
    intro:
      'A corporate event only earns its budget if it changes something afterwards. These are the nine stages that separate an event which fills a room from one that generates business — drawn from how we plan our own editions.',
    tags: [
      'Corporate Events',
      'Event Planning',
      'B2B Events',
      'Event Management India',
    ],
    blocks: [
      { type: 'h2', text: '1. Define the objective first' },
      {
        type: 'p',
        text: 'Before anything else, decide what the event is actually for. Lead generation? Brand positioning? Networking and partnerships? Knowledge sharing?',
      },
      {
        type: 'p',
        text: 'A well-defined objective is the foundation of the entire event strategy. It aligns planning, execution and communication. Without a clear goal, even a well-executed event may not translate into measurable business value.',
      },

      { type: 'h2', text: '2. Identify your target audience' },
      { type: 'p', text: 'A successful corporate event depends on reaching the right audience. Define yours by:' },
      {
        type: 'ul',
        items: [
          'Industry sector — manufacturing, BFSI, technology, healthcare',
          'Designation level — CXOs, directors, senior managers',
          'Business scale — SME, mid-market or large enterprise',
        ],
      },
      {
        type: 'p',
        text: 'A precise audience definition allows better curation of content, speakers and engagement formats. Events designed for the right audience naturally produce higher engagement and stronger business conversations.',
      },

      { type: 'h2', text: '3. Plan the budget strategically' },
      {
        type: 'p',
        text: 'Budget planning is more than keeping costs in check. It is about putting money where it matters and getting real value from every rupee.',
      },
      {
        type: 'ul',
        items: [
          'Venue and infrastructure',
          'Event production — AV setup, branding, stage design',
          'Marketing and outreach campaigns',
          'Speaker coordination and management',
          'Travel, hospitality and logistics',
        ],
      },

      { type: 'h2', text: '4. Select the right venue' },
      { type: 'p', text: 'The venue shapes the attendee experience. Evaluate:' },
      {
        type: 'ul',
        items: [
          'Accessibility, especially proximity to airports and business hubs',
          'Capacity and seating flexibility',
          'Technical infrastructure and AV capability',
          'Ambience and alignment with your brand',
        ],
      },
      {
        type: 'p',
        text: 'In cities like Delhi, Mumbai and Bengaluru, the venue often influences both attendance quality and brand perception.',
      },

      { type: 'h2', text: '5. Focus on content and speaker quality' },
      { type: 'p', text: 'Content is the core driver of engagement. Make sure:' },
      {
        type: 'ul',
        items: [
          'Topics address current industry challenges rather than evergreen generalities',
          'Speakers bring real operating experience and domain expertise',
          'Sessions are insight-driven rather than presentation-driven',
        ],
      },
      {
        type: 'p',
        text: 'Attendees value practical takeaways they can apply. High-quality content directly improves satisfaction and event credibility.',
      },

      { type: 'h2', text: '6. Use technology to deepen engagement' },
      { type: 'p', text: 'Technology is a genuine enabler when it serves the session rather than decorating it:' },
      {
        type: 'ul',
        items: [
          'Event management platforms for registration and scheduling',
          'Live polling and interactive Q&A',
          'Digital networking tools for attendee matchmaking',
          'Post-event analytics for performance tracking',
        ],
      },

      { type: 'h2', text: '7. Build a real marketing plan' },
      { type: 'p', text: 'Even a well-planned event needs to reach the right people:' },
      {
        type: 'ul',
        items: [
          'LinkedIn campaigns for targeted B2B reach',
          'Email marketing for direct audience engagement',
          'Speaker-led promotion for credibility and reach',
          'Strategic partnerships and media collaborations',
        ],
      },
      {
        type: 'p',
        text: 'Start early and stay consistent — ideally three to four weeks out at minimum — to build awareness and attendance momentum.',
      },

      { type: 'h2', text: '8. Deliver a seamless day' },
      { type: 'p', text: 'Execution on the day determines how the whole event is remembered:' },
      {
        type: 'ul',
        items: [
          'Fast, frictionless registration',
          'Disciplined time management across sessions',
          'Structured networking rather than hoping it happens',
          'Attendee comfort and hospitality',
        ],
      },

      { type: 'h2', text: '9. Measure and follow up' },
      { type: 'p', text: 'Post-event analysis is how you learn whether it worked:' },
      {
        type: 'ul',
        items: [
          'Total attendance and audience quality',
          'Engagement levels across sessions',
          'Leads and business opportunities generated',
          'Participant feedback and satisfaction scores',
        ],
      },
      {
        type: 'p',
        text: 'Follow-up by email or LinkedIn is what converts event engagement into long-term business outcomes. It is also the stage most often skipped.',
      },

      { type: 'h2', text: 'Final thoughts' },
      {
        type: 'p',
        text: 'A high-impact corporate event in India is built on clarity, structure and execution. Every stage — from defining the objective to post-event follow-up — determines the outcome. Organisations that prioritise relevance and audience quality consistently get more out of their events.',
      },
    ],
  },
}
