/**
 * Public surface for the data layer — the contract callers (Server Components) hold.
 *
 * This barrel is stable across the mock → real swap: P4 deletes `mocks.ts` and points
 * these exports at real org-scoped Supabase reads (the `data-architecture` skill)
 * without touching any call site. The `DemoState` / `asDemoState` exports are throwaway
 * scaffolding for the four-state walkthrough — TODO(P4): remove them with the toggle.
 */
export {
  getProjects,
  getProjectByPublicId,
  getProjectDocuments,
  getProjectConversations,
  getConversationByPublicId,
  getConversationMessages,
  // TODO(P4): workspace view-model read — same body-swap contract, returns the
  // presentation-shaped WorkspaceData for the workspace screen.
  getWorkspaceData,
  // TODO(P4): remove the demo-state exports below with the ?state= toggle.
  asDemoState,
} from "./mocks";

// TODO(P4): remove with the ?state= toggle.
export type { DemoState } from "./mocks";
