# EBM Live Question Board

Attendees scan a QR at a session, submit a question with their name and company,
and upvote each other's. The host sees what the room actually wants to discuss,
and a projector view shows the top questions on the room screen.

**This is a separate application.** It has its own `package.json`, its own build
and its own Vercel project. It shares nothing at run time with the marketing
site in the parent directory — that site stays a static export, and none of the
code here ships to it.

```bash
npm install
npm run dev      # http://localhost:3200
```

## The three screens

| Route | Who | What |
|---|---|---|
| `/ask/<code>` | Attendee | Submit a question, upvote others. Phone-first. |
| `/ask/<code>/moderator` | Host | Hide, mark answered, promote to the room screen. |
| `/ask/<code>/screen` | Projector | Top questions, large type, no controls. |

`/` lets an attendee type a code when the QR fails, and lets a host create a
board. Codes are short (`mfg8`) because they get printed on a slide and read
aloud — a full event slug is unusable for that.

## Status: demo mode until a database is connected

The Supabase adapter is built and wired in. `getStore()` in `src/lib/store.ts`
uses it whenever `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
are set. Without them the board falls back to `src/lib/adapters/local.ts` —
`localStorage` plus `BroadcastChannel`.

**What demo mode means:** open the three screens in three tabs of one browser and
the whole flow works live, which is enough to demo it. Data lives in that one
browser, so two phones see two different boards. The UI says so with a "Demo
mode" banner rather than letting anyone mistake it for a deployment.

### Going live

Nothing in the UI touches a database. Everything goes through the `QuestionStore`
interface in `src/lib/types.ts`, so Firebase or something internal would be one
new adapter file.

1. Create a Supabase project and run `supabase/schema.sql`. A fresh project needs
   only that file; `supabase/advisories-patch.sql` is for projects created before
   those fixes were folded into the schema.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the
   Vercel project, then redeploy — `NEXT_PUBLIC_` values are baked in at build
   time.
3. Add moderator sign-in (see below). Until then the database refuses board
   creation and the moderator buttons. That is the security model working, not
   a bug; boards can be created from the Supabase dashboard's table editor in the
   meantime.

The anon key is safe in the browser **only because row-level security does the
enforcement**. `supabase/schema.sql` contains those policies: anyone may read a
board and post to an open one; nobody may edit or delete through the public key;
only an authenticated moderator can hide, answer or promote.

## Before a real event — not optional

- **The moderator route has no authentication.** Today the URL is the only thing
  protecting it, which is fine for a demo and not fine at a summit. The database
  policies already require an authenticated moderator to write those flags, so
  the UI needs a sign-in to match.
- **A moderator is anyone signed in with an `@empiricbusinessmedia.com` email**
  (`is_moderator()` in `supabase/schema.sql`). Keep email confirmation on in
  Supabase Auth, and tighten it to an explicit allow-list.
- **Any browser can remove any vote.** `votes_delete` in `supabase/schema.sql` is
  `using (true)`: voting is anonymous, so the database has no identity to check a
  vote against, and a crafted request could strip the votes off a question.
  Either accept that risk for a given event or authenticate voters —
  `supabase/advisories-patch.sql` explains why a policy alone cannot close it.
- **Agree a retention period.** Attendees submit name and company, which is
  personal data under the DPDP Act 2023. Consent is captured at submit and the
  form states exactly where the information appears, but "kept as an event
  archive" needs to be a stated decision with a period attached, and there must
  be a route for someone to have their question removed.
- **Rate limiting is in the schema, not the UI.** The trigger caps one
  name+company to 5 questions per board per 10 minutes. Confirm that is the
  right number before a large room.
- **Test on the venue wifi.** Drafts survive a reload (kept per board in
  `localStorage`), but reconnection behaviour needs a real trial.

## Decisions already taken

- **Live, with a hide button** rather than approve-before-display. Required
  identity is what makes that safe: people behave differently when their name
  and company are attached.
- **Name and company required.** Costs some volume, raises quality, and gives
  the host useful context on who is asking.
- **Reusable across events**, one board per code, archives kept.

## Deploying

Its own Vercel project, with **Root Directory** set to `question-board`. Do not
add it to the marketing site's project — that one is a static export and this is
not.
