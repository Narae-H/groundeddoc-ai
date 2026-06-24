import styles from "./loading.module.css";

/** Conversation loading state — shown while the transcript resolves. */
export default function ConversationLoading() {
  return (
    <section className={styles.loading} aria-busy="true" aria-live="polite">
      <span className={styles.label}>Loading conversation…</span>
    </section>
  );
}
