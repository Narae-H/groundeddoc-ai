"use client";

import { useState } from "react";
import type {
  ChatHistoryGroup,
  SwitcherProject,
  WorkspaceUser,
} from "@/types";

import styles from "./WorkspaceTopbar.module.css";

interface WorkspaceTopbarProps {
  projectName: string;
  org: string;
  user: WorkspaceUser;
  switcherProjects: SwitcherProject[];
  historyGroups: ChatHistoryGroup[];
  onToggleLeftPanel: () => void;
  onSelectProject: (publicId: string) => void;
  onNewProject: () => void;
  onNewChat: () => void;
  onShare: () => void;
  onSignOut: () => void;
}

type OpenMenu = "project" | "history" | "user" | null;

/**
 * The workspace top bar — the documents toggle, the project switcher, the chats
 * history, Share, and the account menu. A client island: it owns which menu is
 * open (local UI state) and emits selections / actions up to the shell.
 */
export function WorkspaceTopbar({
  projectName,
  org,
  user,
  switcherProjects,
  historyGroups,
  onToggleLeftPanel,
  onSelectProject,
  onNewProject,
  onNewChat,
  onShare,
  onSignOut,
}: WorkspaceTopbarProps) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [historySearch, setHistorySearch] = useState("");

  const toggle = (menu: Exclude<OpenMenu, null>) =>
    setOpenMenu((current) => (current === menu ? null : menu));
  const close = () => setOpenMenu(null);

  const starred = switcherProjects.filter((project) => project.starred);
  const others = switcherProjects.filter((project) => !project.starred);

  const query = historySearch.trim().toLowerCase();
  const filteredHistory = historyGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !query || item.title.toLowerCase().includes(query),
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className={styles.topbar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={onToggleLeftPanel}
          title="Toggle documents"
          aria-label="Toggle documents panel"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 6.5h16M4 12h16M4 17.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className={styles.anchor}>
          <button
            type="button"
            className={styles.projectTrigger}
            onClick={() => toggle("project")}
          >
            {/* TODO(P4): real org logo from storage. */}
            <img
              className={styles.orgMark}
              src="/buildco-mark.svg"
              alt=""
              width={26}
              height={26}
            />
            <span className={styles.projectName}>{projectName}</span>
            <svg
              className={`${styles.chevron} ${openMenu === "project" ? styles.chevronOpen : ""}`}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {openMenu === "project" ? (
            <>
              <div className={styles.scrim} onClick={close} />
              <div className={styles.menu}>
                {starred.length > 0 ? (
                  <>
                    <div className={styles.menuLabel}>Starred</div>
                    {starred.map((project) => (
                      <ProjectRow
                        key={project.publicId}
                        project={project}
                        starred
                        onSelect={() => {
                          close();
                          onSelectProject(project.publicId);
                        }}
                      />
                    ))}
                  </>
                ) : null}
                <div className={styles.menuLabel}>All projects</div>
                {others.map((project) => (
                  <ProjectRow
                    key={project.publicId}
                    project={project}
                    starred={false}
                    onSelect={() => {
                      close();
                      onSelectProject(project.publicId);
                    }}
                  />
                ))}
                <div className={styles.divider} />
                <button
                  type="button"
                  className={`${styles.menuRow} ${styles.menuRowAccent}`}
                  onClick={() => {
                    close();
                    onNewProject();
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className={styles.newProject}>New project</span>
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.anchor}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => toggle("history")}
            title="Chats"
            aria-label="Chats"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9.5L6 18.5V15H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.actionLabel}>Chats</span>
          </button>

          {openMenu === "history" ? (
            <>
              <div className={styles.scrim} onClick={close} />
              <div className={styles.historyMenu}>
                <div className={styles.historyTop}>
                  <button
                    type="button"
                    className={styles.newChat}
                    onClick={() => {
                      close();
                      onNewChat();
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    New chat
                  </button>
                </div>
                <div className={styles.historySearchWrap}>
                  <div className={styles.historySearch}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <input
                      className={styles.historyInput}
                      value={historySearch}
                      onChange={(event) => setHistorySearch(event.target.value)}
                      placeholder="Search chats"
                      aria-label="Search chats"
                    />
                  </div>
                </div>
                {filteredHistory.length > 0 ? (
                  <div className={styles.historyList}>
                    {filteredHistory.map((group) => (
                      <div key={group.label}>
                        <div className={styles.menuLabel}>{group.label}</div>
                        {group.items.map((item) => (
                          // TODO(P4): load the conversation route.
                          <button
                            key={item.id}
                            type="button"
                            className={styles.menuRow}
                            onClick={close}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M5 5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9.5L6 18.5V15H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span
                              className={`${styles.historyTitle} ${item.active ? styles.historyTitleActive : ""}`}
                            >
                              {item.title}
                            </span>
                            <span className={styles.historyTime}>{item.time}</span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.historyEmpty}>
                    No chats match your search.
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        <button
          type="button"
          className={styles.shareBtn}
          onClick={onShare}
          title="Share project"
          aria-label="Share project"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="8" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.8" />
            <path d="M2.6 18v-1A3.8 3.8 0 0 1 6.4 13.2h3.2A3.8 3.8 0 0 1 13.4 17v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M18 8v5M20.5 10.5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className={styles.actionLabel}>Share</span>
        </button>

        <div className={styles.anchor}>
          <button
            type="button"
            className={styles.avatar}
            onClick={() => toggle("user")}
            title={user.name}
            aria-label="Account"
          >
            {user.initials}
          </button>

          {openMenu === "user" ? (
            <>
              <div className={styles.scrim} onClick={close} />
              <div className={styles.userMenu}>
                <div className={styles.userHead}>
                  <span className={styles.avatarBig}>{user.initials}</span>
                  <div className={styles.userIdentity}>
                    <span className={styles.userName}>{user.name}</span>
                    <span className={styles.userEmail}>{user.email}</span>
                  </div>
                </div>
                <div className={styles.orgChip}>
                  {/* TODO(P4): real org logo from storage. */}
                  <img
                    className={styles.orgChipMark}
                    src="/buildco-mark.svg"
                    alt=""
                    width={22}
                    height={22}
                  />
                  <span className={styles.orgChipText}>
                    <strong>{org}</strong> workspace
                  </span>
                </div>
                <div className={styles.roleChip}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l7 2.5v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V5.5L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                  <span className={styles.roleName}>{user.role}</span>
                  <span className={styles.accessLabel}>{user.accessLabel}</span>
                </div>
                <div className={styles.accessHead}>Your access</div>
                <div className={styles.permissions}>
                  {user.permissions.map((permission, index) => (
                    <div key={index} className={styles.permission}>
                      <span
                        className={`${styles.permIcon} ${permission.allowed ? styles.permAllowed : styles.permDenied}`}
                        aria-hidden="true"
                      >
                        {permission.allowed ? "✓" : "✕"}
                      </span>
                      <span
                        className={permission.allowed ? styles.permText : styles.permTextMuted}
                      >
                        {permission.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={styles.confidential}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  <span>{user.confidentialNote}</span>
                </div>
                <div className={styles.divider} />
                <button
                  type="button"
                  className={styles.menuRow}
                  onClick={() => {
                    close();
                    onSignOut();
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 17l5-5-5-5M20 12H9M11 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Sign out
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProjectRow({
  project,
  starred,
  onSelect,
}: {
  project: SwitcherProject;
  starred: boolean;
  onSelect: () => void;
}) {
  return (
    <button type="button" className={styles.menuRow} onClick={onSelect}>
      <svg
        className={starred ? styles.starOn : styles.starOff}
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 3l2.6 5.7 6.2.7-4.6 4.2 1.2 6.1L12 16.9 6.6 19.7l1.2-6.1L3.2 9.4l6.2-.7L12 3Z"
          fill={starred ? "currentColor" : "none"}
          stroke={starred ? "none" : "currentColor"}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.projectRowName}>{project.name}</span>
      {project.active ? (
        <svg className={styles.activeTick} width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </button>
  );
}
