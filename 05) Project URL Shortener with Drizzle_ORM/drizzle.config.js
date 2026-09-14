import { defineConfig } from 'drizzle-kit';

process.loadEnvFile('.env');

export default defineConfig({
  out: './drizzle/migration',
  schema: './drizzle/schema.js',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
