---
name: layers
description: Folder layout, one-way import direction, and component placement for the GroundedDoc Next.js app. Consult when adding files, folders, routes, or components, or deciding where code lives.
---

# Layers — folder layout & import direction

Where code lives and which way dependencies point (step 2 of the architecture order). Related, each canonical elsewhere:

- **Where code runs** (server/client) → [`rendering`](../rendering/) skill.
- **Runtime data flow & access** → [`data-architecture`](../data-architecture/) skill.
- **Public-surface / barrel rule** (the *surface* half of the import rule below) → [`module-boundaries`](../module-boundaries/) skill.
- **Why these choices** (no `features` bucket, no DTO layering) → [`docs/DECISIONS.md`](../../../docs/DECISIONS.md).

## Folder layout

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

Shared, non-UI utilities that don't belong to `supabase`, `data`, or `ai` live at the `lib/` root; they are not moved into a sub-folder.

## Import-direction rule (one-way)

Dependencies point in one direction only:

```
app → components → lib/{data,ai} → lib/supabase → types
```

- Nothing imports from a layer **above** it — dependencies only ever point rightward in the chain above.
- `components` never imports from `app`.
- `lib/data` may use `lib/supabase`, but `lib/supabase` must never import from `lib/data`.
- `lib/data` and `lib/ai` are siblings; neither imports the other.
- `types` imports nothing internal — it sits at the end of the chain and is depended upon, never depends.

The *surface* half of this rule — a module is reachable only through its `index.ts` barrel, no deep imports — lives in the [`module-boundaries`](../module-boundaries/) skill. Both halves are enforced automatically — see the [`guardrails`](../guardrails/) skill.

## Component conventions

- **`components/ui`** holds generic, app-agnostic primitives. Presentational, no data fetching.
- **Shared domain components** are grouped by domain in `components/<domain>/` — created as needed, not pre-created.
- **Route-only components** colocate with their route in `app/<route>/_components/` (the leading underscore keeps the folder out of routing).
- There is **no `components/features` bucket**. Shared domain code is grouped by its domain; route-specific code is colocated.

## Separation of concerns

UI, data access (Supabase), and AI orchestration (AI SDK) live in **distinct modules** — never tangled in one file. The runtime flow that wires them together is owned by the [`data-architecture`](../data-architecture/) skill.
