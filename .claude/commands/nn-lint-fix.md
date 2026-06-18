---
description: Lint the project and auto-fix what can be fixed
allowed-tools: Bash(npm run lint:*), Bash(npx eslint:*), Read, Edit
---

Run `npm run lint -- --fix` to lint and auto-fix.

For anything ESLint can't fix automatically, fix it by hand in the source. Don't disable rules to make warnings disappear unless the rule is genuinely wrong for the case — if so, disable it narrowly (single line) with a short reason. Report remaining issues.
