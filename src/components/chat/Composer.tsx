"use client";

import { useRef, useState } from "react";
import type { PromptSuggestion } from "@/types";

import styles from "./Composer.module.css";

interface ComposerProps {
  placeholder?: string;
  /** Scope-bar copy ("Asking across all 7 documents"). Hidden when absent. */
  scopeLabel?: string;
  /** When true, the scope bar shows the active (blue) treatment + Clear action. */
  scopeActive?: boolean;
  /** Clears the document scope. */
  onClearScope?: () => void;
  /** Quick-prompt chips (shown once a conversation has started). */
  chips?: PromptSuggestion[];
  /** Whether the attach button shows (the role can manage docs). */
  canAttach?: boolean;
  /** Opens the upload modal. */
  onAttach?: () => void;
  /** Sends a free-typed question. */
  onSend?: (text: string) => void;
  /** Sends a chip's prompt. */
  onSendPrompt?: (prompt: PromptSuggestion) => void;
}

const MAX_TEXTAREA_HEIGHT = 96;

/**
 * The question composer — a scope bar, quick-prompt chips, an attach button, an
 * auto-growing textarea, and the send button, with the grounding disclaimer
 * beneath. A client leaf: it owns the draft and grows the textarea locally. The
 * send/attach side effects are supplied by the workspace shell.
 *
 * TODO(P4): wire `onSend` to the ask-a-question Server Action / AI route.
 * TODO(P4): contract asymmetry — the conversation route renders this *without* an
 * `onSend` (its send is inert), while the workspace shell passes a real handler.
 * Unify on a single send contract in P4. Do NOT paper over this now by wiring a stub
 * handler on the conversation route — the visual pass keeps its send inert.
 */
export function Composer({
  placeholder = "Ask about your site documents…",
  scopeLabel,
  scopeActive = false,
  onClearScope,
  chips,
  canAttach = false,
  onAttach,
  onSend,
  onSendPrompt,
}: ComposerProps) {
  const [draft, setDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const grow = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    onSend?.(text);
    setDraft("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className={styles.wrap}>
      {scopeLabel ? (
        <div
          className={`${styles.scopeBar} ${scopeActive ? styles.scopeActive : ""}`}
        >
          <span className={styles.scopeDot} aria-hidden="true" />
          <span className={styles.scopeText}>{scopeLabel}</span>
          {scopeActive && onClearScope ? (
            <button
              type="button"
              className={styles.clear}
              onClick={onClearScope}
            >
              Clear
            </button>
          ) : null}
        </div>
      ) : null}

      {chips && chips.length > 0 ? (
        <div className={styles.chips}>
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={styles.chip}
              onClick={onSendPrompt ? () => onSendPrompt(chip) : undefined}
            >
              {chip.short}
            </button>
          ))}
        </div>
      ) : null}

      <div className={styles.bar}>
        {canAttach ? (
          <button
            type="button"
            className={styles.attach}
            onClick={onAttach}
            aria-label="Attach a document"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 11.5l-7.8 7.8a4.5 4.5 0 0 1-6.4-6.4l8-8a3 3 0 0 1 4.3 4.3l-8 8a1.5 1.5 0 0 1-2.2-2.2l7.3-7.3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
        <textarea
          ref={textareaRef}
          className={styles.input}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            grow(event.target);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
          placeholder={placeholder}
          rows={1}
        />
        <button
          type="button"
          className={styles.send}
          onClick={send}
          disabled={draft.trim().length === 0}
          aria-label="Send"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h13M12 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p className={styles.disclaimer}>
        GroundedDoc answers from your uploaded documents and may need verification.
      </p>
    </div>
  );
}
