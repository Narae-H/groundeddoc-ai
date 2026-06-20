# Commit convention

Keep the history clean and consistent. Write **short, focused** commit messages — one logical change per commit, subject only says the essence.

## Format

```
<type>(<scope>): <subject>
```

- **type** — the kind of change (see below)
- **scope** — area affected (optional, e.g. `chat`, `upload`, `deps`)
- **subject** — short description, imperative mood, lower-case, no full stop

## Types

| Type | Description |
| --- | --- |
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or fixing tests |
| `chore` | Routine tasks (build, CI, deps) |

## Rules

- Imperative mood: "add", not "added" / "adds"
- Keep the subject under ~50 characters — core only, no padding
- No full stop at the end
- Lower-case type and scope; omit parentheses if no scope (`feat: add login`)
- Skip the body unless it genuinely needs explaining

## Examples

```
feat(chat): cite source passage for each answer
fix(upload): reject files over 25 MB
docs: update README
chore(deps): bump next to 16.2.9
```

## Branch strategy

- **main** — production-ready.
- Feature/fix branches are named from the tracking issue number — see **[CONTRIBUTING.md → Branch naming](../CONTRIBUTING.md#branch-naming)** for the format. The full issue-driven workflow lives in [CONTRIBUTING.md](../CONTRIBUTING.md).
