"use client";

import { useState } from "react";
import type { WorkspaceDocument, WorkspaceDocumentGroup } from "@/types";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

import styles from "./DocumentLibrary.module.css";

interface DocumentLibraryProps {
  groups: WorkspaceDocumentGroup[];
  documentCount: number;
  hiddenByRole: number;
  /** Set of scoped document ids. */
  scope: ReadonlySet<string>;
  canManageDocs: boolean;
  onToggleScope: (documentId: string) => void;
  onOpenDocument: (documentId: string) => void;
  onUpload: () => void;
  onBackToPortal: () => void;
}

/** Maps a file-format kind to its colour-dot class. */
const DOT_CLASS: Record<WorkspaceDocument["kind"], string> = {
  PDF: "dotPdf",
  DOC: "dotDoc",
  XLSX: "dotXlsx",
  IMG: "dotImg",
};

/**
 * The document library — the left rail. A client island: it owns the search box
 * and emits scope toggles / open-document / upload to the shell. Documents are
 * grouped by category; each row carries a scope checkbox, a file-format dot, and
 * a restricted lock when managers-only.
 */
export function DocumentLibrary({
  groups,
  documentCount,
  hiddenByRole,
  scope,
  canManageDocs,
  onToggleScope,
  onOpenDocument,
  onUpload,
  onBackToPortal,
}: DocumentLibraryProps) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filtered = groups
    .map((group) => ({
      ...group,
      documents: group.documents.filter(
        (document) => !query || document.name.toLowerCase().includes(query),
      ),
    }))
    .filter((group) => group.documents.length > 0);

  const hasScope = scope.size > 0;

  return (
    <div className={styles.rail}>
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.back}
          onClick={onBackToPortal}
          title="Back to portal"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to portal
        </button>
      </div>

      <div className={styles.heading}>
        <div className={styles.headingTitle}>
          <span className={styles.headingLabel}>Documents</span>
          <span className={styles.count}>{documentCount}</span>
        </div>
        {canManageDocs ? (
          <Button variant="utility" size="sm" onClick={onUpload}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V4m0 0L7 9m5-5l5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 19h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Upload
          </Button>
        ) : null}
      </div>

      <div className={styles.searchWrap}>
        <div className={styles.search}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            className={styles.searchInput}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search documents"
            aria-label="Search documents"
          />
        </div>
      </div>

      {!hasScope ? (
        <p className={styles.hint}>
          Tip — tick documents to focus the chat on them. All documents are
          included by default.
        </p>
      ) : null}

      {hiddenByRole > 0 ? (
        <div className={styles.restricted}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span>
            {hiddenByRole} document{hiddenByRole > 1 ? "s are" : " is"} hidden by
            your access level.
          </span>
        </div>
      ) : null}

      <div className={styles.list}>
        {filtered.map((group) => (
          <div key={group.label} className={styles.group}>
            <div className={styles.groupLabel}>{group.label}</div>
            {group.documents.map((document) => {
              const selected = scope.has(document.id);
              return (
                <div
                  key={document.id}
                  className={`${styles.row} ${selected ? styles.rowSelected : ""}`}
                >
                  <Checkbox
                    checked={selected}
                    onChange={() => onToggleScope(document.id)}
                    aria-label={`Focus chat on ${document.name}`}
                  />
                  <button
                    type="button"
                    className={styles.rowBody}
                    onClick={() => onOpenDocument(document.id)}
                  >
                    <span
                      className={`${styles.dot} ${styles[DOT_CLASS[document.kind]]}`}
                      aria-hidden="true"
                    />
                    <span className={styles.rowText}>
                      <span className={styles.name}>{document.name}</span>
                      <span className={styles.meta}>{document.meta}</span>
                    </span>
                    {document.visibility === "managers" ? (
                      <span
                        className={styles.lock}
                        title="Restricted — managers only"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </span>
                    ) : null}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
