// Interaction checking. The pool is injected so this file has no external imports.

const DD_SQL = `
  SELECT i.severity, i.message_en, i.message_hi, i.advice_en, i.advice_hi, i.is_demo,
         a.name AS drug_a_name, b.name AS drug_b_name
  FROM drug_interactions i
  JOIN drugs a ON a.id = i.drug_a_id
  JOIN drugs b ON b.id = i.drug_b_id
  WHERE i.drug_a_id IN (?) AND i.drug_b_id IN (?)
  ORDER BY FIELD(i.severity, 'high', 'moderate', 'low'), i.id`;

const DF_SQL = `
  SELECT i.severity, i.message_en, i.message_hi, i.advice_en, i.advice_hi, i.is_demo,
         d.name AS drug_name, f.name_en AS food_name_en, f.name_hi AS food_name_hi
  FROM drug_food_interactions i
  JOIN drugs d ON d.id = i.drug_id
  JOIN foods f ON f.id = i.food_id
  WHERE i.drug_id IN (?) AND i.food_id IN (?)
  ORDER BY FIELD(i.severity, 'high', 'moderate', 'low'), i.id`;

// Pure: turns DB rows into the JSON shape the frontend already uses.
export function shapeResult({ ddRows = [], dfRows = [], skipped = [], checkedAt = new Date().toISOString() }) {
  return {
    drugDrug: ddRows.map((r) => ({
      severity: r.severity,
      drugNames: [r.drug_a_name, r.drug_b_name],
      message: { en: r.message_en, hi: r.message_hi },
      advice: { en: r.advice_en, hi: r.advice_hi },
      isDemo: Boolean(r.is_demo),
    })),
    drugFood: dfRows.map((r) => ({
      severity: r.severity,
      drugName: r.drug_name,
      foodName: { en: r.food_name_en, hi: r.food_name_hi },
      message: { en: r.message_en, hi: r.message_hi },
      advice: { en: r.advice_en, hi: r.advice_hi },
      isDemo: Boolean(r.is_demo),
    })),
    skipped,
    checkedAt,
  };
}

export async function runCheck(pool, patientId, medicineIds, foodIds) {
  const [meds] = await pool.query(
    'SELECT id, name, drug_id FROM patient_medicines WHERE patient_id = ? AND id IN (?)',
    [patientId, medicineIds]
  );
  const skipped = meds.filter((m) => !m.drug_id).map((m) => m.name);
  const drugIds = [...new Set(meds.filter((m) => m.drug_id).map((m) => m.drug_id))];

  let ddRows = [];
  let dfRows = [];
  if (drugIds.length >= 2) [ddRows] = await pool.query(DD_SQL, [drugIds, drugIds]);
  if (drugIds.length >= 1 && foodIds.length >= 1) [dfRows] = await pool.query(DF_SQL, [drugIds, foodIds]);

  return shapeResult({ ddRows, dfRows, skipped });
}
