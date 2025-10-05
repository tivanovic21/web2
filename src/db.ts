import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: process.env.DB_SSL === 'true' ? true : false,
});

export async function query(text: string, params?: any[]) {
  return db.query(text, params);
}

export { db };