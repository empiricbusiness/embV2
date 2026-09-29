/**
 * Line icons for the event showcase page (24px grid, 1.8 stroke, currentColor).
 * Inline SVG paths — no icon font, no request. Shared by the server component
 * and the small client components on the page.
 */
const PATHS: Record<string, string> = {
  calendar: 'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 10h16M8.5 3v4M15.5 3v4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2',
  pin: 'M12 21s-6.5-5.8-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.2 12 21 12 21zM12 12.6a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5.5M12 7.8v.2',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.3a3.5 3.5 0 0 1 0 6.4M21.5 20.5c0-2.8-1.6-4.9-4-5.7',
  mic: 'M12 14.5a3 3 0 0 0 3-3v-5a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zM6 11a6 6 0 0 0 12 0M12 17v4M8.5 21h7',
  list: 'M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01',
  trophy: 'M8 20.5h8M12 16.5v4M7 3.5h10v5.5a5 5 0 0 1-10 0zM17 5h3v1.8A3.3 3.3 0 0 1 16.8 10M7 5H4v1.8A3.3 3.3 0 0 0 7.2 10',
  briefcase: 'M4 8h16v11.5H4zM9 8V5.5h6V8M4 13h16M11 13v2h2v-2',
  megaphone: 'M3.5 10.5v3a1 1 0 0 0 1 1H7l5 4v-13l-5 4H4.5a1 1 0 0 0-1 1zM15.5 9a3.5 3.5 0 0 1 0 6M18.5 6.5a7 7 0 0 1 0 11',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.6 9.2a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .9-1 1.6v.4M12 16.8v.2',
  check: 'M5 12.5 9.5 17 19 7.5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  chevron: 'M6 9l6 6 6-6',
  flip: 'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4',
  quote: 'M9.5 7C6.5 8 5 10.3 5 13.5V17h5v-5H7.3c.2-1.7 1.1-2.9 2.7-3.6zM19.5 7c-3 1-4.5 3.3-4.5 6.5V17h5v-5h-2.7c.2-1.7 1.1-2.9 2.7-3.6z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM12 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z',
  layers: 'M12 3 2.5 8 12 13l9.5-5zM2.5 12.5 12 17.5l9.5-5M2.5 16.5 12 21.5l9.5-5',
  rocket: 'M5 15c-1.5 1.5-2 4-2 6 2 0 4.5-.5 6-2M14.5 4.5c2.5-1.2 4.8-1.3 6-1.3 0 1.2-.1 3.5-1.3 6L13 15.5 8.5 11zM8.5 11 5 10.5 7.5 8h4.3M13 15.5l.5 3.5 2.5-2.5v-4.3M15.5 9.5a1 1 0 1 0 0-.01',
  // departments
  percent: 'M19 5 5 19M7.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM16.5 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  calculator: 'M6.5 3h11A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3zM8 6.5h8v3H8zM8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01',
  shield: 'M12 21s7-3.2 7-9V5.5L12 3 5 5.5V12c0 5.8 7 9 7 9zM12 8v4.5M12 15.5v.2',
  scale: 'M12 4v16M7.5 20h9M5 7h14M5 7l-2.5 6a2.5 2.5 0 0 0 5 0zM19 7l-2.5 6a2.5 2.5 0 0 0 5 0zM12 4a1 1 0 1 0 0 .01',
  search: 'M10.5 17.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20.5 20.5l-5-5M8 10.5l1.8 1.8 3.2-3.3',
  network: 'M12 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM19 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM12 8v4M12 12l-5.5 4.5M12 12l5.5 4.5',
  coins: 'M9 10.5c3.3 0 6-1.1 6-2.5S12.3 5.5 9 5.5 3 6.6 3 8s2.7 2.5 6 2.5zM3 8v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V8M9 14.5v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4c0-1.4-2.7-2.5-6-2.5',
  gavel: 'M14 3.5 20.5 10M11.5 6l6.5 6.5M13 4.5 9 8.5l6.5 6.5 4-4M11.5 11.5 4 19a1.4 1.4 0 0 0 2 2l7.5-7.5M3 21h9',
  cpu: 'M7 7h10v10H7zM10 10h4v4h-4zM9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4',
  chart: 'M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6M20 16V6',
  // industries
  bank: 'M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20.5h18',
  fintech: 'M7 3h10a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 17 21H7a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 7 3zM10 18h4M12 7.5v5M10.2 9c.3-.7 1-1 1.8-1 1 0 1.8.5 1.8 1.2 0 1.6-3.6 1-3.6 2.6 0 .7.8 1.2 1.8 1.2.8 0 1.5-.3 1.8-1',
  factory: 'M3 20.5V10.5l5 3v-3l5 3v-3l5 3V4.5h3v16zM7 17.5h2M12 17.5h2',
  pill: 'M8.2 20.3a4.5 4.5 0 0 1-6.4-6.4l8.5-8.5a4.5 4.5 0 0 1 6.4 6.4zM6.1 9.6l8.3 8.3',
  cart: 'M3 4h2.2l2.1 10.5h10.4l2-7.5H6.3M9 19.5a1 1 0 1 0 0 .01M17 19.5a1 1 0 1 0 0 .01',
  shop: 'M4 8h16l-1.2 12H5.2zM8.5 8V6.5a3.5 3.5 0 0 1 7 0V8',
  code: 'M8 8l-4 4 4 4M16 8l4 4-4 4M13.6 5l-3.2 14',
  antenna: 'M12 12.5v8.5M8.5 21h7M12 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 6.5a5.7 5.7 0 0 0 0 8M16 6.5a5.7 5.7 0 0 1 0 8M5.2 3.8a9.6 9.6 0 0 0 0 13.4M18.8 3.8a9.6 9.6 0 0 1 0 13.4',
  building: 'M4 20.5V9.5h6.5v11M10.5 20.5V3.5h9.5v17M2.5 20.5h19M13.5 7.5h3M13.5 11.5h3M13.5 15.5h3M6.5 13h2M6.5 16.5h2',
  bolt: 'M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5z',
}

export default function ShowcaseIcon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name] ?? PATHS.spark} />
    </svg>
  )
}

/** Pick an icon from a label, so the data file stays plain text. */
export function iconFor(label: string): string {
  const rules: [RegExp, string][] = [
    // departments
    [/taxation|direct\/indirect/i, 'percent'],
    [/finance & accounts/i, 'calculator'],
    [/^risk management/i, 'shield'],
    [/compliance & regulatory/i, 'scale'],
    [/internal audit/i, 'search'],
    [/governance, risk/i, 'network'],
    [/treasury/i, 'coins'],
    [/legal/i, 'gavel'],
    [/technology \/ it|digital transformation/i, 'cpu'],
    [/data, analytics/i, 'chart'],
    // industries
    [/bank|bfsi|insurance/i, 'bank'],
    [/nbfc|fintech/i, 'fintech'],
    [/manufactur|industrial/i, 'factory'],
    [/pharma|life science/i, 'pill'],
    [/fmcg|retail/i, 'cart'],
    [/commerce|digital platform/i, 'shop'],
    [/\bIT\b|ITES/, 'code'],
    [/telecom|media/i, 'antenna'],
    [/infra|real estate/i, 'building'],
    [/energy|oil|gas/i, 'bolt'],
  ]
  return rules.find(([re]) => re.test(label))?.[1] ?? 'spark'
}
