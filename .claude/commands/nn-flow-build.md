---
description: Build a planned feature — delegate to the 31-developer agent, scaffolding or speccing first when it's a new area.
---

Phase 2 of the feature pipeline. Implements the planned change following project conventions.

## Arguments

`$ARGUMENTS` — optional. The feature/brief to build. If missing, use the plan from the current session or ask.

## Workflow

1. **Branch check** — if on `main`, create a `feature/<short-name>` branch first.
2. **Prepare (only if it's a new area)**
   - Need a route/page contract? Delegate to `21-page-spec`.
   - Need module boilerplate? Delegate to `91-scaffolder`.
   - Schema/RLS changes? Delegate to `23-data-architect`.
3. **Implement** — invoke the `31-developer` agent. It follows the conventions: Server Components by default, AI only via the Vercel AI SDK, secrets server-side, Supabase auth guards.
4. **Self-verify** — ensure `npx tsc --noEmit` and `npm run lint` pass (`/nn-typecheck`, `/nn-lint-fix`).
5. **Report** — what was built, files changed, and the next step: `/nn-flow-review`.

## Rules

- Don't call the Anthropic API with raw `fetch`; use the AI SDK.
- Keep changes scoped to the planned work; flag anything that grew.

## DO NOT

- Don't commit here — that's `/nn-flow-ship`.
- Don't skip the type check / lint before handing off to review.
