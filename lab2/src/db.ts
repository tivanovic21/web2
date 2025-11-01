import { Pool } from 'pg';
import dotenv from 'dotenv';
import { Korisnik } from './types';

dotenv.config();

const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: process.env.DB_HOST == 'localhost' ? false : { rejectUnauthorized: false },
});

async function query(text: string, params?: any[]) {
  return db.query(text, params);
}

export const KorisnikRepository = {
  async createDemo(username: string, password: string, hash: string, contact: string): Promise<number> {
    const res = await query(`INSERT INTO korisnik (username, password, password_hash, contact) VALUES ($1, $2, $3, $4) RETURNING id`, [username, password, hash, contact]);
    return res.rows[0].id;
  },

  async getByUsername(username: string): Promise<Korisnik | null> {
    const res = await query(`SELECT * FROM korisnik WHERE username = $1`, [username]);
    return res.rows[0] ?? null;
  },

  async getById(id: number): Promise<Korisnik | null> {
    const res = await query(`SELECT * FROM korisnik WHERE id = $1`, [id]);
    return res.rows[0] ?? null;
  },

  async getContactByUsername(username: string, isSafe: boolean) {
    if (isSafe) {
      const response = await query("SELECT contact FROM korisnik WHERE username = $1", [username]);
      return response.rows[0]?.contact ?? null;
    } else {
      const sql = `SELECT contact FROM korisnik WHERE username = '${username}'`;
      const response = await query(sql);
      return response.rows[0]?.contact ?? null;
    }
  } 
}