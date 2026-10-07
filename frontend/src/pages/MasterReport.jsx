import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useMedicines } from "../context/MedicineContext.jsx";
import { useReports } from "../context/ReportContext.jsx";
import { findCatalogCandidates, readPrescription } from "../services/ocr.js";
import { canCreateDraft } from "../services/reportValidation.js";

const copy = {
  en: { title: "Build a master report", lead: "Bring clinic reports and multiple prescriptions together. Review text, compare the current medicine list, then prepare a draft for clinicians.", documents: "1 · Collect documents", prescription: "Add prescriptions", clinic: "Add clinic reports", scan: "Read with OCR", review: "I checked this text against the original", sample: "Load fictional sample case", clear: "Clear documents", noDocs: "Add an image or PDF, or load the fictional sample case.", candidate: "Names found in the sample catalog", add: "Add to medicine list", added: "On medicine list", medicines: "2 · Confirm medicines and foods", foods: "Foods to compare", comparison: "3 · Compare evidence", run: "Run comparison", running: "Comparing…", results: "Potential findings", noResult: "Run the comparison after confirming medicines.", reviewers: "4 · Clinician handoff", reviewer: "Reviewer", name: "Reviewer name", specialty: "Specialty", note: "Review note", demoReview: "Record simulated review", draft: "Open confirmation & draft report", OCR: "OCR result", privacy: "Images stay in this browser session. OCR can miss handwriting and currently reads English text only. Never use uncorrected OCR for a care decision.", gate: "To prepare a draft: review both document types, run a comparison, and record two distinct reviewer entries. Entries are unverified simulations; patient release remains blocked.", ai: "AI review connectors", aiPending: "Two independent AI services are not connected. No AI agreement or doctor verification is claimed.", lab: "Clinic report context", voice: "Dictate a note", voiceConsent: "I understand browser voice recognition may send audio to my browser provider.", voiceUnsupported: "Voice recognition is unavailable in this browser. Type the note instead.", fallback: "The comparison uses fictional sample rules. No match does not mean safe.", status: "Unverified draft", error: "Add at least two medicines, or one medicine and a food, before comparing." },
  hi: { title: "मुख्य रिपोर्ट तैयार करें", lead: "क्लिनिक रिपोर्ट और कई पर्चे साथ लाएँ। पाठ जाँचें, दवाओं की तुलना करें और डॉक्टरों के लिए मसौदा बनाएँ।", documents: "1 · दस्तावेज़ जमा करें", prescription: "पर्चे जोड़ें", clinic: "क्लिनिक रिपोर्ट जोड़ें", scan: "OCR से पढ़ें", review: "मैंने मूल दस्तावेज़ से पाठ मिलाया है", sample: "काल्पनिक नमूना लोड करें", clear: "दस्तावेज़ हटाएँ", noDocs: "चित्र/PDF जोड़ें या काल्पनिक नमूना चुनें।", candidate: "नमूना सूची में मिले नाम", add: "दवा सूची में जोड़ें", added: "सूची में है", medicines: "2 · दवा और भोजन की पुष्टि", foods: "तुलना के लिए भोजन", comparison: "3 · प्रमाण की तुलना", run: "तुलना करें", running: "तुलना हो रही है…", results: "संभावित निष्कर्ष", noResult: "दवाओं की पुष्टि के बाद तुलना करें।", reviewers: "4 · डॉक्टर समीक्षा", reviewer: "समीक्षक", name: "समीक्षक का नाम", specialty: "विशेषज्ञता", note: "समीक्षा नोट", demoReview: "नकली समीक्षा दर्ज करें", draft: "पुष्टि और मसौदा रिपोर्ट खोलें", OCR: "OCR परिणाम", privacy: "चित्र इसी ब्राउज़र सत्र में रहते हैं। OCR हस्तलिखित पाठ चूक सकता है और अभी केवल अंग्रेज़ी पढ़ता है। बिना जाँच के OCR से इलाज का निर्णय न लें।", gate: "मसौदे के लिए दोनों तरह के दस्तावेज़ जाँचें, तुलना चलाएँ और दो अलग समीक्षक दर्ज करें। ये अप्रमाणित नमूना प्रविष्टियाँ हैं; रोगी के लिए जारी करना बंद है।", ai: "AI समीक्षा कनेक्टर", aiPending: "दो स्वतंत्र AI सेवाएँ जुड़ी नहीं हैं। AI सहमति या डॉक्टर सत्यापन का दावा नहीं किया जाता।", lab: "क्लिनिक रिपोर्ट संदर्भ", voice: "नोट बोलकर लिखें", voiceConsent: "मैं समझता/समझती हूँ कि ब्राउज़र ऑडियो अपने प्रदाता को भेज सकता है।", voiceUnsupported: "इस ब्राउज़र में वॉइस पहचान उपलब्ध नहीं है। नोट लिखें।", fallback: "तुलना काल्पनिक नमूना नियमों पर है। कोई मिलान न होना सुरक्षित होने का प्रमाण नहीं है।", status: "अप्रमाणित मसौदा", error: "तुलना के लिए दो दवाएँ या एक दवा और भोजन जोड़ें।" },
  ta: { title: "முழு அறிக்கை உருவாக்கு", lead: "மருத்துவமனை அறிக்கைகளையும் பல மருந்துச் சீட்டுகளையும் இணைத்து, உரையைச் சரிபார்த்து, மருத்துவர் மதிப்பாய்வுக்கான வரைவைத் தயாரிக்கவும்.", documents: "1 · ஆவணங்களைச் சேர்", prescription: "மருந்துச் சீட்டுகள்", clinic: "மருத்துவ அறிக்கைகள்", scan: "OCR மூலம் வாசி", review: "அசல் ஆவணத்துடன் உரையைச் சரிபார்த்தேன்", sample: "கற்பனை மாதிரியை ஏற்று", clear: "ஆவணங்களை நீக்கு", noDocs: "படம்/PDF சேர்க்கவும் அல்லது மாதிரியை ஏற்கவும்.", candidate: "மாதிரி பட்டியலில் கண்ட பெயர்கள்", add: "மருந்து பட்டியலில் சேர்", added: "பட்டியலில் உள்ளது", medicines: "2 · மருந்து மற்றும் உணவை உறுதி செய்", foods: "ஒப்பிட வேண்டிய உணவு", comparison: "3 · ஆதாரத்தை ஒப்பிடு", run: "ஒப்பிடு", running: "ஒப்பிடுகிறது…", results: "சாத்தியமான கண்டறிதல்கள்", noResult: "மருந்தை உறுதி செய்து ஒப்பிடவும்.", reviewers: "4 · மருத்துவர் மதிப்பாய்வு", reviewer: "மதிப்பாய்வாளர்", name: "பெயர்", specialty: "சிறப்பு", note: "மதிப்பாய்வு குறிப்பு", demoReview: "மாதிரி மதிப்பாய்வு பதிவு", draft: "உறுதிப்படுத்தல் மற்றும் வரைவு அறிக்கை", OCR: "OCR முடிவு", privacy: "படங்கள் இந்த உலாவி அமர்வில் இருக்கும். கையெழுத்து OCR-ல் தவறலாம்; இப்போது ஆங்கில உரையை மட்டுமே வாசிக்கிறது. சரிபார்க்காத OCR-ஐ சிகிச்சை முடிவுக்கு பயன்படுத்த வேண்டாம்.", gate: "வரைவுக்கு இரண்டு ஆவண வகைகளையும் சரிபார்த்து, ஒப்பீடு செய்து, இரண்டு மதிப்பாய்வாளர் பதிவுகளைச் சேர். இவை உறுதிசெய்யாத மாதிரிகள்; நோயாளிக்கு வெளியிட முடியாது.", ai: "AI மதிப்பாய்வு இணைப்புகள்", aiPending: "இரண்டு சுயாதீன AI சேவைகள் இணைக்கப்படவில்லை. AI அல்லது மருத்துவர் உறுதி செய்யப்பட்டதாகக் கூறவில்லை.", lab: "மருத்துவ அறிக்கை சூழல்", voice: "குரல் குறிப்பு", voiceConsent: "உலாவி என் குரலை அதன் சேவை வழங்குநருக்கு அனுப்பலாம் என்பதை புரிந்துகொள்கிறேன்.", voiceUnsupported: "இந்த உலாவியில் குரல் அடையாளம் இல்லை. குறிப்பை எழுதவும்.", fallback: "ஒப்பீடு கற்பனை மாதிரி விதிகளைப் பயன்படுத்துகிறது. பொருத்தம் இல்லாதது பாதுகாப்பைக் குறிக்காது.", status: "உறுதிசெய்யாத வரைவு", error: "ஒப்பிட இரண்டு மருந்துகள் அல்லது ஒரு மருந்தும் உணவும் சேர்க்கவும்." },
};

