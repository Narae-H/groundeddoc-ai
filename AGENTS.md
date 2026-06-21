<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# GitHub issues are the source of truth

Every change is tracked by a GitHub issue — that issue, not the code or commit messages, is the canonical record of scope and decisions.

- Work starts from an issue and branches off its number (see [CONTRIBUTING.md → Branch naming](CONTRIBUTING.md#branch-naming) for the format). This applies to both new features and bug fixes.
- **Issues require explicit human approval before creation or edit.** Agents may draft issue bodies (title, description, tasks, scope changes) and propose them for review. Only after the human explicitly approves the proposed content may the agent create or edit the issue (e.g. via `gh issue create` / `gh issue edit`). Silence is not approval — default to drafting and asking. If scope drifts mid-development, draft the update, get sign-off, then apply.
- Close the issue from the PR with `Closes #<issue-number>`.
- Drive development with the `nn-flow-*` commands **in order**. Run `/nn-flow-help` to see the flow and the next command for where you are.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

# Tech-stack decisions are recorded as an ADR

The tech-stack choices and their one-line rationale live in [docs/DECISIONS.md](docs/DECISIONS.md) — consult it before re-opening a settled decision (DB, AI SDK, RLS-off stance, input formats, non-streaming responses, the design pipeline). If a decision changes, record it there first.
