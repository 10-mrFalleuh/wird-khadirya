import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';

const databaseUrl = import.meta.env.VITE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "La variable d'environnement VITE_DATABASE_URL est manquante dans le fichier .env"
  );
}

const sql = neon(databaseUrl);
export const db = drizzle(sql);

console.log('Neon Database (via Drizzle) correctement initialisée !');