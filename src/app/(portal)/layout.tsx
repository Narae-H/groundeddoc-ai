import { Header } from "@/components/layout";

import styles from "./layout.module.css";

/**
 * Portal chrome — the slim site Header, a centred content column, and the footer.
 * Scoped to the `(portal)` route group (the parentheses keep it out of the URL, so
 * the portal stays at `/`). Full-bleed routes (`projects/*`, `login`) live outside
 * this group and render without this chrome.
 */
export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        Answers are grounded in your documents and shown with their citations.
      </footer>
    </>
  );
}
