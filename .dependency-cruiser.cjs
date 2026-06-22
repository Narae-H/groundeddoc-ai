/**
 * dependency-cruiser — structural enforcement of the GroundedDoc layering.
 * Mirrors the `layers` skill (one-way import) and the module-boundaries skill.
 * Run: npm run depcruise
 */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Cycles make modules impossible to reason about and break tree-shaking.",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-orphans",
      severity: "warn",
      comment: "Orphan module — not imported anywhere. Dead code or a missing wire-up.",
      from: { orphan: true, pathNot: ["\\.d\\.ts$", "(^|/)index\\.[tj]sx?$"] },
      to: {},
    },
    {
      name: "layer-app-only-down",
      severity: "error",
      comment: "app may use components/lib/types, but nothing imports back into app (one-way rule).",
      from: { pathNot: "^src/app" },
      to: { path: "^src/app" },
    },
    {
      name: "components-no-app",
      severity: "error",
      comment: "components never import from app (one-way rule).",
      from: { path: "^src/components" },
      to: { path: "^src/app" },
    },
    {
      name: "lib-data-ai-are-siblings",
      severity: "error",
      comment: "lib/data and lib/ai are siblings — neither imports the other (one-way rule).",
      from: { path: "^src/lib/(data|ai)" },
      to: {
        path: "^src/lib/(data|ai)",
        pathNot: "^src/lib/$1",
      },
    },
    {
      name: "supabase-never-up-to-data",
      severity: "error",
      comment: "lib/supabase provides clients; it must never import lib/data (one-way rule).",
      from: { path: "^src/lib/supabase" },
      to: { path: "^src/lib/(data|ai)" },
    },
    {
      name: "types-depends-on-nothing-internal",
      severity: "error",
      comment: "types sits at the end of the chain — depended upon, never depends (one-way rule).",
      from: { path: "^src/types" },
      to: { path: "^src/(app|components|lib)" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
    },
  },
};
