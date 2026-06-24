import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GroundedDoc",
  description:
    "Ask questions about your documents, answered only from cited passages.",
  icons: {
    icon: "/favicon.svg",
  },
};

/**
 * Root layout — the document shell only (`<html>`/`<body>`, the font variable, and
 * global styles). It carries no app chrome: the portal's Header/footer live in the
 * `(portal)` route-group layout, and the full-bleed `projects/*` and `login` routes
 * render edge-to-edge. The favicon is wired here via `metadata.icons`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
