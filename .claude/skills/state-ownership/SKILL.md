---
name: state-ownership
description: State ownership (SSOT) for the GroundedDoc app — server data stays server-side, URL state in searchParams, local UI state at the leaf. Consult when adding state or wiring data into components.
---

# State ownership (SSOT)

Every piece of state has a **single owner**; the same data is never held in two places (step 5 of the architecture order).

- **Server data** lives in Server Components, fetched via `lib/data` — never copied into client global state.
- **URL-shared state** (filters, page, tab) lives in `searchParams`, not duplicated into `useState`.
- **Local UI state** (open/closed, hover) lives in a leaf `useState`, colocated — not lifted into context unless genuinely shared.

Most "out-of-sync" bugs come from copying server state into client state. Don't.
