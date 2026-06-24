"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnswerSource, SourcePreview, WorkspaceData } from "@/types";
import { buildFallbackPreview } from "@/lib/preview";
import { AnswerThread, Composer } from "@/components/chat";

import { CreateProjectDialog } from "./CreateProjectDialog";
import { DocumentLibrary } from "./DocumentLibrary";
import { ShareDialog } from "./ShareDialog";
import { SourcePreviewPanel } from "./SourcePreviewPanel";
import { Toast } from "./Toast";
import { UploadModal } from "./UploadModal";
import { WorkspaceTopbar } from "./WorkspaceTopbar";
import styles from "./WorkspaceShell.module.css";

interface WorkspaceShellProps {
  data: WorkspaceData;
}

type ActiveModal = "upload" | "share" | "createProject" | null;

const TOAST_MS = 2400;

/**
 * The interactive workspace island. The server page fetches `WorkspaceData` and
 * hands it here; this owns the local UI state the design drives — document scope,
 * which source is previewed, the left-panel collapse, the open dialog, and the
 * toast. Real side effects (send, upload, remove, sign-out, invite, copy) are P4
 * stubs surfaced as toasts; menus, modals and the preview toggle are real.
 */
export function WorkspaceShell({ data }: WorkspaceShellProps) {
  const router = useRouter();

  const [scope, setScope] = useState<ReadonlySet<string>>(new Set());
  const [preview, setPreview] = useState<SourcePreview | null>(
    data.initialPreview,
  );
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  const toggleScope = useCallback((documentId: string) => {
    setScope((current) => {
      const next = new Set(current);
      if (next.has(documentId)) next.delete(documentId);
      else next.add(documentId);
      return next;
    });
  }, []);

  // Seeded cited passages, keyed by document id; opens fall back to a generic preview.
  const previewByDocument = useMemo(() => {
    const map = new Map<string, SourcePreview>();
    if (data.initialPreview) map.set(data.initialPreview.documentId, data.initialPreview);
    return map;
  }, [data.initialPreview]);

  const openSource = useCallback(
    (source: AnswerSource) => {
      const existing = previewByDocument.get(source.documentId);
      setPreview(
        existing ??
          buildFallbackPreview({
            documentId: source.documentId,
            name: source.label,
            pageLabel: source.page,
            contextLabel: source.verified ? "cited passage" : "document preview",
          }),
      );
    },
    [previewByDocument],
  );

  const openDocument = useCallback(
    (documentId: string) => {
      const existing = previewByDocument.get(documentId);
      const group = data.documentGroups.find((candidate) =>
        candidate.documents.some((document) => document.id === documentId),
      );
      const document = group?.documents.find((item) => item.id === documentId);
      const isImage = document?.kind === "IMG";
      setPreview(
        existing ??
          buildFallbackPreview({
            documentId,
            name: document?.name ?? "Document",
            kind: document?.kind ?? "PDF",
            pageLabel: "Page 1",
            contextLabel: "document preview",
            isImage,
            imageCaption: isImage
              ? `${document?.name ?? "Site photo"} · captured on site`
              : "",
          }),
      );
    },
    [data.documentGroups, previewByDocument],
  );

  const scopeLabel =
    scope.size > 0
      ? `Scoped to ${scope.size} document${scope.size > 1 ? "s" : ""}`
      : `Asking across all ${data.documentCount} documents`;

  return (
    <div className={styles.app}>
      <WorkspaceTopbar
        projectName={data.projectName}
        org={data.org}
        user={data.user}
        switcherProjects={data.switcherProjects}
        historyGroups={data.historyGroups}
        onToggleLeftPanel={() => setLeftCollapsed((collapsed) => !collapsed)}
        onSelectProject={(publicId) => router.push(`/projects/${publicId}`)}
        onNewProject={() => setActiveModal("createProject")}
        // TODO(P4): start a fresh conversation route.
        onNewChat={() => flashToast("New chat is wired in P4")}
        onShare={() => setActiveModal("share")}
        // TODO(P4): sign out via Supabase Auth.
        onSignOut={() => router.push("/login")}
      />

      <div className={styles.row}>
        {!leftCollapsed ? (
          <DocumentLibrary
            groups={data.documentGroups}
            documentCount={data.documentCount}
            hiddenByRole={data.hiddenByRole}
            scope={scope}
            canManageDocs={data.user.canManageDocs}
            onToggleScope={toggleScope}
            onOpenDocument={openDocument}
            onUpload={() => setActiveModal("upload")}
            // TODO(P4): navigate back to the portal.
            onBackToPortal={() => router.push("/")}
          />
        ) : null}

        <div className={styles.chatColumn}>
          <div className={styles.thread}>
            <AnswerThread
              messages={data.messages}
              prompts={data.prompts}
              onOpenSource={openSource}
              // TODO(P4): send the prompt to the ask action.
              onSendPrompt={(prompt) =>
                flashToast(`“${prompt.short}” is wired in P4`)
              }
            />
          </div>
          <div className={styles.composer}>
            <Composer
              placeholder={
                scope.size > 0
                  ? `Ask about the ${scope.size} selected document${scope.size > 1 ? "s" : ""}…`
                  : "Ask about your site documents…"
              }
              scopeLabel={scopeLabel}
              scopeActive={scope.size > 0}
              onClearScope={() => setScope(new Set())}
              chips={data.messages.length > 0 ? data.prompts : undefined}
              canAttach={data.user.canManageDocs}
              onAttach={() => setActiveModal("upload")}
              // TODO(P4): wire send to the ask-a-question action.
              onSend={() => flashToast("Answering is wired in P4")}
              onSendPrompt={(prompt) =>
                flashToast(`“${prompt.short}” is wired in P4`)
              }
            />
          </div>
        </div>

        {preview ? (
          <SourcePreviewPanel
            preview={preview}
            canManageDocs={data.user.canManageDocs}
            onClose={() => setPreview(null)}
            // TODO(P4): remove the document via the data layer.
            onRemove={(documentId) => {
              setPreview(null);
              setScope((current) => {
                const next = new Set(current);
                next.delete(documentId);
                return next;
              });
              flashToast("Removing documents is wired in P4");
            }}
          />
        ) : null}
      </div>

      {activeModal === "upload" ? (
        <UploadModal
          projectName={data.projectName}
          org={data.org}
          onClose={() => setActiveModal(null)}
          // TODO(P4): upload to Supabase Storage and index.
          onConfirm={(fileName, category) => {
            setActiveModal(null);
            flashToast(`“${fileName}” → ${category} (upload wired in P4)`);
          }}
        />
      ) : null}

      {activeModal === "share" ? (
        <ShareDialog
          projectName={data.projectName}
          org={data.org}
          members={data.members}
          onClose={() => setActiveModal(null)}
          // TODO(P4): copy the real share link.
          onCopyLink={() => flashToast("Project link copied to clipboard")}
          // TODO(P4): send the invitation.
          onInvite={(email) => flashToast(`Invitation sent to ${email}`)}
        />
      ) : null}

      {activeModal === "createProject" ? (
        <CreateProjectDialog
          onClose={() => setActiveModal(null)}
          // TODO(P4): create the project via the data layer.
          onCreate={(name) => {
            setActiveModal(null);
            flashToast(`Project “${name}” created (wired in P4)`);
          }}
        />
      ) : null}

      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}
