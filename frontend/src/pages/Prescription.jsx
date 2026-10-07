import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useMedicines } from "../context/MedicineContext.jsx";
import { findCatalogCandidates, readPrescription } from "../services/ocr.js";
import { api } from "../services/api.js";

const copy = {
  en: {
    lead: "Read a prescription, then confirm every medicine before saving.",
    privacy:
      "The image stays in this browser. OCR language data may download on first use.",
    scan: "Read text",
    running: "Reading",
    extracted: "Review extracted text",
    confidence: "OCR confidence",
    warning:
      "Handwriting and brand names can be missed. Compare every line with the original prescription.",
    candidates: "Recognized demo medicines",
    none: "No demo catalog names were identified. Review the text and add medicines manually.",
    save: "Confirm and add",
    added: "Added",
    failed: "Could not add this medicine.",
    manual: "Open medicine list",
    limit: "Image or PDF, up to 12 MB and 3 PDF pages.",
  },
  hi: {
    lead: "पर्चा पढ़ें, फिर सहेजने से पहले हर दवा की पुष्टि करें।",
    privacy:
      "चित्र इसी ब्राउज़र में रहता है। पहली बार OCR भाषा डेटा डाउनलोड हो सकता है।",
    scan: "पाठ पढ़ें",
    running: "पढ़ा जा रहा है",
    extracted: "निकाले गए पाठ की समीक्षा",
    confidence: "OCR भरोसा",
    warning:
      "हस्तलिखित नाम और ब्रांड छूट सकते हैं। हर पंक्ति को मूल पर्चे से मिलाएँ।",
    candidates: "पहचानी गई डेमो दवाएँ",
    none: "डेमो सूची में कोई नाम नहीं मिला। पाठ जाँचें और दवाएँ स्वयं जोड़ें।",
    save: "पुष्टि करके जोड़ें",
    added: "जोड़ दी गई",
    failed: "दवा जोड़ नहीं सके।",
    manual: "दवा सूची खोलें",
    limit: "चित्र या PDF, अधिकतम 12 MB और PDF के 3 पेज।",
  },
  ta: {
    lead: "மருந்துச் சீட்டை வாசித்து, சேமிப்பதற்கு முன் ஒவ்வொரு மருந்தையும் உறுதிசெய்யவும்.",
    privacy:
      "படம் இந்த உலாவியிலேயே இருக்கும். முதல் பயன்பாட்டில் OCR மொழித் தரவு பதிவிறங்கலாம்.",
    scan: "உரையை வாசி",
    running: "வாசிக்கிறது",
    extracted: "எடுக்கப்பட்ட உரையைச் சரிபார்க்கவும்",
    confidence: "OCR நம்பகத்தன்மை",
    warning:
      "கையெழுத்து மற்றும் வணிகப் பெயர்கள் தவறலாம். அசல் சீட்டுடன் ஒவ்வொரு வரியையும் ஒப்பிடவும்.",
    candidates: "கண்டறியப்பட்ட மாதிரி மருந்துகள்",
    none: "மாதிரி பட்டியலில் பெயர் இல்லை. உரையைச் சரிபார்த்து மருந்துகளை கைமுறையாகச் சேர்க்கவும்.",
    save: "உறுதிசெய்து சேர்",
    added: "சேர்க்கப்பட்டது",
    failed: "மருந்தைச் சேர்க்க முடியவில்லை.",
    manual: "மருந்து பட்டியல்",
    limit: "படம் அல்லது PDF, அதிகபட்சம் 12 MB மற்றும் 3 PDF பக்கங்கள்.",
  },
};

