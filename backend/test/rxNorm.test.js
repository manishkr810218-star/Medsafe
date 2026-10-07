import test from 'node:test';
import assert from 'node:assert/strict';
import { lookupRxNorm } from '../src/services/rxNormService.js';

test('RxNorm lookup returns candidate codes without accepting a single concept silently', async () => {
  let requestedUrl;
  const fakeFetch = async (url) => {
    if (url.includes('/properties.json')) return { ok: true, json: async () => ({ properties: { name: 'Example concept', tty: 'IN' } }) };
    requestedUrl = url;
    return { ok: true, json: async () => ({ idGroup: { rxnormId: ['161', '1234'] } }) };
  };
  const result = await lookupRxNorm('sample medicine', fakeFetch);
  assert.match(requestedUrl, /name=sample%20medicine&search=2&allsrc=0/);
  assert.deepEqual(result.candidates, [{ system: 'RxNorm', rxcui: '161', name: 'Example concept', termType: 'IN' }, { system: 'RxNorm', rxcui: '1234', name: 'Example concept', termType: 'IN' }]);
  assert.match(result.disclaimer, /No interaction information/);
});

test('RxNorm lookup handles no match and upstream failure', async () => {
  const empty = await lookupRxNorm('unknown', async () => ({ ok: true, json: async () => ({ idGroup: {} }) }));
  assert.deepEqual(empty.candidates, []);
  await assert.rejects(lookupRxNorm('unknown', async () => { throw new Error('offline'); }), { status: 502 });
});
