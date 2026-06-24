/**
 * A `messages` row — one turn — plus the embedded citation shape. Field names mirror
 * `supabase/schema.sql`.
 *
 * Note the deliberate naming split (issue #20, decision 1):
 *   - Row columns stay snake_case verbatim: `conversation_id`, `org_id`, `created_at`.
 *   - The `citations` payload is a JSON shape, kept camelCase exactly as the schema
 *     comment documents it (`{ documentId, documentTitle, locator, quote }`).
 */

/** Author of a turn — `messages.role` in the schema. */
export type MessageRole = "user" | "assistant";

/**
 * One citation inside `messages.citations` (a jsonb array). camelCase by design —
 * it is a JSON payload, not a DB column set. See schema.sql `messages.citations`.
 */
export interface Citation {
  documentId: string;
  documentTitle: string;
  locator: string;
  quote: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  org_id: string;
  role: MessageRole;
  content: string;
  /** null for user turns; true/false only for assistant turns. */
  grounded: boolean | null;
  citations: Citation[];
  created_at: string;
}
