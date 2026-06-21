# Contributing

How we work on GroundedDoc. Read this before starting any change.

## GitHub issues are the single source of truth

Every unit of work is tracked by a **GitHub issue**. The issue — not a commit message, a Slack thread, or your memory — is where scope, decisions, and progress live. If it isn't in the issue, it isn't tracked.

- **Start from an issue.** Before writing code, there should be an issue describing the work (use the [Task template](.github/ISSUE_TEMPLATE/task.yml)).
- **Keep the issue current.** If scope or details change while you're developing — even a minor adjustment — **update the issue first, then write the code.** This keeps the issue trackable after the fact and avoids the "source of truth is in three places" problem.
- **Check off tasks** in the issue's checklist as you complete them.
- **Issues require explicit human approval before an agent creates or edits them.** Because the issue is the source of truth, an agent may draft issue bodies (title, description, tasks, scope changes) and propose them for review — but only after the human explicitly approves the proposed content may the agent run `gh issue create` / `gh issue edit`. Silence is not approval. Mid-development scope drift goes through the same loop: draft the update, get sign-off, apply.

## Workflow

We use the project's `nn-flow-*` commands to drive development in a consistent order. **Follow the commands in sequence** — they encode the workflow and hand off to the right agent at each step. Run **`/nn-flow-help`** to see the full flow diagram and get the single next command for where you are.

The steps map onto the issue-driven workflow:

1. **Open or pick an issue.** It defines what "done" means (see the Definition of done in the template). This is the source of truth for the rest of the flow.
2. **Branch from the issue number** — see [Branch naming](#branch-naming) for the format.
3. **Plan / Build / Fix** — run `/nn-flow-plan` then `/nn-flow-build` for new work, or `/nn-flow-fix` for a bug or small change. Both bugs and small changes are tracked by an issue too, just like features. If anything drifts from the issue mid-development, **update the issue before continuing.**
4. **Review** — run `/nn-flow-review` before committing.
5. **Ship** — run `/nn-flow-ship`. It commits following the [commit convention](.github/COMMIT_CONVENTION.md) (short, focused, one logical change per commit) and opens a PR using the [PR template](.github/PULL_REQUEST_TEMPLATE.md). Close the issue from the PR with `Closes #<issue-number>` so merging auto-closes it.

> The `nn-flow-*` steps are signals, not a strict gate — you can jump steps when it makes sense. But default to running them in order so work stays consistent and reviewable.

## Branch naming

Branches are named from the tracking issue number, using the type that matches the work:

```
feature/<issue-number>-<short-description>   # new feature   (e.g. feature/123-add-citation-rendering)
fix/<issue-number>-<short-description>       # bug / small change   (e.g. fix/145-empty-document-list)
```

The issue number in the branch name is what ties the branch, commits, and PR back to the issue for tracking. **This is the canonical branch-naming format — other docs link to this section rather than restating it.**

## Where conventions live

| Topic | Document |
| --- | --- |
| This workflow (issue-driven, branching) | this file |
| Commit message format | [`.github/COMMIT_CONVENTION.md`](.github/COMMIT_CONVENTION.md) |
| PR structure | [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) |
| Issue structure | [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE) |
| Architecture, data, style conventions | `.claude/skills/` and the `AGENTS.md` rules |
