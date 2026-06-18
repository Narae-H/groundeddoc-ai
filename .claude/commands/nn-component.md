---
description: Scaffold a new React component following project conventions
argument-hint: <ComponentName> [where it's used]
allowed-tools: Read, Write, Glob
---

Create a new React component named `$1`.

Conventions for this project:
- Default to a **Server Component** (no `"use client"`). Only add `"use client"` if it needs state, effects, or browser-only APIs — and say why.
- TypeScript, typed props via an explicit `Props` type. No `React.FC`.
- Place shared components under `src/components/`; route-local ones next to their route in `src/app/`.
- Match the style of existing components — check a sibling file first with Glob/Read before writing.

If `$2` (usage context) is given, take it into account when deciding client vs server and where the file lives. After creating it, show the file path and a one-line usage example.
