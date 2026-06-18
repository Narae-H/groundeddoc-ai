---
description: Run the TypeScript type checker and fix any errors
allowed-tools: Bash(npx tsc:*), Read, Edit
---

Run `npx tsc --noEmit` to type-check the project.

If there are errors, fix them at the source (don't suppress with `any` or `@ts-ignore` unless there is genuinely no typed alternative), then re-run until clean. Report what you changed.
