# 🏗️ GroundedDoc

[![Built with Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-D97757?logo=anthropic&logoColor=white)](https://claude.com/claude-code)
[![Powered by Cursor](https://img.shields.io/badge/Powered%20by-Cursor-000000?logo=cursor&logoColor=white)](https://cursor.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19.2](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

> 🤖 **Built with AI** — every line of this project was written with **Claude Code** + **Cursor** in the loop.

A mini app for the construction industry: upload a construction document (EBA, subcontract, or award), and the AI reads it and answers your questions in plain English — every answer backed by a citation to the source text. Think of it as an "AI Construction Expert" you can talk to about your own paperwork.

**[🚀 Live demo →](https://example.com)** <!-- TODO: replace with the deployed Vercel URL -->

## 📸 Screenshots

<!-- TODO: add screenshots once the UI is built. Drop image files in docs/screenshots/ and reference them here. -->

| Upload | Chat with citations |
| --- | --- |
| ![Upload a document](docs/screenshots/upload.png) | ![Grounded answer with citation](docs/screenshots/chat.png) |

## ✨ What it does

- 📤 **Upload** a construction document (EBA, subcontract, award).
- 💬 **Ask** questions in plain language.
- 🔎 **Get grounded answers** — the AI replies in plain English and cites the exact passage it relied on, so you can verify every claim against the source.

## 🤖 Built with AI

This project was developed with AI coding tools as part of the workflow — the AI isn't just *in* the product, it *built* the product:

- 🧠 **Claude Code** — Anthropic's agentic CLI, used for planning, implementation, and refactoring.
- ⌨️ **Cursor** — AI-assisted editor, used for in-editor pair programming.

Using AI tooling end to end is itself part of the demonstration: shipping a working, well-architected product quickly with AI orchestration in the loop. 🚢

## 🧰 Tech stack

| Area | Technology | Version | Notes |
| --- | --- | --- | --- |
| Frontend | Next.js (App Router, Server Actions, RSC) | 16 | Server logic runs as Server Actions / Route Handlers. |
| UI | React | 19.2 | Built on the Next 16 App Router, using concurrent features. |
| Language | TypeScript (strict) | 5.x | `strict` mode on. |
| AI orchestration | Vercel AI SDK | 6 | Structured output and streaming — the core of how the model is wired in, rather than a raw `fetch`. |
| AI model | Anthropic Claude API | — | Called via the AI SDK. |
| Database / Data | Supabase (Postgres) | — | Persists documents and conversations. |
| Auth | Supabase Auth | — | Single-user login to protect API credits; extends cleanly to production RLS. |
| Storage | Supabase Storage | — | Stores the original uploaded files. |
| Deploy | Vercel | — | Live demo link plus CI/CD. |

## 🔐 Environment

Copy [`.env.local.example`](.env.local.example) to `.env.local` at the project root and fill in real values for Supabase and Anthropic. The app validates env vars at boot via `src/lib/env.ts` (client) and `src/lib/env.server.ts` (server) — if anything is missing or invalid, boot fails fast with a list of offending variables.

`.env.local` itself stays out of git (see `.gitignore`). For deployment, set the same variables in **Vercel → Project Settings → Environment Variables**. For CI (GitHub Actions), add them as repo or organisation **secrets** under the same names.

## 🛠️ Getting started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit.

## ▲ Deploy on Vercel

The app is deployed on [Vercel](https://vercel.com), which also provides the live demo link and CI/CD pipeline.
