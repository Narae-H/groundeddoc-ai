import type { ReactNode } from "react";

import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  /** The headline — what is empty, in plain words. */
  title: string;
  /** Optional supporting line explaining how to fill it. */
  description?: string;
  /** Optional action slot (e.g. a primary button) supplied by the caller. */
  action?: ReactNode;
}

/**
 * The "nothing here yet" frame — a calm card on the warm canvas. App-agnostic and
 * presentational; the caller owns the copy and any action, so it stays server-safe.
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
