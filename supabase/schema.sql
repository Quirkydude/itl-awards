-- Run this in Supabase → SQL Editor
-- https://supabase.com/dashboard → your project → SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  votes jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  constraint votes_phone_unique unique (phone)
);

create index if not exists votes_submitted_at_idx
  on public.votes (submitted_at desc);

-- Lock down: only service role (server) can read/write
alter table public.votes enable row level security;

-- No policies for anon/authenticated → public clients cannot access rows.
-- The Next.js API uses the service role key, which bypasses RLS.
