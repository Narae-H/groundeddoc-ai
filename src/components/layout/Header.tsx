import Link from "next/link";

import styles from "./Header.module.css";

/**
 * The portal chrome header — a slim white bar carrying the centred wordmark. A domain
 * component (it knows `/` is the portal); presentational, so it runs on the server.
 * Only the `(portal)` group renders it — the full-bleed `projects/*` and `login`
 * routes carry their own headers.
 */
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left} />
      <Link href="/" className={styles.wordmark}>
        GroundedDoc
      </Link>
      <div className={styles.right} />
    </header>
  );
}
