import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMedicineInput, parseCheckInput, parseIntId, HttpError } from '../src/utils/validate.js';
import { shapeResult, runCheck } from '../src/services/interactionService.js';

test('parseMedicineInput trims and requires name', () => {
  assert.deepEqual(parseMedicineInput({ name: '  Placebol ', dose: ' 1 tab' }), { name: 'Placebol', dose: '1 tab', frequency: '' });
  assert.throws(() => parseMedicineInput({ name: '   ' }), HttpError);
  assert.throws(() => parseMedicineInput({ name: 'x'.repeat(101) }), HttpError);
  assert.throws(() => parseMedicineInput({ name: 5 }), HttpError);
  assert.throws(() => parseMedicineInput(undefined), HttpError);
});

test('parseIntId', () => {
  assert.equal(parseIntId('7'), 7);
  for (const bad of ['0', '-1', 'abc', '1.5', '']) assert.throws(() => parseIntId(bad), HttpError);
});

test('parseCheckInput validates and de-duplicates', () => {
  assert.deepEqual(parseCheckInput({ medicineIds: [1, 2, 2], foodIds: ['demo-citrus'] }), { medicineIds: [1, 2], foodIds: ['demo-citrus'] });
  assert.deepEqual(parseCheckInput({ medicineIds: [3] }), { medicineIds: [3], foodIds: [] });
  assert.throws(() => parseCheckInput({}), HttpError);
  assert.throws(() => parseCheckInput({ medicineIds: [] }), HttpError);
  assert.throws(() => parseCheckInput({ medicineIds: ['x'] }), HttpError);
  assert.throws(() => parseCheckInput({ medicineIds: [1], foodIds: 'a' }), HttpError);
  assert.throws(() => parseCheckInput({ medicineIds: [1], foodIds: ["a'; DROP"] }), HttpError);
});

test('shapeResult produces the shape the React UI expects', () => {
  const out = shapeResult({
    ddRows: [{ severity: 'high', drug_a_name: 'A', drug_b_name: 'B', message_en: 'm', message_hi: 'म', advice_en: 'a', advice_hi: 'स', is_demo: 1 }],
    dfRows: [{ severity: 'low', drug_name: 'A', food_name_en: 'F', food_name_hi: 'ख', message_en: 'm', message_hi: 'म', advice_en: 'a', advice_hi: 'स', is_demo: 1 }],
    skipped: ['Unknown'],
    checkedAt: 'T',
  });
  assert.deepEqual(out.drugDrug[0].drugNames, ['A', 'B']);
  assert.equal(out.drugDrug[0].message.hi, 'म');
  assert.equal(out.drugDrug[0].isDemo, true);
  assert.deepEqual(out.drugFood[0].foodName, { en: 'F', hi: 'ख' });
  assert.deepEqual(out.skipped, ['Unknown']);
  assert.equal(out.checkedAt, 'T');
});

test('runCheck only runs the queries that are needed (fake pool)', async () => {
  const calls = [];
  const pool = {
    async query(sql) {
      calls.push(sql);
      if (sql.includes('FROM patient_medicines')) {
        return [[{ id: 1, name: 'Placebol', drug_id: 'placebol' }, { id: 2, name: 'Mystery', drug_id: null }]];
      }
      return [[]];
    },
  };
  const out = await runCheck(pool, 1, [1, 2], ['demo-citrus']);
  assert.deepEqual(out.skipped, ['Mystery']);
  // medicines lookup + drug-food only (one verified drug => no drug-drug query)
  assert.equal(calls.length, 2);
  assert.ok(calls[1].includes('drug_food_interactions'));
  assert.deepEqual(out.drugDrug, []);
});
