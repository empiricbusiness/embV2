import type { QuestionStore } from '@/lib/types'
import { createLocalStore } from '@/lib/adapters/local'
import { createSupabaseStore } from '@/lib/adapters/supabase'

/**
 * Picks the backend at run time.
 *
 * With both env vars present it uses Supabase — a real, shared database, so
 * every device sees the same board. Without them it falls back to a
 * browser-local store so the app still runs and can be demonstrated, and the UI
 * shows a "Demo mode" banner rather than letting anyone mistake it for a
 * working deployment.
 *
 * Nothing in the UI imports an adapter directly. Swapping Supabase for Firebase
 * or something internal is one new file implementing `QuestionStore`, plus one
 * line here.
 *
 * NEXT_PUBLIC_* means these values ship in the browser bundle. That is correct
 * for the Supabase URL and ANON key — row-level security does the enforcement
 * (see supabase/schema.sql). The service_role key must NEVER be used here.
 */
let cached: QuestionStore | null = null

export function getStore(): QuestionStore {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  cached = url && key ? createSupabaseStore(url, key) : createLocalStore()
  return cached
}

/** True once a real shared backend is wired up; drives the "demo mode" banner. */
export const isSharedBackend = () => getStore().name !== 'Local browser storage (demo)'
