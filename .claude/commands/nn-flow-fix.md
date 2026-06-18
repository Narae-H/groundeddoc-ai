---
description: Fix a bug or make a small change to existing code — diagnose root cause (61-debugger) for bugs, or a targeted edit (31-developer) for changes — then hand off to review.
---

Entry point for the **fix flow** (bugs and small modifications to existing code). For brand-new features, use `/nn-flow-plan` instead. Both flows converge on `/nn-flow-review` → `/nn-flow-ship`.

## Arguments

`$ARGUMENTS` — optional. What's broken or what to change (e.g. "document list shows empty" or "raise upload limit to 50 MB"). If missing, ask.

## Workflow

1. **Branch check** — if on `main`, create a `fix/<short-name>` branch first.
2. **Classify the work**
   - **Bug / erroring / unexpected behaviour** → delegate to `61-debugger`: reproduce, isolate the root cause with evidence, apply the minimal fix. No fix without an understood cause.
   - **Small change (not a bug)** → delegate to `31-developer` for a targeted edit following project conventions.
   - **Touches Supabase / SQL / migrations** → loop in `23-data-architect`.
3. **Self-verify** — `npx tsc --noEmit` and `npm run lint` pass (`/nn-typecheck`, `/nn-lint-fix`).
4. **Report** — root cause (for bugs) or what changed, files touched, and the next step: `/nn-flow-review`.

## Rules

- For bugs, identify the root cause before editing — don't patch symptoms.
- Keep the change minimal and scoped; resist unrelated refactoring.
- If the "small change" turns out to need new tables/routes/real planning, stop and switch to `/nn-flow-plan`.

## DO NOT

- Don't commit here — that's `/nn-flow-ship`.
- Don't expand a fix into a feature without flagging it.
