import { useState } from 'react';
import DemoAlert from './DemoAlert.jsx';

const TABS = [
  { id: 'all', label: 'All', types: null },
  { id: 'dd', label: 'Drug-drug', types: ['drug-drug', 'duplicate'] },
  { id: 'df', label: 'Drug-food', types: ['drug-food'] },
  { id: 'dz', label: 'Drug-disease', types: ['drug-disease'] },
  { id: 'lab', label: 'Clinical report', types: ['lab'] },
  { id: 'pt', label: 'Patient-specific', types: ['patient'] },
];

const LEVEL_TEXT = { high: 'High risk - review before dispensing', moderate: 'Moderate risk - changes advised', low: 'Low risk' };

export default function SafetyReport({ result, patient }) {
  const [tab, setTab] = useState('all');
  const active = TABS.find((t) => t.id === tab);
  const shown = active.types ? result.alerts.filter((a) => active.types.includes(a.type)) : result.alerts;
  const countFor = (t) => (t.types ? result.alerts.filter((a) => t.types.includes(a.type)).length : result.alerts.length);

  return (
    <div className="report">
      <div className="card summary">
        <div className={`risk-ring risk-${result.level}`} style={{ '--score': result.score }} role="img" aria-label={`Risk score ${result.score} out of 100`}>
          <span>{result.score}</span>
          <small>/100</small>
        </div>
        <div className="summary-text">
          <strong className={`level-${result.level}`}>{LEVEL_TEXT[result.level]}</strong>
          <span className="muted small">
            {patient.name || 'Patient'} &middot; {result.medCount} medicines checked &middot; {result.alerts.length} findings
          </span>
          <div className="summary-counts">
            <span className="badge badge-high">{result.counts.high} High</span>
            <span className="badge badge-moderate">{result.counts.moderate} Moderate</span>
            <span className="badge badge-low">{result.counts.low} Low</span>
          </div>
        </div>
        <button type="button" className="btn btn-outline print-btn" onClick={() => window.print()}>Print report</button>
      </div>

      <div className="report-grid">
        <div>
          <div className="tabs" role="tablist" aria-label="Filter findings">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`tab${tab === t.id ? ' tab-on' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label} <span className="tab-count">{countFor(t)}</span>
              </button>
            ))}
          </div>
          <div role="tabpanel" aria-label={active.label}>
            {shown.length === 0 ? (
              <div className="card"><p className="muted">No {active.label.toLowerCase()} issues found for this prescription.</p></div>
            ) : (
              shown.map((a) => <DemoAlert key={a.key} alert={a} />)
            )}
          </div>
        </div>

        <aside className="report-side">
          <div className="card">
            <h3>Recommended actions</h3>
            {result.actions.length === 0 ? (
              <p className="muted small">No changes required.</p>
            ) : (
              <ol className="action-list">
                {result.actions.map((a, i) => (
                  <li key={i} className={`action action-${a.sev}`}>
                    <span className="small muted">{a.about}</span>
                    <span>{a.text}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {result.findings.length > 0 && (
            <div className="card">
              <h3>Report values</h3>
              <ul className="finding-list">
                {result.findings.map((f) => (
                  <li key={f.key}>
                    <span>{f.label}</span>
                    <span className={`finding finding-${f.status}`}>{f.value} {f.unit} &middot; {f.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card">
            <h3>Confirmed safe pairs</h3>
            <p className="small muted">No interaction found in the demo database for these combinations.</p>
            {result.safePairs.length === 0 ? (
              <p className="small muted">Every pair has at least one finding.</p>
            ) : (
              <ul className="safe-list">
                {result.safePairs.slice(0, 12).map((p) => <li key={p}>{p}</li>)}
                {result.safePairs.length > 12 && <li className="muted">+{result.safePairs.length - 12} more</li>}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
