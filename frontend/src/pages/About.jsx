import { useLang } from '../i18n/LanguageContext.jsx';
import { Link } from 'react-router-dom';

export default function About() {
  const { t } = useLang();
  
  return (
    <>
      <div className="about-section">
        <h1>{t.about?.title || "What is Medsafe"}</h1>
        <p>{t.about?.description || "Medsafe is a comprehensive drug interaction checker designed to keep you safe from adverse drug reactions and food-drug interactions."}</p>
      </div>

      <div className="about-section">
        <h2>{t.about?.featuresTitle || "Key Features"}</h2>
        <div className="about-grid">
          <ul>
            <li>🔍 {t.about?.feature1 || "Verify drugs and prescriptions"}</li>
            <li>⚠️ {t.about?.feature2 || "Get interaction alerts instantly"}</li>
            <li>🌐 {t.about?.feature3 || "Fully bilingual support (English & Hindi)"}</li>
            <li>📋 {t.about?.feature4 || "Easy to use prescription uploading"}</li>
          </ul>
        </div>
      </div>

      <div className="about-section">
        <h2>{t.about?.howItWorksTitle || "How it works"}</h2>
        <ol>
          <li>{t.about?.step1 || "Step 1: Add your current medicines or upload a prescription."}</li>
          <li>{t.about?.step2 || "Step 2: Run the automated interaction checker."}</li>
          <li>{t.about?.step3 || "Step 3: Review alerts and read the provided guidance."}</li>
        </ol>
      </div>

      <div className="about-section tech-stack">
        <h2>{t.about?.techStackTitle || "Technology stack"}</h2>
        <div className="tech-item-container">
           <span className="tech-item">React</span>
           <span className="tech-item">Node.js</span>
           <span className="tech-item">Express</span>
           <span className="tech-item">MySQL</span>
        </div>
      </div>

      <div className="about-section">
        <p className="muted">{t.about?.disclaimer || "Demo data disclaimer: The information provided by Medsafe is for demonstration purposes only and should not replace professional medical advice."}</p>
      </div>

      <div className="actions">
        <Link className="btn" to="/">{t.about?.cta || "Go to Dashboard"}</Link>
      </div>
    </>
  );
}
