import { useState } from 'react';
import { MED_BY_ID, searchMedicines } from '../../demo/medicines.js';

const confidence = (i) => 98 - ((i * 7) % 9);

export default function ExtractedMeds({ items, setItems, status }) {
  const [query, setQuery] = useState('');
  const results = searchMedicines(query);
  const done = status === 'done';

  function add(med) {
    setItems((prev) => [...prev, { medId: med.id, raw: 'Added manually', dose: med.dose, freq: 'As directed', duration: '', manual: true }]);
    setQuery('');
  }

  return (
    <div className="card">
      <div className="card-title">
        <h3>Detected medicines</h3>
        {done && <span className="badge badge-ok">{items.length} found</span>}
      </div>

      {!done ? (
        <p className="muted small">{status === 'scanning' ? 'Reading\u2026' : 'Medicines will appear here after scanning.'}</p>
      ) : items.length === 0 ? (
        <p className="muted small">No medicines yet. Search below to add them.</p>
      ) : (
        <ul className="med-list">
          {items.map((it, i) => {
            const med = MED_BY_ID[it.medId];
            return (
              <li key={`${it.medId}-${i}`} className="med-row">
                <div className="med-main">
                  <strong>{med.name}</strong>
                  <span className="small muted">
                    {it.manual ? 'Added manually' : <>Read as &ldquo;{it.raw}&rdquo; &middot; {confidence(i)}% match</>}
                  </span>
                  <span className="small">{it.dose} &middot; {it.freq}</span>
                </div>
                <span className="cat-pill">{med.category}</span>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`Remove ${med.name}`}
                  onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
                >
                  {'\u00d7'}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {done && (
        <div className="add-med">
          <label htmlFor="add-med" className="small"><b>Add or correct a medicine</b></label>
          <input
            id="add-med"
            className="input"
            placeholder="Search generic or brand, e.g. Dolo, warfarin"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          {results.length > 0 && (
            <ul className="suggestions">
              {results.map((med) => (
                <li key={med.id}>
                  <button type="button" onClick={() => add(med)}>
                    <span>{med.name} <span className="muted small">({med.brand})</span></span>
                    <span className="small muted">{med.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
