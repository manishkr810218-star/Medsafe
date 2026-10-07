import { Router } from 'express';
import { ah } from './async.js';

export function catalogRouter(pool) {
  const r = Router();

  r.get('/drugs', ah(async (_req, res) => {
    const [rows] = await pool.query('SELECT id, name, is_demo FROM drugs ORDER BY name');
    res.json(rows.map((d) => ({ id: d.id, name: d.name, isDemo: Boolean(d.is_demo) })));
  }));

  r.get('/foods', ah(async (_req, res) => {
    const [rows] = await pool.query('SELECT id, name_en, name_hi, is_demo FROM foods ORDER BY name_en');
    res.json(rows.map((f) => ({ id: f.id, name: { en: f.name_en, hi: f.name_hi }, isDemo: Boolean(f.is_demo) })));
  }));

  return r;
}
