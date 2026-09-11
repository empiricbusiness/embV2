import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Board, NewQuestion, Question, QuestionStore } from '@/lib/types'

/**
 * Supabase-backed store — the real, shared one.
 *
 * Reads and writes go straight from the browser to Supabase with the ANON key.
 * That is safe only because row-level security does the enforcement; see
 * supabase/schema.sql. The service_role key must never appear in this app.
 */

const VOTER_KEY = 'ebm-qb-voter'

/**
 * A random per-browser id, used as the vote key.
 *
 * It is NOT identity. It stops casual double-voting, not a determined person
 * with a fresh incognito window. The alternative — making everyone sign in to
 * upvote — would collapse participation, which is the whole point of the board.
 */
function voterId(): string {
  if (typeof window === 'undefined') return 'ssr'
  try {
    let v = localStorage.getItem(VOTER_KEY)
    if (!v) {
      v = crypto.randomUUID()
      localStorage.setItem(VOTER_KEY, v)
    }
    return v
  } catch {
    // Storage blocked: votes still register, they just are not remembered as
    // "mine" across reloads.
    return crypto.randomUUID()
  }
}

type QuestionRow = {
  id: string
  board_code: string
  body: string
  author_name: string
  author_company: string
  hidden: boolean
  answered: boolean
  promoted: boolean
  created_at: string
}

export function createSupabaseStore(url: string, anonKey: string): QuestionStore {
  const db: SupabaseClient = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
    realtime: { params: { eventsPerSecond: 5 } },
  })
  const me = voterId()

  return {
    name: 'Supabase',
    ready: true,

    async getBoard(code) {
      const { data, error } = await db.from('boards').select('*').eq('code', code).maybeSingle()
      if (error) throw new Error(error.message)
      if (!data) return null
      return {
        code: data.code,
        title: data.title,
        eventName: data.event_name ?? '',
        createdAt: data.created_at,
        open: data.open,
      } satisfies Board
    },

    async createBoard({ code, title, eventName }) {
      const { data, error } = await db
        .from('boards')
        .insert({ code, title, event_name: eventName })
        .select()
        .single()
      if (error) throw new Error(error.message)
      return {
        code: data.code,
        title: data.title,
        eventName: data.event_name ?? '',
        createdAt: data.created_at,
        open: data.open,
      }
    },

    async setBoardOpen(code, open) {
      const { error } = await db.from('boards').update({ open }).eq('code', code)
      if (error) throw new Error(error.message)
    },

    async listQuestions(boardCode) {
      const { data: rows, error } = await db
        .from('questions')
        .select('*')
        .eq('board_code', boardCode)
        .order('created_at', { ascending: false })
      if (error) throw new Error(error.message)

      const questions = (rows ?? []) as QuestionRow[]
      if (questions.length === 0) return []

      // Counts are derived from the votes table rather than a stored counter:
      // a denormalised column drifts the moment two people vote at once.
      const ids = questions.map((q) => q.id)
      const { data: votes, error: vErr } = await db
        .from('votes')
        .select('question_id, voter_id')
        .in('question_id', ids)
      if (vErr) throw new Error(vErr.message)

      const counts = new Map<string, number>()
      const mine = new Set<string>()
      for (const v of votes ?? []) {
        counts.set(v.question_id, (counts.get(v.question_id) ?? 0) + 1)
        if (v.voter_id === me) mine.add(v.question_id)
      }

      return questions.map<Question>((q) => ({
        id: q.id,
        boardCode: q.board_code,
        body: q.body,
        authorName: q.author_name,
        authorCompany: q.author_company,
        createdAt: q.created_at,
        hidden: q.hidden,
        answered: q.answered,
        promoted: q.promoted,
        votes: counts.get(q.id) ?? 0,
        votedByMe: mine.has(q.id),
      }))
    },

    async submitQuestion(input: NewQuestion) {
      const { data, error } = await db
        .from('questions')
        .insert({
          board_code: input.boardCode,
          body: input.body,
          author_name: input.authorName,
          author_company: input.authorCompany,
        })
        .select()
        .single()
      // The rate-limit trigger raises a readable message; pass it through
      // verbatim rather than replacing it with a generic failure.
      if (error) throw new Error(error.message)
      const q = data as QuestionRow
      return {
        id: q.id,
        boardCode: q.board_code,
        body: q.body,
        authorName: q.author_name,
        authorCompany: q.author_company,
        createdAt: q.created_at,
        hidden: q.hidden,
        answered: q.answered,
        promoted: q.promoted,
        votes: 0,
        votedByMe: false,
      }
    },

    async toggleVote(questionId) {
      const { data: existing, error } = await db
        .from('votes')
        .select('voter_id')
        .eq('question_id', questionId)
        .eq('voter_id', me)
        .maybeSingle()
      if (error) throw new Error(error.message)

      if (existing) {
        const { error: dErr } = await db
          .from('votes')
          .delete()
          .eq('question_id', questionId)
          .eq('voter_id', me)
        if (dErr) throw new Error(dErr.message)
      } else {
        const { error: iErr } = await db
          .from('votes')
          .insert({ question_id: questionId, voter_id: me })
        // A duplicate here means the same browser double-tapped; the primary
        // key did its job, so it is not an error worth surfacing.
        if (iErr && !iErr.message.includes('duplicate')) throw new Error(iErr.message)
      }
    },

    async setFlags(questionId, flags) {
      const { error } = await db.from('questions').update(flags).eq('id', questionId)
      if (error) throw new Error(error.message)
    },

    subscribe(boardCode, onChange) {
      // Questions filter server-side on board_code. Votes cannot — that table
      // has no board column — so every vote wakes this channel and the caller
      // re-reads. Cheap at one-event scale; revisit if boards run concurrently.
      const channel = db
        .channel(`board:${boardCode}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'questions', filter: `board_code=eq.${boardCode}` },
          () => onChange(),
        )
        .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => onChange())
        .subscribe()

      return () => {
        void db.removeChannel(channel)
      }
    },
  }
}
