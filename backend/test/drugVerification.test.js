import test from 'node:test';
import assert from 'node:assert/strict';
import mysql from 'mysql2/promise';
import { createApp } from '../src/app.js';
import { HttpError } from '../src/utils/validate.js';
import {
  normalizeName, toSearchKey, escapeLike, searchDrugs, findExactDrug,
} from '../src/services/drugVerificationService.js';

// ---- A tiny fake pool that behaves like the `drugs` table for the two Phase 3 queries. ----
// (It checks our JavaScript and the HTTP layer. It is NOT a MySQL engine.)
const DRUGS = [
  { id: 'demoxetine', name: 'Demoxetine', is_demo: 1 },
  { id: 'placebol', name: 'Placebol', is_demo: 1 },
  { id: 'sampleprin', name: 'Sampleprin', is_demo: 1 },
  { id: 'mockacillin', name: 'Mockacillin', is_demo: 1 },
  { id: 'testafen', name: 'Testafen', is_demo: 1 },
];

function fakePool() {
  const calls = [];
  return {
    calls,
    async query(sql, params = []) {
      calls.push({ sql, params });
      if (!sql.includes('FROM drugs')) return [[]];
      const key = (n) => n.toLowerCase().replace(/[\s_-]+/g, '');
      if (sql.includes('LIKE')) {
        // params: [%key%, key, key%]  (LIKE wildcards are only at the ends in our patterns)
        const needle = params[0].slice(1, -1).replace(/!(.)/g, '$1');
        const rows = DRUGS.filter((d) => key(d.name).includes(needle)).sort((a, b) => a.name.localeCompare(b.name));
        return [rows];
      }
      return [DRUGS.filter((d) => key(d.name) === params[0]).slice(0, 1)];
    },
  };
}

async function withServer(pool, fn) {
  const server = createApp(pool).listen(0);
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(base);
  } finally {
    await new Promise((r) => server.close(r));
  }
}

const getJson = async (url) => {
  const res = await fetch(url);
  return { status: res.status, body: await res.json() };
};

// ---- pure helpers ----
test('normalizeName trims, collapses spaces, lower-cases', () => {
  assert.equal(normalizeName('  DEMO   xetine \t'), 'demo xetine');
  assert.equal(normalizeName('Place\u200Bbol'), 'placebol');
  assert.equal(normalizeName(undefined), '');
});

test('toSearchKey ignores spaces, hyphens and underscores', () => {
  for (const v of ['Demoxetine', 'demo xetine', 'DEMO-XETINE', ' demo_xetine ']) assert.equal(toSearchKey(v), 'demoxetine');
  assert.equal(toSearchKey('  - '), '');
});

test('escapeLike makes % _ and ! literal', () => {
  assert.equal(escapeLike('50%_off!'), '50!%!_off!!');
});

// ---- service ----
test('searchDrugs: exact match is found, regardless of case and spaces', async () => {
  for (const q of ['Demoxetine', 'demoxetine', 'DEMOXETINE', '  demoxetine  ', 'demo xetine', 'Demo-xetine']) {
    const out = await searchDrugs(fakePool(), q);
    assert.equal(out.found, true, q);
    assert.deepEqual(out.medicine, { id: 'demoxetine', name: 'Demoxetine', genericName: null, isDemo: true }, q);
    assert.equal(out.matches[0].matchType, 'exact');
  }
});

test('searchDrugs: partial text gives suggestions but found=false', async () => {
  const out = await searchDrugs(fakePool(), 'demo');
  assert.equal(out.found, false);
  assert.equal(out.medicine, null);
  assert.deepEqual(out.matches.map((m) => [m.name, m.matchType]), [['Demoxetine', 'prefix']]);
});

test('searchDrugs: unknown medicine returns found=false and no matches', async () => {
  const out = await searchDrugs(fakePool(), 'Nonexistium');
  assert.deepEqual([out.found, out.medicine, out.matches], [false, null, []]);
});

test('searchDrugs: user text goes in params, never into the SQL string', async () => {
  const pool = fakePool();
  const evil = "x'; DROP TABLE drugs; --";
  await searchDrugs(pool, evil);
  assert.ok(!pool.calls[0].sql.includes('DROP'));
  assert.ok(pool.calls[0].params.length > 0);
});

test('searchDrugs rejects text with nothing searchable', async () => {
  await assert.rejects(() => searchDrugs(fakePool(), ' - _ '), HttpError);
});

