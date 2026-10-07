import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useMedicines } from "../context/MedicineContext.jsx";
import AlertCard from "../components/AlertCard.jsx";

const matrixCopy = {
  en: { title: "Compare medicines and food", lead: "Select what this patient currently takes. Only matches in the limited sample graph are shown; the tool cannot confirm safety.", matrix: "Comparison matrix", help: "Every selected pair is listed. No sample link means this dataset has no rule for that pair.", noMatch: "No sample link", excluded: "Unmatched name · skipped", source: "Source: fictional sample catalog; no clinical validation." },
  hi: { title: "दवाओं और भोजन की तुलना", lead: "रोगी की वर्तमान दवाएँ चुनें। सीमित नमूना ग्राफ के लिंक ही दिखेंगे; इससे सुरक्षा की पुष्टि नहीं होती।", matrix: "तुलना मैट्रिक्स", help: "हर चुनी जोड़ी दिखाई गई है। नमूना लिंक नहीं का अर्थ केवल इस सूची में नियम नहीं है।", noMatch: "नमूना लिंक नहीं", excluded: "नाम नहीं मिला · छोड़ा गया", source: "स्रोत: काल्पनिक नमूना सूची; चिकित्सीय मान्यता नहीं।" },
  ta: { title: "மருந்து மற்றும் உணவு ஒப்பீடு", lead: "நோயாளி எடுத்துக்கொள்ளும் மருந்துகளைத் தேர்வு செய்யவும். குறைந்த மாதிரி இணைப்புகள் மட்டுமே காட்டப்படும்; பாதுகாப்பை உறுதிசெய்யாது.", matrix: "ஒப்பீட்டு அட்டவணை", help: "தேர்ந்தெடுத்த ஒவ்வொரு ஜோடியும் பட்டியலில் உள்ளது. மாதிரி இணைப்பு இல்லை என்றால் இந்தத் தரவில் விதி இல்லை.", noMatch: "மாதிரி இணைப்பு இல்லை", excluded: "பெயர் பொருந்தவில்லை · தவிர்க்கப்பட்டது", source: "ஆதாரம்: கற்பனை மாதிரி பட்டியல்; மருத்துவ சரிபார்ப்பு இல்லை." },
};

export default function Checker() {
  const { t, lang, pick } = useLang();
  const { medicines, foods, loading, runInteractionCheck } = useMedicines();
  const c = t.checker;
  const labels = matrixCopy[lang];
  // Medicines load from the API after mount, so track the ones the user UNchecked.
  const [deselected, setDeselected] = useState([]);
  const selMeds = medicines
    .filter((m) => !deselected.includes(m.id))
    .map((m) => m.id);
  const [selFoods, setSelFoods] = useState([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const pairKey = (names) => [...names].map((name) => name.toLowerCase()).sort().join("|");
  const comparisonRows = [];
  if (result) {
    const selected = medicines.filter((medicine) => selMeds.includes(medicine.id));
    const drugFindings = new Map(result.drugDrug.map((item) => [pairKey(item.drugNames), item]));
    for (let i = 0; i < selected.length; i++) for (let j = i + 1; j < selected.length; j++) {
      const a = selected[i], b = selected[j];
      comparisonRows.push({ label: `${a.name} + ${b.name}`, type: "Medicine + medicine", severity: !a.drugId || !b.drugId ? "excluded" : drugFindings.get(pairKey([a.name, b.name]))?.severity || "no-match" });
    }
    for (const medicine of selected) for (const foodId of selFoods) {
      const food = foods.find((item) => item.id === foodId);
      if (!food) continue;
      const matched = result.drugFood.find((item) => item.drugName === medicine.name && item.foodName.en === food.name.en);
      comparisonRows.push({ label: `${medicine.name} + ${pick(food.name)}`, type: "Medicine + food", severity: !medicine.drugId ? "excluded" : matched?.severity || "no-match" });
    }
  }

  const toggle = (setter) => (id) => {
    setResult(null);
    setter((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
    );
  };

  const run = async () => {
    setError("");
    if (selMeds.length < 2 && !(selMeds.length === 1 && selFoods.length >= 1)) {
      setError(c.needTwo);
      return;
    }
    setBusy(true);
    try {
      const res = await runInteractionCheck({
        medicineIds: selMeds,
        foodIds: selFoods,
      });
      setResult(res);
    } catch {
      setError(t.common.apiError);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="muted">{t.common.loading}</p>;

  if (medicines.length === 0) {
    return (
      <>
        <h1>{labels.title}</h1>
        <p className="muted">{c.noMeds}</p>
        <Link className="btn" to="/medicines">
          {t.nav.medicines}
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">INTERACTION COMPARISON</span><h1>{labels.title}</h1><p>{labels.lead}</p></div><span className="icon-tile">⇄</span></div>

      <div className="card">
        <h2>{c.pickMeds}</h2>
        {medicines.map((m) => (
          <label key={m.id} className="check">
            <input
              type="checkbox"
              checked={selMeds.includes(m.id)}
              onChange={() => toggle(setDeselected)(m.id)}
            />
            {m.name}
          </label>
        ))}
        <h2>{c.pickFoods}</h2>
        {foods.map((f) => (
          <label key={f.id} className="check">
            <input
              type="checkbox"
              checked={selFoods.includes(f.id)}
              onChange={() => toggle(setSelFoods)(f.id)}
            />
            {pick(f.name)}
          </label>
        ))}
        <button className="btn" onClick={run} disabled={busy}>
          {busy ? c.running : c.run}
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      {result && (
        <>
          <div className="card comparison-matrix"><div className="section-head"><div><h2>{labels.matrix}</h2><p className="muted small">{labels.help}</p></div><span className="count-pill">{comparisonRows.length}</span></div><div className="comparison-grid">{comparisonRows.map((row, index) => <div className="comparison-cell" key={`${row.label}-${index}`}><div><strong>{row.label}</strong><small>{row.type}</small></div><span className={`comparison-status ${row.severity}`}>{row.severity === "no-match" ? labels.noMatch : row.severity === "excluded" ? labels.excluded : t.severity[row.severity]}</span></div>)}</div><p className="muted small">{labels.source}</p></div>
          {result.skipped.length > 0 && (
            <p className="muted">
              {c.skipped} {result.skipped.join(", ")}
            </p>
          )}
          <p className="notice">
            {lang === "hi"
              ? "कवरेज केवल काल्पनिक डेमो सूची तक है। कोई अलर्ट न मिलने का मतलब सुरक्षा नहीं है।"
              : lang === "ta"
                ? "கற்பனையான மாதிரி பட்டியல் மட்டுமே உள்ளடக்கப்பட்டுள்ளது. எச்சரிக்கை இல்லாதது பாதுகாப்பை உறுதி செய்யாது."
                : result.coverage}
          </p>
          <h2>{c.ddTitle}</h2>
          {result.drugDrug.length === 0 ? (
            <p>{c.none}</p>
          ) : (
            result.drugDrug.map((i, n) => (
              <AlertCard
                key={n}
                severity={i.severity}
                title={i.drugNames.join(" + ")}
                message={i.message}
                advice={i.advice}
              />
            ))
          )}
          <h2>{c.dfTitle}</h2>
          {result.drugFood.length === 0 ? (
            <p>{c.none}</p>
          ) : (
            result.drugFood.map((i, n) => (
              <AlertCard
                key={n}
                severity={i.severity}
                title={`${i.drugName} + ${i.foodName[lang]}`}
                message={i.message}
                advice={i.advice}
              />
            ))
          )}
        </>
      )}
    </>
  );
}
