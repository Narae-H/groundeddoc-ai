---
description: Ship the reviewed changes — delegate to 33-committer for scoped commits, then 51-pr-author to open the PR. Shared by the develop and fix flows.
---

Shared ship step. Reaches here from `/nn-flow-review`. Turns reviewed work into commits and a pull request.

## Arguments

`$ARGUMENTS` — optional. A note on intent (e.g. "open the PR too"). If missing, commit and ask before creating the PR.

## Workflow

1. **Confirm readiness** — review is done and 🔴 findings are cleared. If not, send the user back to `/nn-flow-review`.
2. **Commit** — delegate to `33-committer`: scoped, convention-following commits (`.github/COMMIT_CONVENTION.md`), splitting mixed concerns.
3. **Open the PR (on request)** — delegate to `51-pr-author`: push the branch, fill `.github/PULL_REQUEST_TEMPLATE.md`, create the PR against `main` with `gh`.
4. **Reconcile the issue** — before reporting, compare the shipped work against the tracking issue's scope, **Tasks**, and **Definition of done**. Draft the ticked checkboxes (`[ ]`→`[x]`) plus any scope-drift updates, get the user's sign-off, then apply with `gh issue edit` (per [AGENTS.md](../../AGENTS.md) — issues need approval). Leave *Merged to main* unticked until the PR merges.
5. **Report** — the commit log line(s) and the PR URL.

## Rules

- Commit only when the user has asked to ship.
- Push / open a PR only when explicitly requested — confirm first.
- Branch off `main` before committing if work landed on `main`.
- Shipping isn't done at "PR open" — reconcile the issue's checkboxes and scope too (the issue is the source of truth).

## DO NOT

- Don't bundle unrelated changes into one commit.
- Don't merge the PR — that's a separate, explicit step.
- Don't skip hooks or bypass signing unless the user asks.
