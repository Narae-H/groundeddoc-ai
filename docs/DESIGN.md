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
- **Screens in the prototype:** `Sign in` and `GroundedDoc Chat` (app top bar, upload modal,
  share modal, create-project modal). Built from `NotionDesignSystem_*` components.

## Token set (from `/DESIGN.md`)

| Group | Source key | Notes |
| --- | --- | --- |
| Brand colour | `colors.primary` (`#0075de`) | Single confident blue; primary action / links / focus only |
| Colour palette | `colors.*` | Warm off-white canvas, near-black ink, sticker accents (decoration only) |
| Typography | `typography.*` | Inter, display-1 → caption, explicit negative tracking on headlines |
| Spacing | `spacing.*` | `xxs` 4px → `xxl` 32px |
| Radius | `rounded.*` | `xs` 4px → `full` 9999px |
| Shadow | *(not in `/DESIGN.md`)* | getdesign omits shadows; the **Claude Design prototype** defines `--shadow-soft` / `--shadow-elevated`, now carried into `globals.css` from the prototype. |

## Screen → route mapping (documentation only)

The prototype has **two** screens. Routes are **not created in issue #8** — the final
structure is settled under the folder architecture (issue #4):

| Prototype screen | Eventual route |
| --- | --- |
| Login | (auth route — #4) |
| Chat | `src/app/conversations/[conversationId]/` |

`[conversationId]` is `conversations.id` (a uuid). `org_id` stays server-side (from the
session / `DEMO_ORG_ID`) and is **never** in the URL — a conversation already carries its
`org_id`, and the address only needs to say *which conversation*.

**Deferred (not in the prototype):** a home/portal screen isn't needed now — login goes
straight to chat. A documents/list screen, and whether a root `/` is kept, are decided in #4.

## Out of scope for issue #8

- Hand-building React components or real routes — later stub-screen tasks.
- Editing the canonical root `DESIGN.md`.
