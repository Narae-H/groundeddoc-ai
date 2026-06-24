import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import styles from "./not-found.module.css";

/** Root 404 — shown for unknown routes and triggered `notFound()` calls. */
export default function NotFound() {
  return (
    <section className={styles.notFound}>
      <EmptyState
        title="Page not found"
        description="The page you’re after doesn’t exist or may have moved."
        action={
          <Link href="/" className={styles.link}>
            Back to projects
          </Link>
        }
      />
    </section>
  );
}
