import type { Board, Moderator, NewQuestion, Question, QuestionStore } from '@/lib/types'

/**
 * Browser-only store: localStorage for the data, BroadcastChannel for liveness.
 *
 * This exists so the board can be BUILT AND DEMONSTRATED before the database is
 * chosen. Open the attendee view, the moderator view and the screen view in
 * three tabs and they update each other in real time — enough to show the whole
 * flow in a meeting.
 *
 * It is NOT the product. Data lives in one browser, so two phones see two
 * different boards. The UI says so plainly rather than letting anyone mistake
 * it for a working deployment.
 */
const KEY = 'ebm-qb'
const CHANNEL = 'ebm-qb-changes'

type Snapshot = {
  boards: Record<string, Board>
  questions: Question[]
  /** questionId -> true, per browser. Mirrors what a votes table would enforce. */
  votes: Record<string, boolean>
}

const empty = (): Snapshot => ({ boards: {}, questions: [], votes: {} })

function read(): Snapshot {
  if (typeof window === 'undefined') return empty()
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty()
  } catch {
    // Private mode, blocked site data, corrupt JSON — behave like a fresh board
    // rather than throwing on first paint.
    return empty()
  }
}

function write(s: Snapshot) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* quota or blocked storage — the in-memory view still works for this tab */
  }
  try {
    new BroadcastChannel(CHANNEL).postMessage(Date.now())
  } catch {
    /* older browsers: other tabs simply refresh on their own interval */
  }
}

/*
 * Demo moderator login, for trying the sign-in flow locally without a database.
 * The account comes from .env.local (NEXT_PUBLIC_DEMO_MODERATOR_EMAIL and
 * NEXT_PUBLIC_DEMO_MODERATOR_PASSWORD). It is honoured only outside production
 * builds, so a stray variable can never open a deployed board. Without it, demo
 * mode lets everyone through, as before.
 */
const DEMO_EMAIL = (process.env.NEXT_PUBLIC_DEMO_MODERATOR_EMAIL ?? '').trim().toLowerCase()
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_MODERATOR_PASSWORD ?? ''
const DEMO_LOGIN = process.env.NODE_ENV !== 'production' && !!DEMO_EMAIL && !!DEMO_PASSWORD
const SESSION_KEY = 'ebm-qb-demo-session'
const AUTH_CHANNEL = 'ebm-qb-auth'

function readSession(): Moderator | null {
  if (typeof window === 'undefined') return null
  try {
    const email = window.localStorage.getItem(SESSION_KEY)
    return email ? { email } : null
  } catch {
    return null
  }
}

function writeSession(email: string | null) {
  try {
    if (email) window.localStorage.setItem(SESSION_KEY, email)
    else window.localStorage.removeItem(SESSION_KEY)
  } catch {
    /* blocked storage: the sign-in lasts for this tab only */
  }
  try {
    new BroadcastChannel(AUTH_CHANNEL).postMessage(email ?? '')
  } catch {
    /* other tabs pick it up from the storage event */
  }
}

/** Boards that exist from the start in local mode. */
const SEED_BOARDS: Record<string, { title: string; eventName: string }> = {
  fintax: { title: 'Ask the panel', eventName: '5th Edition FinTax Summit & Awards 2026' },
}

/** Ids do not need to be unguessable, only unique within one browser. */
let seq = 0
const id = () => `q${Date.now().toString(36)}${(seq++).toString(36)}`

export function createLocalStore(): QuestionStore {
  return {
    name: 'Local browser storage (demo)',
    ready: true,

    async getBoard(code) {
      const s = read()
      if (!s.boards[code] && SEED_BOARDS[code] && typeof window !== 'undefined') {
        s.boards[code] = { code, ...SEED_BOARDS[code], createdAt: new Date().toISOString(), open: true }
        write(s)
      }
      return s.boards[code] ?? null
    },

    async createBoard({ code, title, eventName }) {
      const s = read()
      const board: Board = {
        code,
        title,
        eventName,
        createdAt: new Date().toISOString(),
        open: true,
      }
      s.boards[code] = board
      write(s)
      return board
    },

    async setBoardOpen(code, open) {
      const s = read()
      if (s.boards[code]) {
        s.boards[code] = { ...s.boards[code], open }
        write(s)
      }
    },

    async listQuestions(boardCode) {
      const s = read()
      return s.questions
        .filter((q) => q.boardCode === boardCode)
        .map((q) => ({ ...q, votedByMe: Boolean(s.votes[q.id]) }))
    },

    async submitQuestion(input: NewQuestion) {
      const s = read()
      const q: Question = {
        id: id(),
        boardCode: input.boardCode,
        body: input.body,
        authorName: input.authorName,
        authorCompany: input.authorCompany,
        createdAt: new Date().toISOString(),
        hidden: false,
        answered: false,
        promoted: false,
        votes: 0,
        votedByMe: false,
      }
      s.questions.push(q)
      write(s)
      return q
    },

    async toggleVote(questionId) {
      const s = read()
      const q = s.questions.find((x) => x.id === questionId)
      if (!q) return
      if (s.votes[questionId]) {
        delete s.votes[questionId]
        q.votes = Math.max(0, q.votes - 1)
      } else {
        s.votes[questionId] = true
        q.votes += 1
      }
      write(s)
    },

    async setFlags(questionId, flags) {
      const s = read()
      const i = s.questions.findIndex((x) => x.id === questionId)
      if (i === -1) return
      s.questions[i] = { ...s.questions[i], ...flags }
      write(s)
    },

    // With a demo account configured, sign-in works as it will against the
    // database; without one, demo mode lets everyone through.
    needsSignIn: DEMO_LOGIN,
    async getModerator() {
      return DEMO_LOGIN ? readSession() : { email: 'demo@empiricbusinessmedia.com' }
    },
    async signIn(email, password) {
      if (!DEMO_LOGIN) return { email }
      // The same message Supabase gives, for a wrong email or password alike.
      if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        throw new Error('Invalid login credentials')
      }
      writeSession(DEMO_EMAIL)
      return { email: DEMO_EMAIL }
    },
    async signOut() {
      writeSession(null)
    },
    onModeratorChange(cb) {
      if (!DEMO_LOGIN || typeof window === 'undefined') return () => {}
      const notify = () => cb(readSession())
      let ch: BroadcastChannel | null = null
      try {
        ch = new BroadcastChannel(AUTH_CHANNEL)
        ch.onmessage = notify
      } catch {
        /* storage event below covers it */
      }
      const onStorage = (e: StorageEvent) => {
        if (e.key === SESSION_KEY) notify()
      }
      window.addEventListener('storage', onStorage)
      return () => {
        ch?.close()
        window.removeEventListener('storage', onStorage)
      }
    },

    subscribe(_boardCode, onChange) {
      if (typeof window === 'undefined') return () => {}
      let ch: BroadcastChannel | null = null
      try {
        ch = new BroadcastChannel(CHANNEL)
        ch.onmessage = () => onChange()
      } catch {
        /* no BroadcastChannel: fall back to the storage event below */
      }
      // `storage` fires in OTHER tabs, which covers browsers without
      // BroadcastChannel and is harmless alongside it.
      const onStorage = (e: StorageEvent) => {
        if (e.key === KEY) onChange()
      }
      window.addEventListener('storage', onStorage)
      return () => {
        ch?.close()
        window.removeEventListener('storage', onStorage)
      }
    },
  }
}
