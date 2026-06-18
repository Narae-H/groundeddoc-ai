---
name: typescript
description: TypeScript and React conventions for GroundedDoc — strict typing, React 19 patterns, naming, output language. Consult when writing or reviewing component/app code.
---

# TypeScript & React

Language conventions. Defer to `AGENTS.md` / `CLAUDE.md` for top-level rules; for structure see `.claude/skills/architecture/`.

## TypeScript

- **Strict mode** is on. No implicit `any`.
- Explicit prop/param types via a named `Props`/argument type. **No `React.FC`.**
- Avoid `any` and `@ts-ignore`. If genuinely unavoidable, narrow as tightly as possible and add a one-line reason.
- Remove unused imports as part of the same edit, not a follow-up.
- Minimal diffs — don't reformat unrelated code.

## React 19 / Next 16

- Server Components by default; `"use client"` only at the interactive leaf (see architecture skill).
- Use concurrent features where they help; don't add client state that server data could provide.
- This is a **modified Next.js** — read the relevant guide under `node_modules/next/dist/docs/` before using a Next API; heed deprecations.

## Naming & style

- Match the surrounding code — check a sibling file before introducing a new pattern.
- Components `PascalCase`; functions/variables `camelCase`; files follow the existing convention in that folder.
- Keep files a sensible size; extract shared logic rather than copy-pasting.

## Output language

- All code comments, identifiers in prose, and any user-facing copy use **Australian English**.
