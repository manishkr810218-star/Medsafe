import { api } from './api.js';

// Backend returns { drugDrug, drugFood, skipped, checkedAt } (same shape as the Phase 1 mock).
export const getDrugCatalog = () => api('/drugs');
export const getFoodCatalog = () => api('/foods');
export const checkInteractions = ({ medicineIds, foodIds }) =>
  api('/interactions/check', { method: 'POST', body: { medicineIds, foodIds } });
