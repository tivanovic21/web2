import { Express } from 'express';
import { query } from './db';

export function registerApi(app: Express) {
  app.get('/api/ping', (req, res) => res.send('pong'));
  app.get('/api/dbping', async (req, res) => {
    try {
      const result = await query('SELECT NOW()');
      res.json(result.rows[0]); 
    } catch (err) {
      console.error('Database error: ', err);
      res.status(500).send('Database error');
    }
  });
}