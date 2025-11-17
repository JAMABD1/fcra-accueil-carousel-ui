import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Use Vite's environment variables (must be prefixed with VITE_)
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || import.meta.env.DATABASE_URL || '';

if (!DATABASE_URL) {
  console.warn('DATABASE_URL is not set. Database operations will fail.');
}

const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });
