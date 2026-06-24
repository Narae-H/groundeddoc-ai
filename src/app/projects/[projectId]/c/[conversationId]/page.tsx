import Link from "next/link";
import { notFound } from "next/navigation";

import { Composer, MessageList } from "@/components/chat";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  asDemoState,
  getConversationByPublicId,
  getConversationMessages,
} from "@/lib/data";

import styles from "./page.module.css";

// TODO(P4): remove `searchParams` and the `?state=` demo toggle once data is real.
interface ConversationPageProps {
  params: Promise<{ projectId: string; conversationId: string }>;
  searchParams: Promise<{ state?: string }>;
}

/**
 * A single conversation within a project — its transcript plus the composer.
 * `projectId` and `conversationId` are opaque `public_id`s from the URL. Server
 * Component: awaits the mock reads; `error.tsx` / `loading.tsx` own those states.
 */
export default async function ConversationPage({
  params,
  searchParams,
}: ConversationPageProps) {
  const { projectId, conversationId } = await params;
  // TODO(P4): drop the demo-state plumbing.
  const { state } = await searchParams;
  const demoState = asDemoState(state);

  // The conversation header is always read "happy": the demo state belongs to the
  // *messages* section (so `?state=empty` shows the empty-transcript EmptyState, and
  // `?state=error` degrades the messages read) — not to whether the conversation
  // exists. Both reads run in parallel; the not-found branch is kept after the await.
  const [conversation, messages] = await Promise.all([
    getConversationByPublicId(conversationId, "happy"),
    getConversationMessages(conversationId, demoState),
  ]);
  if (!conversation) {
    notFound();
  }

  return (
    <div className={styles.conversation}>
      <Link href={`/projects/${projectId}`} className={styles.back}>
        <span aria-hidden="true">←</span> Back to project
      </Link>

      <header className={styles.head}>
        <h1 className={styles.title}>
          {conversation.title ?? "Untitled conversation"}
        </h1>
      </header>

      {messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Ask a question to start this conversation."
        />
      ) : (
        <MessageList messages={messages} />
      )}

      <Composer placeholder="Ask a follow-up question…" />
    </div>
  );
}
