import { Router } from 'express';
import { ah } from './async.js';
import { config } from '../config.js';
import { HttpError, cleanText, parseIntId, parseMedicineInput } from '../utils/validate.js';
import { findExactDrug, searchDrugs } from '../services/drugVerificationService.js';

const toDto = (m) => ({ id: m.id, name: m.name, drugId: m.drug_id, dose: m.dose, frequency: m.frequency });

export function medicinesRouter(pool) {
  const r = Router();
  const patientId = config.demoPatientId; // no auth until Phase 6

  const findByName = async (name) => {
    const [rows] = await pool.query(
      'SELECT id, name, drug_id, dose, frequency FROM patient_medicines WHERE patient_id = ? AND name = ? LIMIT 1',
      [patientId, name]
    );
    return rows[0] || null;
  };

  r.get('/', ah(async (_req, res) => {
    const [rows] = await pool.query(
      'SELECT id, name, drug_id, dose, frequency FROM patient_medicines WHERE patient_id = ? ORDER BY id',
      [patientId]
    );
    res.json(rows.map(toDto));
  }));

  // Phase 3: search the drugs table (used by the Medicines page while typing).
  // Must stay read-only: it never creates a drug.
  r.get('/search', ah(async (req, res) => {
    const q = cleanText(req.query.q, 'q (medicine name)', { max: 100, required: true });
    res.json({ success: true, ...(await searchDrugs(pool, q)) });
  }));

  // The name is verified on the server (never trusted from the browser): a normalized exact match
  // against the drugs table links drug_id; otherwise the text is saved as typed with drug_id = NULL.
  // Nothing is ever inserted into `drugs` here.
  r.post('/', ah(async (req, res) => {
    const { name, dose, frequency } = parseMedicineInput(req.body);
    const drug = await findExactDrug(pool, name);
    const finalName = drug ? drug.name : name.replace(/\s+/g, ' '); // verified: official spelling

    const existing = await findByName(finalName);
    if (existing) return res.status(200).json(toDto(existing)); // duplicates are ignored, like Phase 1

    try {
      await pool.query(
        'INSERT INTO patient_medicines (patient_id, drug_id, name, dose, frequency) VALUES (?, ?, ?, ?, ?)',
        [patientId, drug ? drug.id : null, finalName, dose, frequency]
      );
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        const again = await findByName(finalName);
        if (again) return res.status(200).json(toDto(again));
      }
      throw err;
    }
    res.status(201).json(toDto(await findByName(finalName)));
  }));

  r.delete('/:id', ah(async (req, res) => {
    const id = parseIntId(req.params.id);
    const [result] = await pool.query('DELETE FROM patient_medicines WHERE id = ? AND patient_id = ?', [id, patientId]);
    if (result.affectedRows === 0) throw new HttpError(404, 'Medicine not found');
    res.status(204).end();
  }));

  r.delete('/', ah(async (_req, res) => {
    await pool.query('DELETE FROM patient_medicines WHERE patient_id = ?', [patientId]);
    res.status(204).end();
  }));

  return r;
}
