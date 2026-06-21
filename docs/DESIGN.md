# Design

> Pointer doc: where the design source and prototype live, and how tokens reach the app.
> It is **not** the canonical token source.

## The chain

```
/DESIGN.md  ──►  Claude Design prototype  ──►  src/app/globals.css
(analysis)       (visual contract, live)       (the actual tokens)
```

1. **[`/DESIGN.md`](../DESIGN.md)** — the Notion brand **analysis**, imported via `getdesign`
   (`npx getdesign@latest add notion`, `getdesign@0.6.24`, 2026-06-21). Single canonical file,
   tokens embedded in YAML front matter, **never hand-edited**.
2. **Claude Design prototype** — the GroundedDoc prototype built from that analysis. It is the
   **visual contract** later screens are built against. Lives in Claude Design (find it by name —
   see [Prototype](#prototype)); its
   richer token CSS (it adds shadow tokens getdesign omitted) lives there too — not copied into
   the repo, to avoid duplicating what `globals.css` holds.
3. **`src/app/globals.css`** — the **real tokens** as CSS variables. Populated in this task (#8)
   from the Notion tokens (per the ADR: tokens → `globals.css`, CSS Modules, no Tailwind). This is
   the single home for tokens in the app — no intermediate committed copy.

## Prototype

- **Where:** in [Claude Design](https://claude.ai/design) — open your project list and find the
  project named **"GroundedDoc"**. The direct project URL/ID is intentionally **not** committed
  (this repo is public); look it up by name instead.
- **Screens in the prototype:** `Login` and the **Project workspace** (e.g. "Riverside Tower —
  Stage 2": left documents sidebar, centre chat with citations, "Chats" history, "Back to portal").
  Includes upload, share, and create-project modals. Built from `NotionDesignSystem_*` components.

## Token set (from `/DESIGN.md`)

| Group | Source key | Notes |
| --- | --- | --- |
| Brand colour | `colors.primary` (`#0075de`) | Single confident blue; primary action / links / focus only |
| Colour palette | `colors.*` | Warm off-white canvas, near-black ink, sticker accents (decoration only) |
| Typography | `typography.*` | Inter, display-1 → caption, explicit negative tracking on headlines |
| Spacing | `spacing.*` | `xxs` 4px → `xxl` 32px |
| Radius | `rounded.*` | `xs` 4px → `full` 9999px |
| Shadow | *(not in `/DESIGN.md`)* | getdesign omits shadows; the **Claude Design prototype** defines `--shadow-soft` / `--shadow-elevated`, now carried into `globals.css` from the prototype. |

## Domain model & routes (documentation only)

**The product is project-centric**, not a single chat. A *project* is a scope of documents; a
*conversation* is a Q&A thread grounded in that project's documents. The hierarchy:

```
organization (tenant; DEMO_ORG_ID)
  └─ project           a scope of documents — e.g. "Riverside Tower — Stage 2"
       ├─ documents     uploaded files (reports / contracts / invoices / photos), project-scoped
       └─ conversation  a Q&A thread over that project's documents ("Chats")
            └─ messages   question/answer turns + citations
```

Routes are **not created in issue #8** — confirmed here; folder layout per #9 (folder architecture), screens built in later tasks:

| Screen | Route |
| --- | --- |
| Login | `/login` |
| Portal (project list) | `/` |
| Project workspace (documents + chat) | `/projects/[projectId]` |
| A specific conversation | `/projects/[projectId]/c/[conversationId]` |

- **IDs** are short opaque ids (nanoid, ~10 chars) — e.g. `/projects/aB3xK9/c/7mP2qT`, not raw
  uuid PKs. `org_id` stays server-side (session / `DEMO_ORG_ID`) and is **never** in the URL.

> **Schema impact — tracked in #16, NOT done here.** The current `supabase/schema.sql` is
> org-scoped: `documents` and `conversations` carry `org_id`, and a conversation spans *all*
> org documents. This project-centric model adds a **`projects`** table and re-scopes
> `documents` and `conversations` to `project_id` (org_id kept as the tenant boundary), plus a
> short public id. That schema change is #16; the folder layout is #9.

## Out of scope for issue #8

- Hand-building React components or real routes — later stub-screen tasks.
- The `projects` schema change and project-scoping — #16 (see the note above).
- Editing the canonical root `DESIGN.md`.
