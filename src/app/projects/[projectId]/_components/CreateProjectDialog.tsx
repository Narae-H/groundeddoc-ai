"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/CloseIcon";

import styles from "./CreateProjectDialog.module.css";

interface CreateProjectDialogProps {
  onClose: () => void;
  /** Creates the project. Side effect is a P4 stub the shell toasts. */
  onCreate: (name: string) => void;
}

/**
 * The "Create project" dialog — a single name field. A client island owning the
 * name draft; creating is a P4 stub surfaced as a toast by the shell.
 */
export function CreateProjectDialog({
  onClose,
  onCreate,
}: CreateProjectDialogProps) {
  const [name, setName] = useState("");
  const trimmed = name.trim();

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.title}>Create project</span>
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
          <span className={styles.label}>Project name</span>
          <input
            className={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Parkside Depot — Stage 1"
            aria-label="Project name"
          />
          <span className={styles.hint}>
            You will be the owner. Add documents and invite teammates once it is
            created.
          </span>
        </div>
        <div className={styles.footer}>
          <Button variant="utility" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={trimmed.length === 0}
            onClick={() => onCreate(trimmed)}
          >
            Create project
          </Button>
        </div>
      </div>
    </div>
  );
}
