/**
 * Shared source-preview fallback — the generic preview shown when a document has no
 * seeded cited passage. Lives at the `lib/` root (app-agnostic, no DB, no React) so
 * the mock data layer (`lib/data`) and the client workspace shell (`app/`) build the
 * same fallback from one place — preventing the body copy from drifting between the
 * server-derived preview and the client-derived one.
 *
 * TODO(P4): Remove with the mock data layer. The real backend returns a preview
 * (cited passage or document excerpt) from storage, so this generic fallback goes
 * away with the seeds.
 */
import type { SourcePreview, WorkspaceFileKind } from "@/types";

/** The generic body line shown when a document has no seeded passage. */
export const FALLBACK_PREVIEW_BODY =
  "GroundedDoc has indexed this document. Ask a question and the answer will cite the exact page from here.";

interface FallbackPreviewInput {
  documentId: string;
  name: string;
  /** Locator label ("Page 1", "Page 6"). */
  pageLabel: string;
  /** "cited passage" for a verified source, "document preview" otherwise. */
  contextLabel: string;
  kind?: WorkspaceFileKind;
  /** When true, render the image well instead of the text body. */
  isImage?: boolean;
  imageCaption?: string;
}

/** Builds the generic fallback `SourcePreview` shared by the mock layer and the shell. */
export function buildFallbackPreview({
  documentId,
  name,
  pageLabel,
  contextLabel,
  kind = "PDF",
  isImage = false,
  imageCaption = "",
}: FallbackPreviewInput): SourcePreview {
  return {
    documentId,
    name,
    kind,
    pageLabel,
    contextLabel,
    isImage,
    imageCaption,
    parts: isImage ? [] : [{ text: FALLBACK_PREVIEW_BODY, highlight: false }],
  };
}
