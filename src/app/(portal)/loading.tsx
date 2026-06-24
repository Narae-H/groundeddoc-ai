import styles from "./loading.module.css";

/** Portal loading state — shown while the projects read resolves. */
export default function PortalLoading() {
  return (
    <section className={styles.loading} aria-busy="true" aria-live="polite">
      <span className={styles.label}>Loading projects…</span>
    </section>
  );
}
