import styles from "./Logo.module.css";

interface LogoProps {
  /** Rendered width/height in px. Defaults to 28. */
  size?: number;
  className?: string;
}

/**
 * The GroundedDoc brand mark — a single inline SVG that mirrors `/public/favicon.svg`
 * (the rounded blue tile, the document with its folded corner and ruled lines, and
 * the base bar). App-agnostic and presentational, so it runs on the server. Reuse
 * this everywhere the mark appears (login, the workspace topbar, the empty thread)
 * rather than redrawing it; the same file is also the browser favicon via
 * `metadata.icons`.
 */
export function Logo({ size = 28, className }: LogoProps) {
  return (
    <svg
      className={className ? `${styles.logo} ${className}` : styles.logo}
      width={size}
      height={size}
      viewBox="0 0 512 512"
      role="img"
      aria-label="GroundedDoc"
    >
      <rect width="512" height="512" rx="116" fill="var(--accent)" />
      <path
        d="M168 120 h120 l60 60 v150 a18 18 0 0 1 -18 18 H168 a18 18 0 0 1 -18 -18 V138 a18 18 0 0 1 18 -18 Z"
        fill="var(--logo-paper)"
      />
      <path d="M288 120 v42 a18 18 0 0 0 18 18 h42 Z" fill="var(--logo-fold)" />
      <rect x="188" y="206" width="96" height="15" rx="7.5" fill="var(--logo-line-strong)" />
      <rect x="188" y="240" width="132" height="15" rx="7.5" fill="var(--logo-line-soft)" />
      <rect x="148" y="392" width="216" height="18" rx="9" fill="var(--logo-paper)" />
      <path
        d="M178 410 l-18 28 M230 410 l-18 28 M282 410 l-18 28 M334 410 l-18 28"
        stroke="var(--logo-paper)"
        strokeWidth="13"
        strokeLinecap="round"
      />
    </svg>
  );
}
