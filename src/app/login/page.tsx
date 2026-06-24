import { Logo } from "@/components/ui/Logo";

import { LoginActions } from "./_components/LoginActions";
import styles from "./page.module.css";

/**
 * Sign in — the GroundedDoc login. A visual stub: no auth is wired yet (the
 * prototype is single-user). The brand band sits on the left; the right panel
 * offers a Microsoft sign-in and demo role sign-ins that preview each role's
 * permissions. A Server Component — the sign-in buttons are a small client island.
 *
 * TODO(P4): wire Microsoft sign-in and the demo roles to Supabase Auth.
 * TODO(P4): when auth lands, add a `login/error.tsx` boundary for failed sign-ins;
 * a root `app/global-error.tsx` is also a P4 candidate (catches errors thrown by the
 * root layout itself, which the per-route `error.tsx` boundaries can't).
 */
export default function LoginPage() {
  return (
    <div className={styles.frame}>
      <div className={styles.row}>
        <div className={styles.brand}>
          <div className={styles.brandTop}>
            <Logo size={30} />
            <span className={styles.wordmark}>GroundedDoc</span>
          </div>

          <div className={styles.pitch}>
            <div className={styles.eyebrow}>Document Intelligence</div>
            <h1 className={styles.headline}>
              Every site document, one conversation.
            </h1>
            <div className={styles.rule} />
            <p className={styles.lead}>
              Search reports, contracts, invoices and photos across your
              projects — with answers that cite the exact source.
            </p>
          </div>

          <div className={styles.copyright}>
            © 2026 GroundedDoc · BuildCo · Sydney
          </div>
        </div>

        <div className={styles.panel}>
          <LoginActions />
        </div>
      </div>
    </div>
  );
}
