---
name: new-ai-route
description: Scaffold a new AI endpoint that calls Claude via the Vercel AI SDK with structured, grounded output. Use when adding a feature that asks the model a question over an uploaded document and returns an answer with citations.
---

# Add a new AI route

A repeatable workflow for wiring a Claude-backed endpoint in GroundedDoc. Follow the steps in order — do not skip step 1.

## 1. Read the docs first (mandatory)

This is a modified Next.js — APIs differ from training data. Before writing any route code, read the relevant guide under `node_modules/next/dist/docs/01-app/` (Route Handlers / Server Actions). Heed any deprecation notices. Likewise, confirm the installed **Vercel AI SDK** API surface from its package rather than assuming — check `generateObject` / `streamText` signatures against the installed version.

## 2. Decide the shape

- **Server Action** if it's invoked from a form/component mutation.
- **Route Handler** (`src/app/api/<name>/route.ts`) if it's a standalone endpoint (streaming chat, fetch from client).

## 3. Wire Claude through the AI SDK

- Call Claude **only** via the Vercel AI SDK (`@ai-sdk/anthropic`) — never a raw `fetch` to the Anthropic API.
- Use the latest capable model id (e.g. a current Claude Sonnet/Opus). Read the project's `claude-api` reference if unsure of the exact id.
- For answers-with-citations, use **structured output** so the result is typed and the model is forced to attach sources. Match the persisted shape: an `answer` plus `citations[]` of `{ documentId, documentTitle, locator, quote }`, and a `grounded` boolean (see `messages` in `supabase/schema.sql`). Stream when the UX benefits.

## 4. Ground the answer

- Pass only the org's `documents.content` as context (scoped by `org_id` / `DEMO_ORG_ID`); instruct the model to cite **from that content only**.
- Each citation's `quote` must be verbatim from `documents.content` so it can be checked later; include a `locator` for the "view source" UX.
- Provide a fallback: if nothing relevant is found, return "not found in the document" with `grounded = false` rather than guessing.

## 5. Persist & secure

- Save the conversation/answer to Supabase if the feature needs history.
- The route must be auth-guarded (Supabase Auth) — no unauthenticated access to the model (protects API credits).
- Keep the Anthropic key server-side only; never expose it to the client.

## 6. Verify (the deterministic gate)

Before persisting the answer, check it mechanically (this is Zone 3 in [`docs/DATA_FLOW.md`](../../../docs/DATA_FLOW.md)):

- **Invariant** — `grounded === true` ⟹ at least one citation; `grounded === false` ⟹ zero citations.
- **Source check** — each citation's `quote` exists verbatim in `documents.content`; drop or fail the answer otherwise.
- Then `npx tsc --noEmit` and `npm run lint` clean; spot-check with the `42-citation-verifier` agent.
