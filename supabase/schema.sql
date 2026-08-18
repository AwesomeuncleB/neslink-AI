-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query).

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_key text not null,
  essay_text text not null,
  overall_score integer,
  word_count integer,
  word_limit integer,
  response jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.submissions enable row level security;

-- Each user can only ever see their own submissions...
create policy "Users can read their own submissions"
  on public.submissions for select
  using (auth.uid() = user_id);

-- ...and can only ever insert rows tagged with their own user id.
-- Combined with the backend forwarding the user's own token (not a service-role
-- key) to Supabase, this means a bug in the backend can't leak one user's
-- essays to another user -- the database enforces it either way.
create policy "Users can insert their own submissions"
  on public.submissions for insert
  with check (auth.uid() = user_id);

create index if not exists submissions_user_id_created_at_idx
  on public.submissions (user_id, created_at desc);
