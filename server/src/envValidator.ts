
// Importing necessary libraries
import { z } from 'zod';
import { config } from './config';

// Define the schema for environment variable validation
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  HUGGING_FACE_API_TOKEN: z.string().min(10),
  GITHUB_API: z.string().min(10),
  JWT_SECRET: z.string().min(10),
  BCRYPT_SALT_ROUNDS: z.string().regex(/^[0-9]+$/),
  PORT: z.string().regex(/^[0-9]+$/),
  REFRESH_TOKEN_EXPIRES_IN: z.string().regex(/^\d+[smhdw]$/), // Supports time format (e.g., 7d, 1h, etc.)
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.string().regex(/^[0-9]+$/),
  REDIS_PASSWORD: z.string().optional(),
});

// Validate the environment variables against the schema
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

// Ensure config aligns with the parsed env
export const env = {
  ...config,
  ...parsedEnv.data,
};
