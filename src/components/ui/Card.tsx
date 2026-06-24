import type { ReactNode } from "react";

import styles from "./Card.module.css";

interface CardProps {
  children: ReactNode;
  /**
   * Elevation. `flat` (default) is a hairline-only card on the warm canvas;
   * `raised` adds the barely-there soft shadow for cards that float.
   */
  elevation?: "flat" | "raised";
  className?: string;
}

/**
 * The workhorse surface — a white card on the warm canvas, defined by a hairline
 * and (optionally) the soft layered shadow. App-agnostic and presentational:
 * it renders props only and runs on the server.
 */
export function Card({ children, elevation = "flat", className }: CardProps) {
  const classes = [styles.card, styles[elevation], className]
    .filter(Boolean)
    .join(" ");
  return <div className={classes}>{children}</div>;
}
