import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { asDemoState, getProjects } from "@/lib/data";

import styles from "./page.module.css";

// TODO(P4): remove `searchParams` and the `?state=` demo toggle once data is real.
interface PortalPageProps {
  searchParams: Promise<{ state?: string }>;
}

/**
 * Portal — the list of projects the org can open. Server Component: it awaits the
 * (mock) data read directly. The `error` state is thrown by the mock and caught by
 * `error.tsx`; the `loading` state is shown by `loading.tsx`.
 */
export default async function PortalPage({ searchParams }: PortalPageProps) {
  // TODO(P4): drop the demo-state plumbing; just `await getProjects()`.
  const { state } = await searchParams;
  const projects = await getProjects(asDemoState(state));

  return (
    <section className={styles.portal}>
      <header className={styles.head}>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.subtitle}>
          A project is a scope of documents. Open one to ask grounded questions.
        </p>
      </header>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create a project to group documents and start asking questions."
        />
      ) : (
        <ul className={styles.grid}>
          {projects.map((project) => (
            <li key={project.public_id}>
              <Link
                href={`/projects/${project.public_id}`}
                className={styles.cardLink}
              >
                <Card>
                  <span className={styles.cardName}>{project.name}</span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
