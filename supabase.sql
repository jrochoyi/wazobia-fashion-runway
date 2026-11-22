-- Run this in the Supabase SQL Editor for the event project.
create table if not exists public.contestants (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 tribe text not null,
 story text default '',
 image_url text not null,
 active boolean not null default true,
 created_at timestamptz not null default now()
);
create table if not exists public.votes (
 id uuid primary key default gen_random_uuid(),
 contestant_id uuid not null references public.contestants(id),
 voter_token text not null unique,
 created_at timestamptz not null default now()
);
create index if not exists votes_contestant_idx on public.votes(contestant_id);
alter table public.contestants enable row level security;
alter table public.votes enable row level security;
drop policy if exists "Public can see active contestants" on public.contestants;
create policy "Public can see active contestants" on public.contestants for select to anon, authenticated using (active = true);
-- Voting is done through this RPC, not direct table access.
create or replace function public.cast_vote(p_contestant_id uuid, p_voter_token text)
returns void language plpgsql security definer set search_path = public as $$
begin
 if length(p_voter_token) < 20 or length(p_voter_token) > 200 then raise exception 'Invalid voter token'; end if;
 if not exists(select 1 from public.contestants where id=p_contestant_id and active=true) then raise exception 'Contestant unavailable'; end if;
 insert into public.votes(contestant_id,voter_token) values(p_contestant_id,p_voter_token);
end; $$;
revoke all on function public.cast_vote(uuid,text) from public;
grant execute on function public.cast_vote(uuid,text) to anon, authenticated;
-- Create a public Storage bucket for contestant photos.
insert into storage.buckets (id,name,public) values ('contestant-photos','contestant-photos',true) on conflict (id) do update set public=true;
-- Admin uploads use the service role from the server; no public upload policy is needed.
