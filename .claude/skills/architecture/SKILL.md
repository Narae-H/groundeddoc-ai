---
name: architecture
description: Structure and boundary conventions for the GroundedDoc Next.js app — folder layout, server/client split, where AI and data logic live. Consult when adding routes/components or reviewing structure.
---

# Architecture

How the codebase is organised. Defer to `AGENTS.md` / `CLAUDE.md` for top-level rules.

## Folder layout (path-first)

- `src/app/` — routes (App Router). Route-local components live next to their route.
- `src/app/api/<name>/route.ts` — Route Handlers (standalone endpoints, streaming).
- `src/components/` — shared, reusable components.
- `src/lib/` — non-UI modules: `lib/supabase/` (data/auth/storage), `lib/ai/` (Vercel AI SDK + Claude). Keep these out of components.

Group by feature/domain path first, not by responsibility (`components/`, `services/` roots that split one feature across folders).

## Server / client split

- **Server Components by default.** Add `"use client"` only at the smallest leaf that needs state, effects, or browser APIs — never bubble it up.
- Data fetching and secrets stay on the server (Server Components, Server Actions, Route Handlers).
- Mutations go through **Server Actions**; standalone/streaming endpoints through **Route Handlers**.

## Request flow

```
Component → Server Action / Route Handler → lib/ai or lib/supabase → Claude / Postgres
```

| Layer | Responsibility |
|---|---|
| Component | UI + input; no direct DB/AI calls from client components |
| Server Action / Route Handler | Auth guard, orchestration, validation |
| `lib/ai` | Claude via the Vercel AI SDK (never raw `fetch`); structured, grounded output |
| `lib/supabase` | All Supabase access; service-role key server-side only |

## Boundaries

- UI, data access, and AI orchestration live in **distinct modules** — don't tangle them in one file.
- The Anthropic key and Supabase service-role key **never** reach client code.
- Prefer the smallest additive change; keep public shapes (route params, DTOs, schema) stable.

## Tenancy & data

- `org_id` is the tenant boundary; the single-user prototype uses a fixed `DEMO_ORG_ID`, and every tenant-scoped query filters by `org_id`. See `.claude/skills/supabase/`.
- Document text is stored in `documents.content` (queryable, re-read per question); the original file lives in Supabase Storage via `storage_path`.

## Trust zones (the AI data flow)

The model is caged between two deterministic steps — full design in [`docs/DATA_FLOW.md`](../../../docs/DATA_FLOW.md):

1. **Fetch (deterministic) = security.** Selecting documents by `org_id` is the whole security boundary — the model can only ever see what this step fetched. Never push tenant isolation into the prompt.
2. **Model (probabilistic) = sandbox.** It sees only the fetched context; the worst case here is a quality failure, not a cross-tenant leak.
3. **Verify (deterministic) = quality.** Mechanically check the output (`grounded` ↔ citation count; each `quote` exists in `documents.content`) before persisting.

Security failures must be impossible (handled at fetch/RLS); quality failures only need to be unlikely (handled by prompt + schema + the verify gate).
