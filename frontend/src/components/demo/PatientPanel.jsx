import { useState } from 'react';
import { DISEASE_BY_ID, searchDiseases } from '../../demo/diseases.js';
import { ALLERGY_OPTIONS } from '../../demo/rules.js';

export default function PatientPanel({ patient, setPatient }) {
  const [query, setQuery] = useState('');
  const results = searchDiseases(query, patient.conditions);
  const set = (key, value) => setPatient((p) => ({ ...p, [key]: value }));
  const toggleIn = (key, id) =>
    setPatient((p) => ({ ...p, [key]: p[key].includes(id) ? p[key].filter((x) => x !== id) : [...p[key], id] }));

  return (
    <div className="card">
      <div className="card-title">
        <h3>Patient details</h3>
        <span className="small muted">Optional user data</span>
      </div>

      <div className="field-grid">
        <label className="field">
          <span>Name</span>
          <input className="input" value={patient.name} onChange={(e) => set('name', e.target.value)} />
        </label>
        <label className="field">
          <span>Age</span>
          <input className="input" type="number" min="0" value={patient.age} onChange={(e) => set('age', e.target.value)} />
        </label>
        <label className="field">
          <span>Sex</span>
          <select className="input" value={patient.sex} onChange={(e) => set('sex', e.target.value)}>
            <option value="">Select</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </label>
        <label className="field">
          <span>Weight (kg)</span>
          <input className="input" type="number" min="0" value={patient.weight} onChange={(e) => set('weight', e.target.value)} />
        </label>
      </div>

      <fieldset className="toggles">
        <legend className="small"><b>Status &amp; lifestyle</b></legend>
        {[
          ['pregnant', 'Pregnant'],
          ['breastfeeding', 'Breastfeeding'],
          ['alcohol', 'Drinks alcohol'],
          ['smoking', 'Smokes'],
        ].map(([key, label]) => (
          <label key={key} className="check">
            <input type="checkbox" checked={patient[key]} onChange={(e) => set(key, e.target.checked)} />
            {label}
          </label>
        ))}
      </fieldset>

      <fieldset className="chips-field">
        <legend className="small"><b>Known allergies</b></legend>
        <div className="chips">
          {ALLERGY_OPTIONS.map((a) => {
            const on = patient.allergies.includes(a.id);
            return (
              <button key={a.id} type="button" className={`chip${on ? ' chip-on' : ''}`} aria-pressed={on} onClick={() => toggleIn('allergies', a.id)}>
                {a.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="chips-field">
        <legend className="small"><b>Medical conditions</b></legend>
        <div className="chips">
          {patient.conditions.length === 0 && <span className="small muted">None added</span>}
          {patient.conditions.map((id) => (
            <span key={id} className="chip chip-on">
              {DISEASE_BY_ID[id]?.name ?? id}
              <button type="button" className="chip-x" aria-label={`Remove ${DISEASE_BY_ID[id]?.name ?? id}`} onClick={() => toggleIn('conditions', id)}>
                {'\u00d7'}
              </button>
            </span>
          ))}
        </div>
        <input
          className="input"
          placeholder="Add condition, e.g. asthma, dengue, CKD"
          aria-label="Search conditions"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        {results.length > 0 && (
          <ul className="suggestions">
            {results.map((dz) => (
              <li key={dz.id}>
                <button type="button" onClick={() => { toggleIn('conditions', dz.id); setQuery(''); }}>
                  <span>{dz.name}</span>
                  <span className="small muted">{dz.category}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </fieldset>
    </div>
  );
}
