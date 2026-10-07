import React from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useMedicines } from "../context/MedicineContext.jsx";
import SeverityBadge from "../components/SeverityBadge.jsx";

const copy = {
  en: {
    title: "Clinician review",
    lead: "A compact handoff for discussing the demo findings with a clinician.",
    medicines: "Current medicine list",
    findings: "Interaction findings",
    empty: "Run an interaction check to create a summary.",
    noAlerts:
      "No edges in the fictional demo graph for the selected items. This does not establish safety.",
    alternative: "Alternative review",
    alternativeText:
      "No clinically validated substitute is available in this prototype. Review the actual prescription, indications, doses, and evidence before considering a change.",
    source: "Source",
    coverage: "Coverage",
    print: "Print summary",
    check: "Run check",
    skipped: "Unverified names were skipped",
  },
  hi: {
    title: "डॉक्टर के लिए सारांश",
    lead: "डेमो निष्कर्षों पर डॉक्टर से चर्चा करने के लिए संक्षिप्त सारांश।",
    medicines: "वर्तमान दवा सूची",
    findings: "इंटरैक्शन निष्कर्ष",
    empty: "सारांश बनाने के लिए जाँच चलाएँ।",
    noAlerts:
      "काल्पनिक डेमो ग्राफ में कोई लिंक नहीं मिला। इससे सुरक्षा सिद्ध नहीं होती।",
    alternative: "विकल्पों की समीक्षा",
    alternativeText:
      "इस प्रोटोटाइप में कोई चिकित्सकीय रूप से मान्य विकल्प नहीं है। बदलाव से पहले असली पर्चा, कारण, खुराक और प्रमाण जाँचें।",
    source: "स्रोत",
    coverage: "कवरेज",
    print: "सारांश प्रिंट करें",
    check: "जाँच चलाएँ",
    skipped: "असत्यापित नाम छोड़े गए",
  },
  ta: {
    title: "மருத்துவர் மதிப்பாய்வு",
    lead: "மாதிரி முடிவுகளை மருத்துவருடன் விவாதிக்கச் சுருக்கம்.",
    medicines: "தற்போதைய மருந்துகள்",
    findings: "தொடர்பு முடிவுகள்",
    empty: "சுருக்கம் பெற முதலில் சோதனை செய்யவும்.",
    noAlerts:
      "கற்பனையான மாதிரி வரைபடத்தில் தொடர்பு இல்லை. இது பாதுகாப்பை உறுதி செய்யாது.",
    alternative: "மாற்று மருந்து மதிப்பாய்வு",
    alternativeText:
      "இந்த மாதிரியில் மருத்துவ ரீதியாக உறுதிசெய்யப்பட்ட மாற்று இல்லை. மாற்றத்திற்கு முன் அசல் சீட்டு, நோக்கம், அளவு மற்றும் ஆதாரத்தை மதிப்பாய்வு செய்யவும்.",
    source: "மூலம்",
    coverage: "உள்ளடக்கம்",
    print: "சுருக்கத்தை அச்சிடு",
    check: "சோதனை செய்",
    skipped: "சரிபார்க்கப்படாத பெயர்கள் தவிர்க்கப்பட்டன",
  },
};

export default function Doctor() {
  const { lang, t, pick } = useLang();
  const { medicines, lastCheck } = useMedicines();
  const c = copy[lang];
  const alerts = lastCheck
    ? [
        ...lastCheck.drugDrug.map((item) => ({
          ...item,
          title: (item.drugNames || []).join(" + "),
        })),
        ...lastCheck.drugFood.map((item) => ({
          ...item,
          title: `${item.drugName || ""} + ${pick(item.foodName)}`,
        })),
      ]
    : [];
  return (
    <section className="page-flow doctor-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">CLINICIAN WORKSPACE</span>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </div>
        <button
          className="btn btn-outline print-btn"
          onClick={() => window.print()}
        >
          {c.print}
        </button>
      </div>
      <div className="doctor-grid">
        <div className="card">
          <h2>{c.medicines}</h2>
          {medicines.length ? (
            <ul className="clinical-list">
              {medicines.map((m) => (
                <li key={m.id}>
                  <strong>{m.name}</strong>
                  <span>
                    {[m.dose, m.frequency].filter(Boolean).join(" · ") || "—"}
                  </span>
                  <small>{m.drugId ? `Demo ID: ${m.drugId}` : c.skipped}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">{t.medicines.empty}</p>
          )}
        </div>
        <div className="card clinician-note">
          <h2>{c.alternative}</h2>
          <p>{c.alternativeText}</p>
          <p className="small">
            <strong>{c.coverage}:</strong>{" "}
            {lastCheck?.coverage || "Fictional demo catalog only."}
          </p>
        </div>
      </div>
      <div className="card">
        <div className="section-head">
          <h2>{c.findings}</h2>
          <span className="count-pill">{alerts.length}</span>
        </div>
        {!lastCheck ? (
          <p className="muted">
            {c.empty} <Link to="/checker">{c.check}</Link>
          </p>
        ) : alerts.length === 0 ? (
          <p>{c.noAlerts}</p>
        ) : (
          <ul className="finding-list">
            {alerts.map((item, index) => (
              <li key={index}>
                <div className="finding-title">
                  <strong>{item.title}</strong>
                  <SeverityBadge level={item.severity} />
                </div>
                <p>
                  {lang === "ta" && !item.message.ta
                    ? `${item.title}: ${t.severity[item.severity]} தீவிரத்தின் கற்பனையான மாதிரி தொடர்பு.`
                    : pick(item.message)}
                </p>
                <small>
                  {c.source}: Fictional demo seed · {c.alternative}:{" "}
                  {c.alternativeText}
                </small>
              </li>
            ))}
          </ul>
        )}
        {lastCheck?.skipped?.length > 0 && (
          <p className="notice">
            {c.skipped}: {lastCheck.skipped.join(", ")}
          </p>
        )}
      </div>
    </section>
  );
}
