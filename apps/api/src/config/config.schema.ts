import z from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(8000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().default("some-secret"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z
    .string()
    .default("http://localhost:8000/auth/google/callback"),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_BUCKET: z.string(),
  S3_ENDPOINT: z.string().default("http://localhost:9000"),
});

export type Env = z.infer<typeof envSchema>;
