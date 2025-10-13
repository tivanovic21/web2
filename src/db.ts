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

async function query(text: string, params?: any[]) {
  return db.query(text, params);
}

export const KoloRepository = {
  async findActive(): Promise<Kolo | null> {
    const res = await query('SELECT * FROM kolo WHERE is_active = true ORDER BY id DESC');
    if (res.rows.length === 0) return null;
    if (res.rows.length > 1) throw new Error('Više aktivnih kola pronađeno');
    return res.rows[0];
  },

  async findLast(): Promise<Kolo | null> {
    const res = await query('SELECT * FROM kolo ORDER BY id DESC LIMIT 1');
    if (res.rows.length === 0) throw new Error('Nema kola u bazi');
    return res.rows[0];
  },

  async findById(koloId: number): Promise<Kolo | null> {
    const res = await query('SELECT * FROM kolo WHERE id = $1', [koloId]);
    if (res.rows.length === 0) return null;
    if (res.rows.length > 1) throw new Error('Više kola s istim ID-em pronađeno');
    return res.rows[0];
  },

  async create(isActive: boolean): Promise<Kolo> {
    const res = await query('INSERT INTO kolo (is_active) VALUES ($1) RETURNING *', [isActive]);
    return res.rows[0];
  },

  async close(koloId: number): Promise<boolean> {
    try {
      await query('UPDATE kolo SET is_active = false WHERE id = $1', [koloId]);
      return true;
    } catch (error) {
      console.error('Error closing kolo:', error);
      return false;
    }
  }, 

  async findCurrent(): Promise<Kolo | null> {
    const res = await query ('SELECT * FROM kolo WHERE is_active = false AND dobitni_brojevi IS NULL ORDER BY id DESC');
    if (res.rows.length === 0) return null;
    if (res.rows.length > 1) throw new Error('Više trenutnih kola pronađeno');
    return res.rows[0];
  }, 

  async update(koloId: number, fieldsToUpdate: Partial<Kolo>): Promise<boolean> {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in fieldsToUpdate) {
      if (fieldsToUpdate.hasOwnProperty(key)) {
        fields.push(`${key} = $${index}`);
        values.push((fieldsToUpdate as any)[key]);
        index++;
      }
    }

    if (fields.length === 0) {
      return false;
    }

    const queryText = `UPDATE kolo SET ${fields.join(', ')} WHERE id = $${index}`;
    values.push(koloId);

    try {
      const result = await query(queryText, values);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Error updating kolo:', error);
      return false;
    }
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
  }, 

  async countByKoloId(koloId: number): Promise<number | null> {
    const res = await query('SELECT COUNT(*) FROM listic WHERE kolo_id = $1', [koloId]);
    if (res.rows.length === 0) return null;
    return parseInt(res.rows[0].count, 10);
  }, 

  async getAllByKoloId(koloId: number): Promise<Listic[]> {
    const res = await query('SELECT * FROM listic WHERE kolo_id = $1', [koloId]);
    return res.rows;
  }
}