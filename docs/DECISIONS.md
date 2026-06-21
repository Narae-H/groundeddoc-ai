# Decisions — GroundedDoc Prototype

The single source of truth for the tech-stack choices, so later issues never re-ask "why this way?". This file is the terse *record*; the full data-flow rationale lives in [DATA_FLOW.md](DATA_FLOW.md).

---

## Tech-stack decisions

| # | Decision | Reason (one line) |
|---|---|---|
| 1 | **DB = Supabase** (schema: [`../supabase/schema.sql`](../supabase/schema.sql)) | Managed Postgres + Storage + Auth in one — minimal ops for a prototype. |
| 2 | **AI = Anthropic via the Vercel AI SDK; structured output via zod** | Typed, grounded `{ grounded, answer, citations }` output without raw `fetch`; never call the API directly. |
| 3 † | **RLS = OFF in the prototype; `org_id` + role scoping is the app layer's responsibility** | Single-user, fixed org — nothing to isolate from yet. App code enforces org isolation *and* role-based clearance; the DB boundary is *written but disabled*. See [RLS link](#rls-link) below. |
| 4 † | **M1 input = text/markdown only; broader file formats planned** | One `file.text()` path for M1; defer extraction complexity. The design already anticipates four file formats (see [Document types](#document-types)). |
| 5 | **Responses = non-streaming (verify-then-return)** | Zone 3's deterministic gate must verify every citation against the source *before* the user sees the answer — incompatible with streaming tokens. |
| 6 | **Single seeded org = `DEMO_ORG_ID`** | Fixed org `00000000-0000-0000-0000-000000000001` (seeded in `schema.sql`); `org_id` stays an expression of intent until multi-tenancy lands. |
| 7 | **Design source = Notion → getdesign → Claude Design → tokens in `globals.css`; components hand-built; no Tailwind; styling = CSS Modules** | One design origin, synced — not redrawn by hand. See [Design pipeline](#design-pipeline) below. |

† **Provisional — may still change.** Decisions 3 and 4 are not yet locked; they capture the current direction, not a settled choice.

---

## RLS link

RLS is **deliberately disabled** in the prototype. The boundary is fully written but commented out in [`../supabase/schema.sql`](../supabase/schema.sql):

- Header note — `schema.sql` line 12: *"This prototype is SINGLE-USER. RLS is written below but kept OFF."*
- Enforcement layer — `schema.sql` line 101: *"ENFORCEMENT LAYER — RLS  (DO NOT ENABLE FOR THE SINGLE-USER PROTOTYPE)"*, with the policies ready to uncomment once Supabase Auth supplies `org_id` as a JWT claim.

Until then, scoping is enforced in app code: **`org_id`** for tenant isolation (Zone 1's `WHERE org_id` fetch) plus **role** for within-org clearance. Role-based access maps to the future `memberships(user_id, org_id, role)` table already sketched in `schema.sql` (line 127). The guarantee *moves* to the database the moment RLS is enabled — see DATA_FLOW.md §3–4 for why the security boundary is never left to the model.

> **Provisional (decision 3).** Whether role lives in the JWT claim, a `memberships` table, or both is not yet locked.

---

## Document types

Two distinct axes — don't conflate them:

- **Semantic category** (`documents.doc_type` in `schema.sql`): `eba` · `subcontract` · `award` · `policy` — *what the document is about*.
- **File format** (the upload/input axis, decision 4): the design prototype already defines four formats, each with a colour dot:

  | Colour | Format | Typical content |
  |---|---|---|
  | 🟠 Orange | PDF | Reports, specs |
  | 🔵 Blue | Word (DOC) | Contracts |
  | 🟢 Green | Excel (XLSX) | Invoices, spreadsheets |
  | 🩷 Pink | Image | Site photos |

> **Provisional (decision 4).** M1 implements **text/markdown only**; the four formats above are the planned direction, not all shipped in M1. PDF is the first to follow (targeted for P5).

---

## Design pipeline

The design is imported from a single Notion source, not hand-drawn:

1. **Install** — `npx getdesign@latest add notion` pulls the Notion design into a `design.md` source file.
2. **Sync** — `/design-sync` integrates that source with Claude Design and mirrors the design tokens into `globals.css` as CSS variables.
3. **Build** — components are hand-built against those tokens. **No Tailwind**; component styling is **CSS Modules**, global tokens live in `globals.css`.

The current in-repo design is the result of importing the Notion `design.md` ahead of time and working it up from there.

---

> Adding or revisiting a decision? Edit the table above and add a one-line reason — don't re-litigate a settled choice in a new issue without recording the change here first.