export default function Prescription() {
  const { t, lang } = useLang();
  const { drugs, addMedicine } = useMedicines();
  const c = copy[lang];
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState([]);
  const [lookupName, setLookupName] = useState("");
  const [lookupConsent, setLookupConsent] = useState(false);
  const [codes, setCodes] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);
  const candidates = useMemo(
    () => findCatalogCandidates(editedText, drugs),
    [editedText, drugs],
  );

  useEffect(() => {
    if (!file?.type.startsWith("image/")) {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const scan = async () => {
    setBusy(true);
    setProgress(0);
    setError("");
    setResult(null);
    setSaved([]);
    try {
      const output = await readPrescription(file, setProgress);
      setResult(output);
      setEditedText(output.text);
    } catch (err) {
      setError(err.message || "OCR failed.");
    } finally {
      setBusy(false);
    }
  };

  const add = async (drug) => {
    const ok = await addMedicine({ name: drug.name, dose: "", frequency: "" });
    if (ok) setSaved((list) => [...list, drug.id]);
    else setError(c.failed);
  };

  const lookup = async () => {
    if (!lookupConsent || !lookupName.trim()) return;
    setLookingUp(true);
    setError("");
    setCodes(null);
    try {
      setCodes(
        await api(`/normalize?name=${encodeURIComponent(lookupName.trim())}`),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLookingUp(false);
    }
  };

  return (
    <section className="page-flow">
      <div className="page-heading">
        <div>
          <span className="eyebrow">01 / PRESCRIPTION</span>
          <h1>{t.prescription.title}</h1>
          <p>{c.lead}</p>
        </div>
        <span className="icon-tile">▧</span>
      </div>
      <div className="card upload-card">
        <label className="upload-drop">
          <span className="upload-icon">↑</span>
          <strong>{t.prescription.desc}</strong>
          <span>{c.limit}</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => {
              setFile(e.target.files[0] || null);
              setResult(null);
              setError("");
            }}
          />
        </label>
        {file && <p className="file-name">{file.name}</p>}
        {preview && <img className="preview" src={preview} alt={file.name} />}
        <p className="privacy-note">⌁ {c.privacy}</p>
        <div className="actions">
          <button className="btn" disabled={!file || busy} onClick={scan}>
            {busy ? `${c.running} ${progress}%` : c.scan}
          </button>
          <Link className="btn btn-outline" to="/medicines">
            {c.manual}
          </Link>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>
      {result && (
        <div className="card review-card">
          <div className="section-head">
            <h2>{c.extracted}</h2>
            <span className="confidence">
              {c.confidence}: {result.confidence}%
            </span>
          </div>
          <p className="notice">{c.warning}</p>
          <textarea
            aria-label={c.extracted}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={9}
          />
          <h3>{c.candidates}</h3>
          {candidates.length === 0 ? (
            <p className="muted">{c.none}</p>
          ) : (
            <ul className="candidate-list">
              {candidates.map(({ line, drug }, index) => (
                <li key={`${line}-${drug.id}-${index}`}>
                  <span>
                    <strong>{drug.name}</strong>
                    <small>
                      Line {line} · Demo catalog ID: {drug.id}
                    </small>
                  </span>
                  <button
                    className="btn btn-small"
                    disabled={saved.includes(drug.id)}
                    onClick={() => add(drug)}
                  >
                    {saved.includes(drug.id) ? c.added : c.save}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="code-lookup">
            <h3>
              {lang === "hi"
                ? "मानक कोड खोजें"
                : lang === "ta"
                  ? "நிலையான குறியீட்டைத் தேடு"
                  : "Look up a standard code"}
            </h3>
            <p className="muted small">
              {lang === "hi"
                ? "केवल सही किए गए दवा नाम को अमेरिकी RxNorm सेवा में भेजें। पूरा पर्चा या चित्र नहीं भेजा जाएगा।"
                : lang === "ta"
                  ? "திருத்திய மருந்துப் பெயர் மட்டும் அமெரிக்க RxNorm சேவைக்கு அனுப்பப்படும். முழுச் சீட்டோ படமோ அனுப்பப்படாது."
                  : "Send only a corrected medicine name to the US RxNorm service. The image and full prescription are not sent."}
            </p>
            <div className="actions">
              <input
                aria-label="Corrected medicine name"
                placeholder="Corrected medicine name"
                value={lookupName}
                onChange={(e) => {
                  setLookupName(e.target.value);
                  setCodes(null);
                }}
                maxLength={100}
              />
              <button
                className="btn btn-outline"
                disabled={!lookupConsent || !lookupName.trim() || lookingUp}
                onClick={lookup}
              >
                {lookingUp ? "Looking up…" : "Find RxCUI"}
              </button>
            </div>
            <label className="check">
              <input
                type="checkbox"
                checked={lookupConsent}
                onChange={(e) => setLookupConsent(e.target.checked)}
              />
              {lang === "hi"
                ? "मैं इस नाम को RxNorm को भेजने की सहमति देता/देती हूँ।"
                : lang === "ta"
                  ? "இந்தப் பெயரை RxNorm சேவைக்கு அனுப்ப ஒப்புக்கொள்கிறேன்."
                  : "I agree to send this medicine name to RxNorm."}
            </label>
            {codes && (
              <div className="code-results">
                <strong>
                  {codes.candidates.length
                    ? "Candidate RxCUIs — confirm the correct concept with a clinician:"
                    : "No active RxNorm code found for this name."}
                </strong>
                {codes.candidates.map((item) => (
                  <code key={item.rxcui}>
                    {item.name
                      ? `${item.name} (${item.termType || "concept"}) · `
                      : ""}
                    {item.system}: {item.rxcui}
                  </code>
                ))}
                <small>{codes.disclaimer}</small>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
