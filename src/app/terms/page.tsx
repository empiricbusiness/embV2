import { pageMeta } from '@/lib/seo'
import LegalPage from '@/components/LegalPage'

export const metadata = pageMeta({
  title: 'Terms of Use',
  description:
    'The terms governing use of the Empiric Business Media website and participation in EBM conferences, summits and awards.',
  path: '/terms/',
})

export default function Page() {
  return (
    <LegalPage
      eyebrow="Terms of Use"
      title="Terms of Use"
      path="/terms/"
      updated="2 September 2026"
      intro="These terms govern your use of this website and your participation in events organised by Empiric Business Media. By using the site or registering for an event, you accept them."
      sections={[
        {
          h: 'Use of this website',
          p: [
            'The content on this site is provided for information. You may view and print it for your own business use. You may not republish, sell or systematically extract it without our written permission.',
          ],
        },
        {
          h: 'Event registration',
          p: [
            'A registration is confirmed only once we have accepted it and payment, where applicable, has cleared. We operate an invitation-led model and reserve the right to decline a registration that does not meet the delegate profile for an event.',
          ],
        },
        {
          h: 'Programme changes',
          p: [
            'Agendas, speakers, venues and timings are subject to change. We will tell registered delegates about material changes as early as we can. A change of speaker or session is not on its own grounds for a refund.',
          ],
        },
        {
          h: 'Cancellation by EBM',
          p: [
            'If we cancel or postpone an event, our liability is limited as set out in the Refund and Cancellation Policy.',
          ],
        },
        {
          h: 'Conduct at events',
          p: [
            'We expect professional conduct. We may refuse entry to, or remove, anyone whose behaviour is disruptive, discriminatory or unsafe, without refund.',
          ],
        },
        {
          h: 'Third-party marks',
          p: [
            'Partner, sponsor and client logos shown on this site remain the property of their respective owners and are displayed with permission.',
            'TODO(client): confirm written permission is held for every third-party mark displayed, particularly the large global brands carried over from the previous site.',
          ],
        },
        {
          h: 'Governing law',
          p: [
            'These terms are governed by the laws of India, and the courts of Mumbai, Maharashtra have exclusive jurisdiction.',
            'TODO(client): confirm the jurisdiction clause with your legal advisor.',
          ],
        },
      ]}
    />
  )
}
