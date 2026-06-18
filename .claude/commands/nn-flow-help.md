---
description: Show the dev workflow (develop + fix), detect roughly where you are, and recommend the next nn- command to run.
---

Read-only guidance. Never modifies files, branches, or commits. Use this when you're unsure which step to call next.

## The workflow

Two entry flows that share the same tail:

```
DEVELOP (new)   nn-flow-plan  →  nn-flow-build  ┐
                (11-planner)     (31-developer)  │
                                                 ├→  nn-flow-review  →  nn-flow-ship
FIX (bug/change)    nn-flow-fix ─────────────────┘   (32-reviewer        (33-committer
                    (61-debugger / 31-developer)       +42-citation         →51-pr-author)
                                                        +23-data if SQL)
```

## Workflow

1. **Inspect state** (read-only)
   - Current branch (`git rev-parse --abbrev-ref HEAD`). Warn if on `main`.
   - Uncommitted changes (`git status --porcelain`) and rough diff size (`git diff --stat`).
   - Unpushed commits vs upstream, if any.

2. **Pick the single best next step**
   - On `main`, clean tree, **new feature** → `/nn-flow-plan`
   - On `main`, clean tree, **a bug or small change** → `/nn-flow-fix`
   - Scope clear, little/no code yet (develop) → `/nn-flow-build`
   - Uncommitted code changes present → `/nn-flow-review`
   - Review done, changes ready → `/nn-flow-ship`

3. **Report** — a compact block: current branch, change summary, recommended next command, and any blocker (e.g. "on main — branch first").

## Rules

- Read-only: no branch, commit, push, or edit operations.
- Recommend exactly one next command; if the develop-vs-fix intent is unclear, ask which it is.
- These steps are signals, not a strict gate — the user can jump steps. Say so if asked.

## DO NOT

- Don't claim a plan or review "exists" — those live in the conversation, not on disk. Infer from git state and the recent session, and say when you're unsure.
