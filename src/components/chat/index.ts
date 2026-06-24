/** Public surface for chat domain components, shared by the workspace and conversation routes. */

// TODO(P4): two divergent message contracts live here — `MessageList` renders the
// snake_case DB row `Message` (conversation route), while `AnswerThread` renders the
// view-model `WorkspaceMessage` (typed blocks/sources, workspace route). They are not
// interchangeable. Converge on a single answer-rendering contract in P4 (likely fold
// `MessageList` into `AnswerThread` once messages carry typed blocks + sources).
export { MessageList } from "./MessageList";
export { CitationChip } from "./CitationChip";
export { Composer } from "./Composer";
export { AnswerThread } from "./AnswerThread";
export { SourcePill } from "./SourcePill";
