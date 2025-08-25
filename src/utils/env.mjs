import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    DATABASE_URL: z.string().url(),
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),

    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string(),

    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_GITHUB_CLIENT_ID: z.string(),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
  },
  runtimeEnv: {
    GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
    HASURA_ADMIN_SECRET: process.env.HASURA_ADMIN_SECRET,
    HASURA_JWT_SECRET_TYPE: process.env.HASURA_JWT_SECRET_TYPE,
    HASURA_JWT_SECRET_KEY: process.env.HASURA_JWT_SECRET_KEY,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    DATABASE_URL: process.env.DATABASE_URL,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',

    NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
});
