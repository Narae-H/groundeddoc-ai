"use client";

import type { SourcePreview, WorkspaceFileKind } from "@/types";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/CloseIcon";

import styles from "./SourcePreviewPanel.module.css";

interface SourcePreviewPanelProps {
  preview: SourcePreview;
  canManageDocs: boolean;
  onClose: () => void;
  onRemove: (documentId: string) => void;
}

const DOT_CLASS: Record<WorkspaceFileKind, string> = {
  PDF: "dotPdf",
  DOC: "dotDoc",
  XLSX: "dotXlsx",
  IMG: "dotImg",
};

/**
 * The right-hand source preview drawer: a header (dot + name + page/context),
 * the cited body (image well or highlighted text parts), and a footer
 * (Remove / Open document). A client island — close/remove are real local UI
 * actions; opening the underlying document is a P4 stub.
 */
export function SourcePreviewPanel({
  preview,
  canManageDocs,
  onClose,
  onRemove,
}: SourcePreviewPanelProps) {
  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <span
            className={`${styles.dot} ${styles[DOT_CLASS[preview.kind]]}`}
            aria-hidden="true"
          />
          <div className={styles.headingText}>
            <span className={styles.name}>{preview.name}</span>
            <span className={styles.context}>
              {preview.pageLabel} · {preview.contextLabel}
            </span>
          </div>
        </div>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close preview"
        >
          <CloseIcon size={17} />
        </button>
      </div>

      <div className={styles.body}>
        {preview.isImage ? (
          <div className={styles.imageCard}>
            <div className={styles.imageWell} aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="8.5" cy="10" r="1.6" fill="currentColor" />
                <path d="M4 17l5-4 3 2.5L16 11l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={styles.imageCaption}>{preview.imageCaption}</div>
          </div>
        ) : (
          <div className={styles.textCard}>
            <div className={styles.docLabel}>{preview.name}</div>
            {preview.parts.map((part, index) => (
              <p
                key={index}
                className={part.highlight ? styles.highlight : styles.part}
              >
                {part.text}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {canManageDocs ? (
          <button
            type="button"
            className={styles.remove}
            onClick={() => onRemove(preview.documentId)}
            title="Remove from library"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 7h14M10 7V5.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V7M7.5 7l.8 11a1 1 0 0 0 1 .95h5.4a1 1 0 0 0 1-.95l.8-11"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Remove
          </button>
        ) : (
          <span />
        )}
        {/* TODO(P4): open the underlying document in a viewer. */}
        <Button variant="utility" size="sm">
          Open document
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 17L17 7M9 7h8v8"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
    </aside>
  );
}