test('findExactDrug returns the row or null', async () => {
  assert.equal((await findExactDrug(fakePool(), ' PLACEBOL ')).id, 'placebol');
  assert.equal(await findExactDrug(fakePool(), 'Placebolx'), null);
  assert.equal(await findExactDrug(fakePool(), '---'), null);
});

// ---- HTTP: GET /api/medicines/search ----
test('GET /api/medicines/search: existing medicine', async () => {
  await withServer(fakePool(), async (base) => {
    const { status, body } = await getJson(`${base}/api/medicines/search?q=Placebol`);
    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.equal(body.found, true);
    assert.equal(body.medicine.id, 'placebol');
    assert.equal(body.medicine.name, 'Placebol');
  });
});

test('GET /api/medicines/search: unknown medicine', async () => {
  await withServer(fakePool(), async (base) => {
    const { status, body } = await getJson(`${base}/api/medicines/search?q=Unknownol`);
    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.equal(body.found, false);
    assert.equal(body.medicine, null);
  });
});

test('GET /api/medicines/search: capitalization and surrounding spaces', async () => {
  await withServer(fakePool(), async (base) => {
    for (const q of ['pLaCeBoL', '%20%20placebol%20%20', 'PLACEBOL']) {
      const { body } = await getJson(`${base}/api/medicines/search?q=${q}`);
      assert.equal(body.found, true, q);
      assert.equal(body.medicine.name, 'Placebol');
    }
  });
});

test('GET /api/medicines/search: empty or missing q is a 400', async () => {
  await withServer(fakePool(), async (base) => {
    for (const url of ['/search?q=', '/search?q=%20%20%20', '/search', '/search?q=a&q=b', `/search?q=${'x'.repeat(101)}`]) {
      const { status, body } = await getJson(`${base}/api/medicines${url}`);
      assert.equal(status, 400, url);
      assert.ok(body.error, url);
    }
  });
});

test('GET /api/medicines/search: database unavailable gives a 503 (real mysql2 pool, closed port)', async () => {
  const pool = mysql.createPool({ host: '127.0.0.1', port: 1, user: 'x', password: '', database: 'x', connectTimeout: 2000 });
  const realConsoleError = console.error;
  console.error = () => {}; // the app logs the connection error; keep test output clean
  try {
    await withServer(pool, async (base) => {
      const { status, body } = await getJson(`${base}/api/medicines/search?q=Placebol`);
      assert.equal(status, 503);
      assert.match(body.error, /Database unavailable/);
    });
  } finally {
    console.error = realConsoleError;
    await pool.end();
  }
});

// ---- HTTP: POST /api/medicines uses the same verification and never creates drugs ----
function fakePoolWithPatientList() {
  const pool = fakePool();
  const saved = [];
  const base = pool.query.bind(pool);
  pool.saved = saved;
  pool.query = async (sql, params = []) => {
    if (sql.includes('FROM patient_medicines') && sql.includes('AND name = ?')) {
      return [saved.filter((s) => s.name === params[1]).map((s, i) => ({ id: i + 1, ...s }))];
    }
    if (sql.startsWith('INSERT INTO patient_medicines')) {
      saved.push({ drug_id: params[1], name: params[2], dose: params[3], frequency: params[4] });
      pool.calls.push({ sql, params });
      return [{ affectedRows: 1 }];
    }
    return base(sql, params);
  };
  return pool;
}

const post = async (url, body) => {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
};

test('POST /api/medicines: spacing/case variations are saved as the verified database medicine', async () => {
  const pool = fakePoolWithPatientList();
  await withServer(pool, async (base) => {
    const { status, body } = await post(`${base}/api/medicines`, { name: '  DEMO   xetine ', dose: '1 tab' });
    assert.equal(status, 201);
    assert.equal(body.name, 'Demoxetine'); // official spelling from the drugs table
    assert.equal(body.drugId, 'demoxetine'); // verified
  });
});

test('POST /api/medicines: unknown text is saved unverified and no drug is created', async () => {
  const pool = fakePoolWithPatientList();
  await withServer(pool, async (base) => {
    const { status, body } = await post(`${base}/api/medicines`, { name: '  Some   Unknown  Thing ' });
    assert.equal(status, 201);
    assert.equal(body.name, 'Some Unknown Thing');
    assert.equal(body.drugId, null);
    assert.ok(pool.calls.every((c) => !/INSERT INTO drugs/i.test(c.sql)));
  });
});
