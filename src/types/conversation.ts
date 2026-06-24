/**
 * A `conversations` row — a chat session scoped to a project. Field names mirror
 * `supabase/schema.sql`.
 *
 * `public_id` is the short opaque nanoid that appears in URLs; `title` is nullable
 * in the schema and can be derived from the first question.
 */
export interface Conversation {
  id: string;
  org_id: string;
  project_id: string;
  public_id: string;
  title: string | null;
  created_at: string;
}
