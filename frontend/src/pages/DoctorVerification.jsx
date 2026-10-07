import React from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useReports } from "../context/ReportContext.jsx";

const copy = {
  en: {
    eyebrow: "CLINICIAN HANDOFF · DEMO",
    title: "Dr. verification in process",
    badge: "SIMULATED WORKFLOW",
    lead: "Your master report draft is assembled. This screen illustrates the proposed two-doctor review queue; no real doctor has received the report.",
    queue: "Review packet prepared",
    queueDetail: "Documents, medicine matches and possible links are ready for a clinician to check.",
    status: "Actual verification status",
    statusDetail: "Awaiting authenticated doctors · 0 of 2 approvals",
    collected: "Draft assembled",
    reviewed: "Example notes recorded",
    waiting: "Doctor verification",
    blocked: "Patient-ready release",
    complete: "Demo step complete",
    pending: "Not connected",
    locked: "Blocked",
    reviewers: "Fictional doctor profiles",
    slots: "TWO INDEPENDENT SLOTS",
    reviewer: "REVIEWER",
    report: "REPORT",
    reviewersLead: "These entries demonstrate separate specialties and review notes. They are not medical sign-offs.",
    profileStatus: "Demo note only · approval pending",
    reviewNote: "Example review note",
    summary: "Handoff snapshot",
    documents: "Source documents",
    medicines: "Medicines on report",
    findings: "Possible links",
    approval: "Authenticated approvals",
    next: "Open confirmation and draft",
    edit: "Edit master report",
    warning: "No patient-ready report can be released. Confirm all findings with qualified clinicians and validated sources.",
    missing: "Create a master report draft to see the review queue.",
  },
  hi: {
    eyebrow: "डॉक्टर को भेजने का नमूना चरण",
    title: "डॉक्टर सत्यापन की प्रक्रिया",
    badge: "केवल नमूना प्रक्रिया",
    lead: "मुख्य रिपोर्ट का मसौदा तैयार है। यह स्क्रीन दो डॉक्टरों की प्रस्तावित समीक्षा प्रक्रिया दिखाती है; किसी वास्तविक डॉक्टर को रिपोर्ट नहीं भेजी गई है।",
    queue: "समीक्षा पैकेट तैयार",
    queueDetail: "दस्तावेज़, दवाओं के मिलान और संभावित संबंध डॉक्टर की जाँच के लिए तैयार हैं।",
    status: "वास्तविक सत्यापन स्थिति",
    statusDetail: "प्रमाणित डॉक्टरों की प्रतीक्षा · 2 में से 0 स्वीकृतियाँ",
    collected: "मसौदा तैयार",
    reviewed: "नमूना नोट दर्ज",
    waiting: "डॉक्टर सत्यापन",
    blocked: "रोगी के लिए जारी",
    complete: "नमूना चरण पूरा",
    pending: "जुड़ा नहीं है",
    locked: "रुका हुआ",
    reviewers: "काल्पनिक डॉक्टर प्रोफ़ाइल",
    slots: "दो अलग समीक्षा स्थान",
    reviewer: "समीक्षक",
    report: "रिपोर्ट",
    reviewersLead: "ये प्रविष्टियाँ अलग विशेषज्ञता और नोट दिखाती हैं। ये चिकित्सा स्वीकृति नहीं हैं।",
    profileStatus: "केवल नमूना नोट · स्वीकृति लंबित",
    reviewNote: "नमूना समीक्षा नोट",
    summary: "समीक्षा सारांश",
    documents: "स्रोत दस्तावेज़",
    medicines: "रिपोर्ट की दवाएँ",
    findings: "संभावित संबंध",
    approval: "प्रमाणित स्वीकृतियाँ",
    next: "पुष्टि और मसौदा खोलें",
    edit: "मुख्य रिपोर्ट बदलें",
    warning: "रोगी के लिए रिपोर्ट जारी नहीं की जा सकती। योग्य डॉक्टरों और मान्य स्रोतों से सभी निष्कर्ष जाँचें।",
    missing: "समीक्षा कतार देखने के लिए पहले मुख्य रिपोर्ट का मसौदा बनाएँ।",
  },
  ta: {
    eyebrow: "மருத்துவர் ஒப்படைப்பு · மாதிரி",
    title: "மருத்துவர் சரிபார்ப்பு நடைபெறுகிறது",
    badge: "மாதிரி செயல்முறை மட்டும்",
    lead: "முழு அறிக்கை வரைவு தயாராக உள்ளது. இரு மருத்துவர் மதிப்பாய்வு எப்படி இயங்கும் என்பதை இது காட்டுகிறது; உண்மையான மருத்துவருக்கு அறிக்கை அனுப்பப்படவில்லை.",
    queue: "மதிப்பாய்வு தொகுப்பு தயார்",
    queueDetail: "ஆவணங்கள், மருந்துப் பொருத்தங்கள் மற்றும் சாத்தியமான தொடர்புகள் மருத்துவர் சரிபார்ப்புக்குத் தயார்.",
    status: "உண்மையான சரிபார்ப்பு நிலை",
    statusDetail: "அங்கீகரிக்கப்பட்ட மருத்துவர்களுக்காகக் காத்திருக்கிறது · 2 இல் 0 ஒப்புதல்கள்",
    collected: "வரைவு தயார்",
    reviewed: "மாதிரி குறிப்புகள் பதிவு",
    waiting: "மருத்துவர் சரிபார்ப்பு",
    blocked: "நோயாளிக்கு வெளியீடு",
    complete: "மாதிரி படி முடிந்தது",
    pending: "இணைக்கப்படவில்லை",
    locked: "தடை செய்யப்பட்டது",
    reviewers: "கற்பனை மருத்துவர் சுயவிவரங்கள்",
    slots: "இரண்டு தனி மதிப்பாய்வு இடங்கள்",
    reviewer: "மதிப்பாய்வாளர்",
    report: "அறிக்கை",
    reviewersLead: "வெவ்வேறு நிபுணத்துவமும் குறிப்புகளும் காட்டப்படுகின்றன. இவை மருத்துவ ஒப்புதல்கள் அல்ல.",
    profileStatus: "மாதிரி குறிப்பு மட்டும் · ஒப்புதல் நிலுவை",
    reviewNote: "மாதிரி மதிப்பாய்வு குறிப்பு",
    summary: "மதிப்பாய்வு சுருக்கம்",
    documents: "மூல ஆவணங்கள்",
    medicines: "அறிக்கையில் உள்ள மருந்துகள்",
    findings: "சாத்தியமான தொடர்புகள்",
    approval: "அங்கீகரிக்கப்பட்ட ஒப்புதல்கள்",
    next: "உறுதிப்படுத்தல் மற்றும் வரைவைத் திற",
    edit: "முழு அறிக்கையைத் திருத்து",
    warning: "நோயாளிக்கான அறிக்கையை வெளியிட முடியாது. தகுதியான மருத்துவர்களுடனும் சரிபார்க்கப்பட்ட ஆதாரங்களுடனும் கண்டறிதல்களை உறுதி செய்யவும்.",
    missing: "மதிப்பாய்வு வரிசையைப் பார்க்க முதலில் அறிக்கை வரைவை உருவாக்கவும்.",
  },
};

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(-2).map((part) => part[0]).join("").toUpperCase();

