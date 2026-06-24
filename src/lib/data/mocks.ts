/**
 * THROWAWAY mock data layer.
 *
 * TODO(P4): Delete this file. The barrel in ./index.ts is the contract P4 keeps —
 * P4 swaps these bodies for real Supabase, org-scoped reads (see the `data-architecture`
 * skill) without touching call sites. Everything here — the seed rows, the demo IDs,
 * and the `?state=` demo hint — is scaffolding for the four-state walkthrough only.
 *
 * Shape rules these mocks honour so the swap is body-only:
 *   - async signatures (`Promise<…>`), as real DB reads will be.
 *   - org scoping is internal (filter by DEMO_ORG_ID); callers never pass org_id.
 *   - return the shared `@/types` domain types.
 */
import type {
  AccessPermission,
  AnswerSource,
  ChatHistoryGroup,
  Conversation,
  Document,
  Message,
  Project,
  PromptSuggestion,
  SourcePreview,
  WorkspaceData,
  WorkspaceDocument,
  WorkspaceDocumentGroup,
  WorkspaceMember,
  WorkspaceMessage,
  WorkspaceUser,
} from "@/types";
import { buildFallbackPreview } from "@/lib/preview";

/** Fixed seeded org for the single-user prototype (schema.sql / DECISIONS.md #6). */
const DEMO_ORG_ID = "00000000-0000-0000-0000-000000000001";

/**
 * TODO(P4): Remove. A throwaway hint, read from the `?state=` searchParam, that lets
 * a screen demonstrate its four states without a real backend:
 *   - "empty"  → return nothing,
 *   - "error"  → throw (exercises error.tsx),
 *   - "happy"  → return seed data (the default).
 * `loading` is not a data state — it is shown by loading.tsx while the await resolves.
 */
export type DemoState = "empty" | "error" | "happy";

/** TODO(P4): Remove. Normalises an arbitrary searchParam value to a DemoState. */
export function asDemoState(value: string | string[] | undefined): DemoState {
  const first = Array.isArray(value) ? value[0] : value;
  if (first === "empty" || first === "error") return first;
  return "happy";
}

// ── Seed rows (throwaway) ────────────────────────────────────────────────────
// TODO(P4): Remove. Public IDs are the opaque URL handles real rows will carry.

const SEED_PROJECTS: Project[] = [
  {
    id: "00000000-0000-0000-0000-000000000002",
    org_id: DEMO_ORG_ID,
    public_id: "demo-proj-1",
    name: "Demo Project",
    created_at: "2026-05-01T09:00:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    org_id: DEMO_ORG_ID,
    public_id: "demo-proj-2",
    name: "Northside Tower — Subcontracts",
    created_at: "2026-05-14T14:30:00.000Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    org_id: DEMO_ORG_ID,
    public_id: "demo-proj-3",
    name: "Enterprise Agreement Review",
    created_at: "2026-06-02T08:15:00.000Z",
  },
];

const SEED_DOCUMENTS: Document[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    org_id: DEMO_ORG_ID,
    project_id: "00000000-0000-0000-0000-000000000002",
    title: "BuildCo Enterprise Agreement 2024",
    doc_type: "eba",
    access_level: "org_private",
    file_format: "pdf",
    created_at: "2026-05-01T09:05:00.000Z",
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    org_id: DEMO_ORG_ID,
    project_id: "00000000-0000-0000-0000-000000000002",
    title: "Concreting Subcontract — Level 3",
    doc_type: "subcontract",
    access_level: "org_private",
    file_format: "word",
    created_at: "2026-05-03T11:20:00.000Z",
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    org_id: DEMO_ORG_ID,
    project_id: "00000000-0000-0000-0000-000000000002",
    title: "Modern Award — Building & Construction",
    doc_type: "award",
    access_level: "org_public",
    file_format: "pdf",
    created_at: "2026-05-04T16:45:00.000Z",
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    org_id: DEMO_ORG_ID,
    project_id: "00000000-0000-0000-0000-000000000002",
    title: "Site Safety Policy",
    doc_type: "policy",
    access_level: "org_private",
    file_format: "image",
    created_at: "2026-05-06T10:00:00.000Z",
  },
];

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    org_id: DEMO_ORG_ID,
    project_id: "00000000-0000-0000-0000-000000000002",
    public_id: "demo-conv-1",
    title: "Overtime rates under the EBA",
    created_at: "2026-06-10T13:00:00.000Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    org_id: DEMO_ORG_ID,
    project_id: "00000000-0000-0000-0000-000000000002",
    public_id: "demo-conv-2",
    title: "Subcontractor insurance obligations",
    created_at: "2026-06-12T09:30:00.000Z",
  },
];

