/**
 * The data contract for the Live Question Board.
 *
 * The storage decision (Supabase / Firebase / something internal) is still open
 * with the client, so nothing in the UI talks to a database directly. Everything
 * goes through `QuestionStore` below, and swapping backend means writing one new
 * adapter — no screen changes.
 */

export type Question = {
  id: string
  boardCode: string
  body: string
  /** Attendees identify themselves: name and company are required at submit. */
  authorName: string
  authorCompany: string
  createdAt: string
  /** Moderator has pulled it from the public board and the screen. */
  hidden: boolean
  /** Moderator has marked it dealt with on stage. */
  answered: boolean
  /** Moderator has pushed it to the projector view. */
  promoted: boolean
  votes: number
  /** Whether THIS viewer has already voted — resolved per device, never stored on the row. */
  votedByMe: boolean
}

export type Board = {
  code: string
  title: string
  /** Free text: which event/session this board belongs to. */
  eventName: string
  createdAt: string
  /** Closed boards accept no new questions but stay readable as an archive. */
  open: boolean
}

export type NewQuestion = {
  boardCode: string
  body: string
  authorName: string
  authorCompany: string
}

/**
 * Every storage backend implements this. Deliberately small: the less surface
 * it has, the cheaper it is to reimplement when the database is chosen.
 */
export interface QuestionStore {
  /** Human-readable name, shown in the moderator footer so it is obvious which backend is live. */
  readonly name: string
  /** False when the backend is not configured — the UI then explains itself instead of failing. */
  readonly ready: boolean

  getBoard(code: string): Promise<Board | null>
  createBoard(input: { code: string; title: string; eventName: string }): Promise<Board>
  setBoardOpen(code: string, open: boolean): Promise<void>

  listQuestions(boardCode: string): Promise<Question[]>
  submitQuestion(input: NewQuestion): Promise<Question>
  toggleVote(questionId: string): Promise<void>
  setFlags(questionId: string, flags: Partial<Pick<Question, 'hidden' | 'answered' | 'promoted'>>): Promise<void>

  /**
   * Push updates to the caller. Returns an unsubscribe function.
   * The local adapter uses BroadcastChannel; Supabase uses realtime channels.
   */
  subscribe(boardCode: string, onChange: () => void): () => void
}

/** Sort used everywhere: most-voted first, newest breaking ties. */
export const rank = (a: Question, b: Question) =>
  b.votes - a.votes || b.createdAt.localeCompare(a.createdAt)
