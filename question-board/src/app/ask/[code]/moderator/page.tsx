import Board from '@/components/Board'
import ModeratorGate from '@/components/ModeratorGate'

/**
 * The host's view, behind moderator sign-in. The database enforces the same
 * rule (is_moderator() in supabase/schema.sql), so a copied URL alone can no
 * longer hide, answer or promote anything.
 */
export default async function ModeratorPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  return (
    <ModeratorGate purpose="moderate this board" page>
      <Board code={code.toLowerCase()} mode="moderator" />
    </ModeratorGate>
  )
}