export default function DoctorVerification() {
  const { lang } = useLang();
  const { draft } = useReports();
  const c = copy[lang];

  if (!draft) return <section className="page-flow"><h1>{c.title}</h1><p>{c.missing}</p><Link className="btn" to="/report">{c.edit}</Link></section>;

  const stages = [
    { label: c.collected, state: c.complete, kind: "done" },
    { label: c.reviewed, state: c.complete, kind: "done" },
    { label: c.waiting, state: c.pending, kind: "waiting" },
    { label: c.blocked, state: c.locked, kind: "blocked" },
  ];

  return <section className="page-flow verification-page">
    <div className="page-heading"><div><span className="eyebrow">{c.eyebrow}</span><h1>{c.title}</h1><p>{c.lead}</p></div><span className="badge badge-warn">{c.badge}</span></div>
    <div className="verification-hero" role="status">
      <span className="verification-pulse" aria-hidden="true" />
      <div><span className="eyebrow">{c.queue}</span><h2>{c.status}</h2><p>{c.statusDetail}</p><small>{c.queueDetail}</small></div>
      <strong className="verification-count">0<span>/ 2</span><small>{c.approval}</small></strong>
    </div>
    <div className="verification-stages" aria-label={c.status}>{stages.map((stage, index) => <div className={`verification-stage ${stage.kind}`} key={index}><span className="verification-stage-number">{index + 1}</span><div><strong>{stage.label}</strong><small>{stage.state}</small></div></div>)}</div>
    <div className="verification-grid">
      <section className="card verification-reviewers"><div className="section-head"><div><span className="eyebrow">{c.slots}</span><h2>{c.reviewers}</h2><p>{c.reviewersLead}</p></div><span className="badge badge-warn">0/2</span></div><div className="verification-doctor-list">{draft.reviewers.map((reviewer, index) => <article className="verification-doctor" key={`${reviewer.name}-${index}`}><span className="verification-avatar" aria-hidden="true">{initials(reviewer.name)}</span><div><span className="eyebrow">{c.reviewer} {String(index + 1).padStart(2, "0")}</span><h3>{reviewer.name}</h3><p>{reviewer.specialty || c.reviewers}</p><span className="verification-profile-status">{c.profileStatus}</span><div className="verification-note"><strong>{c.reviewNote}</strong><p>{reviewer.note}</p></div></div></article>)}</div></section>
      <aside className="card verification-summary"><span className="eyebrow">{c.report} {draft.id.slice(0, 8).toUpperCase()}</span><h2>{c.summary}</h2><dl><div><dt>{c.documents}</dt><dd>{draft.documents.length}</dd></div><div><dt>{c.medicines}</dt><dd>{draft.medicines.length}</dd></div><div><dt>{c.findings}</dt><dd>{draft.findings.length}</dd></div><div><dt>{c.approval}</dt><dd>0/2</dd></div></dl><p className="notice">{c.warning}</p></aside>
    </div>
    <div className="verification-actions"><Link className="btn" to="/confirmation">{c.next} →</Link><Link className="btn btn-outline" to="/report">{c.edit}</Link></div>
  </section>;
}
