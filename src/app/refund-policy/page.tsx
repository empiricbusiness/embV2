import { pageMeta } from '@/lib/seo'
import LegalPage from '@/components/LegalPage'

export const metadata = pageMeta({
  title: 'Refund & Cancellation Policy',
  description:
    'Refund, cancellation, substitution and transfer terms for delegate passes and sponsorship at Empiric Business Media events in India.',
  path: '/refund-policy/',
})

export default function Page() {
  return (
    <LegalPage
      eyebrow="Refund & Cancellation"
      title="Refund & Cancellation Policy"
      path="/refund-policy/"
      updated="2 September 2026"
      intro="This policy sets out what happens if you cancel a delegate pass or sponsorship, or if we change or cancel an event. Publishing it is also a requirement of Indian payment gateways for online sales."
      sections={[
        {
          h: 'Delegate cancellations',
          p: [
            'Cancellation requests must be made in writing to our team.',
            'TODO(client): confirm the cancellation ladder. A common structure is a full refund more than 30 days before the event, a partial refund between 30 and 15 days, and no refund within 14 days. We have deliberately not invented these numbers.',
          ],
        },
        {
          h: 'Substitutions',
          p: [
            'A confirmed delegate place may be transferred to a colleague at no charge, provided the substitute meets the delegate profile for that event and we are told in writing before the event.',
          ],
        },
        {
          h: 'Transfers to another edition',
          p: [
            'Where an edition turns out not to be suitable, a paid pass may be transferred to a future edition subject to availability.',
            'TODO(client): confirm whether transfers are offered, and any administrative fee.',
          ],
        },
        {
          h: 'If EBM postpones an event',
          p: [
            'Registrations transfer automatically to the rescheduled date. If you cannot attend the new date, you may transfer to another edition or request a refund.',
          ],
        },
        {
          h: 'If EBM cancels an event',
          p: [
            'We will refund the delegate fee in full. We are not liable for travel, accommodation or other costs incurred, so we recommend booking flexible travel.',
          ],
        },
        {
          h: 'Sponsorship',
          p: [
            'Sponsorship and exhibition agreements are governed by their own signed contract, which takes precedence over this policy.',
          ],
        },
        {
          h: 'How refunds are processed',
          p: [
            'Approved refunds are returned to the original payment method.',
            'TODO(client): state the processing time (commonly 7 to 14 working days) and whether payment-gateway charges are deducted.',
          ],
        },
      ]}
    />
  )
}
