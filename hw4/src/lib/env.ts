import { z } from "zod";

const envSchema = z.object({
  POSTGRES_URL: z.string().url(),
});

type Env = z.infer<typeof envSchema>;

export const env: Env = {
  POSTGRES_URL: process.env.POSTGRES_URL!,
};

// this would throw an error if the env variables don't match the schema
envSchema.parse(env);