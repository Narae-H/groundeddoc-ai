import type { AnswerSource } from "@/types";

import styles from "./SourcePill.module.css";

interface SourcePillProps {
  source: AnswerSource;
  /** Opens this source in the preview panel. Supplied by a client caller. */
  onOpen?: (source: AnswerSource) => void;
}

/**
 * A grounded source citation rendered as a pill under an assistant answer. A
 * verified source is a solid blue pill; an unverified one is a dashed outline
 * (the design's "needs verification" treatment). Presentational — the open
 * handler comes from a client caller, so this stays server-safe.
 */
export function SourcePill({ source, onOpen }: SourcePillProps) {
  const className = source.verified
    ? styles.pill
    : `${styles.pill} ${styles.unverified}`;
  return (
    <button
      type="button"
      className={className}
      onClick={onOpen ? () => onOpen(source) : undefined}
    >
      <svg
        className={styles.icon}
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 3.5h7l5 5V20a.8.8 0 0 1-.8.8H6a.8.8 0 0 1-.8-.8V4.3A.8.8 0 0 1 6 3.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 3.5V9H18"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
      {source.label}
    </button>
  );
}
