import { useCallback, useEffect, useState } from 'react';
import { searchMedicines } from '../services/medicineService.js';
import { useMedicines } from '../context/MedicineContext.jsx';

const IDLE = { status: 'idle', data: null }; // status: idle | loading | done | error

// Searches the backend ~300 ms after the user stops typing.
// Older responses are ignored, so a slow request can never overwrite a newer one.
export function useMedicineSearch(text, { skip = false } = {}) {
  const { mode, drugs } = useMedicines();
  const [state, setState] = useState(IDLE);
  const [attempt, setAttempt] = useState(0); // bumping this re-runs the search (Retry button)

  useEffect(() => {
    const q = text.trim();
    if (skip || !q) {
      setState(IDLE);
      return undefined;
    }
    let ignore = false;
    setState({ status: 'loading', data: null });
    const timer = setTimeout(async () => {
      try {
        const data = mode === 'sample'
          ? (() => {
              const matches = drugs.filter((drug) => drug.name.toLowerCase().includes(q.toLowerCase()))
                .map((drug) => ({ ...drug, matchType: drug.name.toLowerCase() === q.toLowerCase() ? 'exact' : 'partial' }));
              const medicine = matches.find((drug) => drug.matchType === 'exact') || null;
              return { success: true, query: q, found: Boolean(medicine), medicine, matches };
            })()
          : await searchMedicines(q);
        if (!ignore) setState({ status: 'done', data });
      } catch {
        if (!ignore) setState({ status: 'error', data: null });
      }
    }, 300);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [text, skip, attempt, mode, drugs]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
