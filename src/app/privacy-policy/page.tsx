import { pageMeta } from '@/lib/seo'
import LegalPage from '@/components/LegalPage'

export const metadata = pageMeta({
  title: 'Privacy Policy',
  description:
    'How EBM collects, uses and protects personal data from this website and our events, in line with the Digital Personal Data Protection Act 2023.',
  path: '/privacy-policy/',
})

export default function Page() {
  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      path="/privacy-policy/"
      updated="2 September 2026"
      intro="This policy explains what personal data Empiric Business Media collects, why we collect it, who we share it with, and the rights you have over it. It applies to this website and to registration for our events."
      sections={[
        {
          h: 'What we collect',
          p: [
            'When you submit an enquiry or register for an event we collect the details you provide: name, work email, company, job title, phone number and the content of your message.',
            'When you visit the site we may collect standard technical data such as IP address, browser type and pages visited, through analytics. We do not use this to identify you personally.',
          ],
        },
        {
          h: 'Why we use it',
          p: [
            'To respond to your enquiry, to process and administer event registrations, to send you information about the event you registered for, and — where you have consented — to tell you about future EBM events relevant to your sector.',
            'We do not sell personal data.',
          ],
        },
        {
          h: 'Sharing with sponsors',
          p: [
            'Our events are supported by sponsors. Where we intend to share a delegate’s contact details with a sponsor, we ask for explicit consent at the point of registration and identify the sponsor. You can decline and still attend.',
            'TODO(client): confirm this reflects your actual practice, including whether badge scanning at events shares data with exhibitors, and how that consent is captured.',
          ],
        },
        {
          h: 'Photography and recording',
          p: [
            'Our events are photographed and sometimes recorded. Images may be used in EBM marketing, including on this website. If you do not wish to appear, tell the on-site team and we will accommodate it.',
          ],
        },
        {
          h: 'Retention',
          p: [
            'We keep enquiry and registration data for as long as needed for the purpose it was collected, and thereafter only where we have a legal reason to.',
            'TODO(client): state a specific retention period.',
          ],
        },
        {
          h: 'Your rights',
          p: [
            'Under the Digital Personal Data Protection Act 2023 you may request access to your personal data, ask for it to be corrected, ask for it to be erased, and withdraw consent at any time. Email us to exercise any of these rights.',
          ],
        },
        {
          h: 'Cookies and analytics',
          p: [
            'This site uses only what is necessary to function, plus analytics to understand how the site is used.',
            'TODO(client): confirm which analytics and marketing tools will be deployed. If any non-essential cookies are used, a consent banner is required before they load.',
          ],
        },
      ]}
    />
  )
}
