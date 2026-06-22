---
name: rendering
description: The server/client (RSC) boundary for the GroundedDoc app — Server Components by default, "use client" at the smallest leaf, secrets server-side. Consult when deciding where a component runs or where data is fetched.
---

# Rendering boundary (RSC)

Where code runs (step 3 of the architecture order). The folder layout is owned by the [`layers`](../layers/) skill; the runtime data flow by [`data-architecture`](../data-architecture/).

## Server / client split

- **Server Components by default.** Add `"use client"` only at the smallest leaf that needs state, effects, or browser APIs — never bubble it up to a parent that doesn't need it.
- **Data fetching and secrets stay on the server** — in Server Components, Server Actions, and Route Handlers.
- Mutations go through **Server Actions**; standalone/streaming endpoints go through **Route Handlers**.

## Secrets stay server-side

The **Anthropic key** and the **Supabase service-role key** never reach client code — they live only in Server Components, Server Actions, and Route Handlers. A secret crossing into a client component is a defect, not a style nit.
