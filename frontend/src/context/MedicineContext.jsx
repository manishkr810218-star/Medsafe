import React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  listMedicines,
  addMedicineApi,
  removeMedicineApi,
  clearMedicinesApi,
} from "../services/medicineService.js";
import {
  getDrugCatalog,
  getFoodCatalog,
  checkInteractions,
} from "../services/interactionService.js";
import {
  sampleDrugs, sampleFoods, loadSampleMedicines, saveSampleMedicines,
  addSampleMedicine, runSampleCheck,
} from "../services/sampleWorkspace.js";

const MedicineContext = createContext(null);
const CHECK_KEY = "dic.lastCheck";

const loadLastCheck = () => {
  try {
    const value = JSON.parse(localStorage.getItem(CHECK_KEY));
    return value &&
      Array.isArray(value.drugDrug) &&
      Array.isArray(value.drugFood) &&
      value.drugDrug.every(
        (item) => Array.isArray(item?.drugNames) && item?.message,
      ) &&
      value.drugFood.every(
        (item) => item?.drugName && item?.message && item?.foodName,
      )
      ? value
      : null;
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
  const [mode, setMode] = useState("loading"); // api | sample
  const [lastCheck, setLastCheck] = useState(loadLastCheck);

  useEffect(
    () => localStorage.setItem(CHECK_KEY, JSON.stringify(lastCheck)),
    [lastCheck],
  );
  useEffect(() => {
    if (mode === "sample") saveSampleMedicines(medicines);
  }, [mode, medicines]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [meds, d, f] = await Promise.all([
        listMedicines(),
        getDrugCatalog(),
        getFoodCatalog(),
      ]);
      setMedicines(meds);
      setDrugs(d);
      setFoods(f);
      setError(false);
      setMode("api");
    } catch {
      setMedicines(loadSampleMedicines());
      setDrugs(sampleDrugs);
      setFoods(sampleFoods);
      setError(false);
      setMode("sample");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem("dic.medicines"); // Phase 1 stored medicines locally; they now live in MySQL
    reload();
  }, [reload]);

  // Runs an API action, then refreshes the list. Returns true on success.
  const mutate = useCallback(async (action) => {
    try {
      await action();
      setMedicines(await listMedicines());
      setLastCheck(null); // Medicine changes invalidate an earlier comparison.
      setError(false);
      return true;
    } catch {
      setError(true);
      return false;
    }
  }, []);

  const addMedicine = useCallback(async (input) => {
    if (mode === "sample") {
      setMedicines((current) => addSampleMedicine(current, input));
      setLastCheck(null);
      return true;
    }
    return mutate(() => addMedicineApi(input));
  }, [mode, mutate]);
  const removeMedicine = useCallback(async (id) => {
    if (mode === "sample") {
      setMedicines((current) => current.filter((item) => item.id !== id));
      setLastCheck(null);
      return true;
    }
    return mutate(() => removeMedicineApi(id));
  }, [mode, mutate]);
  const clearMedicines = useCallback(async () => {
    if (mode === "sample") {
      setMedicines([]);
      setLastCheck(null);
      return true;
    }
    return mutate(clearMedicinesApi);
  }, [mode, mutate]);
  const runInteractionCheck = useCallback(async ({ medicineIds, foodIds }) => {
    const result = mode === "sample"
      ? runSampleCheck(medicines, medicineIds, foodIds)
      : await checkInteractions({ medicineIds, foodIds });
    setLastCheck(result);
    return result;
  }, [mode, medicines]);

  return (
    <MedicineContext.Provider
      value={{
        medicines,
        drugs,
        foods,
        loading,
        error,
        mode,
        reload,
        addMedicine,
        removeMedicine,
        clearMedicines,
        runInteractionCheck,
        lastCheck,
        setLastCheck,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
}

export const useMedicines = () => useContext(MedicineContext);
