import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { listMedicines, addMedicineApi, removeMedicineApi, clearMedicinesApi } from '../services/medicineService.js';
import { getDrugCatalog, getFoodCatalog } from '../services/interactionService.js';

const MedicineContext = createContext(null);
const CHECK_KEY = 'dic.lastCheck';

const loadLastCheck = () => {
  try {
    return JSON.parse(localStorage.getItem(CHECK_KEY)) ?? null;
  } catch {
    return null;
  }
};

export function MedicineProvider({ children }) {
  const [medicines, setMedicines] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // true when the backend is unreachable / failing
  const [lastCheck, setLastCheck] = useState(loadLastCheck);

  useEffect(() => localStorage.setItem(CHECK_KEY, JSON.stringify(lastCheck)), [lastCheck]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [meds, d, f] = await Promise.all([listMedicines(), getDrugCatalog(), getFoodCatalog()]);
      setMedicines(meds);
      setDrugs(d);
      setFoods(f);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem('dic.medicines'); // Phase 1 stored medicines locally; they now live in MySQL
    reload();
  }, [reload]);

  // Runs an API action, then refreshes the list. Returns true on success.
  const mutate = useCallback(async (action) => {
    try {
      await action();
      setMedicines(await listMedicines());
      setError(false);
      return true;
    } catch {
      setError(true);
      return false;
    }
  }, []);

  const addMedicine = useCallback((input) => mutate(() => addMedicineApi(input)), [mutate]);
  const removeMedicine = useCallback((id) => mutate(() => removeMedicineApi(id)), [mutate]);
  const clearMedicines = useCallback(() => mutate(clearMedicinesApi), [mutate]);

  return (
    <MedicineContext.Provider
      value={{
        medicines, drugs, foods, loading, error, reload,
        addMedicine, removeMedicine, clearMedicines, lastCheck, setLastCheck,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
}

export const useMedicines = () => useContext(MedicineContext);
