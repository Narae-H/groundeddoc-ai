---
name: supabase
description: Supabase/Postgres conventions for GroundedDoc — the org-scoped data model, the deliberate prototype RLS stance, queries, storage, migrations. Consult when adding or changing tables, queries, buckets, or migrations.
---

# Supabase

Data-layer conventions. **The canonical schema lives in [`supabase/schema.sql`](../../../supabase/schema.sql)** — read it for exact columns; don't duplicate the DDL here. This file captures the durable design principles. Defer to `AGENTS.md` / `CLAUDE.md` for top-level rules.

## The model (at a glance)

- `organizations` — the tenant. `documents` · `conversations` · `messages` all carry `org_id`.
- **`documents` is the access unit** — one document = one row = one `access_level` (upload unit = access unit). `content` (extracted text) lives in the DB so it's queryable and re-read cheaply on every question and used to verify citations; `storage_path` points to the original file in Storage.
- **`conversations` are org-scoped, not document-scoped** (no `document_id`) — questions run across all of the org's documents, enabling cross-document answers.
- `messages` store the AI's structured output directly: `grounded` (boolean, assistant turns only) and `citations` (jsonb array). `org_id` is denormalised onto messages so RLS stays a flat column check.

## Tenant boundary = `org_id` (not `auth.uid()`)

Isolation is **per-org**, via `org_id`, not per-user. When RLS is enabled the policy compares `org_id = (auth.jwt() ->> 'org_id')::uuid`. A `memberships(user_id, org_id, role)` table is the future home for within-org permission.

## RLS stance — deliberately OFF for the prototype

⚠️ **This prototype is single-user. RLS is written (commented) in `schema.sql` but kept OFF, and the app uses a fixed `DEMO_ORG_ID` (`00000000-0000-0000-0000-000000000001`).** This is an intentional decision, not a gap:

- **Do not "fix" it by enabling RLS.** Enabling it without Supabase Auth + the `org_id` JWT claim returns **zero rows** and breaks the app (it fails *closed*, which is the design).
- RLS is the eventual enforcement layer — activate only after Auth is configured and `org_id` is available as a claim.
- Until then, tenant scoping is done in app code via `DEMO_ORG_ID`. Every tenant-scoped query still filters by `org_id`.

## Schema conventions

- `snake_case` tables/columns; `uuid` PKs with `gen_random_uuid()` defaults.
- `not null` where required; FKs with explicit `on delete` (cascade within a tenant); `created_at` `timestamptz default now()`.
- `check` constraints for fixed sets (`doc_type`, `role`, `access_level`); `access_level` is **secure-by-default** (most restrictive default).

## Queries, storage & migrations

- Index foreign keys and columns used in `where`/`order by`/joins (see the indexes in `schema.sql`).
- Keep all Supabase access inside `lib/supabase` (see architecture skill); never query from client components; service-role key server-side only.
- Storage bucket policies must match the table policies once RLS is on.
- Migration-first and additive where possible; keep `schema.sql` the source of truth.
