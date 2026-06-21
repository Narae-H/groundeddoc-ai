---
name: architecture
description: Structure and boundary conventions for the GroundedDoc Next.js app — folder layout, server/client split, where AI and data logic live. Consult when adding routes/components or reviewing structure.
---

# Architecture

The full, canonical reference is [`docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md) — read it before adding routes, components, or modules. This skill is a pointer into that doc; don't restate its content here.

## The gist

- **Layout:** `src/app/` (routes; route-only components in `app/<route>/_components/`), `src/components/` (`ui/` primitives + `<domain>/` folders, no `features/` bucket), `src/lib/` (`supabase/` clients, `data/` typed org-scoped queries, `ai/` Vercel AI SDK), `src/types/` (incl. generated DB types).
- **Server-first:** Server Components by default; `"use client"` only at the smallest leaf; data fetching and secrets stay server-side.
- **One-way imports:** `app → components → lib/{data,ai} → lib/supabase → types`.
- **Boundaries:** UI, data access, and AI orchestration live in distinct modules; the Anthropic and Supabase service-role keys never reach client code.

## Related (each canonical elsewhere)

- **Tenancy & `org_id` scoping** — see the [`supabase`](../supabase/) skill.
- **AI data flow & trust zones** (fetch = security, model = sandbox, verify = quality) — see [`docs/DATA_FLOW.md`](../../../docs/DATA_FLOW.md).
