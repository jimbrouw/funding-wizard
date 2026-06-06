-- Grant Engine MVP schema.
-- Internal MVP: no auth/RLS policy is enabled here. API routes should use the
-- Supabase service role key server-side only.

create extension if not exists pgcrypto;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  raw_idea text not null,
  concrete_outputs text,
  budget_total numeric,
  status text not null default 'draft'
    check (status in ('draft','interrogating','ready_to_draft','drafted','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists grants (
  id uuid primary key default gen_random_uuid(),
  funder_name text not null,
  title text not null,
  grant_url text,
  deadline date,
  max_amount numeric,
  match_summary text,
  historical_focus text,
  assessment_criteria jsonb not null default '[]'::jsonb,
  requirements_text text,
  status text not null default 'discovery'
    check (status in ('discovery','active','selected','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists master_data_assets (
  id uuid primary key default gen_random_uuid(),
  asset_type text not null
    check (asset_type in ('bio','budget_template','access_rider','method_statement','equipment_inventory','past_project_outcome')),
  title text not null,
  content text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_grants (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  grant_id uuid not null references grants(id) on delete cascade,
  relationship text not null default 'candidate'
    check (relationship in ('candidate','selected','rejected')),
  match_score numeric,
  created_at timestamptz not null default now(),
  unique (project_id, grant_id)
);

create unique index if not exists one_selected_grant_per_project
  on project_grants (project_id)
  where relationship = 'selected';

create index if not exists project_grants_grant_id_idx
  on project_grants (grant_id);

create table if not exists interrogation_questions (
  id uuid primary key default gen_random_uuid(),
  project_grant_id uuid not null references project_grants(id) on delete cascade,
  criterion_id text,
  question text not null,
  reason text,
  required boolean not null default true,
  status text not null default 'open'
    check (status in ('open','answered','not_applicable','rewrite_requested')),
  answer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists interrogation_questions_project_grant_id_idx
  on interrogation_questions (project_grant_id);

create table if not exists draft_sections (
  id uuid primary key default gen_random_uuid(),
  project_grant_id uuid not null references project_grants(id) on delete cascade,
  section_key text not null,
  title text not null,
  generated_text text not null,
  source_inputs jsonb not null default '{}'::jsonb,
  guardrail_flags jsonb not null default '[]'::jsonb,
  status text not null default 'generated'
    check (status in ('generated','edited','approved','flagged')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists draft_sections_project_grant_id_idx
  on draft_sections (project_grant_id);

create or replace function block_project_ready_with_open_questions()
returns trigger
language plpgsql
as $$
declare
  selected_pairing uuid;
  unresolved_count integer;
begin
  if new.status = 'ready_to_draft' and old.status is distinct from new.status then
    select id into selected_pairing
    from project_grants
    where project_id = new.id and relationship = 'selected'
    limit 1;

    if selected_pairing is null then
      raise exception 'Cannot mark project ready_to_draft without a selected grant';
    end if;

    select count(*) into unresolved_count
    from interrogation_questions
    where project_grant_id = selected_pairing
      and required = true
      and status in ('open','rewrite_requested');

    if unresolved_count > 0 then
      raise exception 'Cannot mark project ready_to_draft while interrogation questions are unresolved';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists projects_ready_to_draft_guard on projects;
create trigger projects_ready_to_draft_guard
before update of status on projects
for each row
execute function block_project_ready_with_open_questions();
