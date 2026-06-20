---
description: Plan a feature or change before coding — delegate to the 11-planner agent to define scope, risks, and approach.
---

Phase 1 of the feature pipeline. Produces an implementation brief; writes no code.

## Arguments

`$ARGUMENTS` — optional. A short description of the feature or change to plan (e.g. "document upload + ask a question"). If missing, ask the user what they want to build.

## Workflow

1. **Frame** — restate the request in one or two sentences and confirm with the user if it's ambiguous.
2. **Delegate** — invoke the `11-planner` agent with the request. It defines scope, affected routes/components/tables, risks (breaking APIs, auth/RLS, grounding accuracy, API credits), alternatives, and a validation plan.
3. **Surface decisions** — present any open decisions the planner flagged and get the user's call before moving on.
4. **Report** — the brief plus the recommended next step: `/nn-flow-build`.

## Rules

- No application code in this phase.
- Don't proceed to build while requirements are ambiguous — resolve open decisions first.
- The work should be tracked by a GitHub issue; if none exists yet, recommend the human open one and map the brief to it — don't create the issue yourself (issues are human-owned; see [AGENTS.md](../../AGENTS.md)).

## DO NOT

- Don't expand scope beyond what the user asked without flagging it explicitly.
