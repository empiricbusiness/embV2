/**
 * Daily keep-alive for the Supabase Free project, called by the Vercel cron in
 * vercel.json. A Free project pauses after a week without activity and Supabase
 * then withdraws its DNS, so the board fails with "Failed to fetch" — one cheap
 * read a day keeps it awake between events.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return Response.json({ ok: false, error: 'Supabase environment variables are not set' }, { status: 500 })
  }

  try {
    const res = await fetch(`${url}/rest/v1/boards?select=code&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store',
    })
    return Response.json({ ok: res.ok, status: res.status, at: new Date().toISOString() }, { status: res.ok ? 200 : 502 })
  } catch (err) {
    // A paused project has no DNS record, so the fetch itself throws.
    return Response.json({ ok: false, error: String(err), at: new Date().toISOString() }, { status: 502 })
  }
}
