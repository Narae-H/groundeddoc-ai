<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# GitHub issues are the source of truth

Every change is tracked by a GitHub issue — that issue, not the code or commit messages, is the canonical record of scope and decisions.

- Work starts from an issue and branches off its number (see [CONTRIBUTING.md → Branch naming](CONTRIBUTING.md#branch-naming) for the format). This applies to both new features and bug fixes.
- **Issues are human-owned** — don't create or edit them yourself. If scope or details drift mid-development, **flag it and recommend the human update the issue** before continuing. You may advise (wording, scope), but the human makes the change.
- Close the issue from the PR with `Closes #<issue-number>`.
- Drive development with the `nn-flow-*` commands **in order**. Run `/nn-flow-help` to see the flow and the next command for where you are.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.
