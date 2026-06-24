import { notFound } from "next/navigation";

import { asDemoState, getWorkspaceData } from "@/lib/data";

import { WorkspaceShell } from "./_components/WorkspaceShell";
import styles from "./page.module.css";

// TODO(P4): remove `searchParams` and the `?state=` demo toggle once data is real.
interface WorkspacePageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ state?: string }>;
}

/**
 * Project workspace — the GroundedDoc chat over a project's documents. `projectId`
 * is the opaque `public_id` from the URL (never a uuid / org_id). A Server
 * Component: it awaits the workspace view model and hands it to the interactive
 * client shell. `error.tsx` / `loading.tsx` own the error and loading states; the
 * empty thread (no messages) is rendered inside the shell.
 *
 * TODO(P4): the `?state=` toggle (empty / error / happy) is throwaway four-state
 * scaffolding — it goes with the mock data layer.
 */
export default async function WorkspacePage({
  params,
  searchParams,
}: WorkspacePageProps) {
  const { projectId } = await params;
  // TODO(P4): drop the demo-state plumbing.
  const { state } = await searchParams;
  const demoState = asDemoState(state);

  const data = await getWorkspaceData(projectId, demoState);
  if (!data) {
    notFound();
  }

  return (
    <div className={styles.screen}>
      <WorkspaceShell data={data} />
    </div>
  );
}
