import { useState } from 'react';
import { LAB_RANGES } from '../../demo/rules.js';
import { labStatus } from '../../demo/engine.js';

const rangeText = (r) => {
  if (r.low != null && r.high != null) return `${r.low}-${r.high}`;
  if (r.low != null) return `\u2265 ${r.low}`;
  return `\u2264 ${r.high}`;
};

export default function ClinicalReport({ report, labs, setLabs }) {
  const [fileName, setFileName] = useState('');

  return (
    <div className="card">
      <div className="card-title">
        <h3>Clinical report</h3>
        {report.lab && <span className="small muted">{report.lab} &middot; {report.date}</span>}
      </div>
      <label className="file-btn small">
        <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={(e) => setFileName(e.target.files[0]?.name || '')} />
        <span className="link-btn">{fileName ? `Attached: ${fileName}` : 'Attach lab report (optional)'}</span>
      </label>

      <div className="lab-grid">
        {Object.entries(LAB_RANGES).map(([key, r]) => {
          const status = labStatus(key, labs[key]);
          return (
            <label key={key} className={`lab-field${status && status !== 'normal' ? ' abnormal' : ''}`}>
              <span className="lab-label">
                {r.label}
                {status && <span className={`dot dot-${status}`} aria-label={status === 'normal' ? 'Normal' : `${status} value`} />}
              </span>
              <input
                className="input"
                type="number"
                inputMode="decimal"
                step="any"
                value={labs[key] ?? ''}
                onChange={(e) => setLabs((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={'\u2014'}
              />
              <span className="lab-unit">{r.unit} {r.unit && '\u00b7'} {rangeText(r)}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
