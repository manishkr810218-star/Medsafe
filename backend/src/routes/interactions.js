import { Router } from 'express';
import { ah } from './async.js';
import { config } from '../config.js';
import { parseCheckInput } from '../utils/validate.js';
import { runCheck } from '../services/interactionService.js';

export function interactionsRouter(pool) {
  const r = Router();

  r.post('/check', ah(async (req, res) => {
    const { medicineIds, foodIds } = parseCheckInput(req.body);
    res.json(await runCheck(pool, config.demoPatientId, medicineIds, foodIds));
  }));

  return r;
}