const newReviewer = () => ({ name: "", specialty: "", note: "", simulated: false });
const sampleDocuments = () => [
  { id: crypto.randomUUID(), kind: "prescription", name: "Fictional prescription A", text: "Demoxetine 10 mg once daily\nPlacebol 20 mg at night", confidence: null, reviewed: false, source: "sample" },
  { id: crypto.randomUUID(), kind: "prescription", name: "Fictional prescription B", text: "Sampleprin 5 mg after food\nTestafen 100 mg", confidence: null, reviewed: false, source: "sample" },
  { id: crypto.randomUUID(), kind: "clinic", name: "Fictional clinic checkup", text: "Follow-up visit. No validated laboratory values are supplied in this sample. Confirm diagnoses and results from the original report.", confidence: null, reviewed: false, source: "sample" },
];

export default function MasterReport() {
  const { lang, pick } = useLang();
  const c = copy[lang];
  const navigate = useNavigate();
  const { drugs, foods, medicines, addMedicine, runInteractionCheck, mode } = useMedicines();
  const { createDraft } = useReports();
  const [documents, setDocuments] = useState([]);
  const [busyId, setBusyId] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [foodIds, setFoodIds] = useState([]);
  const [result, setResult] = useState(null);
  const [reviewers, setReviewers] = useState([newReviewer(), newReviewer()]);
  const [voiceConsent, setVoiceConsent] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");

  const candidates = useMemo(() => {
    const found = documents.filter((document) => document.kind === "prescription").flatMap((document) => findCatalogCandidates(document.text, drugs));
    return [...new Map(found.map((entry) => [entry.drug.id, entry.drug])).values()];
  }, [documents, drugs]);
  const findings = result ? [
    ...result.drugDrug.map((item) => ({ ...item, title: item.drugNames.join(" + "), type: "Medicine + medicine" })),
    ...result.drugFood.map((item) => ({ ...item, title: `${item.drugName} + ${pick(item.foodName)}`, type: "Medicine + food" })),
  ] : [];
  const ready = canCreateDraft({ documents, result, reviewers });
  const stageDone = [
    ["prescription", "clinic"].every((kind) => documents.some((document) => document.kind === kind && document.reviewed)) && documents.every((document) => document.reviewed),
    medicines.length > 0 && medicines.every((medicine) => Boolean(medicine.drugId)),
    Boolean(result),
    reviewers.every((reviewer) => reviewer.name.trim() && reviewer.note.trim() && reviewer.simulated) && reviewers[0].name.trim().toLowerCase() !== reviewers[1].name.trim().toLowerCase(),
  ];

  const attach = (kind, files) => {
    const next = [...files].slice(0, Math.max(0, 6 - documents.length)).map((file) => ({ id: crypto.randomUUID(), kind, name: file.name, file, text: "", confidence: null, reviewed: false, source: "file" }));
    setDocuments((current) => [...current, ...next]);
    setResult(null);
  };
  const patchDocument = (id, change) => setDocuments((items) => items.map((item) => item.id === id ? { ...item, ...change } : item));
  const scan = async (document) => {
    setBusyId(document.id); setProgress(0); setError("");
    try {
      const output = await readPrescription(document.file, setProgress);
      patchDocument(document.id, { text: output.text, confidence: output.confidence, reviewed: false, source: "ocr" });
    } catch (cause) { setError(`${document.name}: ${cause.message || "OCR failed"}`); }
    finally { setBusyId(""); }
  };
  const compare = async () => {
    if (medicines.length < 2 && !(medicines.length === 1 && foodIds.length)) { setError(c.error); return; }
    setBusyId("compare"); setError("");
    try { setResult(await runInteractionCheck({ medicineIds: medicines.map((medicine) => medicine.id), foodIds })); }
    catch (cause) { setError(cause.message || "Comparison failed"); }
    finally { setBusyId(""); }
  };
  const updateReviewer = (index, change) => setReviewers((items) => items.map((item, position) => position === index ? { ...item, ...change } : item));
  const dictate = () => {
    if (!voiceConsent) return;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setError(c.voiceUnsupported); return; }
    const recognition = new Recognition();
    recognition.lang = { en: "en-IN", hi: "hi-IN", ta: "ta-IN" }[lang];
    recognition.interimResults = false;
    recognition.onresult = (event) => setVoiceNote((current) => `${current} ${event.results[0][0].transcript}`.trim());
    recognition.onerror = () => setError(c.voiceUnsupported);
    recognition.start();
  };
  const makeDraft = () => {
    if (!ready) return;
    createDraft({
      id: crypto.randomUUID(), createdAt: new Date().toISOString(), source: mode,
      documents: documents.map(({ kind, name, text, confidence, source }) => ({ kind, name, text, confidence, source })),
      medicines: medicines.map(({ name, dose, frequency, drugId }) => ({ name, dose, frequency, drugId })),
      foods: foodIds.map((id) => foods.find((food) => food.id === id)?.name).filter(Boolean),
      findings, skipped: result.skipped, coverage: result.coverage, reviewers,
      voiceNote: voiceNote.trim(), aiReviews: [{ name: "AI reviewer A", status: "not connected" }, { name: "AI reviewer B", status: "not connected" }],
    });
    navigate("/confirmation");
  };

  return <section className="page-flow master-page">
    <div className="page-heading"><div><span className="eyebrow">PATIENT SAFETY WORKFLOW</span><h1>{c.title}</h1><p>{c.lead}</p></div><span className="badge badge-warn">{c.status}</span></div>
    <div className="report-steps" aria-live="polite">{[c.documents, c.medicines, c.comparison, c.reviewers].map((label, index) => <span className={stageDone[index] ? "done" : busyId && index === (busyId === "compare" ? 2 : 0) ? "working" : ""} key={index}>{String(index + 1).padStart(2, "0")} {label.split("· ")[1]} {stageDone[index] ? "✓" : busyId && index === (busyId === "compare" ? 2 : 0) ? "…" : ""}</span>)}</div>
    <section className="card master-section"><div className="section-head"><h2>{c.documents}</h2><button className="text-link" onClick={() => { setDocuments([]); setResult(null); }}>{c.clear}</button></div><p className="muted">{c.privacy}</p>
      <div className="actions"><label className="btn btn-outline upload-action">{c.prescription}<input type="file" accept="image/*,application/pdf" multiple onChange={(event) => { attach("prescription", event.target.files); event.target.value = ""; }} /></label><label className="btn btn-outline upload-action">{c.clinic}<input type="file" accept="image/*,application/pdf" multiple onChange={(event) => { attach("clinic", event.target.files); event.target.value = ""; }} /></label><button className="btn btn-outline" onClick={() => { setDocuments(sampleDocuments()); setResult(null); }}>{c.sample}</button></div>
      {documents.length === 0 && <p className="empty-panel">{c.noDocs}</p>}
      <div className="document-grid">{documents.map((document) => <article className="document-card" key={document.id}><div className="section-head"><div><span className="eyebrow">{document.kind === "clinic" ? c.clinic : c.prescription}</span><h3>{document.name}</h3></div><span className="badge">{document.source === "sample" ? "SAMPLE" : document.confidence === null ? "NEW" : `${c.OCR} ${document.confidence}%`}</span></div>{document.file && <button className="btn btn-small" disabled={Boolean(busyId)} onClick={() => scan(document)}>{busyId === document.id ? `${c.scan} ${progress}%` : c.scan}</button>}<textarea aria-label={`${document.name} text`} rows={5} placeholder={c.OCR} value={document.text} onChange={(event) => { patchDocument(document.id, { text: event.target.value, reviewed: false }); setResult(null); }} /><label className="check"><input type="checkbox" checked={document.reviewed} disabled={!document.text.trim()} onChange={(event) => patchDocument(document.id, { reviewed: event.target.checked })} />{c.review}</label></article>)}</div>
    </section>
    <section className="card master-section"><div className="section-head"><h2>{c.medicines}</h2><Link className="text-link" to="/medicines">Open medicine list →</Link></div><h3>{c.candidate}</h3><div className="candidate-chips">{candidates.map((drug) => <button className="btn btn-outline btn-small" key={drug.id} disabled={medicines.some((medicine) => medicine.drugId === drug.id)} onClick={() => { setResult(null); addMedicine({ name: drug.name, dose: "", frequency: "" }); }}>{drug.name} · {medicines.some((medicine) => medicine.drugId === drug.id) ? c.added : c.add}</button>)}{!candidates.length && <span className="muted">—</span>}</div><div className="selected-summary"><strong>{medicines.length} medicines</strong><span>{medicines.map((medicine) => medicine.name).join(" · ") || "Add medicines from a reviewed prescription."}</span></div><h3>{c.foods}</h3><div className="food-options">{foods.map((food) => <label className="check" key={food.id}><input type="checkbox" checked={foodIds.includes(food.id)} onChange={() => { setFoodIds((ids) => ids.includes(food.id) ? ids.filter((id) => id !== food.id) : [...ids, food.id]); setResult(null); }} />{pick(food.name)}</label>)}</div></section>
    <section className="card master-section"><div className="section-head"><h2>{c.comparison}</h2><button className="btn" disabled={Boolean(busyId)} onClick={compare}>{busyId === "compare" ? c.running : c.run}</button></div><div className="evidence-grid"><div className="evidence-card"><strong>01 · OCR</strong><span>{documents.filter((document) => document.reviewed).length}/{documents.length} text reviews complete</span><small>Browser Tesseract · human correction required</small></div><div className="evidence-card"><strong>02 · Catalog match</strong><span>{medicines.filter((medicine) => medicine.drugId).length}/{medicines.length} names found</span><small>{mode === "sample" ? "Fictional offline catalog" : "Local MySQL demo catalog"}</small></div><div className="evidence-card"><strong>03 · Graph rules</strong><span>{result ? `${findings.length} potential links` : "Waiting for comparison"}</span><small>Fictional rules · no clinical coverage</small></div></div><div className="notice"><strong>{c.ai}:</strong> {c.aiPending}</div><h3>{c.results}</h3>{result ? <><p className="muted">{c.fallback} {result.skipped.length ? `Skipped: ${result.skipped.join(", ")}.` : ""}</p><div className="finding-rows">{findings.length ? findings.map((finding, index) => <div className="finding-row" key={index}><span className={`severity-dot ${finding.severity}`} /><div><strong>{finding.title}</strong><small>{finding.type} · {finding.severity.toUpperCase()} · {pick(finding.message)}</small></div></div>) : <p>{result.coverage}</p>}</div></> : <p className="muted">{c.noResult}</p>}</section>
    <section className="card master-section"><h2>{c.reviewers}</h2><p className="notice">{c.gate}</p><div className="reviewer-grid">{reviewers.map((reviewer, index) => <div className="reviewer-card" key={index}><h3>{c.reviewer} {index + 1} <span className="badge badge-warn">SIMULATED</span></h3><label>{c.name}<input value={reviewer.name} onChange={(event) => updateReviewer(index, { name: event.target.value, simulated: false })} placeholder="Fictional reviewer name" /></label><label>{c.specialty}<input value={reviewer.specialty} onChange={(event) => updateReviewer(index, { specialty: event.target.value, simulated: false })} placeholder="e.g. General medicine" /></label><label>{c.note}<textarea rows={3} value={reviewer.note} onChange={(event) => updateReviewer(index, { note: event.target.value, simulated: false })} placeholder="Review notes for discussion" /></label><label className="check"><input type="checkbox" checked={reviewer.simulated} disabled={!reviewer.name.trim() || !reviewer.note.trim()} onChange={(event) => updateReviewer(index, { simulated: event.target.checked })} />{c.demoReview}</label></div>)}</div><div className="voice-note"><label>{c.lab}<textarea rows={3} value={voiceNote} onChange={(event) => setVoiceNote(event.target.value)} placeholder="Optional context from the clinic report; not interpreted automatically" /></label><label className="check"><input type="checkbox" checked={voiceConsent} onChange={(event) => setVoiceConsent(event.target.checked)} />{c.voiceConsent}</label><button className="btn btn-outline" disabled={!voiceConsent} onClick={dictate}>{c.voice}</button></div><div className="actions"><button className="btn" disabled={!ready} onClick={makeDraft}>{c.draft} →</button></div></section>
    {error && <p className="error" role="alert">{error}</p>}
  </section>;
}
