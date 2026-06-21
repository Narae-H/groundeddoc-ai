-- ============================================================
-- GroundedDoc Prototype — Data Model
-- Supabase (Postgres)
--
-- Design principles encoded here:
--   1. Access control is enforced at the ROW level (one document = one row).
--   2. org_id is the tenant boundary, present on every tenant-scoped table.
--   3. Documents and conversations are scoped to a PROJECT (a scope of documents
--      within an org); org_id is kept denormalised on every tenant-scoped table
--      so the tenant check stays a flat column comparison.
--   4. Secure by default: access_level defaults to the most restrictive value.
--   5. AI output (grounded + citations) is persisted as-is; verification is
--      done in code against documents.content.
--
-- URL-facing entities (projects, conversations) carry a short opaque public_id
-- (an ~10-char nanoid generated APP-SIDE) as the URL handle, while the uuid PK
-- stays the internal identifier. This file only declares the column + uniqueness
-- and seeds a literal value; generation lives in app code.
--
-- NOTE: This prototype is SINGLE-USER. RLS is written below but kept OFF.
--       The app uses a fixed DEMO_ORG_ID. See the "ENFORCEMENT LAYER" section.
-- ============================================================


-- ------------------------------------------------------------
-- organizations — the tenant. Anchor for org_id everywhere else.
-- ------------------------------------------------------------
create table organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now()
);


-- ------------------------------------------------------------
-- projects — a SCOPE of documents within an org. Documents and conversations
--   belong to a project; a question in a project spans that project's documents.
--   org_id    = kept as the denormalised tenant column (the tenant boundary RLS
--               checks), so project rows scope the same way as everything else.
--   public_id = the URL-facing handle — a short opaque (~10-char) nanoid generated
--               APP-SIDE. The uuid PK stays the internal identifier; public_id is
--               what appears in URLs. This file only declares it + uniqueness and
--               seeds a literal value (no DB default / no generation here).
-- ------------------------------------------------------------
create table projects (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations(id) on delete cascade,
  public_id   text not null unique,         -- short opaque URL id (app-side nanoid)
  name        text not null,
  created_at  timestamptz not null default now()
);

create index projects_org_id_idx on projects (org_id);


-- ------------------------------------------------------------
-- documents — the ACCESS UNIT. RLS (when on) filters this table by org_id.
--   project_id   = the project this document belongs to. Documents are now
--                  PROJECT-scoped; org_id is retained as the tenant boundary.
--   org_id       = kept alongside project_id as the denormalised tenant column,
--                  so the RLS check stays a flat column comparison (no join).
--                  Enforcing org_id == projects.org_id via CHECK/trigger is
--                  intentionally OUT OF SCOPE for the prototype.
--   content      = extracted plain text. Fed to the model AND used to verify
--                  citation quotes. Lives in the DB because it must be queryable
--                  and re-read cheaply on every question.
--   storage_path = pointer to the ORIGINAL file in Supabase Storage. Kept for
--                  provenance, "view source" UX, and possible re-extraction.
--   access_level = secure-by-default. One document carries ONE access level
--                  (upload unit = access unit). Default is the most restrictive.
-- ------------------------------------------------------------
create table documents (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references organizations(id) on delete cascade,
  project_id    uuid not null references projects(id) on delete cascade,
  title         text not null,            -- exact string the model cites
  doc_type      text not null check (doc_type in ('eba','subcontract','award','policy')),
  access_level  text not null default 'org_private'
                  check (access_level in ('org_private','org_public')),
  storage_path  text,                     -- nullable: text-only docs may skip Storage
  content       text not null,            -- extracted text (context + citation source)
  created_at    timestamptz not null default now()
);

create index documents_org_id_idx on documents (org_id);
create index documents_project_id_idx on documents (project_id);


