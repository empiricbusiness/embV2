import Board from '@/components/Board'

/** Projector view: big type, top questions, no controls. */
export default async function ScreenPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  return <Board code={code.toLowerCase()} mode="screen" />
}
