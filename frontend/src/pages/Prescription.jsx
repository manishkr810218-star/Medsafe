import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';

// UI only. OCR is intentionally NOT implemented in Phase 1.
export default function Prescription() {
  const { t } = useLang();
  const p = t.prescription;
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showSoon, setShowSoon] = useState(false);

  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [file]);

  return (
    <>
      <h1>{p.title}</h1>
      <div className="card">
        <p>{p.desc}</p>
        <input type="file" accept="image/*,application/pdf" onChange={(e) => { setFile(e.target.files[0] || null); setShowSoon(false); }} />
        {file && <p className="muted">{p.selected}: {file.name}</p>}
        {preview && <img className="preview" src={preview} alt={file.name} />}
        <div className="actions">
          <button className="btn" disabled={!file} onClick={() => setShowSoon(true)}>{p.scan}</button>
          <Link className="btn btn-outline" to="/medicines">{p.manual}</Link>
        </div>
        {showSoon && <p className="notice">{p.soon}</p>}
      </div>
      <div className="card demo-cta">
        <div>
          <strong>Try the full demo</strong>
          <p className="muted small">Sample prescriptions, clinical reports and patient data with drug-drug, drug-food and drug-disease checks.</p>
        </div>
        <Link className="btn" to="/demo">Open Demo Lab</Link>
      </div>
    </>
  );
}
