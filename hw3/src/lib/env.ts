import { z } from "zod";

// zod is a library for runtime data validation
// read more about zod here: https://zod.dev/
const envSchema = z.object({
  POSTGRES_URL: z.string().url(),
});

type Env = z.infer<typeof envSchema>;

export const env: Env = {
  POSTGRES_URL: process.env.POSTGRES_URL!,
};

// this would throw an error if the env variables don't match the schema
envSchema.parse(env);