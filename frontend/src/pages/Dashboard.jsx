import React from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useMedicines } from "../context/MedicineContext.jsx";
import AlertCard from "../components/AlertCard.jsx";

const copy = {
  en: {
    eyebrow: "YOUR MEDICATION WORKSPACE",
    title: "A clearer view of your medicines.",
    intro:
      "Bring prescriptions, medicines, and possible interactions into one place. Review each result with a healthcare professional.",
    primary: "Check interactions",
    secondary: "Scan prescription",
    workflow: "A simple path to a safer conversation",
    step1: "Collect",
    step1Text: "Add medicines or read a prescription image.",
    step2: "Review",
    step2Text: "Confirm names and inspect demo interaction links.",
    step3: "Discuss",
    step3Text: "Share a concise summary with a clinician.",
    activity: "Your workspace",
    activityText: "Current demo patient information",
    medicines: "Medicines on list",
    findings: "Demo findings",
    latest: "Latest check",
    graph: "Explore the knowledge graph",
    clinician: "Open clinician view",
    noFindings: "No check has been run yet.",
    viewAll: "Run a new check",
  },
  hi: {
    eyebrow: "आपका दवा कार्यक्षेत्र",
    title: "अपनी दवाओं को स्पष्ट रूप से देखें।",
    intro:
      "पर्चे, दवाएँ और संभावित इंटरैक्शन एक जगह देखें। हर परिणाम को स्वास्थ्य विशेषज्ञ से जाँचें।",
    primary: "इंटरैक्शन जाँचें",
    secondary: "पर्चा स्कैन करें",
    workflow: "डॉक्टर से बेहतर बातचीत के तीन कदम",
    step1: "इकट्ठा करें",
    step1Text: "दवाएँ जोड़ें या पर्चे का चित्र पढ़ें।",
    step2: "जाँचें",
    step2Text: "नामों की पुष्टि करें और डेमो लिंक देखें।",
    step3: "चर्चा करें",
    step3Text: "डॉक्टर के साथ संक्षिप्त सारांश साझा करें।",
    activity: "आपका कार्यक्षेत्र",
    activityText: "वर्तमान डेमो रोगी की जानकारी",
    medicines: "सूची में दवाएँ",
    findings: "डेमो निष्कर्ष",
    latest: "पिछली जाँच",
    graph: "ज्ञान ग्राफ देखें",
    clinician: "डॉक्टर दृश्य खोलें",
    noFindings: "अभी तक कोई जाँच नहीं हुई।",
    viewAll: "नई जाँच करें",
  },
  ta: {
    eyebrow: "உங்கள் மருந்துப் பணியிடம்",
    title: "உங்கள் மருந்துகளைத் தெளிவாகக் காண்க.",
    intro:
      "சீட்டு, மருந்துகள் மற்றும் சாத்தியமான தொடர்புகளை ஒரே இடத்தில் காண்க. ஒவ்வொரு முடிவையும் மருத்துவரிடம் சரிபார்க்கவும்.",
    primary: "தொடர்புகளைச் சோதி",
    secondary: "சீட்டை ஸ்கேன் செய்",
    workflow: "மருத்துவருடன் பேச மூன்று படிகள்",
    step1: "சேகரி",
    step1Text: "மருந்துகளைச் சேர்க்கவும் அல்லது சீட்டைப் படிக்கவும்.",
    step2: "மதிப்பாய்வு",
    step2Text: "பெயர்களை உறுதிசெய்து மாதிரி தொடர்புகளைக் காண்க.",
    step3: "விவாதி",
    step3Text: "சுருக்கத்தை மருத்துவருடன் பகிரவும்.",
    activity: "உங்கள் பணியிடம்",
    activityText: "தற்போதைய மாதிரி நோயாளி தகவல்",
    medicines: "பட்டியலில் மருந்துகள்",
    findings: "மாதிரி முடிவுகள்",
    latest: "கடைசி சோதனை",
    graph: "அறிவு வரைபடம்",
    clinician: "மருத்துவர் பார்வை",
    noFindings: "இன்னும் சோதனை செய்யவில்லை.",
    viewAll: "புதிய சோதனை",
  },
};

export default function Dashboard() {
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
  const when = lastCheck
    ? new Date(lastCheck.checkedAt).toLocaleDateString(
        { en: "en-IN", hi: "hi-IN", ta: "ta-IN" }[lang],
        { day: "numeric", month: "short", year: "numeric" },
      )
    : "—";
  return (
    <section className="dashboard">
      <div className="hero">
        <div className="hero-copy">
          <span className="eyebrow">✳ {c.eyebrow}</span>
          <h1>{c.title}</h1>
          <p>{c.intro}</p>
          <div className="actions">
            <Link className="btn btn-light" to="/checker">
              {c.primary} <span>↗</span>
            </Link>
            <Link className="btn btn-ghost" to="/prescription">
              {c.secondary} <span>→</span>
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-center">✳</div>
          <div className="hero-dot dot-one" />
          <div className="hero-dot dot-two" />
          <div className="hero-dot dot-three" />
        </div>
      </div>
      <div className="section-head section-heading">
        <div>
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>{c.workflow}</h2>
        </div>
      </div>
      <div className="workflow-grid">
        <div className="workflow-card">
          <span className="step-number">01</span>
          <span className="step-icon">▧</span>
          <h3>{c.step1}</h3>
          <p>{c.step1Text}</p>
        </div>
        <div className="workflow-card">
          <span className="step-number">02</span>
          <span className="step-icon">⌁</span>
          <h3>{c.step2}</h3>
          <p>{c.step2Text}</p>
        </div>
        <div className="workflow-card">
          <span className="step-number">03</span>
          <span className="step-icon">◫</span>
          <h3>{c.step3}</h3>
          <p>{c.step3Text}</p>
        </div>
      </div>
      <div className="section-head section-heading">
        <div>
          <span className="eyebrow">AT A GLANCE</span>
          <h2>{c.activity}</h2>
          <p>{c.activityText}</p>
        </div>
        <Link className="text-link" to="/medicines">
          {t.nav.medicines} →
        </Link>
      </div>
      <div className="stats">
        <div className="card stat">
          <span className="stat-num">
            {medicines.length.toString().padStart(2, "0")}
          </span>
          <span>{c.medicines}</span>
        </div>
        <div className="card stat">
          <span className="stat-num">
            {lastCheck ? alerts.length.toString().padStart(2, "0") : "—"}
          </span>
          <span>{c.findings}</span>
        </div>
        <div className="card stat">
          <span className="stat-date">{when}</span>
          <span>{c.latest}</span>
        </div>
      </div>
      <div className="dashboard-bottom">
        <div className="card recent-card">
          <div className="section-head">
            <h2>{t.dashboard.recent}</h2>
            <Link className="text-link" to="/checker">
              {c.viewAll} →
            </Link>
          </div>
          {alerts.length ? (
            alerts
              .slice(0, 2)
              .map((item, index) => (
                <AlertCard
                  key={index}
                  severity={item.severity}
                  title={item.title}
                  message={item.message}
                  advice={item.advice}
                />
              ))
          ) : (
            <p className="muted">{c.noFindings}</p>
          )}
        </div>
        <div className="side-links">
          <Link to="/graph">
            <span className="side-icon">⌘</span>
            <strong>{c.graph}</strong>
            <span>↗</span>
          </Link>
          <Link to="/doctor">
            <span className="side-icon">◫</span>
            <strong>{c.clinician}</strong>
            <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
