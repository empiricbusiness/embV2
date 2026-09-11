import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // NOTE: experimental.inlineCss was measured and rejected. It grew the HTML
  // from 147KB to 271KB, and on Lighthouse's slow-4G throttle the extra bytes
  // in the critical stream cost more than the saved round-trip — the contact
  // page's LCP went from 1.7s to 2.2s. A cached, parallel stylesheet wins here.
}

export default nextConfig
