# Architecture — GroundedDoc

How the codebase is organised: where code goes and the structural rules that keep UI, data, and AI in distinct, one-way-dependent layers.

## 1. Purpose & scope

This document is the detailed expansion of the structure conventions summarised in [`.claude/skills/architecture/SKILL.md`](../.claude/skills/architecture/SKILL.md). It covers the folder layout, the server/client split, the layers and request flow, the one-way import rule, component conventions, and the boundaries we hold.

- For **top-level project rules** (Next.js version warnings, the GitHub-issues-as-source-of-truth workflow), defer to [`AGENTS.md`](../AGENTS.md).
- For the **rationale** behind these structural decisions — *why* we split the data layer in two, *why* there is no `components/features` bucket, *why* no DTO/mapper layering — see [`docs/DECISIONS.md`](DECISIONS.md). (That document is tracked by a follow-up issue and does not exist yet; this link is the agreed home for it.)
- For the **AI data flow** — the upload and query flows and the trust zones that cage the model — see [`docs/DATA_FLOW.md`](DATA_FLOW.md).

This doc describes structure, not rationale and not data flow. Cross-link to those documents rather than duplicating them.

## 2. Folder layout

```
src/
  app/                     # routes (App Router); route-only components colocate here
    <route>/
      _components/         # components used only by this route (Next.js private folder)
    api/<name>/route.ts    # Route Handlers (standalone endpoints, streaming)
  components/
    ui/                    # shared, app-agnostic UI primitives (presentational)
    <domain>/              # shared domain components, grouped by domain (created as needed)
  lib/
    env.ts                 # shared lib utilities live at the lib root
    env.server.ts          # server-only environment access
    supabase/              # Supabase client/auth/storage plumbing (server + browser)
    data/                  # typed, org-scoped data-access functions
    ai/                    # Claude calls via the Vercel AI SDK
  types/                   # shared TS types, incl. generated Supabase DB types (supabase.ts)
```

Role of each directory (mirrors the per-directory `README.md` files):

| Directory | Role |
|---|---|
| `app/` | Routes (App Router). Route-only components colocate in `app/<route>/_components/`. |
| `app/api/<name>/route.ts` | Route Handlers — standalone/streaming endpoints. |
| `components/ui/` | Shared, app-agnostic UI primitives (Button, Card, EmptyState, ErrorState). Presentational; no data fetching. |
| `components/<domain>/` | Shared domain components, grouped by domain. Created as needed — not pre-created. |
| `lib/` (root) | Shared lib utilities (e.g. `env.ts`, `env.server.ts`). |
| `lib/supabase/` | Supabase client/auth/storage plumbing. Low-level; domain queries live in `lib/data`. |
| `lib/data/` | Typed, org-scoped data-access functions — the only entry point for DB reads and writes. Built on `lib/supabase`; every query filters by `org_id`. |
| `lib/ai/` | Claude calls via the Vercel AI SDK; structured, grounded output. No raw `fetch`, no direct DB access. |
| `types/` | Shared TypeScript types, including the generated Supabase DB types (`supabase.ts`). |

Shared, non-UI utilities that don't belong to `supabase`, `data`, or `ai` live at the `lib/` root (e.g. `env.ts`, `env.server.ts`); they are not moved into a sub-folder.

## 3. Server / client split

- **Server Components by default.** Add `"use client"` only at the smallest leaf that needs state, effects, or browser APIs — never bubble it up to a parent that doesn't need it.
- **Data fetching and secrets stay on the server** — in Server Components, Server Actions, and Route Handlers. The Anthropic key and the Supabase service-role key never reach client code.
- Mutations go through **Server Actions**; standalone/streaming endpoints go through **Route Handlers**.

## 4. Layers & request flow

```
Component → Server Action / Route Handler → lib/data | lib/ai → lib/supabase → Postgres / Claude
```

| Layer | Responsibility |
|---|---|
| Component | UI + input; no direct DB/AI calls from client components. |
| Server Action / Route Handler | Auth guard, orchestration, validation. |
| `lib/data` | Typed, org-scoped DB reads and writes; every query filters by `org_id`. Built on `lib/supabase`. |
| `lib/ai` | Claude via the Vercel AI SDK (never raw `fetch`); structured, grounded output. |
| `lib/supabase` | Supabase client/auth/storage plumbing; service-role key server-side only. |

`lib/data` is the only entry point for the database — Server Actions and Route Handlers call it rather than reaching into `lib/supabase` directly. `lib/supabase` provides the clients; `lib/data` provides the queries.

## 5. Import-direction rule (one-way)

Dependencies point in one direction only:

```
app → components → lib/{data,ai} → lib/supabase → types
```

Stated precisely:

- Nothing imports from a layer **above** it — dependencies only ever point rightward in the chain above.
- `components` never imports from `app`.
- `lib/data` may use `lib/supabase`, but `lib/supabase` must never import from `lib/data`.
- `lib/data` and `lib/ai` are siblings; neither imports the other.
- `types` imports nothing internal — it sits at the end of the chain and is depended upon, never depends.

## 6. Component conventions

- **`components/ui`** holds generic, app-agnostic primitives (Button, Card, EmptyState, ErrorState). Presentational, no data fetching.
- **Shared domain components** are grouped by domain in `components/<domain>/` (e.g. `components/documents/`). These are created as needed — not pre-created as empty folders.
- **Route-only components** colocate with their route in `app/<route>/_components/`, using the Next.js private-folder convention (the leading underscore keeps the folder out of routing).
- There is **no `components/features` bucket**. Shared domain code is grouped by its domain; route-specific code is colocated. We never split one feature across a generic `features/` root.

## 7. Boundaries & non-goals

- UI, data access, and AI orchestration live in **distinct modules** — they are not tangled together in one file.
- The **Anthropic key** and the **Supabase service-role key** never reach client code; they stay server-side.
- **Access scoping is enforced in `lib/data`** — every tenant-scoped query filters by `org_id`. Tenant isolation is a data-layer property, not a prompt instruction; the AI grounds only on documents the fetch returned (see [`docs/DATA_FLOW.md`](DATA_FLOW.md)).
  - **Role-based document visibility — planned, not yet implemented.** On top of `org_id`, document reads will additionally gate by the caller's role (intended: two tiers — visible to all members, or restricted to managers), with the role resolved from a server-side session (a demo persona switcher now, real auth later) and never trusted from the client. Until that RBAC work lands, `lib/data` enforces `org_id` scoping only; the full model (roles, the all-members/managers-only gate, persona resolution) will be specified with it.

**Non-goal:** no DTO / mapper / service / model layering at this stage. The data layer is `lib/data` (typed functions) plus `types` (generated DB types) — that combination covers what those extra layers would, without the ceremony.