-- ------------------------------------------------------------
-- conversations — a chat session, scoped to a PROJECT (not to a single document).
--   project_id = the project this conversation belongs to. A conversation spans
--                THAT PROJECT's documents — cross-document questions ("compare EBA
--                vs award") run across the documents within the project. There is
--                deliberately no document_id FK.
--   org_id     = kept alongside project_id as the denormalised tenant column, so
--                the RLS check stays a flat column comparison (no join). Enforcing
--                org_id == projects.org_id via CHECK/trigger is intentionally OUT
--                OF SCOPE for the prototype.
--   public_id  = the URL-facing handle — a short opaque (~10-char) nanoid generated
--                APP-SIDE, same rationale as projects. uuid PK stays internal.
-- ------------------------------------------------------------
create table conversations (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations(id) on delete cascade,
  project_id  uuid not null references projects(id) on delete cascade,
  public_id   text not null unique,         -- short opaque URL id (app-side nanoid)
  title       text,                       -- nullable; can derive from first question
  created_at  timestamptz not null default now()
);

create index conversations_org_id_idx on conversations (org_id);
create index conversations_project_id_idx on conversations (project_id);


-- ------------------------------------------------------------
-- messages — one turn. The AI's structured output is stored here directly.
--   grounded   = null for user messages; true/false for assistant messages.
--   citations  = jsonb array of { documentId, documentTitle, locator, quote }.
--                Embedded (not a table) because a citation is a point-in-time
--                snapshot of one answer with no independent lifecycle.
--   org_id     = DENORMALIZED from conversations so RLS policies stay flat
--                column checks instead of joins (RLS runs on every row access).
-- ------------------------------------------------------------
create table messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references conversations(id) on delete cascade,
  org_id           uuid not null references organizations(id) on delete cascade,
  role             text not null check (role in ('user','assistant')),
  content          text not null,         -- the question, or the answer text
  grounded         boolean,               -- only meaningful for assistant turns
  citations        jsonb not null default '[]',
  created_at       timestamptz not null default now()
);

-- load a conversation's turns in order
create index messages_conversation_idx on messages (conversation_id, created_at);
create index messages_org_id_idx on messages (org_id);


-- ------------------------------------------------------------
-- Seed: one fixed org for the single-user prototype.
-- Hardcode this id in the app as DEMO_ORG_ID.
-- ------------------------------------------------------------
insert into organizations (id, name)
values ('00000000-0000-0000-0000-000000000001', 'BuildCo Pty Ltd (Demo)');


-- ------------------------------------------------------------
-- Seed: one fixed demo project under DEMO_ORG_ID.
-- App code can reference this as the demo project (fixed id + fixed public_id).
-- public_id here is a stable literal; app code generates nanoids for new projects.
-- ------------------------------------------------------------
insert into projects (id, org_id, public_id, name)
values (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'demo-proj-1',
  'Demo Project'
);


-- ============================================================
-- ENFORCEMENT LAYER — RLS  (DO NOT ENABLE FOR THE SINGLE-USER PROTOTYPE)
--
-- This is where tenant isolation is actually GUARANTEED — not in app code,
-- not in the prompt. Postgres refuses to return rows that fail the policy,
-- regardless of what query (buggy, injected, whatever) reaches it.
--
-- Activate ONLY after Supabase Auth is configured and org_id is available as
-- a JWT claim (or via a memberships table). Enabling RLS without a matching
-- policy/claim will return ZERO rows and break the prototype — which is itself
-- the point: it fails CLOSED, not open.
-- ============================================================

-- alter table projects      enable row level security;
-- alter table documents     enable row level security;
-- alter table conversations enable row level security;
-- alter table messages      enable row level security;

-- create policy org_isolation_projects on projects
--   using (org_id = (auth.jwt() ->> 'org_id')::uuid);

-- create policy org_isolation_documents on documents
--   using (org_id = (auth.jwt() ->> 'org_id')::uuid);

-- create policy org_isolation_conversations on conversations
--   using (org_id = (auth.jwt() ->> 'org_id')::uuid);

-- create policy org_isolation_messages on messages
--   using (org_id = (auth.jwt() ->> 'org_id')::uuid);

-- Within-org permission (future): compare the document's required access_level
-- against the user's clearance, e.g. via a memberships(user_id, org_id, role)
-- table. The unit stays the document row — sub-document permission would mean
-- splitting into separate rows/chunks, not a more complex policy.
