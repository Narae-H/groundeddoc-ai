---
name: style-consumption
description: Style consumption rules for the GroundedDoc app — consume globals.css design tokens, no magic values, CSS Modules (no Tailwind / CSS-in-JS). Consult when styling a component or adding a token.
---

# Style consumption

How components consume the visual system (step 8 of the architecture order). Token *definitions* live in `src/app/globals.css`; the design source, token table, and prototype are reference — see [`docs/DESIGN.md`](../../../docs/DESIGN.md). The `25-style-curator` agent **owns** the token layer; this skill is the rules anyone styling a component follows.

## Rules

- **Tokens over magic values.** Every colour, spacing, radius, or shadow comes from a CSS custom property (`var(--token)`). A raw hex or pixel value in a component is a smell — promote it to a token in `globals.css`.
- **CSS Modules for components; plain CSS for globals and resets.** **No Tailwind, no CSS-in-JS.** (Rationale in [`docs/DECISIONS.md`](../../../docs/DECISIONS.md).)
- **Design source of truth.** The Notion design is imported via `getdesign` to `design.md` at the project root (canonical, never hand-edited); tokens are mirrored into `src/app/globals.css`. Don't redraw the system by hand.
- **Keep the existing Next font setup** — don't re-add font loading.

Adding, renaming, or changing tokens themselves is the `25-style-curator` agent's job — defer to it for the token layer.
