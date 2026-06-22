---
name: module-boundaries
description: Module boundary & barrel conventions for GroundedDoc — public APIs via index.ts, no deep imports, modules as islands. Consult when adding modules or importing across them.
---

# Module boundaries & barrels

This extends the **one-way import rule** in the [`layers`](../layers/) skill: that skill owns *direction*; this skill owns the *public-surface* (barrel) rule. Read both together.

## Rules

1. **A module's public surface is its `index.ts` barrel.** Other modules import the barrel — `lib/data`, never a deep path like `lib/data/internal/...`. Internal files can be refactored freely as long as the barrel stays stable; the barrel is the contract.
2. **Modules are islands.** Sibling modules (`lib/ai` ↔ `lib/data`, one `components/<domain>` ↔ another) never reach into each other's internals. Need to share? **Promote** the shared code down a layer — into `lib/`, `types/`, or `components/ui/`.
3. **Import only the public surface, only rightward.** Combine with the `layers` skill's one-way rule: you may import another module's *barrel*, and only in the allowed direction (`app → components → lib/{data,ai} → lib/supabase → types`).

Applies to module *directories* (`lib/data`, `lib/ai`, `lib/supabase`, `components/<domain>`). Flat root utilities (`lib/env.ts`) stay as single files with no barrel — see the `layers` skill.

## Why

- Internal refactors don't ripple across the codebase — consumers only ever touched the barrel.
- Cycles and god-modules are prevented structurally, not by review vigilance.

## Enforcement

Enforced automatically, not just by review — `eslint` import boundaries (deep-import / wrong-direction = error) + `dependency-cruiser` (zero cycles, layer rules, orphan detection) in CI. See the project's lint/CI config.
