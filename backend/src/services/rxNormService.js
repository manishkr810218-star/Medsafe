import { HttpError } from '../utils/validate.js';

const RXNORM_BASE = 'https://rxnav.nlm.nih.gov/REST';

// Only a user-confirmed medicine name is sent to NLM. No image or full prescription is sent.
export async function lookupRxNorm(name, fetchImpl = fetch) {
  const signal = AbortSignal.timeout(8000);
  let response;
  try {
    response = await fetchImpl(`${RXNORM_BASE}/rxcui.json?name=${encodeURIComponent(name)}&search=2&allsrc=0`, { signal });
  } catch {
    throw new HttpError(502, 'RxNorm service is unavailable. Try again later.');
  }
  if (!response.ok) throw new HttpError(502, 'RxNorm service is unavailable. Try again later.');
  const data = await response.json();
  const codes = (data.idGroup?.rxnormId || []).filter((code) => /^\d{1,20}$/.test(code)).slice(0, 5);
  const candidates = await Promise.all(codes.map(async (rxcui) => {
    try {
      const detail = await fetchImpl(`${RXNORM_BASE}/rxcui/${rxcui}/properties.json`, { signal });
      const properties = detail.ok ? (await detail.json()).properties : null;
      return { system: 'RxNorm', rxcui, name: properties?.name || null, termType: properties?.tty || null };
    } catch {
      return { system: 'RxNorm', rxcui, name: null, termType: null };
    }
  }));
  return { name, source: 'US National Library of Medicine RxNorm', matchMode: 'exact-or-normalized', candidates, disclaimer: 'Codes identify concepts only. No interaction information or clinical validation is provided.' };
}
