import type {
  AnswerBlock,
  AnswerSource,
  PromptSuggestion,
  WorkspaceMessage,
} from "@/types";
import { Logo } from "@/components/ui/Logo";

import { SourcePill } from "./SourcePill";
import styles from "./AnswerThread.module.css";

interface AnswerThreadProps {
  messages: WorkspaceMessage[];
  prompts: PromptSuggestion[];
  /** When true, an assistant turn is being composed ("Reading documents…"). */
  thinking?: boolean;
  /** Opens a cited source in the preview panel. */
  onOpenSource?: (source: AnswerSource) => void;
  /** Sends a suggested prompt from an empty-state card. */
  onSendPrompt?: (prompt: PromptSuggestion) => void;
}

/**
 * The answer thread — the empty prompt grid when there are no messages, otherwise
 * user/assistant turns rendering typed answer blocks (text / bullets / table),
 * grounded source pills, and a thinking indicator. Presentational; the open/send
 * handlers come from the client shell that owns the conversation state.
 */
export function AnswerThread({
  messages,
  prompts,
  thinking = false,
  onOpenSource,
  onSendPrompt,
}: AnswerThreadProps) {
  if (messages.length === 0 && !thinking) {
    return (
      <div className={styles.empty}>
        <Logo size={50} className={styles.logo} />
        <h2 className={styles.emptyTitle}>Ask anything about this site</h2>
        <p className={styles.emptyLead}>
          Your reports, contracts, invoices and site photos are indexed. Every
          answer cites the exact document and page.
        </p>
        <div className={styles.promptGrid}>
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              className={styles.promptCard}
              onClick={onSendPrompt ? () => onSendPrompt(prompt) : undefined}
            >
              <span
                className={`${styles.promptIcon} ${styles[`tint_${prompt.tint}`]}`}
                aria-hidden="true"
              >
                {prompt.icon}
              </span>
              <span className={styles.promptLabel}>{prompt.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.thread}>
      {messages.map((message) =>
        message.role === "user" ? (
          <div key={message.id} className={styles.userRow}>
            <div className={styles.userBubble}>{message.text}</div>
          </div>
        ) : (
          <div key={message.id} className={styles.aiRow}>
            <AiAvatar />
            <div className={styles.aiBubble}>
              {message.blocks.map((block, index) => (
                <AnswerBlockView key={index} block={block} />
              ))}
              {message.sources.length > 0 ? (
                <div className={styles.sources}>
                  <span className={styles.sourcesLabel}>Sources</span>
                  {message.sources.map((source, index) => (
                    <SourcePill
                      key={index}
                      source={source}
                      onOpen={onOpenSource}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ),
      )}

      {thinking ? (
        <div className={styles.aiRow}>
          <AiAvatar />
          <div className={styles.thinking} aria-live="polite">
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.thinkingLabel}>Reading documents…</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** The assistant avatar — a blue tile with the GroundedDoc spark. */
function AiAvatar() {
  return (
    <span className={styles.avatar} aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l2.1 5.4L19.5 10l-5.4 1.6L12 17l-2.1-5.4L4.5 10l5.4-1.6L12 3Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function AnswerBlockView({ block }: { block: AnswerBlock }) {
  if (block.type === "text") {
    return <p className={styles.text}>{block.text}</p>;
  }
  if (block.type === "bullets") {
    return (
      <ul className={styles.bullets}>
        {block.items.map((item, index) => (
          <li key={index} className={styles.bullet}>
            <span className={styles.bulletDot} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {block.columns.map((column, index) => (
              <th key={index} className={styles.th}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => {
            const isTotal =
              block.totalRow === true && rowIndex === block.rows.length - 1;
            return (
              <tr
                key={rowIndex}
                className={isTotal ? styles.totalRow : undefined}
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className={styles.td}>
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
