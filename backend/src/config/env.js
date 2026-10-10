
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(9000),
    CORS_ORIGIN: z.string().default("http://localhost:5173"),
    DATABASE_URL: z.string().min(1),
    CLERK_PUBLISHABLE_KEY: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    OLLAMA_URL: z.string().default("http://localhost:11434"),
    LLM_MODEL: z.string().default("llama3.2:3b"),
    USE_LLM: z.enum(["true", "false"]).default("false"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment variables:");
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = result.data;