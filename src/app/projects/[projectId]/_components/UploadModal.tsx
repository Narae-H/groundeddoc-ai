"use client";

import { useState } from "react";
import type { WorkspaceFileKind } from "@/types";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/CloseIcon";

import styles from "./UploadModal.module.css";

interface UploadModalProps {
  projectName: string;
  org: string;
  onClose: () => void;
  /** Confirms the upload. Side effect is a P4 stub. */
  onConfirm: (fileName: string, category: string) => void;
}

interface PendingFile {
  name: string;
  kind: WorkspaceFileKind;
  category: string;
}

/** Throwaway sample files the "Browse" button cycles through for the visual pass. */
const SAMPLE_FILES: PendingFile[] = [
  { name: "RFI 042 — Glazing Detail", kind: "PDF", category: "Reports" },
  { name: "Variation 17 — Lift Lobby", kind: "DOC", category: "Contracts & Specs" },
  { name: "Invoice #4519 — FormWorks", kind: "XLSX", category: "Invoices" },
  { name: "Scaffold Handover — Level 4", kind: "IMG", category: "Site Photos" },
];

const CATEGORIES = ["Reports", "Contracts & Specs", "Invoices", "Site Photos"];

const VISIBILITY = [
  {
    id: "members" as const,
    label: "All project members",
    desc: "Everyone on this project can view and chat with it.",
  },
  {
    id: "managers" as const,
    label: "Project managers only",
    desc: "Restricted — hidden from members without permission.",
  },
];

const BADGE_CLASS: Record<WorkspaceFileKind, string> = {
  PDF: "badgePdf",
  DOC: "badgeDoc",
  XLSX: "badgeXlsx",
  IMG: "badgeImg",
};

/**
 * The "Add documents" modal — a dropzone (Browse files), the pending file with
 * its auto-detected category and access, and an access note. A client island
 * that owns its draft selection; confirming is a P4 stub the shell toasts.
 */
export function UploadModal({
  projectName,
  org,
  onClose,
  onConfirm,
}: UploadModalProps) {
  const [pending, setPending] = useState<PendingFile | null>(null);
  const [category, setCategory] = useState("Reports");
  const [visibility, setVisibility] = useState<"members" | "managers">("members");
  const [sampleIndex, setSampleIndex] = useState(0);

  const browse = () => {
    const sample = SAMPLE_FILES[sampleIndex % SAMPLE_FILES.length];
    setPending(sample);
    setCategory(sample.category);
    setVisibility("members");
    setSampleIndex((index) => index + 1);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.title}>Add documents</span>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.dropzone}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17.5 9.5a3.5 3.5 0 0 1 .2 6.97"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 12v7M9.4 14.2L12 11.6l2.6 2.6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className={styles.dropLabel}>Drag files here, or</div>
            <Button variant="utility" size="sm" onClick={browse}>
              Browse files
            </Button>
            <div className={styles.dropHint}>
              PDF, DOC, XLSX or images · up to 50 MB
            </div>
          </div>

          {pending ? (
            <>
              <div className={styles.pending}>
                <span className={`${styles.badge} ${styles[BADGE_CLASS[pending.kind]]}`}>
                  {pending.kind}
                </span>
                <div className={styles.pendingText}>
                  <span className={styles.pendingName}>{pending.name}</span>
                  <span className={styles.pendingMeta}>Ready to analyse</span>
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionHead}>
                  <span className={styles.sectionTitle}>Category</span>
                  <span className={styles.autoBadge}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 3l2.1 5.4L19.5 10l-5.4 1.6L12 17l-2.1-5.4L4.5 10l5.4-1.6L12 3Z"
                        fill="currentColor"
                      />
                    </svg>
                    Auto-detected
                  </span>
                </div>
                <div className={styles.catGrid}>
                  {CATEGORIES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.catChip} ${category === option ? styles.catChipActive : ""}`}
                      onClick={() => setCategory(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.section}>
                <span className={styles.sectionTitle}>Who can access</span>
                <div className={styles.visList}>
                  {VISIBILITY.map((option) => {
                    const selected = visibility === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`${styles.visRow} ${selected ? styles.visRowActive : ""}`}
                        onClick={() => setVisibility(option.id)}
                      >
                        <span className={styles.radio} aria-hidden="true">
                          {selected ? <span className={styles.radioDot} /> : null}
                        </span>
                        <span className={styles.visText}>
                          <span className={styles.visLabel}>{option.label}</span>
                          <span className={styles.visDesc}>{option.desc}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.note}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3l7 2.5v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V5.5L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>
                  Uploading to <strong>{projectName}</strong>. GroundedDoc enforces
                  document-level access, so files stay within this project and
                  respect each member&rsquo;s permissions in {org}.
                </span>
              </div>
            </>
          ) : null}
        </div>

        <div className={styles.footer}>
          <Button variant="utility" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!pending}
            onClick={() => pending && onConfirm(pending.name, category)}
          >
            Add to library
          </Button>
        </div>
      </div>
    </div>
  );
}
