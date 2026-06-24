"use client";

import { useState } from "react";
import type { WorkspaceMember } from "@/types";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/CloseIcon";

import styles from "./ShareDialog.module.css";

interface ShareDialogProps {
  projectName: string;
  org: string;
  members: WorkspaceMember[];
  onClose: () => void;
  /** Copies the share link. Side effect is a P4 stub the shell toasts. */
  onCopyLink: () => void;
  /** Invites a teammate by email. Side effect is a P4 stub. */
  onInvite: (email: string) => void;
}

/** Initials from a display name. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * The Share dialog — invite by email, the people-with-access list, and the
 * org link-sharing toggle with copy. A client island that owns the invite draft
 * and the link toggle; invite/copy are P4 stubs surfaced as toasts by the shell.
 */
export function ShareDialog({
  projectName,
  org,
  members,
  onClose,
  onCopyLink,
  onInvite,
}: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const [linkOn, setLinkOn] = useState(true);

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.headingText}>
            <span className={styles.title}>Share project</span>
            <span className={styles.subtitle}>{projectName}</span>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.inviteRow}>
            <input
              className={styles.inviteInput}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Invite people by email"
              aria-label="Invite people by email"
              type="email"
            />
            <Button
              variant="primary"
              size="sm"
              disabled={email.trim().length === 0}
              onClick={() => {
                onInvite(email.trim());
                setEmail("");
              }}
            >
              Invite
            </Button>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTitle}>People with access</span>
            <div className={styles.members}>
              {members.map((member) => (
                <div key={member.email} className={styles.member}>
                  <span className={styles.memberAvatar} aria-hidden="true">
                    {initials(member.name)}
                  </span>
                  <div className={styles.memberText}>
                    <span className={styles.memberName}>
                      {member.you ? `${member.name} (You)` : member.name}
                    </span>
                    <span className={styles.memberEmail}>{member.email}</span>
                  </div>
                  <span className={styles.memberRole}>{member.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.linkCard}>
            <div className={styles.linkRow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div className={styles.linkText}>
                <span className={styles.linkTitle}>
                  Anyone at {org} with the link
                </span>
                <span className={styles.linkMeta}>
                  {linkOn ? "Can view · expires never" : "Link sharing is off"}
                </span>
              </div>
              <button
                type="button"
                className={`${styles.switch} ${linkOn ? styles.switchOn : ""}`}
                role="switch"
                aria-checked={linkOn}
                aria-label="Link sharing"
                onClick={() => setLinkOn((on) => !on)}
              >
                <span className={styles.switchKnob} />
              </button>
            </div>
            <div className={styles.linkActions}>
              <Button variant="utility" size="sm" onClick={onCopyLink}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9.5 9.5h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  <path d="M6 14.5H5.5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                Copy link
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
