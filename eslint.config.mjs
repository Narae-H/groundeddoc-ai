import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

// Layer elements, most-specific first (boundaries matches the first hit).
// Mirrors the one-way import rule in the `layers` skill and the
// barrel rule in .claude/skills/module-boundaries/.
// Folder mode (the default): each pattern names the element's *folder*; all files
// under it form one element, so intra-module imports (a sibling file or its CSS
// module) are internal and skipped by the boundaries rules. The `domain` capture
// keeps each `components/<domain>` a distinct element for cross-module rules.
const elements = [
  { type: "ui", pattern: "src/components/ui" },
  { type: "domain", pattern: "src/components/*", capture: ["domain"] },
  { type: "app", pattern: "src/app" },
  { type: "lib-data", pattern: "src/lib/data" },
  { type: "lib-ai", pattern: "src/lib/ai" },
  { type: "lib-supabase", pattern: "src/lib/supabase" },
  { type: "lib-shared", pattern: "src/lib/*" },
  { type: "types", pattern: "src/types" },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": elements,
      "boundaries/include": ["src/**/*"],
    },
    rules: {
      // Direction: each layer may only import the layers below it (structure skill).
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["ui", "domain", "lib-data", "lib-ai", "lib-shared", "types"] },
            { from: "domain", allow: ["ui", "lib-data", "lib-ai", "lib-shared", "types"] },
            { from: "ui", allow: ["lib-shared", "types"] },
            { from: "lib-data", allow: ["lib-supabase", "lib-shared", "types"] },
            { from: "lib-ai", allow: ["lib-shared", "types"] },
            { from: "lib-supabase", allow: ["lib-shared", "types"] },
            { from: "lib-shared", allow: ["types"] },
            // types imports nothing internal — it sits at the end of the chain.
          ],
        },
      ],
      // Surface: a module is reachable only through its index.ts barrel (no deep imports).
      "boundaries/entry-point": [
        "error",
        {
          default: "disallow",
          rules: [
            { target: ["lib-data", "lib-ai", "lib-supabase", "domain"], allow: "index.{ts,tsx}" },
            // ui primitives and flat lib utils are single files / open imports.
            { target: ["ui", "lib-shared", "types", "app"], allow: "**" },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
