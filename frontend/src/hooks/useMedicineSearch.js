import { useCallback, useEffect, useState } from 'react';
import { searchMedicines } from '../services/medicineService.js';

const IDLE = { status: 'idle', data: null }; // status: idle | loading | done | error

// Searches the backend ~300 ms after the user stops typing.
// Older responses are ignored, so a slow request can never overwrite a newer one.
export function useMedicineSearch(text, { skip = false } = {}) {
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
        const data = await searchMedicines(q);
        if (!ignore) setState({ status: 'done', data });
      } catch {
        if (!ignore) setState({ status: 'error', data: null });
      }
    }, 300);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [text, skip, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
