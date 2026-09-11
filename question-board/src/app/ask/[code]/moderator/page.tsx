import Board from '@/components/Board'

/**
 * TODO before a live event: put this behind authentication.
 *
 * Today the URL is the only thing protecting it, which is fine for a demo and
 * NOT fine at a real summit — anyone who guesses /moderator can hide questions.
 * The database policies already require an authenticated moderator to write
 * those flags (see supabase/schema.sql), so this needs a sign-in to match.
 */
export default async function ModeratorPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  return <Board code={code.toLowerCase()} mode="moderator" />
}
