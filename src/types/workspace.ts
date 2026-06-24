/**
 * Workspace view models — the presentation-shaped data the project workspace renders
 * (grouped library, typed answer blocks, chats history, role access, source preview).
 * They sit beside the snake_case DB-row mirrors because the screen needs more than a
 * single row carries. Fields mirroring DB columns stay snake_case; pure view state is
 * camelCase.
 *
 * TODO(P4): the building blocks come from org-scoped `lib/data` reads; the purely
 * presentational fragments (scope-bar copy, prompt cards, dots) are derived server-side.
 */

/** File-format axis for the colour dot + upload badge (PDF/DOC/XLSX/IMG). */
export type WorkspaceFileKind = "PDF" | "DOC" | "XLSX" | "IMG";

/**
 * Who may open a document — drives the restricted lock + access filtering.
 *
 * TODO(P4): this view-model axis maps from the DB `documents.access_level`
 * (`org_private` | `org_public`): `org_private` (managers-only) → `"managers"`,
 * `org_public` (all members) → `"members"`. The data layer derives `visibility`
 * from `access_level`; the schema is not changed.
 */
export type DocumentVisibility = "members" | "managers";

/** One row in the document library (a `documents` row, shaped for display). */
export interface WorkspaceDocument {
  /**
   * Opaque handle for the row. The `documents` table has no `public_id` column —
   * TODO(P4): this maps to `documents.id` (the uuid), or to a dedicated opaque
   * handle if one is later added; it is never an org_id and is the value the
   * preview/source lookups key on.
   */
  id: string;
  /** Group heading the row sits under (Reports, Invoices, …). */
  group: string;
  name: string;
  kind: WorkspaceFileKind;
  /** Pre-formatted metadata line ("4 pages · 2 days ago"). */
  meta: string;
  visibility: DocumentVisibility;
}

/** A document library group (heading + its rows). */
export interface WorkspaceDocumentGroup {
  label: string;
  documents: WorkspaceDocument[];
}

/** A typed block inside an assistant answer. */
export type AnswerBlock =
  | { type: "text"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "table"; columns: string[]; rows: string[][]; totalRow?: boolean };

/** A source pill under an assistant answer. */
export interface AnswerSource {
  /** The document this source opens in the preview panel. */
  documentId: string;
  label: string;
  /** Locator within the document ("Page 6", "Sheet 1"). */
  page: string;
  /** false → unverified (dashed pill); true → grounded source pill. */
  verified: boolean;
}

/** One turn in the answer thread. */
export type WorkspaceMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      blocks: AnswerBlock[];
      sources: AnswerSource[];
    };

/** A chats-history entry. */
export interface ChatHistoryItem {
  id: string;
  title: string;
  time: string;
  active: boolean;
}

/** A chats-history group (Today, Yesterday, …). */
export interface ChatHistoryGroup {
  label: string;
  items: ChatHistoryItem[];
}

/** A project in the topbar switcher. */
export interface SwitcherProject {
  /** Opaque public handle used in the URL. */
  publicId: string;
  name: string;
  starred: boolean;
  active: boolean;
}

/** One line in the user-menu access list. */
export interface AccessPermission {
  text: string;
  allowed: boolean;
}

/** A person with access, for the Share dialog. */
export interface WorkspaceMember {
  name: string;
  email: string;
  role: string;
  you: boolean;
}

/** The signed-in user and what their role can do in this project. */
export interface WorkspaceUser {
  name: string;
  email: string;
  initials: string;
  /** Display role in this project ("Site Manager"). */
  role: string;
  /** Access tier label ("Owner"/"Editor"/"Viewer"). */
  accessLabel: string;
  /** Editors/Owners may upload & remove; Viewers may not. */
  canManageDocs: boolean;
  /** Owners may open restricted, managers-only files. */
  canSeeRestricted: boolean;
  permissions: AccessPermission[];
  confidentialNote: string;
}

/** A big prompt card on the empty thread + a composer chip. */
export interface PromptSuggestion {
  id: string;
  /** Full question sent on click. */
  label: string;
  /** Short chip label. */
  short: string;
  /** Single-glyph icon ("S", "$", "!"). */
  icon: string;
  /** Sticker tint for the icon tile. */
  tint: "orange" | "teal" | "green" | "pink";
}

/** A part of the source-preview body (text documents). */
export interface PreviewPart {
  text: string;
  highlight: boolean;
}

/** The right-hand source-preview drawer contents. */
export interface SourcePreview {
  documentId: string;
  name: string;
  kind: WorkspaceFileKind;
  pageLabel: string;
  /** "cited passage" vs "document preview". */
  contextLabel: string;
  isImage: boolean;
  imageCaption: string;
  parts: PreviewPart[];
}

/**
 * The full workspace payload the server page hands to the client shell. Bundled so
 * the page does a single typed await; P4 swaps the mock body for org-scoped reads.
 */
export interface WorkspaceData {
  projectName: string;
  projectPublicId: string;
  org: string;
  user: WorkspaceUser;
  switcherProjects: SwitcherProject[];
  documentGroups: WorkspaceDocumentGroup[];
  /** Count of ready (non-restricted-hidden) documents shown in the header. */
  documentCount: number;
  /** Documents hidden from this role by access level. */
  hiddenByRole: number;
  messages: WorkspaceMessage[];
  historyGroups: ChatHistoryGroup[];
  members: WorkspaceMember[];
  prompts: PromptSuggestion[];
  /** A source preview to open initially (cited answer), or null. */
  initialPreview: SourcePreview | null;
}
