import type { Metadata, Viewport } from 'next'
import { Onest } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { SITE } from '@/data/site'
import { organizationLd, websiteLd } from '@/lib/seo'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import ConsentBanner from '@/components/ConsentBanner'
import { CONSENT_KEY } from '@/lib/consent'

/**
 * Self-hosted at build time by next/font — no render-blocking request to
 * fonts.googleapis.com. The old site requested the full Onest 100..900 variable
 * range plus Font Awesome and Remix Icon webfonts (247 KB of icon fonts alone).
 */
const onest = Onest({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-onest',
  // Not preloaded on purpose. Five preload links at top priority were
  // competing with the hero image for bandwidth on throttled mobile and
  // pushing LCP past 3s. With display:swap plus next/font's size-adjusted
  // fallback, text paints immediately in the metric-matched fallback and
  // swaps in without layout shift once the woff2 arrives.
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Empiric Business Media - EBM | B2B Conferences & Summits',
    // Short suffix on purpose: Google truncates around 60-65 characters, and
    // "| Empiric Business Media" alone eats 25 of them.
    template: '%s | EBM',
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.legalName,
  alternates: { canonical: `${SITE.url}/` },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: '48x48' }, { url: '/images/brand/favicon.png', type: 'image/png' }],
    apple: '/images/brand/favicon.png',
  },
  formatDetection: { telephone: true, address: true, email: true },
}

export const viewport: Viewport = {
  themeColor: '#071d33',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
}

/**
 * Google Analytics 4, property "EBM website". afterInteractive keeps gtag off the
 * critical rendering path. Enhanced measurement (switched on in GA) records
 * client-side route changes, so no per-navigation code is needed here.
 *
 * Consent Mode v2: storage starts denied, and a stored "granted" is replayed
 * before `config` on every page, so GA sets no cookie until the visitor accepts
 * in <ConsentBanner>. Without consent GA sends only cookieless pings.
 */
const GA_ID = 'G-3P9S92J6H7'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={onest.variable}>
      <body>
        <JsonLd data={organizationLd()} />
        <JsonLd data={websiteLd()} />
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ConsentBanner />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}` +
            `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});` +
            `try{if(localStorage.getItem('${CONSENT_KEY}')==='granted')gtag('consent','update',{analytics_storage:'granted'})}catch(e){}` +
            `gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
      </body>
    </html>
  )
}
