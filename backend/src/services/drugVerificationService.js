// Phase 3: drug name normalization + verification against the MySQL `drugs` table.
// The pool is injected (like interactionService.js), so this file has no DB setup of its own.
//
// "Verified" means ONE thing: the name matches a row in the `drugs` table.
// Nothing in this file ever inserts into `drugs`.

import { HttpError } from '../utils/validate.js';

export const MAX_MATCHES = 10;

// Escape character used with LIKE ... ESCAPE '!'  (so user-typed % and _ are plain text)
const LIKE_ESCAPE = '!';

// SQL version of toSearchKey() below: lower-case, with spaces, hyphens and underscores removed.
// It is applied to the column, so MySQL cannot use an index here. That is fine for a small drugs table.
const KEY_SQL = "LOWER(REPLACE(REPLACE(REPLACE(name, ' ', ''), '-', ''), '_', ''))";

/**
 * Readable normalized form: Unicode-normalized, invisible characters removed,
 * whitespace collapsed to single spaces, trimmed, lower-cased.
 *   "  DEMO   xetine " -> "demo xetine"
 */
export function normalizeName(input) {
  return String(input ?? '')
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width characters sometimes come from copy/paste
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Comparison key: the normalized name with spaces, hyphens and underscores removed,
 * so "Demo xetine", "demo-xetine" and "DEMOXETINE" are all the same key.
 */
export function toSearchKey(input) {
  return normalizeName(input).replace(/[\s_-]+/g, '');
}

/** Escape LIKE wildcards in user text so "%" or "_" cannot widen the search. */
export function escapeLike(text) {
  return text.replace(/[!%_]/g, (ch) => LIKE_ESCAPE + ch);
}

// What the API returns for one drug row. `genericName` is null because the current
// `drugs` table has no generic-name column (add one later and map it here).
export function toMedicineDto(row) {
  return {
    id: row.id,
    name: row.name,
    genericName: row.generic_name ?? null,
    isDemo: Boolean(row.is_demo),
  };
}

function matchType(rowName, key) {
  const rowKey = toSearchKey(rowName);
  if (rowKey === key) return 'exact';
  if (rowKey.startsWith(key)) return 'prefix';
  return 'contains';
}

/**
 * Exact (normalized) lookup. Returns the drug row or null.
 * Used by POST /api/medicines to decide whether a typed name is verified.
 */
export async function findExactDrug(pool, rawName) {
  const key = toSearchKey(rawName);
  if (!key) return null;
  const [rows] = await pool.query(
    `SELECT id, name, is_demo FROM drugs WHERE ${KEY_SQL} = ? ORDER BY name LIMIT 1`,
    [key]
  );
  return rows[0] || null;
}

/**
 * Search for suggestions while the user types.
 *   found    -> true only when a drug matches the typed name exactly (after normalization)
 *   medicine -> that exact match, otherwise null
 *   matches  -> up to MAX_MATCHES drugs whose name contains the typed text (exact first, then prefix)
 */
export async function searchDrugs(pool, rawQuery) {
  const normalizedQuery = normalizeName(rawQuery);
  const key = toSearchKey(rawQuery);
  if (!key) throw new HttpError(400, 'Enter a medicine name to search');

  const [rows] = await pool.query(
    `SELECT id, name, is_demo
       FROM drugs
      WHERE ${KEY_SQL} LIKE ? ESCAPE '${LIKE_ESCAPE}'
      ORDER BY CASE WHEN ${KEY_SQL} = ? THEN 0
                    WHEN ${KEY_SQL} LIKE ? ESCAPE '${LIKE_ESCAPE}' THEN 1
                    ELSE 2 END,
               name
      LIMIT ${MAX_MATCHES}`,
    [`%${escapeLike(key)}%`, key, `${escapeLike(key)}%`]
  );

  const matches = rows.map((row) => ({ ...toMedicineDto(row), matchType: matchType(row.name, key) }));
  const exactRow = rows.find((row) => toSearchKey(row.name) === key) || null;

  return {
    query: String(rawQuery).trim(),
    normalizedQuery,
    found: Boolean(exactRow),
    medicine: exactRow ? toMedicineDto(exactRow) : null,
    matches,
  };
}
