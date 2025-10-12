import { Pool } from 'pg';
import dotenv from 'dotenv';
import { Kolo, Listic } from './types';

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

export const KoloRepository = {
  async findActive(): Promise<Kolo | null> {
    const res = await query('SELECT * FROM kolo WHERE is_active = true ORDER BY id DESC LIMIT 1');
    if (res.rows.length === 0) return null;
    if (res.rows.length > 1) throw new Error('Multiple active rounds found');
    return res.rows[0];
  }
}

export const ListicRepository = {
  async create(uuid: string, lotoBrojevi: number[], documentId: string, koloId: number, korisnikId: string): Promise<boolean> {
    try {
      await query(
        'INSERT INTO listic (uuid, loto_brojevi, document_id, kolo_id, korisnik_id) VALUES ($1, $2, $3, $4, $5)',
        [uuid, lotoBrojevi, documentId, koloId, korisnikId]
      );
      return true;
    } catch (error) {
      console.error('Error creating listic:', error);
      return false;
    }
  },

  async findByUUID(uuid: string): Promise<Listic | null> {
    const res = await query('SELECT * FROM listic WHERE uuid = $1', [uuid]);
    if (res.rows.length === 0) return null;
    if (res.rows.length > 1) throw new Error('Više listića s istim UUID-om');
    return res.rows[0];
  }
}