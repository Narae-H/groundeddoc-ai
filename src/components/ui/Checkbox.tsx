import type { InputHTMLAttributes } from "react";

import styles from "./Checkbox.module.css";

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  /** Accessible label for the control (it renders no visible text). */
  "aria-label"?: string;
};

/**
 * App-agnostic checkbox primitive — an 18×18 box with a blue tick when checked.
 * Presentational: the native `<input>` is visually hidden and the styled box is
 * drawn with CSS, so `checked` / `onChange` come from a client caller and this
 * file stays server-safe (no hooks).
 */
export function Checkbox({ ...rest }: CheckboxProps) {
  return (
    <label className={styles.wrap}>
      <input type="checkbox" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden="true">
        <svg
          className={styles.tick}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5 12.5l4.5 4.5L19 7"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  );
}
