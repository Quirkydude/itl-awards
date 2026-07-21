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

-- OTP codes for phone verification (Moolr delivers SMS; we verify ourselves)
create table if not exists public.otp_codes (
  phone text primary key,
  code_hash text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists otp_codes_expires_at_idx
  on public.otp_codes (expires_at);

alter table public.otp_codes enable row level security;
