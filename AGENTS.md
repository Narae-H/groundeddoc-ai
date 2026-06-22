<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Folder structure & conventions

The codebase's folder layout, import-direction rule, and component conventions live in the [`layers`](.claude/skills/layers/SKILL.md) skill; the server/client split in [`rendering`](.claude/skills/rendering/SKILL.md). Read them before adding routes, components, or modules.

# GitHub issues are the source of truth

Every change is tracked by a GitHub issue — that issue, not the code or commit messages, is the canonical record of scope and decisions.

- Work starts from an issue and branches off its number (see [CONTRIBUTING.md → Branch naming](CONTRIBUTING.md#branch-naming) for the format). This applies to both new features and bug fixes.
- **Issues require explicit human approval before creation or edit.** Agents may draft issue bodies (title, description, tasks, scope changes) and propose them for review. Only after the human explicitly approves the proposed content may the agent create or edit the issue (e.g. via `gh issue create` / `gh issue edit`). Silence is not approval — default to drafting and asking. If scope drifts mid-development, draft the update, get sign-off, then apply.
- Close the issue from the PR with `Closes #<issue-number>`.
- Drive development with the `nn-flow-*` commands **in order**. Run `/nn-flow-help` to see the flow and the next command for where you are.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

# Tech-stack decisions are recorded as an ADR

The tech-stack choices and their one-line rationale live in [docs/DECISIONS.md](docs/DECISIONS.md) — consult it before re-opening a settled decision (DB, AI SDK, RLS-off stance, input formats, non-streaming responses, the design pipeline). If a decision changes, record it there first.

# Findings output format

This format applies **only when a response reports findings** — a code or structure review, a "review this", an architecture critique, or a QA/security audit. It does **not** apply to ordinary questions, edits, explanations, or conversation; answer those normally.

When you are reporting findings, group them by severity:

- 🔴 must-fix
- 🟡 should-fix
- 🟢 nice-to-have

Each finding gets a `file:line` and a concrete, actionable suggestion (for reviews, a refactor; for audits, a fix). If the work is sound, say so plainly instead of inventing findings.

# Output language

Artifacts you produce — reviews, findings, summaries, docs, and commit/PR/issue text — are written in **Australian English**. Working drafts and chat may be in another language; the committed artifact is Australian English. (Code comments and identifiers: see the `typescript` skill.)
