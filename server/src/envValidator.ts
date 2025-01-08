
import { z } from 'zod';
import { config } from './config';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
  BCRYPT_SALT_ROUNDS: z.string().regex(/^[0-9]+$/),
  PORT: z.string().regex(/^[0-9]+$/),
});

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