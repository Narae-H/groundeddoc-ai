---
name: error-handling
description: Error & resilience conventions for GroundedDoc — error.tsx boundaries, normalised errors, and graceful degradation of the data/AI sections. Consult when adding routes, data/AI calls, or handling failures.
---

# Error handling & resilience

**Goal:** a failure in one section — a Supabase read, a Claude call, citation verification — degrades *that section only*, never the whole page. The BE-independent shell (header, nav, static content) always renders.

This complements the structure rules in the [`layers`](../layers/) skill; it does not restate them.

## 1. Boundaries (Next.js App Router)

- **Per-segment `error.tsx`** for fault isolation, plus a root **`global-error.tsx`** and **`not-found.tsx`**. A thrown error is caught by the *nearest* `error.tsx` and replaced with a fallback; the rest of the page survives.
- **Place boundaries at route-group level.** Too high → one failure drops the whole app; too low → duplicated boilerplate.
- **`loading.tsx` per segment** + `<Suspense>` around slow, data-dependent sections so the static shell streams in first and a slow fetch never blocks it.
  - This is page-data streaming (RSC), **not** AI token streaming — AI answers stay non-streaming (verify-then-return, see [`docs/DECISIONS.md`](../../../docs/DECISIONS.md) #5).

## 2. Normalise errors at the boundary

- Convert raw failures — Supabase errors, AI SDK errors, grounding/citation-verify failures — into a **single app error shape inside `lib/`**. Components never see a raw SDK/HTTP error.
- Set **timeouts** on outbound calls in `lib/ai` and `lib/data` so a dead dependency fails fast into a fallback instead of hanging.
- Surface failures through the shared `components/ui/ErrorState` — one consistent error UI.

## 3. Critical vs enhancement

- Classify each data section: **critical** ("the page can't exist without it") vs **enhancement** ("nice to have").
- Enhancement sections must **gracefully degrade** — each ships all three of **error / empty / loading** states.
- The AI answer is the product's core, yet a single answer failure shows `ErrorState` *in that panel*, not a page crash.

## 4. Real 404s

- A missing resource → `notFound()` → `not-found.tsx`. Never a soft 404 ("`200` + a not-found message"). Wrong status hurts both correctness and crawlers.

## 5. Honest caveat

`error.tsx` isolates faults but does **not** make the app data-independent for free. The guarantee is:

- ✅ a dependency failure doesn't kill the FE process/deploy,
- ✅ only the **data-dependent section** degrades, not the whole page,
- ✅ the static shell keeps working,
- ⚠️ you can't show the freshest BE data when the BE is down — you fall back to a clean **error / empty** state instead.

That outcome is *earned by implementation*, not granted by folders: a BE-independent static shell, error/empty/loading on every data section, and global timeouts. Review for the implementation, not just the folder layout.
