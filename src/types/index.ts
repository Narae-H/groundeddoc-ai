/**
 * Public surface for shared domain types. Consumers import from `@/types`, never a
 * deep path (the `module-boundaries` skill). Will grow to re-export the generated
 * `supabase.ts` types once the DB layer lands.
 */
export type { Project } from "./project";
export type {
  Document,
  DocType,
  AccessLevel,
  FileFormat,
} from "./document";
export type { Conversation } from "./conversation";
export type { Message, Citation, MessageRole } from "./message";

// TODO(P4): The workspace view models below are scaffolding for the visual pass —
// see the file header. They sit beside the DB-row mirrors above until the real
// backend derives them from org-scoped reads.
export type {
  WorkspaceData,
  WorkspaceUser,
  WorkspaceDocument,
  WorkspaceDocumentGroup,
  WorkspaceFileKind,
  DocumentVisibility,
  WorkspaceMessage,
  AnswerBlock,
  AnswerSource,
  ChatHistoryItem,
  ChatHistoryGroup,
  SwitcherProject,
  AccessPermission,
  WorkspaceMember,
  PromptSuggestion,
  PreviewPart,
  SourcePreview,
} from "./workspace";
