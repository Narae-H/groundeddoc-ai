/**
 * A `documents` row — the access unit. Field names mirror `supabase/schema.sql`.
 *
 * `doc_type` is the semantic category (what the document is about). The file-format
 * axis (PDF/Word/Excel/Image, each with a colour dot) is separate — see
 * `docs/DECISIONS.md` → Document types — and is represented by `file_format` here so
 * the documents sidebar can show its format dot. `file_format` is a UI/display axis
 * not yet present in the schema, so it is optional: P4's generated `supabase.ts` can
 * merge with this hand-written mirror without a type clash, and it becomes required
 * once the upload pipeline populates it.
 *
 * Deliberately not mirrored yet: the storage-bound columns `content` and
 * `storage_path` stay out of this type until the upload pipeline (P5) lands — the
 * visual pass never reads document bytes.
 */

/** Semantic category — `documents.doc_type` in the schema. */
export type DocType = "eba" | "subcontract" | "award" | "policy";

/** Access clearance — `documents.access_level` in the schema. */
export type AccessLevel = "org_private" | "org_public";

/** File format axis (DECISIONS.md → Document types) — drives the sidebar colour dot. */
export type FileFormat = "pdf" | "word" | "excel" | "image";

export interface Document {
  id: string;
  org_id: string;
  project_id: string;
  title: string;
  doc_type: DocType;
  access_level: AccessLevel;
  /** Display-only file-format hint (not yet a schema column); optional until P4. */
  file_format?: FileFormat;
  created_at: string;
}