const SEED_MESSAGES: Message[] = [
  {
    id: "30000000-0000-0000-0000-000000000001",
    conversation_id: "20000000-0000-0000-0000-000000000001",
    org_id: DEMO_ORG_ID,
    role: "user",
    content: "What overtime rate applies after the first two hours on a weekday?",
    grounded: null,
    citations: [],
    created_at: "2026-06-10T13:00:00.000Z",
  },
  {
    id: "30000000-0000-0000-0000-000000000002",
    conversation_id: "20000000-0000-0000-0000-000000000001",
    org_id: DEMO_ORG_ID,
    role: "assistant",
    content:
      "After the first two hours of overtime on a weekday, work is paid at double time (200% of the ordinary rate) until the employee is released from duty.",
    grounded: true,
    citations: [
      {
        documentId: "10000000-0000-0000-0000-000000000001",
        documentTitle: "BuildCo Enterprise Agreement 2024",
        locator: "Clause 24.3",
        quote:
          "Overtime is paid at time and a half for the first two hours and double time thereafter.",
      },
    ],
    created_at: "2026-06-10T13:00:08.000Z",
  },
  {
    id: "30000000-0000-0000-0000-000000000003",
    conversation_id: "20000000-0000-0000-0000-000000000001",
    org_id: DEMO_ORG_ID,
    role: "user",
    content: "Does that change on a public holiday?",
    grounded: null,
    citations: [],
    created_at: "2026-06-10T13:01:00.000Z",
  },
  {
    id: "30000000-0000-0000-0000-000000000004",
    conversation_id: "20000000-0000-0000-0000-000000000001",
    org_id: DEMO_ORG_ID,
    role: "assistant",
    content:
      "Yes. All time worked on a public holiday is paid at double time and a half (250% of the ordinary rate), with a minimum engagement of four hours.",
    grounded: true,
    citations: [
      {
        documentId: "10000000-0000-0000-0000-000000000001",
        documentTitle: "BuildCo Enterprise Agreement 2024",
        locator: "Clause 26.1",
        quote:
          "Work performed on a public holiday is paid at the rate of double time and a half.",
      },
      {
        documentId: "10000000-0000-0000-0000-000000000003",
        documentTitle: "Modern Award — Building & Construction",
        locator: "Clause 39.2(b)",
        quote:
          "An employee required to work on a public holiday is entitled to a minimum payment of four hours.",
      },
    ],
    created_at: "2026-06-10T13:01:11.000Z",
  },
];

// ── Mock reads (throwaway bodies, contract-stable signatures) ────────────────
// TODO(P4): Replace each body with a real org-scoped Supabase read. Keep the
// signature. `await new Promise(...)` below only simulates latency so loading.tsx
// is briefly visible during the walkthrough.

const SIMULATED_LATENCY_MS = 300;

/** TODO(P4): Remove — simulated network latency so loading.tsx is visible. */
function settle(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
}

/** TODO(P4): Remove — honours the throwaway `?state=` demo hint. */
function applyDemoState<T>(rows: T[], state: DemoState): T[] {
  if (state === "error") {
    throw new Error("Demo error state — wired by the ?state=error toggle.");
  }
  if (state === "empty") return [];
  return rows;
}

/** Portal: the projects visible to the current org. */
export async function getProjects(state: DemoState = "happy"): Promise<Project[]> {
  await settle();
  // TODO(P4): const rows = await selectProjects() scoped by org_id internally.
  const rows = SEED_PROJECTS.filter((p) => p.org_id === DEMO_ORG_ID);
  return applyDemoState(rows, state);
}

/** Workspace header: a single project by its opaque public_id, or null if absent. */
export async function getProjectByPublicId(
  publicId: string,
  state: DemoState = "happy",
): Promise<Project | null> {
  await settle();
  if (state === "error") {
    throw new Error("Demo error state — wired by the ?state=error toggle.");
  }
  if (state === "empty") return null;
  // TODO(P4): const row = await selectProject(publicId) scoped by org_id internally.
  return (
    SEED_PROJECTS.find(
      (p) => p.public_id === publicId && p.org_id === DEMO_ORG_ID,
    ) ?? null
  );
}

