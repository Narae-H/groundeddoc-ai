/**
 * Shared domain types — hand-written to mirror the DB rows in `supabase/schema.sql`.
 *
 * Field names are the snake_case DB column names verbatim (no DTO, no mapper):
 * `public_id`, `org_id`, `doc_type`, … . The deliberate no-DTO stance lives in the
 * `data-architecture` skill. These will be superseded by the generated `supabase.ts`
 * types once the DB layer lands; until then they are the single source of truth that
 * both the mocks and the components import.
 */

/**
 * A `projects` row — a scope of documents within an org.
 *
 * `public_id` is the short opaque (~10-char) nanoid that appears in URLs; the uuid
 * `id` stays the internal identifier. `org_id` is exposed on the type but is never
 * placed in a URL.
 */
export interface Project {
  id: string;
  org_id: string;
  public_id: string;
  name: string;
  created_at: string;
}
