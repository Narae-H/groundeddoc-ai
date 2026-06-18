---
description: Review the current changes — delegate to 32-reviewer and 42-citation-verifier (and 23-data-architect when the diff touches data). Shared by the develop and fix flows.
---

Shared review step. Reaches here from either `/nn-flow-build` (develop) or `/nn-flow-fix` (fix). Reviews the working changes before they're committed.

## Arguments

`$ARGUMENTS` — optional. A focus area (e.g. "the chat answer route"). If missing, review the full current diff.

## Workflow

1. **Scope the diff** — `git status` and `git diff` to see what changed.
2. **Code review** — delegate to `32-reviewer` for correctness, trust boundaries, conventions, and edge cases. Back it with `npx tsc --noEmit` and `npm run lint`.
3. **Grounding review (when AI answers/citations changed)** — delegate to `42-citation-verifier` to confirm answers cite real, supporting passages and fall back gracefully when nothing is found. This is the product's core promise — don't skip it for AI changes.
4. **Data review (only if the diff touches Supabase/SQL/migrations)** — delegate to `23-data-architect` for RLS, indexing, and migration safety.
5. **Consolidate** — merge findings into one list by severity (🔴/🟡/🟢). Offer to fix 🔴/🟡 now.
6. **Report** — the verdict and the next step: `/nn-flow-ship` once 🔴s are cleared.

## Rules

- Run the type check and lint as part of the review — don't review on assertion alone.
- For any change to AI answers, the grounding review is mandatory, not optional.

## DO NOT

- Don't pass a diff that leaks secrets to the client or skips an auth guard.
- Don't commit or push — review only.
