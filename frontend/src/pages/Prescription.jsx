import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';

export default function Prescription() {
  const { t } = useLang();
  const p = t.prescription;
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showSoon, setShowSoon] = useState(false);
  const [dragover, setDragover] = useState(false);

  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [file]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragover(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragover(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragover(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setShowSoon(false);
    }
  };

  return (
    <>
      <h1>{p.title}</h1>
      <div className="card">
        <p>{p.desc}</p>
        
        <div className="steps-container">
           <h4>Steps:</h4>
           <ol>
             <li>Upload prescription</li>
             <li>Auto-scan</li>
             <li>Review</li>
           </ol>
        </div>

        <div 
          className={`upload-zone ${dragover ? 'dragover' : ''}`}
          style={{ border: dragover ? '2px dashed #007bff' : '2px dashed #ccc', padding: '2rem', textAlign: 'center', margin: '1rem 0' }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p>Drag and drop your prescription here, or click below to select a file.</p>
          <input type="file" accept="image/*,application/pdf" onChange={(e) => { setFile(e.target.files[0] || null); setShowSoon(false); }} />
        </div>
        
        {file && <p className="muted">{p.selected}: {file.name}</p>}
        {preview && <img className="preview" src={preview} alt={file.name} />}
        
        <div className="actions">
          <button className="btn" disabled={!file} onClick={() => setShowSoon(true)}>{p.scan}</button>
          <Link className="btn btn-outline" to="/medicines">{p.manual}</Link>
        </div>
        {showSoon && <p className="notice">{p.soon}</p>}
      </div>
    </>
  );
}
