import { z } from "zod";

if (typeof window !== "undefined") throw new Error("src/env.ts is server-only");

// z.coerce.boolean() turns "false" into true, so parse booleans explicitly
const bool = z.enum(["true", "false"]).transform((v) => v === "true");

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_SECURE: bool,
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  SMTP_FROM: z
    .string()
    .regex(/^(?:[^<>]+<)?[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>?$/, "an address or 'Name <address>'"),

  CONTACT_TO: z.email(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment variables:", z.flattenError(parsed.error).fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
