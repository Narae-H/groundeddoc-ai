---
name: guardrails
description: Automated enforcement of GroundedDoc's layering — eslint-plugin-boundaries, dependency-cruiser, and the CI gate. Consult when changing lint/CI config or when a boundary lint error appears.
---

# Guardrails (enforcement)

The one-way import rule (owned by the [`layers`](../layers/) skill) and the barrel rule (owned by [`module-boundaries`](../module-boundaries/)) are enforced automatically, not by review vigilance (step 9 of the architecture order):

- `eslint-plugin-boundaries` — wrong-direction or deep-import = lint error (`eslint.config.mjs`).
- `dependency-cruiser` — zero cycles, layer rules, orphan detection (`.dependency-cruiser.cjs`, `npm run depcruise`).
- Both run in CI (`.github/workflows/ci.yml`).
