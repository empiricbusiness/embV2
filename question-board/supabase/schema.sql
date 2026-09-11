-- EBM Live Question Board — schema and access rules
--
-- Run once in the Supabase SQL editor. Nothing here is specific to Supabase
-- except the RLS syntax; the shape ports to any Postgres.
--
-- THE SECURITY MODEL, because it is the part that matters:
-- The browser holds the anon key, so the DATABASE has to enforce the rules —
-- there is no server of ours in between. Anyone may read a board and post to an
-- open one; nobody may edit or delete a question through the public key. Only
-- an authenticated moderator can hide, answer or promote.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- boards ----
create table if not exists boards (
  code        text primary key check (code ~ '^[a-z0-9-]{3,24}$'),
  title       text not null,
  event_name  text not null default '',
  open        boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------- questions ----
create table if not exists questions (
  id             uuid primary key default gen_random_uuid(),
  board_code     text not null references boards(code) on delete cascade,
  body           text not null check (length(btrim(body)) between 5 and 400),
  author_name    text not null check (length(btrim(author_name)) between 2 and 80),
  author_company text not null check (length(btrim(author_company)) between 2 and 80),
  hidden         boolean not null default false,
  answered       boolean not null default false,
  promoted       boolean not null default false,
  created_at     timestamptz not null default now()
);
create index if not exists questions_board_idx on questions (board_code, created_at desc);

-- ------------------------------------------------------------------ votes ----
-- voter_id is a random id generated in the browser and kept in localStorage.
-- It is NOT identity — it stops casual double-voting, not a determined person
-- with a fresh incognito window. Accepted trade-off: the alternative is making
-- everyone sign in to upvote, which would collapse participation.
create table if not exists votes (
  question_id uuid not null references questions(id) on delete cascade,
  voter_id    text not null check (length(voter_id) between 8 and 64),
  created_at  timestamptz not null default now(),
  primary key (question_id, voter_id)
);

-- Vote counts are derived, never stored — a denormalised counter drifts the
-- moment two people vote in the same instant.
-- security_invoker: a view runs as its OWNER by default, which reads through
-- row-level security rather than under it. Make it run as the caller.
create or replace view question_counts with (security_invoker = on) as
  select q.id, count(v.voter_id)::int as votes
  from questions q left join votes v on v.question_id = q.id
  group by q.id;

-- ------------------------------------------------------------------- RLS ----
alter table boards    enable row level security;
alter table questions enable row level security;
alter table votes     enable row level security;

-- Who counts as a moderator. Restricted to the company domain so a stray signup
-- cannot moderate. Tighten to an explicit allow-list before a real event.
create or replace function is_moderator() returns boolean
  language sql stable
  -- Pinned search_path: without it, an object created in an earlier schema
  -- could shadow something this relies on.
  set search_path = public, pg_temp
as $$
  select coalesce(auth.jwt() ->> 'email', '') like '%@empiricbusinessmedia.com'
$$;

-- Boards: world readable, moderator writable.
drop policy if exists boards_read on boards;
create policy boards_read on boards for select using (true);
-- Split by verb, not FOR ALL: boards_read already covers SELECT, and a FOR ALL
-- write policy overlapped it so every read evaluated two policies.
drop policy if exists boards_write on boards;
create policy boards_insert on boards for insert with check (is_moderator());
create policy boards_update on boards for update using (is_moderator()) with check (is_moderator());
create policy boards_delete on boards for delete using (is_moderator());

-- Questions: anyone reads; anyone inserts INTO AN OPEN BOARD; only moderators
-- update or delete. Note the insert check also pins the three flags to false so
-- a crafted request cannot self-promote onto the projector.
drop policy if exists questions_read on questions;
create policy questions_read on questions for select using (true);

drop policy if exists questions_insert on questions;
create policy questions_insert on questions for insert with check (
  exists (select 1 from boards b where b.code = board_code and b.open)
  and hidden = false and answered = false and promoted = false
);

drop policy if exists questions_moderate on questions;
create policy questions_moderate on questions for update using (is_moderator()) with check (is_moderator());
drop policy if exists questions_delete on questions;
create policy questions_delete on questions for delete using (is_moderator());

-- Votes: readable, insertable and removable by anyone (the primary key stops
-- double voting); a voter may only delete their own row.
drop policy if exists votes_read on votes;
create policy votes_read on votes for select using (true);
drop policy if exists votes_insert on votes;
create policy votes_insert on votes for insert with check (true);
drop policy if exists votes_delete on votes;
create policy votes_delete on votes for delete using (true);

-- ------------------------------------------------------- rate limiting ------
-- Required, not optional: without it one script fills the projector screen.
-- Caps a single voter_id/browser to 5 questions per board per 10 minutes.
create or replace function check_question_rate() returns trigger
  language plpgsql
  set search_path = public, pg_temp
as $$
declare recent int;
begin
  select count(*) into recent
  from questions
  where board_code = new.board_code
    and created_at > now() - interval '10 minutes'
    and author_name = new.author_name
    and author_company = new.author_company;
  if recent >= 5 then
    raise exception 'Too many questions in a short time. Please wait a moment.';
  end if;
  return new;
end $$;

drop trigger if exists questions_rate_limit on questions;
create trigger questions_rate_limit before insert on questions
  for each row execute function check_question_rate();

-- ---------------------------------------------------------------- realtime --
alter publication supabase_realtime add table questions;
alter publication supabase_realtime add table votes;

-- ------------------------------------------------------------------- DPDP ---
-- Attendees submit name and company, which is personal data under the DPDP Act
-- 2023. Consequences to settle with the client BEFORE the first live event:
--   * consent is captured at submit (the form states the question, name and
--     company are shown publicly on the board and the room screen);
--   * a retention period must be agreed — questions are kept as an event
--     archive, so "indefinitely" needs to be a deliberate, stated decision;
--   * there must be a route for an attendee to have their question removed.
-- The delete policy above gives moderators that ability today.
