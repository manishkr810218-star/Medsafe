import React from "react";
import { useLang } from "../i18n/LanguageContext.jsx";
import SeverityBadge from "./SeverityBadge.jsx";

export default function AlertCard({ severity, title, message, advice }) {
  const { t, pick, lang } = useLang();
  const tamilMessage = `இது ${t.severity[severity]} தீவிரத்தின் கற்பனையான மாதிரி தொடர்பு: ${title}. மருத்துவ ஆலோசனைக்கு மருத்துவரை அணுகவும்.`;
  const spokenMessage =
    lang === "ta" && !message?.ta ? tamilMessage : pick(message);
  const spokenAdvice =
    lang === "ta" && !advice?.ta
      ? "இந்த மாதிரி தகவலை அடிப்படையாகக் கொண்டு மருந்தை மாற்ற வேண்டாம்."
      : pick(advice);
  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${title}. ${spokenMessage} ${spokenAdvice}`,
    );
    utterance.lang = { en: "en-IN", hi: "hi-IN", ta: "ta-IN" }[lang];
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };
  return (
    <div className={`alert alert-${severity}`}>
      <div className="alert-head">
        <strong>{title}</strong>
        <span className="alert-tags">
          <span className="badge badge-demo">{t.demoTag}</span>
          <SeverityBadge level={severity} />
        </span>
      </div>
      <p>{spokenMessage}</p>
      {advice && (
        <p className="muted">
          <strong>{t.checker.advice}:</strong> {spokenAdvice}
        </p>
      )}
      <button
        className="voice-btn"
        type="button"
        onClick={speak}
        disabled={
          typeof window === "undefined" || !("speechSynthesis" in window)
        }
        aria-label={
          lang === "hi"
            ? "अलर्ट सुनें"
            : lang === "ta"
              ? "எச்சரிக்கையைக் கேளுங்கள்"
              : "Listen to alert"
        }
      >
        ◖)){" "}
        <span>
          {lang === "hi" ? "सुनें" : lang === "ta" ? "கேட்க" : "Listen"}
        </span>
      </button>
    </div>
  );
}
