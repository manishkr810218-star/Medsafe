import { api } from './api.js';

export const listMedicines = () => api('/medicines');
export const addMedicineApi = (input) => api('/medicines', { method: 'POST', body: input });
export const removeMedicineApi = (id) => api(`/medicines/${id}`, { method: 'DELETE' });
export const clearMedicinesApi = () => api('/medicines', { method: 'DELETE' });

// Phase 3: verify / search medicine names against the MySQL drugs table.
// Resolves to { success, query, normalizedQuery, found, medicine, matches[] }.
export const searchMedicines = (q) => api(`/medicines/search?q=${encodeURIComponent(q)}`);
