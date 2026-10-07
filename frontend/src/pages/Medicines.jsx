import { useState } from 'react';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useMedicines } from '../context/MedicineContext.jsx';
import { useMedicineSearch } from '../hooks/useMedicineSearch.js';

export default function Medicines() {
  const { t } = useLang();
  const { medicines, loading, addMedicine, removeMedicine, clearMedicines } = useMedicines();
  const m = t.medicines;
  const [form, setForm] = useState({ name: '', dose: '', frequency: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Phase 3: `selected` is a medicine the user picked from the database matches.
  // It only counts while the input still shows exactly that name.
  const [selected, setSelected] = useState(null);
  const isPicked = Boolean(selected) && selected.name === form.name;
  const search = useMedicineSearch(form.name, { skip: isPicked });
  const typed = form.name.trim();
  const matches = search.status === 'done' ? search.data.matches : [];
  // Verified = a real row from the database (picked, or typed text that matches one exactly).
  const verified = isPicked ? selected : search.status === 'done' && search.data.found ? search.data.medicine : null;

  const pick = (med) => {
    setSelected(med);
    setForm((f) => ({ ...f, name: med.name }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!typed) return;
    const ok = await addMedicine(form); // the server verifies the name again before saving
    if (ok) {
      setForm({ name: '', dose: '', frequency: '' });
      setSelected(null);
    }
  };

  return (
    <>
      <h1>{m.title}</h1>

      <form className="card form" onSubmit={submit}>
        <h2>{m.add}</h2>
        <label>
          {m.name}
          <input value={form.name} onChange={set('name')} placeholder={m.namePh} maxLength={100} autoComplete="off" required />
        </label>

        {typed && (
          <div className="search-panel" aria-live="polite">
            {search.status === 'loading' && <p className="muted small">{m.searching}</p>}

            {search.status === 'error' && (
              <p className="error small">
                {t.common.apiError}{' '}
                <button type="button" className="btn btn-outline" onClick={search.retry}>{t.common.retry}</button>
              </p>
            )}

            {search.status === 'done' && matches.length === 0 && <p className="muted small">{m.noMatch}</p>}

            {matches.length > 0 && !isPicked && (
              <>
                <p className="muted small">{m.suggestions}</p>
                <ul className="suggestions">
                  {matches.map((med) => (
                    <li key={med.id}>
                      <button type="button" onClick={() => pick(med)}>
                        <span>{med.name}{med.genericName ? ` (${med.genericName})` : ''}</span>
                        {med.matchType === 'exact' && <span className="badge badge-ok">{m.exactMatch}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {verified && (
              <p className="small"><span className="badge badge-ok">{m.verifiedDb}</span> {verified.name}</p>
            )}
            {!verified && search.status === 'done' && (
              <p className="small"><span className="badge badge-warn">{m.unverified}</span> <span className="muted">{m.typedHint}</span></p>
            )}
          </div>
        )}
        <div className="row">
          <label>{m.dose}<input value={form.dose} onChange={set('dose')} placeholder={m.dosePh} /></label>
          <label>{m.freq}<input value={form.frequency} onChange={set('frequency')} placeholder={m.freqPh} /></label>
        </div>
        <button className="btn" type="submit">{m.save}</button>
      </form>

      {loading ? (
        <p className="muted">{t.common.loading}</p>
      ) : medicines.length === 0 ? (
        <p className="muted">{m.empty}</p>
      ) : (
        <>
          <ul className="list">
            {medicines.map((med) => (
              <li key={med.id} className="card list-item">
                <div>
                  <strong>{med.name}</strong>
                  <div className="muted">{[med.dose, med.frequency].filter(Boolean).join(' · ')}</div>
                  <span className={`badge ${med.drugId ? 'badge-ok' : 'badge-warn'}`}>
                    {med.drugId ? m.verified : m.unverified}
                  </span>
                  {!med.drugId && <div className="muted small">{m.unverifiedHint}</div>}
                </div>
                <button className="btn btn-outline" onClick={() => removeMedicine(med.id)}>{m.remove}</button>
              </li>
            ))}
          </ul>
          <button className="btn btn-outline" onClick={clearMedicines}>{m.clearAll}</button>
        </>
      )}
    </>
  );
}
