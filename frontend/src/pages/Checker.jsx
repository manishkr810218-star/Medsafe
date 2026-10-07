import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useMedicines } from "../context/MedicineContext.jsx";
import AlertCard from "../components/AlertCard.jsx";

export default function Checker() {
  const { t, lang, pick } = useLang();
  const { medicines, foods, loading, runInteractionCheck } = useMedicines();
  const c = t.checker;
  // Medicines load from the API after mount, so track the ones the user UNchecked.
  const [deselected, setDeselected] = useState([]);
  const selMeds = medicines
    .filter((m) => !deselected.includes(m.id))
    .map((m) => m.id);
  const [selFoods, setSelFoods] = useState([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const toggle = (setter) => (id) =>
    setter((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
    );

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
        <h1>{c.title}</h1>
        <p className="muted">{c.noMeds}</p>
        <Link className="btn" to="/medicines">
          {t.nav.medicines}
        </Link>
      </>
    );
  }

  return (
    <>
      <h1>{c.title}</h1>

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
