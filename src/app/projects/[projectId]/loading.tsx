import styles from "./loading.module.css";

/** Workspace loading state — shown while the project and its documents resolve. */
export default function WorkspaceLoading() {
  return (
    <section className={styles.loading} aria-busy="true" aria-live="polite">
      <span className={styles.label}>Loading project…</span>
    </section>
  );
}
