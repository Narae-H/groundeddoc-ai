import type { Message } from "@/types";

import { CitationChip } from "./CitationChip";
import styles from "./MessageList.module.css";

interface MessageListProps {
  messages: Message[];
}

/**
 * The transcript of a conversation — user turns and grounded assistant answers, the
 * latter carrying their citation chips. Presentational; runs on the server.
 */
export function MessageList({ messages }: MessageListProps) {
  return (
    <ol className={styles.list}>
      {messages.map((message) => (
        <li
          key={message.id}
          className={`${styles.turn} ${styles[message.role]}`}
        >
          <p className={styles.content}>{message.content}</p>

          {message.role === "assistant" && message.grounded === false ? (
            <p className={styles.ungrounded}>
              No grounded answer — nothing in the project’s documents supports this.
            </p>
          ) : null}

          {message.citations.length > 0 ? (
            <div className={styles.citations}>
              {message.citations.map((citation, index) => (
                <CitationChip
                  key={`${message.id}-${index}`}
                  citation={citation}
                />
              ))}
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
