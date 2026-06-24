import type { ReactNode } from "react";

import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  /** The headline — what failed, in plain words. */
  title?: string;
  /** Optional supporting line. Keep it human; never leak a raw stack trace. */
  description?: string;
  /**
   * Optional action slot (e.g. a "Try again" button). The retry handler itself is
   * client-side, so the caller — typically an `error.tsx` boundary — supplies it,
   * keeping this component presentational and server-safe.
   */
  action?: ReactNode;
}

/**
 * The "something went wrong" frame — a calm card, no semantic-red alarm (the Notion
 * system carries no error ramp). App-agnostic and presentational.
 */
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn’t load this just now. Please try again.",
  action,
}: ErrorStateProps) {
  return (
    <div className={styles.error} role="alert">
      <p className={styles.title}>{title}</p>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
