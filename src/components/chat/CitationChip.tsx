import type { Citation } from "@/types";

import styles from "./CitationChip.module.css";

interface CitationChipProps {
  citation: Citation;
}

/**
 * One grounded citation, rendered as a small pill: the source document and its
 * locator, with the cited quote underneath. Presentational — runs on the server.
 *
 * Reads the camelCase citation JSON shape (`documentTitle`, `locator`, `quote`)
 * exactly as stored in `messages.citations`.
 */
export function CitationChip({ citation }: CitationChipProps) {
  return (
    <figure className={styles.chip}>
      <figcaption className={styles.source}>
        <span className={styles.title}>{citation.documentTitle}</span>
        <span className={styles.locator}>{citation.locator}</span>
      </figcaption>
      <blockquote className={styles.quote}>“{citation.quote}”</blockquote>
    </figure>
  );
}
