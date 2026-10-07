import { Router } from 'express';
import { ah } from './async.js';
import { cleanText } from '../utils/validate.js';
import { lookupRxNorm } from '../services/rxNormService.js';

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

  r.get('/graph', ah(async (_req, res) => {
    const [[drugs], [foods], [drugDrug], [drugFood]] = await Promise.all([
      pool.query('SELECT id, name, is_demo FROM drugs ORDER BY name'),
      pool.query('SELECT id, name_en, name_hi, is_demo FROM foods ORDER BY name_en'),
      pool.query('SELECT id, drug_a_id, drug_b_id, severity, is_demo FROM drug_interactions ORDER BY id'),
      pool.query('SELECT id, drug_id, food_id, severity, is_demo FROM drug_food_interactions ORDER BY id'),
    ]);
    res.json({
      nodes: [
        ...drugs.map((d) => ({ id: d.id, type: 'drug', name: d.name, isDemo: Boolean(d.is_demo), standardCode: null })),
        ...foods.map((f) => ({ id: f.id, type: 'food', name: { en: f.name_en, hi: f.name_hi }, isDemo: Boolean(f.is_demo) })),
      ],
      edges: [
        ...drugDrug.map((e) => ({ id: `dd-${e.id}`, type: 'drug-drug', source: e.drug_a_id, target: e.drug_b_id, severity: e.severity, provenance: 'Fictional demo seed', isDemo: Boolean(e.is_demo) })),
        ...drugFood.map((e) => ({ id: `df-${e.id}`, type: 'drug-food', source: e.drug_id, target: e.food_id, severity: e.severity, provenance: 'Fictional demo seed', isDemo: Boolean(e.is_demo) })),
      ],
      coverage: 'Fictional demo catalog only. Missing edges do not establish safety.',
    });
  }));

  r.get('/normalize', ah(async (req, res) => {
    const name = cleanText(req.query.name, 'name', { max: 100, required: true });
    res.json(await lookupRxNorm(name));
  }));

  return r;
}