/** Workspace sidebar: the documents in a project, by the project's public_id. */
export async function getProjectDocuments(
  projectPublicId: string,
  state: DemoState = "happy",
): Promise<Document[]> {
  await settle();
  const project = SEED_PROJECTS.find(
    (p) => p.public_id === projectPublicId && p.org_id === DEMO_ORG_ID,
  );
  // TODO(P4): const rows = await selectDocuments(project.id) scoped by org_id internally.
  // The project lookup + filter here is two steps only because these are in-memory
  // seeds; P4 can collapse it into one query (join, or a subselect on public_id).
  const rows = project
    ? SEED_DOCUMENTS.filter((d) => d.project_id === project.id)
    : [];
  return applyDemoState(rows, state);
}

/** Workspace: the conversations in a project, by the project's public_id. */
export async function getProjectConversations(
  projectPublicId: string,
  state: DemoState = "happy",
): Promise<Conversation[]> {
  await settle();
  const project = SEED_PROJECTS.find(
    (p) => p.public_id === projectPublicId && p.org_id === DEMO_ORG_ID,
  );
  // TODO(P4): const rows = await selectConversations(project.id) scoped by org_id internally.
  // Two-step here only because of the in-memory seeds; P4 can collapse it into one
  // query (join, or a subselect on public_id).
  const rows = project
    ? SEED_CONVERSATIONS.filter((c) => c.project_id === project.id)
    : [];
  return applyDemoState(rows, state);
}

/** Conversation screen: a single conversation by its opaque public_id, or null. */
export async function getConversationByPublicId(
  publicId: string,
  state: DemoState = "happy",
): Promise<Conversation | null> {
  await settle();
  if (state === "error") {
    throw new Error("Demo error state — wired by the ?state=error toggle.");
  }
  if (state === "empty") return null;
  // TODO(P4): const row = await selectConversation(publicId) scoped by org_id internally.
  return (
    SEED_CONVERSATIONS.find(
      (c) => c.public_id === publicId && c.org_id === DEMO_ORG_ID,
    ) ?? null
  );
}

/** Conversation screen: the turns of a conversation, by its public_id, in order. */
export async function getConversationMessages(
  conversationPublicId: string,
  state: DemoState = "happy",
): Promise<Message[]> {
  await settle();
  const conversation = SEED_CONVERSATIONS.find(
    (c) => c.public_id === conversationPublicId && c.org_id === DEMO_ORG_ID,
  );
  // TODO(P4): const rows = await selectMessages(conversation.id) scoped by org_id internally.
  // Two-step here only because of the in-memory seeds; P4 can collapse it into one
  // query (join, or a subselect on public_id).
  const rows = conversation
    ? SEED_MESSAGES.filter((m) => m.conversation_id === conversation.id)
    : [];
  return applyDemoState(rows, state);
}

// ── Workspace view-model seed (throwaway) ────────────────────────────────────
// TODO(P4): Remove. Backs `getWorkspaceData`'s richer-than-a-row view (grouped
// library, typed answer blocks, chats history, role access); P4 derives the same
// shape from org-scoped `lib/data` reads.

interface SeedWorkspaceDoc {
  id: string;
  group: string;
  name: string;
  kind: WorkspaceDocument["kind"];
  meta: string;
  visibility: WorkspaceDocument["visibility"];
}

const WORKSPACE_DOC_ORDER = [
  "Reports",
  "Contracts & Specs",
  "Invoices",
  "Site Photos",
] as const;

const SEED_WORKSPACE_DOCS: SeedWorkspaceDoc[] = [
  { id: "safety", group: "Reports", name: "Site Safety Inspection — Level 3", kind: "PDF", meta: "4 pages · 2 days ago", visibility: "members" },
  { id: "progress", group: "Reports", name: "Weekly Progress Report — W12", kind: "PDF", meta: "6 pages · 5 days ago", visibility: "members" },
  { id: "subcontract", group: "Contracts & Specs", name: "Subcontract Agreement — Steelfab", kind: "DOC", meta: "18 pages · 3 wks ago", visibility: "managers" },
  { id: "concretespec", group: "Contracts & Specs", name: "Concrete Spec 03 30 00", kind: "PDF", meta: "11 pages · 3 wks ago", visibility: "members" },
  { id: "inv4471", group: "Invoices", name: "Invoice #4471 — Steelfab", kind: "XLSX", meta: "$48,200 · 1 wk ago", visibility: "members" },
  { id: "inv4472", group: "Invoices", name: "Invoice #4472 — CraneCo", kind: "XLSX", meta: "$12,750 · 4 days ago", visibility: "members" },
  { id: "photo1", group: "Site Photos", name: "Footing Pour — Grid C4", kind: "IMG", meta: "JPG · 2 days ago", visibility: "members" },
  { id: "photo2", group: "Site Photos", name: "Scaffold — Level 2", kind: "IMG", meta: "JPG · 6 days ago", visibility: "members" },
];

