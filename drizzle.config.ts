import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db',
  dialect: 'postgresql',
  dbCredentials: {
    // Utilise la clé Neon que vous avez configurée dans l'Option A
    url: process.env.VITE_DATABASE_URL || "postgresql://neondb_owner:npg_ks6zMqvGPgb0@ep-floral-sunset-as19h8yx-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
});