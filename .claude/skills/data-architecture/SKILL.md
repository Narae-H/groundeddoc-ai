---
name: data-architecture
description: The app data-access flow for GroundedDoc — Component → Server Action/Route Handler → lib/data | lib/ai → lib/supabase, org-scoping, and the deliberate no-DTO stance. Consult when adding data access or AI calls.
---

# Data architecture

The runtime flow from UI to Postgres/Claude (step 4 of the architecture order). Related, each canonical elsewhere:

- **Schema, RLS, queries, storage** → [`supabase`](../supabase/) skill.
- **AI trust zones** (fetch = security, model = sandbox, verify = quality) → [`docs/DATA_FLOW.md`](../../../docs/DATA_FLOW.md).
- **Folder layout** → [`layers`](../layers/) skill. **Where code runs** → [`rendering`](../rendering/) skill.

## Layers & request flow

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

`lib/data` is the only entry point for the database — Server Actions and Route Handlers call it rather than reaching into `lib/supabase` directly.

## Access scoping

- **Access scoping is enforced in `lib/data`** — every tenant-scoped query filters by `org_id`. Tenant isolation is a data-layer property, not a prompt instruction (see [`docs/DATA_FLOW.md`](../../../docs/DATA_FLOW.md)).
- **Role-based document visibility — planned, not yet implemented.** On top of `org_id`, document reads will additionally gate by the caller's role, resolved from a server-side session and never trusted from the client. Until that RBAC work lands, `lib/data` enforces `org_id` scoping only. Rationale in [`docs/DECISIONS.md`](../../../docs/DECISIONS.md).

## Non-goal: no DTO/mapper/service/model layering

No DTO / mapper / service / model layering at this stage. The data layer is `lib/data` (typed functions) plus `types` (generated DB types) — that combination covers what those extra layers would, without the ceremony.
