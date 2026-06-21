# Agents

Agents are numbered by SDLC phase (tens digit) and role lane within that phase (units digit), not by global priority across all agents. Agents in the 90s are non-recurring setup utilities.

> The number is a **human-facing convention** for ordering and mental model — Claude Code selects an agent by its `description`, not its number.

## 1x — Plan

| Agent | Role |
| --- | --- |
| [`11-planner`](11-planner.md) | Analyse requirements, define scope and risks before implementation |

## 2x — Design

Within `2x` the units digit is the design lane: `1` page/route contract, `2` component architecture review, `3` data layer (Supabase schema, RLS, migrations), `5` style and design-token layer.

| Agent | Role |
| --- | --- |
| [`21-page-spec`](21-page-spec.md) | Page/route contract design — author/refine the GitHub issue body before scaffolding (no implementation) |
| [`22-architect-reviewer`](22-architect-reviewer.md) | Component architecture, module boundary integrity, long-term maintainability |
| [`23-data-architect`](23-data-architect.md) | Supabase/Postgres ownership — schema, RLS policies, migration safety, indexing |
| [`25-style-curator`](25-style-curator.md) | Style layer ownership — `globals.css`, design tokens sourced from Notion `design.md`, CSS Modules, no Tailwind |

## 3x — Implement

| Agent | Role |
| --- | --- |
| [`31-developer`](31-developer.md) | Implement features following project conventions |
| [`32-reviewer`](32-reviewer.md) | Code quality, pattern consistency, module boundary verification |
| [`33-committer`](33-committer.md) | Commit with scope control and commit convention |

## 4x — Test

Within `4x`: `1` general testing, `2` AI grounding / citation quality.

| Agent | Role |
| --- | --- |
| [`41-tester`](41-tester.md) | Write, organise, and validate tests; report coverage gaps |
| [`42-citation-verifier`](42-citation-verifier.md) | Verify answers are grounded — each citation exists in the source and supports the claim |

## 5x — Deploy

| Agent | Role |
| --- | --- |
| [`51-pr-author`](51-pr-author.md) | PR draft and creation from the repository template |

## 6x — Maintain

| Agent | Role |
| --- | --- |
| [`61-debugger`](61-debugger.md) | Reproduce bugs, isolate root cause, apply minimal fix |

## 90s — Non-recurring

| Agent | Role |
| --- | --- |
| [`91-scaffolder`](91-scaffolder.md) | New module boilerplate via a staged workflow |

## Conventions

- Every agent uses `model: inherit` (follows the session model) and a rich `description` with `<example>` blocks so the main loop can auto-select it.
- Each agent keeps its own memory under `.claude/agent-memory/<agent>/` (created on first write, committed with the repo).

## Common rules

All agents follow these regardless of role or phase.

- Never hardcode personal or machine-specific absolute paths (e.g. `C:\Users\...`, `/home/...`). Always use repository-relative paths (e.g. `.claude/agents/`).
