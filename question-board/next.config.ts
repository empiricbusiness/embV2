import type { NextConfig } from 'next'

/**
 * NOT a static export, unlike the marketing site.
 *
 * Board codes are created by moderators at run time, so `/ask/[code]` cannot be
 * enumerated at build time and `output: 'export'` would not work. This is a
 * normal Next app; it is also a separate Vercel project, so the marketing
 * site's static build and its Lighthouse scores are untouched by anything here.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
}

export default nextConfig
