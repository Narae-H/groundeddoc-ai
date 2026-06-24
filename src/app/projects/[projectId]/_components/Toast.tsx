import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
}

/**
 * The transient confirmation toast (centred at the bottom of the workspace). The
 * shell owns when it shows and auto-dismisses it; this just renders the message.
 */
export function Toast({ message }: ToastProps) {
  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <span className={styles.dot} aria-hidden="true" />
      {message}
    </div>
  );
}
