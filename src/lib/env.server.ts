import "server-only";

import { z, ZodError } from "zod";

import { clientEnv } from "./env";

const serverEnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1, "must not be empty"),
});

function formatIssues(error: ZodError): string {
  const lines = error.issues.map((issue) => {
    const path = issue.path.join(".") || "(root)";
    return `  - ${path}: ${issue.message}`;
  });
  return `Invalid or missing environment variables:\n${lines.join("\n")}`;
}

function parseServerEnv() {
  const result = serverEnvSchema.safeParse({
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  });
  if (!result.success) {
    throw new Error(formatIssues(result.error));
  }
  return result.data;
}

export const serverEnv = parseServerEnv();
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export { clientEnv };
export type { ClientEnv } from "./env";
