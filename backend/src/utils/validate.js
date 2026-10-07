export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function cleanText(value, field, { max = 100, required = false } = {}) {
  if (value === undefined || value === null) value = '';
  if (typeof value !== 'string') throw new HttpError(400, `${field} must be a string`);
  const v = value.trim();
  if (required && !v) throw new HttpError(400, `${field} is required`);
  if (v.length > max) throw new HttpError(400, `${field} must be at most ${max} characters`);
  return v;
}

export function parseMedicineInput(body) {
  const b = body ?? {};
  return {
    name: cleanText(b.name, 'name', { required: true }),
    dose: cleanText(b.dose, 'dose'),
    frequency: cleanText(b.frequency, 'frequency'),
  };
}

export function parseIntId(value, field = 'id') {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `${field} must be a positive integer`);
  return n;
}

const MAX_IDS = 50;

export function parseCheckInput(body) {
  const b = body ?? {};
  if (!Array.isArray(b.medicineIds) || b.medicineIds.length === 0) {
    throw new HttpError(400, 'medicineIds must be a non-empty array');
  }
  if (b.medicineIds.length > MAX_IDS) throw new HttpError(400, `At most ${MAX_IDS} medicineIds allowed`);
  const medicineIds = [...new Set(b.medicineIds.map((x) => parseIntId(x, 'medicineIds[]')))];

  const rawFoods = b.foodIds ?? [];
  if (!Array.isArray(rawFoods)) throw new HttpError(400, 'foodIds must be an array');
  if (rawFoods.length > MAX_IDS) throw new HttpError(400, `At most ${MAX_IDS} foodIds allowed`);
  const foodIds = [
    ...new Set(
      rawFoods.map((x) => {
        if (typeof x !== 'string' || !/^[a-z0-9-]{1,50}$/.test(x)) {
          throw new HttpError(400, 'foodIds[] must be food id strings');
        }
        return x;
      })
    ),
  ];
  return { medicineIds, foodIds };
}
