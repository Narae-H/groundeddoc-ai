import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /**
   * `primary` is the single blue action (the only place the brand blue paints).
   * `secondary` is a white pill. `utility` is the tighter nav/utility button.
   */
  variant?: "primary" | "secondary" | "utility";
  /** `md` (default) is the standard control height; `sm` is the compact variant. */
  size?: "md" | "sm";
}

/**
 * App-agnostic button primitive. Presentational by default (a plain `<button>`);
 * any `onClick` is supplied by a client caller, so this file stays server-safe.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
