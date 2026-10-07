import { useEffect, useState } from 'react';

export default function PrescriptionScan({ caseData, patient, file, onFile, status, onScan }) {
  const [preview, setPreview] = useState(null);
  const rx = caseData.prescription;
  const isCustom = caseData.id === 'custom';
  const scanning = status === 'scanning';

  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [file]);

  return (
    <div className="card scan-card">
      <div className={`scan-stage${scanning ? ' scanning' : ''}`}>
        {preview ? (
          <img className="scan-image" src={preview} alt={`Uploaded prescription ${file.name}`} />
        ) : isCustom ? (
          <div className="rx-sheet rx-empty">
            <p className="muted">Upload a prescription photo or PDF, then add the medicines you see on it.</p>
          </div>
        ) : (
          <article className="rx-sheet" aria-label={`Sample prescription for ${patient.name}`}>
            <header className="rx-head">
              <div>
                <strong>{rx.clinic}</strong>
                <span className="small">{rx.doctor}</span>
              </div>
              <span className="small">{rx.date}</span>
            </header>
            <p className="rx-patient small">
              <span><b>Patient:</b> {patient.name}</span>
              <span><b>Age/Sex:</b> {patient.age} / {patient.sex}</span>
            </p>
            <p className="rx-dx small"><b>Dx:</b> {rx.diagnosis}</p>
            <span className="rx-symbol" aria-hidden="true">{'\u211e'}</span>
            <ol className="rx-items">
              {rx.items.map((it, i) => (
                <li key={i}>
                  <span className="rx-raw">{it.raw}</span>
                  <span className="rx-sig">{it.freq} &middot; {it.duration}</span>
                </li>
              ))}
            </ol>
            <p className="rx-sign small">Signature: {rx.doctor.split(',')[0]}</p>
          </article>
        )}
        {scanning && <span className="scan-line" aria-hidden="true" />}
      </div>

      <div className="scan-controls">
        <label className="file-btn">
          <input
            type="file"
            accept="image/*,application/pdf"
            className="sr-only"
            onChange={(e) => onFile(e.target.files[0] || null)}
          />
          <span className="btn btn-outline">{file ? 'Change file' : 'Upload prescription'}</span>
        </label>
        <button className="btn" type="button" onClick={onScan} disabled={scanning}>
          {scanning ? 'Reading prescription\u2026' : status === 'done' ? 'Scan again' : 'Scan prescription'}
        </button>
      </div>
      <p className="small muted" aria-live="polite">
        {file ? `Attached: ${file.name}. ` : ''}
        {scanning ? 'Detecting text, matching brand names to generic medicines\u2026' : 'Scan is simulated for the demo and reads the selected case.'}
      </p>
    </div>
  );
}
