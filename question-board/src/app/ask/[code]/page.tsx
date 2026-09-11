import Board from '@/components/Board'

export default async function AskPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  return <Board code={code.toLowerCase()} mode="attendee" />
}