const SEED_PROMPTS: PromptSuggestion[] = [
  { id: "safety", label: "Summarise the latest safety inspection", short: "Latest safety inspection", icon: "S", tint: "orange" },
  { id: "payment", label: "What are the payment terms with Steelfab?", short: "Steelfab payment terms", icon: "C", tint: "teal" },
  { id: "invoiced", label: "Total invoiced this month", short: "Invoiced this month", icon: "$", tint: "green" },
  { id: "defects", label: "Any open defects on Level 3?", short: "Open defects", icon: "!", tint: "pink" },
];

/** A worked example conversation (the "happy" thread). */
const SEED_WORKSPACE_MESSAGES: WorkspaceMessage[] = [
  { id: "wm1", role: "user", text: "What are the payment terms with Steelfab?" },
  {
    id: "wm2",
    role: "assistant",
    blocks: [
      {
        type: "text",
        text: "Steelfab is engaged on 30-day payment terms from the date of a valid tax invoice. A 5% retention applies, released in two equal parts at Practical Completion and the end of the Defects Liability Period.",
      },
      {
        type: "table",
        columns: ["Term", "Detail"],
        rows: [
          ["Payment period", "30 days from valid invoice"],
          ["Retention", "5% (capped at 5% of contract sum)"],
          ["Defects liability", "12 months from Practical Completion"],
          ["Variations", "Written approval required before works"],
        ],
      },
    ],
    sources: [
      { documentId: "subcontract", label: "Subcontract — Steelfab · §4.2", page: "Page 6", verified: true },
    ],
  },
  { id: "wm3", role: "user", text: "Any open defects on Level 3?" },
  {
    id: "wm4",
    role: "assistant",
    blocks: [
      { type: "text", text: "One open defect remains on Level 3:" },
      {
        type: "bullets",
        items: [
          "Temporary balustrade missing at Grid C4 stair void — high priority, raised 18 June.",
          "Assigned to Site Supervisor · due 21 June.",
        ],
      },
    ],
    sources: [
      { documentId: "safety", label: "Safety Inspection — Level 3 · Defects", page: "Page 4", verified: true },
    ],
  },
];

const SEED_HISTORY_GROUPS: ChatHistoryGroup[] = [
  {
    label: "Today",
    items: [
      { id: "h1", title: "Open defects on Level 3", time: "2h ago", active: true },
      { id: "h2", title: "What needs sign-off this week", time: "5h ago", active: false },
    ],
  },
  {
    label: "Yesterday",
    items: [
      { id: "h3", title: "Steelfab payment terms", time: "Yesterday", active: false },
      { id: "h4", title: "Invoice approvals outstanding", time: "Yesterday", active: false },
    ],
  },
  {
    label: "Previous 7 days",
    items: [
      { id: "h5", title: "This month's invoice total", time: "Mon", active: false },
      { id: "h6", title: "Safety inspection recap", time: "Sun", active: false },
    ],
  },
];

const SEED_MEMBERS: WorkspaceMember[] = [
  { name: "Alex Morgan", email: "alex@buildco.com", role: "Owner", you: true },
  { name: "Priya Nair", email: "priya@buildco.com", role: "Editor", you: false },
  { name: "Marcus Lee", email: "marcus@buildco.com", role: "Viewer", you: false },
];

/** The signed-in user for the visual pass — the Owner role (the design default). */
const OWNER_PERMISSIONS: AccessPermission[] = [
  { text: "View & chat with every document in this project", allowed: true },
  { text: "Upload, categorise & remove documents", allowed: true },
  { text: "Open restricted, managers-only files", allowed: true },
  { text: "Invite teammates & set their access", allowed: true },
];

const SEED_WORKSPACE_USER: WorkspaceUser = {
  name: "Alex Morgan",
  email: "alex@buildco.com",
  initials: "AM",
  role: "Site Manager",
  accessLabel: "Owner",
  canManageDocs: true,
  canSeeRestricted: true,
  permissions: OWNER_PERMISSIONS,
  confidentialNote:
    "This project holds restricted documents. Your role can open managers-only files.",
};

