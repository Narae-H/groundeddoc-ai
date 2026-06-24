"use client";

import { useRouter } from "next/navigation";

import styles from "./LoginActions.module.css";

/** The demo project the sign-in buttons land on. */
const DEMO_PROJECT = "demo-proj-1";

/** The demo roles previewed on the sign-in panel. */
const ROLES = [
  { role: "Site Manager", name: "Alex Morgan" },
  { role: "Site Engineer", name: "Priya Nair" },
  { role: "Subcontractor", name: "Marcus Lee" },
];

/**
 * The sign-in actions — a client island. No auth is wired (the prototype is
 * single-user), so every button simply lands on the demo workspace.
 *
 * TODO(P4): wire Microsoft sign-in and the role previews to Supabase Auth.
 */
export function LoginActions() {
  const router = useRouter();
  const signIn = () => router.push(`/projects/${DEMO_PROJECT}`);

  return (
    <div className={styles.panelInner}>
      <h2 className={styles.title}>Sign in</h2>
      <p className={styles.subtitle}>Use your BuildCo account to continue.</p>

      <button type="button" className={styles.microsoft} onClick={signIn}>
        <span className={styles.msMark} aria-hidden="true">
          <span className={styles.msTile} data-tile="r" />
          <span className={styles.msTile} data-tile="g" />
          <span className={styles.msTile} data-tile="b" />
          <span className={styles.msTile} data-tile="y" />
        </span>
        Sign in with Microsoft
      </button>

      <div className={styles.restricted}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3l7 2.5v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V5.5L12 3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <span>
          Restricted to <strong>@buildco.com</strong> accounts. Access is granted
          based on your role.
        </span>
      </div>

      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerLabel}>DEMO</span>
        <span className={styles.dividerLine} />
      </div>

      <div className={styles.demoHead}>Sign in as — to preview role permissions</div>
      <div className={styles.roles}>
        {ROLES.map((entry) => (
          <button
            key={entry.role}
            type="button"
            className={styles.roleBtn}
            onClick={signIn}
          >
            <span className={styles.roleText}>
              <span className={styles.roleRole}>{entry.role}</span>
              <span className={styles.roleName}>{entry.name}</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      <div className={styles.support}>
        Issues signing in? <span className={styles.supportLink}>Contact IT support</span>
      </div>
    </div>
  );
}
