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
3. Create the moderator accounts and switch off public sign-up (see "Moderator
   sign-in" below).

The anon key is safe in the browser **only because row-level security does the
enforcement**. `supabase/schema.sql` contains those policies: anyone may read a
board and post to an open one; nobody may edit or delete through the public key;
only an authenticated moderator can hide, answer or promote.

## Moderator sign-in

The moderator page (`/ask/<code>/moderator`) and "Create a board" on the home
page sit behind a sign-in (`src/components/ModeratorGate.tsx`). Attendee and
room-screen pages stay open. The database enforces the same rule
(`is_moderator()` in `supabase/schema.sql`), so a copied moderator URL is useless
without an account.

Moderators sign in with an email and a password. There is no sign-up in the app
and no emailed login link: Supabase's built-in mailer only reaches the project's
own team, a couple of messages an hour.

**Add a moderator** (Supabase dashboard): Authentication → Users → Add user →
Create new user → an `@empiricbusinessmedia.com` email and a password → tick
**Auto Confirm User**. Share the password with that person directly.

**Once, per project:** Authentication → Sign In / Providers → turn **off**
"Allow new users to sign up". Only accounts an admin creates can then exist.

In demo mode (no database) the gate lets everyone through — unless a demo
account is set in `.env.local`, which makes the sign-in work locally exactly as
it will against the database:

```
NEXT_PUBLIC_QB_BACKEND=local
NEXT_PUBLIC_DEMO_MODERATOR_EMAIL=demo.moderator@empiricbusinessmedia.com
NEXT_PUBLIC_DEMO_MODERATOR_PASSWORD=<anything>
```

`QB_BACKEND=local` keeps the board in the browser even when the Supabase keys
are present. The demo account is ignored in production builds. The `fintax`
board exists from the start in local mode.

## Before a real event — not optional

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

Production runs on the client's Vercel team (`ebm5`), importing the same
`empiricbusiness/embV2` repository. Set two environment variables there:
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Do **not** set
`NEXT_PUBLIC_QB_BACKEND` or the demo moderator variables — those are for a laptop
demo only, and any `NEXT_PUBLIC_` value present at build time is copied into the
public JavaScript.

**Keep-alive.** A Supabase Free project pauses after a week without activity, and
the board then fails with "Failed to fetch". `vercel.json` schedules a daily cron
at 03:30 UTC (09:00 IST) to `/api/keepalive`, which makes one small read. Vercel
runs crons on production deployments only.