/** Source-preview bodies, keyed by document id. */
const SEED_PREVIEWS: Record<string, Omit<SourcePreview, "documentId" | "contextLabel">> = {
  subcontract: {
    name: "Subcontract Agreement — Steelfab",
    kind: "DOC",
    pageLabel: "Page 6",
    isImage: false,
    imageCaption: "",
    parts: [
      { text: "4.1  The Contractor shall pay the Subcontractor for works properly executed in accordance with this Agreement.", highlight: false },
      { text: "4.2  Payment shall be made within thirty (30) days of receipt of a valid tax invoice. The Contractor may retain five percent (5%) of each payment as retention, capped at 5% of the Subcontract Sum.", highlight: true },
      { text: "4.3  Retention monies shall be released in two equal parts: the first at Practical Completion, the second at expiry of the Defects Liability Period.", highlight: false },
    ],
  },
  safety: {
    name: "Site Safety Inspection — Level 3",
    kind: "PDF",
    pageLabel: "Page 4",
    isImage: false,
    imageCaption: "",
    parts: [
      { text: "Inspection date: 18 June 2026  ·  Inspector: J. Okafor", highlight: false },
      { text: "Checks completed: 7   ·   Passed: 6   ·   Action required: 1", highlight: false },
      { text: "Open item — Temporary balustrade missing at Grid C4 stair void. High priority; rectify before further access to the void edge.", highlight: true },
    ],
  },
};

/** TODO(P4): Remove. Builds a source preview for a cited source. */
function buildPreview(source: AnswerSource): SourcePreview {
  const seed = SEED_PREVIEWS[source.documentId];
  const contextLabel = source.verified ? "cited passage" : "document preview";
  const base: SourcePreview = seed
    ? { ...seed, documentId: source.documentId, contextLabel }
    : buildFallbackPreview({
        documentId: source.documentId,
        name: source.label,
        pageLabel: source.page,
        contextLabel,
      });
  return { ...base, pageLabel: source.page };
}

/** TODO(P4): Remove. Groups the seed documents the role may see, in display order. */
function buildDocumentGroups(canSeeRestricted: boolean): WorkspaceDocumentGroup[] {
  const visible = SEED_WORKSPACE_DOCS.filter(
    (d) => canSeeRestricted || d.visibility !== "managers",
  );
  return WORKSPACE_DOC_ORDER.map((label) => ({
    label,
    documents: visible
      .filter((d) => d.group === label)
      .map((d) => ({ id: d.id, group: d.group, name: d.name, kind: d.kind, meta: d.meta, visibility: d.visibility })),
  })).filter((g) => g.documents.length > 0);
}

/**
 * Workspace screen: the full presentation payload for a project, by its opaque
 * public_id. One typed await — the page hands it to the client shell as props.
 *
 * TODO(P4): Replace the body with org-scoped `lib/data` reads (project, documents,
 * conversations, messages, citations) shaped into this same view model; the
 * `?state=` hint and the seeds go with the toggle.
 */
export async function getWorkspaceData(
  projectPublicId: string,
  state: DemoState = "happy",
): Promise<WorkspaceData | null> {
  await settle();
  if (state === "error") {
    throw new Error("Demo error state — wired by the ?state=error toggle.");
  }
  const project = SEED_PROJECTS.find(
    (p) => p.public_id === projectPublicId && p.org_id === DEMO_ORG_ID,
  );
  if (!project) return null;

  const user = SEED_WORKSPACE_USER;
  const documentGroups = buildDocumentGroups(user.canSeeRestricted);
  const documentCount = documentGroups.reduce((n, g) => n + g.documents.length, 0);
  const hiddenByRole = user.canSeeRestricted
    ? 0
    : SEED_WORKSPACE_DOCS.filter((d) => d.visibility === "managers").length;

  // The empty state shows prompt cards with no thread; happy shows the worked
  // conversation and opens its first cited source in the preview drawer.
  const isEmpty = state === "empty";
  const messages = isEmpty ? [] : SEED_WORKSPACE_MESSAGES;
  const firstCited = messages
    .flatMap((m) => (m.role === "assistant" ? m.sources : []))
    .find((s) => s.verified);

  const switcherProjects = SEED_PROJECTS.filter((p) => p.org_id === DEMO_ORG_ID).map((p) => ({
    publicId: p.public_id,
    name: p.name,
    // The first seed project stands in as a starred favourite for the switcher.
    starred: p.public_id === "demo-proj-1",
    active: p.public_id === projectPublicId,
  }));

  return {
    projectName: project.name,
    projectPublicId: project.public_id,
    org: "BuildCo",
    user,
    switcherProjects,
    documentGroups,
    documentCount,
    hiddenByRole,
    messages,
    historyGroups: isEmpty ? [] : SEED_HISTORY_GROUPS,
    members: SEED_MEMBERS,
    prompts: SEED_PROMPTS,
    initialPreview: firstCited ? buildPreview(firstCited) : null,
  };
}
